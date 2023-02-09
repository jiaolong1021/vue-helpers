import { commands, ExtensionContext, Uri, TextDocument, workspace, window, Selection, Position } from 'vscode'
import { getWorkspaceRoot, open } from './util/util'
import * as path from 'path'
import * as fs from 'fs'
import { ExplorerProvider } from './explorer';
import camelCase from 'camelcase';

interface ApiItem {
  reqPath: string, // 访问地址
  description: string, // 描述
  filePath: string, // 存放文件路径
  method: string,
  params: any,
  annotation: string
}

interface Api {
  [prop: string]: ApiItem
}

export class IntfProvider {
  public context: ExtensionContext;
  public explerer: ExplorerProvider
  // 获取到的swagger数据信息
  public api: Api = {}
  public url: string = ''
  public version = 2 // 目前支持2.0 3.0
  private fileType: String = 'ts' // 生成文件类型
  private projectRootPath: string = '' // 工程所在位置
  // private apiCompletionItem: CompletionItem[] = []
  public projectApiPath: string = ''
  public definitions: any = {}

  constructor(context: ExtensionContext, explerer: ExplorerProvider) {
    this.context = context
    this.explerer = explerer
    this.projectRootPath = getWorkspaceRoot('')
    this.fileType = fs.existsSync(path.join(this.projectRootPath, 'tsconfig.json')) ? 'ts' : 'js'
    this.projectApiPath = 'src/api'
    if (this.explerer.config.rootPath && this.explerer.config.rootPath.api) {
      this.projectApiPath = this.explerer.config.rootPath.api
    }
  }

  public register() {
    this.context.subscriptions.push(commands.registerCommand('meteor.interfaceSetting', async () => {
      let meteorJsonPath = path.join(this.projectRootPath, 'meteor.json')
      const config = fs.readFileSync(meteorJsonPath, 'utf-8')
      let configLines = config.split('\n')
      let env = ''
      if (config) {
        env = JSON.parse(config).activeEnv
      }
      let envReg = new RegExp(`.*\\"${env}\\"\\s?:.*`, 'gi')
      let inEnv = false
      let x = 0, y = 0
      for (let i = 0; i < configLines.length; i++) {
        const line = configLines[i];
        if (envReg.test(line)) {
          inEnv = true
          continue
        }
        if (inEnv) {
          if (/.*\"swaggerUrl\"\s?:.*/gi.test(line)) {
            x = i
            y = line.length - 2
            break
          }
        }
      }
      let uri = Uri.file(meteorJsonPath)
      const document: TextDocument = await workspace.openTextDocument(uri)
      await window.showTextDocument(document, { preserveFocus: true, selection: new Selection(new Position(x, y), new Position(x, y)) });
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.interfaceSync', () => {
      this.getSwaggerUrl()
      this.url && this.getApi()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.interfaceVisit', () => {
      this.getSwaggerUrl()
      this.url && open(this.url)
    }))
  }

  // 获取已配置swagger地址
  public getSwaggerUrl() {
    let conf = this.explerer.config[this.explerer.activeEnv]
    if (conf && conf.interface && conf.interface.swaggerUrl) {
      this.url = conf.interface.swaggerUrl
    } else {
      this.url = ''
      window.showInformationMessage(`请先[配置](command:meteor.interfaceSetting)${this.explerer.activeEnvName}环境的接口地址`)
    }
  }

