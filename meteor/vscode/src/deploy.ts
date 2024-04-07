import { ExtensionContext, commands, window } from "vscode";
import { ExplorerProvider } from "./explorer";
import * as fs from 'fs'
import * as path from 'path'
import { PkgProvider } from "./pkg";
import { v4 as uuid } from 'uuid'

interface DeployConfig {
  cloudUrl: string,
  cloudUsername: string,
  cloudPassword: string,
  cloudEnv: string,
  cloudGroup: string,
  cloudService: string,
  cloudConfig: string,
  cloudAccess: string,
}

export class DeployProvider {
  public context: ExtensionContext
  public explorer: ExplorerProvider
  public token: string = ''
  public config: DeployConfig = {
    cloudUrl: '',
    cloudUsername: '',
    cloudPassword: '',
    cloudEnv: '',
    cloudGroup: '',
    cloudService: '',
    cloudConfig: '',
    cloudAccess: '',
  };
  public serviceGroupList: any[] = []
  public envList: any[] = []
  public pkg: PkgProvider

  constructor(context: ExtensionContext, explorer: ExplorerProvider, pkg: PkgProvider) {
    this.context = context
    this.explorer = explorer
    this.pkg = pkg
  }

  public register() {
    this.context.subscriptions.push(commands.registerCommand('meteor.deploySetting', () => {
      this.explorer.openConfigInKey('cloudUrl')
      this.getConfig()
      this.syncInfo()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.deploySync', () => {
      this.getConfig()
      this.syncInfo()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.deployRun', () => {
      this.getConfig()
      this.deploy()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.deployVisit', () => {
      this.getConfig()
      if (this.config.cloudEnv) {
        let envs = this.config.cloudEnv.split(',')
        if (envs.length === 2) {
          this.explorer.open(`${this.config.cloudUrl}/home/environment/${envs[1]}/info`)
        } else {
          this.explorer.open(this.config.cloudUrl)
        }
      }
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.deployWebVisit', () => {
      this.getConfig()
      this.visitWeb()
    }))

    this.context.subscriptions.push(commands.registerCommand('meteor.deployDownload', () => {
      this.getConfig()
      this.updateConfig('download')
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.deployUpload', () => {
      this.getConfig()
      this.updateConfig('upload')
    }))
  }

