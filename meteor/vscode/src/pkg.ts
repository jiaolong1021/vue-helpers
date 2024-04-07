import { commands, ExtensionContext, window, env } from 'vscode'
import { ExplorerProvider } from './explorer'
import { execa } from 'execa'
const puppeteer = require("puppeteer-core")
import { findChrome } from 'find-chrome-bin'
import { store } from './util/util'

export class PkgProvider {
  public context: ExtensionContext
  public explerer: ExplorerProvider
  public browser: any
  public page: any
  public packageNoRemain = 120
  public packageNoSi: any = null

  constructor(context: ExtensionContext, explerer: ExplorerProvider) {
    this.context = context
    this.explerer = explerer
  }

  public register() {
    this.context.subscriptions.push(commands.registerCommand('meteor.packageSetting', async () => {
      this.explerer.openConfigInKey('jenkinsUrl')
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.encrypt', async () => {
      let psd = await window.showInputBox({
        placeHolder: '请输入原始密码'
      })
      if (window.activeTerminal) {
        window.activeTerminal.sendText(this.explerer.encrypt(psd || ''))
      } else {
        const terminal = window.createTerminal('meteor')
        terminal.sendText(this.explerer.encrypt(psd || ''))
      }
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.packageVisit', () => {
      let pkgConfig = this.explerer.config[this.explerer.activeEnv].package
      this.explerer.open(this.explerer.config[this.explerer.activeEnv].package.jenkinsUrl + '/job/' + (pkgConfig.jenkinsJob || this.explerer.project))
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.packageRun', () => {
      this.run('build', true)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.packageVersion', () => {
      this.run('version', true)
    }))
  }

  public clearSi() {
    if (this.packageNoSi) {
      clearInterval(this.packageNoSi)
      this.packageNoSi = null
    }
  }