  // 获取swaggger接口信息
  public async getApi() {
    let url = this.getApiUrl()
    if (!url) {
      return
    }
    try {
      const res = await this.explerer.fetch({
        method: 'get',
        url: url
      })
      // this.apiCompletionItem = []
      let inList: string[] = []
      let typeList: string[] = []
      // 通过接口第一级来定义存放文件
      for (const apiPath in res.data.paths) {
        const req = res.data.paths[apiPath];
        for (const reqMtd in req) {
          const reqBody = req[reqMtd];
          let apiName = '';
          let apiPaths: string[] = apiPath.split('/');
          let nameList: string[] = []
          let apiPathLen = apiPaths.length;
          let annotation = '';
          if (reqBody.description) {
            annotation = '\n/**\n';
            annotation += '* ' + reqBody.description + '\n';
            annotation += '*/\n';
          }
          if (apiPathLen > 2) {
            let prev = apiPaths[apiPathLen - 2];
            let last = apiPaths[apiPathLen - 1];
            // 判断存在多级路径参数
            let idInParent = false
            if (/^{.*}$/gi.test(prev)) {
              idInParent = true
              prev = prev.replace(/^{(.*)}$/, '$1');
              prev = 'by' + prev[0].toUpperCase() + prev.substr(1, prev.length);
            }
            if (/^{.*}$/gi.test(last)) {
              last = last.replace(/^{(.*)}$/, '$1');
              last = 'by' + last[0].toUpperCase() + last.substr(1, last.length);
            }
            if (idInParent) {
              nameList = [prev, last];
            } else {
              nameList = [last];
            }
          } else {
            nameList = [apiPaths[apiPathLen - 1]]
          }
          // 加上请求前缀
          if (nameList[0] && !nameList[0].toLowerCase().includes(reqMtd)) {
            nameList.unshift(reqMtd);
          }
          // 重名处理
          apiName = camelCase(nameList);
          if (this.api[apiName]) {
            let name = ''
            if (apiPathLen > 2) {
              name = apiPaths[apiPathLen - 2]
              if (!/^{.*}$/gi.test(name)) {
                nameList.splice(1, 0, name)
                apiName = camelCase(nameList);
              }
              if (this.api[apiName]) {
                if (apiPathLen > 3) {
                  name = apiPaths[apiPathLen - 3]
                  if (!/^{.*}$/gi.test(name)) {
                    nameList.splice(1, 0, name)
                    apiName = camelCase(nameList);
                  }
                }
                if (this.api[apiName]) {
                  if (apiPathLen > 4) {
                    name = apiPaths[apiPathLen - 4]
                    if (!/^{.*}$/gi.test(name)) {
                      nameList.splice(1, 0, name)
                      apiName = camelCase(nameList);
                    }
                  }
                }
              }
            }
          }
          reqBody.parameters && reqBody.parameters.forEach((param: any) => {
            if (!inList.includes(param.in)) {
              inList.push(param.in)
            }
            let type = ''
            if (param.schema) {
              type = param.schema.type
            } else if (param.type) {
              type = param.type
            }
            if (!typeList.includes(type)) {
              typeList.push(type)
            }
          });
          this.api[apiName] = {
            reqPath: apiPath,
            annotation: annotation,
            description: reqBody.description || '',
            filePath: path.join(this.projectRootPath, this.projectApiPath, `${apiPaths[0] || apiPaths[1]}.${this.fileType}`),
            method: reqMtd,
            params: reqBody.parameters
          }
        }
      }
      switch (this.version) {
        case 2:
          this.definitions = res.data.definitions
          break;
        case 3:
          if (res.data.components && res.data.components.schemas) {
            this.definitions = res.data.components.schemas
          }
          break;
        default:
          break;
      }
      console.log(inList)
      console.log(typeList)
      console.log(this.api)
    } catch (error) {
      console.log(error)
    }
  }

  // 获取请求地址
  public getApiUrl() {
    let baseUrls = this.url.match(/http(s)?:\/\/[^\/]*/gi)
    if (baseUrls && baseUrls.length > 0) {
      let baseUrl = baseUrls[0]
      if (this.url.includes('swagger-ui.')) {
        this.version = 2
        return baseUrl + '/v2/api-docs'
      } else if (this.url.includes('swagger-ui/')) {
        this.version = 3
        return baseUrl + '/v3/api-docs'
      }
    } else {
      window.showInformationMessage('请检查swagger地址是否正确')
    }
    return ''
  }
}