  public async updateConfig(opt: string) {
    await this.login()
    if (!this.config.cloudUrl) {
      return window.showInformationMessage('请输入容器云地址')
    }
    if (!this.config.cloudUsername) {
      return window.showInformationMessage('请输入容器云账号')
    }
    if (!this.config.cloudPassword) {
      return window.showInformationMessage('请输入容器云密码')
    }
    if (!this.config.cloudEnv) {
      return window.showInformationMessage('请输入容器云环境')
    }
    let envId = ''
    let envs = this.config.cloudEnv.split(',')
    let project = this.explorer.project
    let service = this.config.cloudService || project
    let configMaps = this.config.cloudConfig || project
    let configRootPath = path.join(this.explorer.projectRootPath, this.explorer.config.rootPath.config, this.explorer.activeEnv)
    if (envs.length === 2) {
      envId = envs[1]
    } else {
      envId = envs[0]
    }

    const serviceConfigRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/service/info?environmentId=${envId}&serviceId=${this.config.cloudService}`,
      headers: {
        token: this.token
      }
    })
    let conf: any[] = []
    let configList: string[] = []
    if (serviceConfigRes.data.data && serviceConfigRes.data.data.configMapParamVos) {
      serviceConfigRes.data.data.configMapParamVos.forEach((config: any) => {
        // 排除nginx相关配置
        if (!config.configMapName.includes('nginx')) {
          configList.push(config.configMapName)
        }
      })
    }

    const configRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/environments/${envId}/configmaps`,
      headers: {
        token: this.token
      }
    })
    configRes.data.data.forEach((config: any) => {
      if (configList.includes(config.id)) {
        conf.push(config)
      }
    });

    if (opt === 'download') {
      if (conf.length > 0) {
        for (let i = 0; i < conf.length; i++) {
          const confItem = conf[i];
          for (const key in confItem.data) {
            fs.writeFileSync(path.join(configRootPath, key), confItem.data[key])
          }
        }
        window.showInformationMessage('下载配置集成功')
      }
    } else {
      let configData = {
        id: service,
        description: '',
        environmentId: envId,
        data: {} as any
      }
      const configFiles = fs.readdirSync(configRootPath)
      if (configFiles) {
        configFiles.forEach((fileName: string) => {
          configData.data[fileName] = fs.readFileSync(path.join(configRootPath, fileName), 'utf-8')
        });
      }
      if (conf.length > 0) {
        // 修改，只支持一个配置更新
        let updateConf: any = {}
        if (conf.length === 1) {
          updateConf = conf[0]
          updateConf.data = configData.data
          await this.explorer.fetch({
            url: `${this.config.cloudUrl}/api/environments/${envId}/configmaps/${configMaps}`,
            method: 'put',
            data: updateConf,
            headers: {
              token: this.token
            }
          })
        }
      } else {
        // 新增
        await this.explorer.fetch({
          url: `${this.config.cloudUrl}/api/environments/${envId}/configmaps`,
          method: 'post',
          data: configData,
          headers: {
            token: this.token
          }
        })
      }
      let groupId = ''
      let groups = this.config.cloudGroup.split(',')
      if (groups.length === 2) {
        groupId = groups[1]
      }
      this.explorer.fetch({
        url: `${this.config.cloudUrl}/api/environments/${envId}/groups/${groupId}/services/${service}/reboot?deploymentName=${service}`,
        method: 'DELETE',
        headers: {
          token: this.token
        }
      })
      window.showInformationMessage('配置集更新成功, [立即访问](command:meteor.deployWebVisit)')
    }
  }

  public async visitWeb() {
    await this.login()
    if (!this.config.cloudUrl) {
      return window.showInformationMessage('请输入容器云地址')
    }
    if (!this.config.cloudUsername) {
      return window.showInformationMessage('请输入容器云账号')
    }
    if (!this.config.cloudPassword) {
      return window.showInformationMessage('请输入容器云密码')
    }
    if (!this.config.cloudEnv) {
      return window.showInformationMessage('请输入容器云环境')
    }
    if (!this.config.cloudGroup) {
      return window.showInformationMessage('请输入容器云服务组')
    }
    if (!this.config.cloudAccess) {
      return window.showInformationMessage('请输入容器云访问权')
    }
    let envId = ''
    let project = this.explorer.project
    let service = this.config.cloudService || project
    let envs = this.config.cloudEnv.split(',')
    if (envs.length === 2) {
      envId = envs[1]
    } else {
      envId = envs[0]
    }
    const serviceRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/service/info`,
      method: 'get',
      params: {
        environmentId: envId,
        serviceId: service
      },
      headers: {
        token: this.token
      }
    })
    if (serviceRes.data.data && serviceRes.data.data.ingress) {
      let ingressList: string[] = Object.values(serviceRes.data.data.ingress)
      if (ingressList.length > 0) {
        this.explorer.open('http://' + ingressList[0])
      } else {
        window.showInformationMessage('未找到访问地址')
      }
    }
  }

  public async deploy() {
    window.showInformationMessage('正在进行容器云部署，请稍等...')
    // 获取镜像
    const pkgDocker = await this.pkg.run('version', false)
    if (!pkgDocker) {
      return window.showInformationMessage('未获取到镜像，请先打包')
    } else {
      window.showInformationMessage('本次部署镜像: ' + pkgDocker)
    }
    
    await this.login()
    if (!this.config.cloudUrl) {
      return window.showInformationMessage('请输入容器云地址')
    }
    if (!this.config.cloudUsername) {
      return window.showInformationMessage('请输入容器云账号')
    }
    if (!this.config.cloudPassword) {
      return window.showInformationMessage('请输入容器云密码')
    }
    if (!this.config.cloudEnv) {
      return window.showInformationMessage('请输入容器云环境')
    }
    if (!this.config.cloudGroup) {
      return window.showInformationMessage('请输入容器云服务组')
    }
    if (!this.config.cloudAccess) {
      return window.showInformationMessage('请输入容器云访问权')
    }
    let envId = ''
    let groupId = ''
    let project = this.explorer.project
    let service = this.config.cloudService || project
    let envs = this.config.cloudEnv.split(',')
    if (envs.length === 2) {
      envId = envs[1]
    } else {
      envId = envs[0]
    }
    let groups = this.config.cloudGroup.split(',')
    if (groups.length === 2) {
      groupId = groups[1]
    } else {
      // 新增服务组
      const groupRes = await this.explorer.fetch({
        url: `${this.config.cloudUrl}/serviceGroup/add`,
        method: 'post',
        data: {
          bg: false,
          environmentId: envId,
          name: groups[0]
        },
        headers: {
          token: this.token
        }
      })
      groupId = groupRes.data.data.id
    }
    // 查询配置集是否存在
    let isExistConfig = false
    // 获取服务配置集
    const serviceConfigRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/service/info?environmentId=${envId}&serviceId=${this.config.cloudService}`,
      headers: {
        token: this.token
      }
    })
    
    if (serviceConfigRes.data.data && serviceConfigRes.data.data.configMapParamVos) {
      isExistConfig = serviceConfigRes.data.data.configMapParamVos.length > 0
    }

    if (!isExistConfig) {
      // 上传配置信息
      let configPath = path.join(this.explorer.projectRootPath, this.explorer.config.rootPath.config, this.explorer.activeEnv)
      const dirList = fs.readdirSync(configPath)
      // if (dirList.length === 0) {
      //   return window.showInformationMessage(`请将配置文件放到${configPath.replace(this.explorer.projectRootPath, '')}目录下后再次尝试`)
      // }
      let configData = {
        id: service,
        description: '',
        environmentId: envId,
        data: {} as any
      }
      dirList.forEach((dir: string) => {
        configData.data[dir] = fs.readFileSync(path.join(configPath, dir), 'utf-8')
      });
      await this.explorer.fetch({
        url: `${this.config.cloudUrl}/api/environments/${envId}/configmaps`,
        method: 'post',
        data: configData,
        headers: {
          token: this.token
        }
      })
    }

    // 获取环境基本信息
    const envRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/environments/${envId}/basicInfo`,
      headers: {
        token: this.token
      }
    })

    const serviceRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/service/info`,
      method: 'get',
      params: {
        environmentId: envId,
        serviceId: service
      },
      headers: {
        token: this.token
      }
    })
    if (serviceRes.data.data) {
      if (pkgDocker === serviceRes.data.data.image) {
        this.explorer.fetch({
          url: `${this.config.cloudUrl}/api/environments/${envId}/groups/${groupId}/services/${service}/reboot?deploymentName=${service}`,
          method: 'DELETE',
          headers: {
            token: this.token
          }
        })
        window.showInformationMessage('服务镜像已为最新，本次重启了服务。[立即访问](command:meteor.deployWebVisit)')
      } else {
        serviceRes.data.data.image = pkgDocker
        this.explorer.fetch({
          url: `${this.config.cloudUrl}/api/environments/${envId}/groups/${groupId}/services/${service}/upgrade?upgradeType=roll&autoUpgrade=false`,
          method: 'put',
          data: serviceRes.data.data,
          headers: {
            token: this.token
          }
        })
        window.showInformationMessage('服务升级成功！[立即访问](command:meteor.deployWebVisit)')
      }
    } else {
      // 服务不存在, 添加访问权
      const accessListRes = await this.explorer.fetch({
        url: `${this.config.cloudUrl}/api/environments/${envId}/ingresses`,
        method: 'get',
        headers: {
          token: this.token
        }
      })
      let hasAccess = false
      accessListRes.data.data.forEach((access: any) => {
        if (access.id === this.config.cloudAccess) {
          hasAccess = true
        }
      });
      if (!hasAccess) {
        await this.explorer.fetch({
          url: `${this.config.cloudUrl}/api/environments/${envId}/ingresses`,
          method: 'post',
          data: {
            id: this.config.cloudAccess,
            level3domen: this.config.cloudAccess,
            maxBodySize: "8",
            environmentName: envId,
            paths: [
              {
                id: uuid(),
                path: "/",
                serviceId: service,
                servicePort: "80",
                error: false
              }
            ],
            host: `${this.config.cloudAccess}.${envRes.data.data.secondaryDomain}.${this.explorer.config.rootPath.domain}`,
            secondaryDomain: `${envRes.data.data.secondaryDomain}.${this.explorer.config.rootPath.domain}`
          },
          headers: {
            token: this.token
          }
        })
      }

      let ingress: any = {}
      ingress[this.config.cloudAccess] = `${this.config.cloudAccess}.${envRes.data.data.secondaryDomain}.${this.explorer.config.rootPath.domain}`

      // 新建服务
      this.explorer.fetch({
        url: `${this.config.cloudUrl}/api/service/add`,
        method: 'post',
        headers: {
          token: this.token
        },
        data: {
          groupName: groupId,
          id: service,
          type: "deployment",
          replicas: 1,
          description: "",
          cpu: 0.999,
          requestCpu: 0.1,
          memory: 2,
          requestMemory: 0.5,
          command: "",
          image: pkgDocker,
          args: "",
          ports: [{ "port": "80", "protocol": "TCP" }],
          env: [],
          ingress: ingress,
          pvcFlag: false,
          pvcVos: [],
          pvcStorageSize: 1,
          mountPath: "",
          pvcName: "",
          accessModes: "ReadWriteMany",
          configMapParamVos: [{ "containerMountPath": "/home/work/dist/static/conf/", "configMapName": service }],
          secretVos: [],
          concurrencyPolicy: "Forbid",
          healthCheckFlag: false,
          hpaFlag: false,
          hostFlag: false,
          hostAliases: [],
          environmentId: envId,
          groupId: groupId
        }
      })
      window.showInformationMessage('新建服务：' + service + '成功. [立即访问](command:meteor.deployWebVisit)')
    }

  }

  public async syncInfo() {
    await this.login()
    await this.getEnvList()
  }

  public async getEnvList() {
    const res = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/environment`,
      headers: {
        token: this.token
      }
    })
    this.envList = res.data.data
    this.explorer.setCloudEnvSuggestions(this.envList, this.config.cloudUrl, this.token)
    window.showInformationMessage('同步环境信息完成')
  }

  public async login() {
    try {
      const res = await this.explorer.fetch({
        url: `${this.config.cloudUrl}/api/login`,
        method: 'post',
        data: {
          username: this.config.cloudUsername,
          password: this.explorer.decrypt(this.config.cloudPassword)
        }
      })
      this.token = res.data.data.token
    } catch (error) {
      window.showErrorMessage('登录容器云失败')
    }
  }

  public getConfig() {
    this.config = this.explorer.config[this.explorer.activeEnv].deploy
  }
}