  public async run(type: string, showMsg: boolean) {
    let ret = ''
    if (showMsg) {
      if (type === 'build') {
        window.showInformationMessage('开始编译...')
      } else {
        if (!this.packageNoSi) {
          window.showInformationMessage('正在获取最新打包状态...')
        }
      }
    }
    // 获取分支
    let branch = ''
    const res = await execa('git', ['branch', '--show-current'], { cwd: this.explerer.projectRootPath })
    if (res.stdout) {
      branch = res.stdout
    }

    try {
      let executablePath = store.get('chromePath')
      if (!executablePath) {
        let findChromePath = await findChrome({})
        executablePath = findChromePath.executablePath
        if (!executablePath) {
          window.showInformationMessage('未找到Chrome浏览器')
          this.clearSi()
          return ''
        }
        store.set('chromePath', executablePath)
      }
      this.browser = await puppeteer.launch({
        executablePath,
        headless: true,
        defaultViewport: {
          width: 1366,
          height: 768
        }
      });
      

      const page = await this.browser.newPage();
      this.page = page
      let project = this.explerer.project
      let pkgConfig = this.explerer.config[this.explerer.activeEnv].package
      // 登录
      await page.goto(`${pkgConfig.jenkinsUrl}`);
      await page.type('#j_username', pkgConfig.jenkinsUsername)
      await page.type('[name="j_password"]', this.explerer.decrypt(pkgConfig.jenkinsPassword))
      await Promise.all([
        page.waitForNavigation({}),
        page.click('[name="Submit"]', {}),
      ]);

      if (type === 'build') {
        // 进入build页面
        await this.page.goto(`${pkgConfig.jenkinsUrl}/job/${pkgConfig.jenkinsJob || project}/build?delay=0sec`)
        try {
          const h2Text = await this.page.$eval('body > h2', (node: any) => node.innerText)
          if (h2Text === 'HTTP ERROR 404 Not Found') {
            window.showInformationMessage(`job: ${pkgConfig.jenkinsJob || project}不存在，正在新建...`)
            // 新建job
            await this.page.goto(`${pkgConfig.jenkinsUrl}/view/${pkgConfig.jenkinsView || 'all'}/newJob`, {
              waitUntil: 'networkidle0'
            })
            await page.type('#name', project)
            await page.type('#from', pkgConfig.jenkinsBaseJob)
            await Promise.all([
              page.waitForNavigation({}),
              page.click('#ok-button', {}),
            ]);
            const remoteCmd = await execa('git', ['remote', '-v'], { cwd: this.explerer.projectRootPath })
            if (remoteCmd.stdout) {
              const remoteMatchs = remoteCmd.stdout.match(/http.* /)
              if (remoteMatchs && remoteMatchs?.length > 0) {
                let gitUrl = remoteMatchs[0].trim().replace(/http(s)?:\/\//i, 'git@').replace(/\//i, ':')
                await page.$eval('[checkdependson="credentialsId"]', (el: any) => {
                  el.value = ''
                })
                await page.type('[checkdependson="credentialsId"]', gitUrl)
                await Promise.all([
                  page.waitForNavigation({}),
                  page.click('[type="submit"]', {}),
                ]);
                await this.page.goto(`${pkgConfig.jenkinsUrl}/job/${pkgConfig.jenkinsJob || project}/build?delay=0sec`)
                window.showInformationMessage(`job: ${pkgConfig.jenkinsJob || project}新建成功...`)
              }
            }
          }
        } catch (error) {
          window.showInformationMessage(error as any)
          this.clearSi()
        }
  
        // 判断分支是否设置
        const branchOptions = await this.page.$$eval('[name="parameter"] option', (options: any) => {
          const ret: string[] = []
          options.forEach((option: any) => {
            ret.push(option.value)
          });
          return ret
        })
        if (branchOptions.includes(branch)) {
          const statusList = await this.page.$$eval('#buildHistory .single-line', (els: any) => {
            var ret: any[] = []
            els.forEach((el: any) => {
              var status = 'fail'
              var statusIcon = el.querySelector('.icon-blue')
              var innerText = el.querySelector('.display-name').innerText
              if (statusIcon) {
                status = 'success'
              }
              ret.push({
                status,
                innerText
              })
            });
            return ret
          })
          let version: any = 0
          if (statusList.length > 0) {
            let status = statusList[0]
            version = parseInt(status.innerText.replace(/#/gi, '')) + 1
          }
          version = 'jenkins-' + version
          // 选择分支
          await this.page.select('[name="value"]', branch)
          const genBtn = await this.page.$('#yui-gen1-button')
          if (genBtn) {
            await genBtn.click()
          }
          execa('git', ['tag', version], { cwd: this.explerer.projectRootPath })
          execa('git', ['push', 'origin', version], { cwd: this.explerer.projectRootPath })
          window.showInformationMessage(`开始打包,仓库已打标签[${version}]`)
          this.packageNoRemain = 120
          if (this.packageNoSi) {
            clearInterval(this.packageNoSi)
            this.packageNoSi = null
          }
          this.packageNoSi = setInterval(() => {
            if (this.packageNoRemain < 0) {
              clearInterval(this.packageNoSi)
              this.packageNoRemain = 120
            }
            this.packageNoRemain -= 4
            this.run('version', true)
          }, 4000)
        } else {
          window.showInformationMessage(`[前往设置分支](${pkgConfig.jenkinsUrl}/job/${pkgConfig.jenkinsJob || project}/configure)`)
        }
      } else {
        await this.page.goto(`${pkgConfig.jenkinsUrl}/job/${pkgConfig.jenkinsJob || project}`)
        const statusList = await this.page.$$eval('#buildHistory .single-line', (els: any) => {
          var ret: any[] = []
          els.forEach((el: any) => {
            var status = 'fail'
            var statusIcon = el.querySelector('.icon-blue')
            var innerText = el.querySelector('.display-name').innerText
            if (statusIcon) {
              status = 'success'
            }
            ret.push({
              status,
              innerText
            })
          });
          return ret
        })
        if (statusList.length > 0) {
          let status = statusList[0]
          if (status.status === 'fail') {
            if (!this.packageNoSi) {
              window.showInformationMessage(`最新编译失败, [查看失败原因](${pkgConfig.jenkinsUrl}/job/${pkgConfig.jenkinsJob || project})`)
            }
          } else {
            let version = status.innerText.replace(/#/gi, '')
            await this.page.goto(`${pkgConfig.jenkinsUrl}/job/${pkgConfig.jenkinsJob || project}/${version}/console`)
            const out = await this.page.$eval('.console-output', (el: any) => {
              return el.innerText
            })
            if (out) {
              let outList = out.split('\n')
              for (let i = 0; i < outList.length; i++) {
                const outItem = outList[i];
                if (outItem.includes('Untagged:') && outItem.includes(`${pkgConfig.jenkinsJob || project}:${version}`)) {
                  ret = outItem.replace(new RegExp(`.*Untagged:\\s(.*:${version}).*`, 'gi'), '$1')
                  if (showMsg) {
                    env.clipboard.writeText(ret)
                    this.clearSi()
                    window.showInformationMessage('最新编译成功，已复制到剪切板 \n 镜像地址: ' + ret)
                  }
                  break
                }
              }
            }
          }
        }
      }
      return ret
    } catch (error) {
      console.log(error)
      window.showInformationMessage(error as any)
      this.clearSi()
    }
  }
}