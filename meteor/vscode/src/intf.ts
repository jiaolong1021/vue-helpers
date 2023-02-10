import { commands, ExtensionContext, Uri, TextDocument, workspace, window, Selection, Position, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, 
  ProviderResult, languages, MarkdownString } from 'vscode'
import { getWorkspaceRoot, open, setTabSpace, getCurrentWord } from './util/util'
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
  public static apiCompletionItem: CompletionItem[] = []
  public projectApiPath: string = ''
  public definitions: any = {}
  private tabSpace: string = ''
  public paramsKeys: any = {
    header: 'headers',
    body: 'data',
    query: 'params',
    path: 'path',
    formData: 'data',
  }
  public paramsDefault: any = {
    string: "''",
    array: "[]",
    boolean: "false",
    integer: "0",
    ref: "{}",
    file: "{}",
    object: "{}",
  }

  constructor(context: ExtensionContext, explerer: ExplorerProvider) {
    this.context = context
    this.explerer = explerer
    this.projectRootPath = getWorkspaceRoot('')
    this.fileType = fs.existsSync(path.join(this.projectRootPath, 'tsconfig.json')) ? 'ts' : 'js'
    this.projectApiPath = 'src/api'
    if (this.explerer.config.rootPath && this.explerer.config.rootPath.api) {
      this.projectApiPath = this.explerer.config.rootPath.api
    }
    this.tabSpace = setTabSpace()
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
      this.getSwaggerUrl(true)
      this.url && this.getApi(true)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.interfaceVisit', () => {
      this.getSwaggerUrl(true)
      this.url && open(this.url)
    }))
    this.context.subscriptions.push(
      languages.registerCompletionItemProvider(['vue', 'javascript', 'typescript', 'html', 'wxml'], new ApiCompletionItemProvider(), '')
    )
    this.getSwaggerUrl(false)
    this.url && this.getApi(false)
  }

  // 获取已配置swagger地址
  public getSwaggerUrl(showMsg: boolean) {
    let conf = this.explerer.config[this.explerer.activeEnv]
    if (conf && conf.interface && conf.interface.swaggerUrl) {
      this.url = conf.interface.swaggerUrl
    } else {
      this.url = ''
      if (showMsg) {
        window.showInformationMessage(`请先[配置](command:meteor.interfaceSetting)${this.explerer.activeEnvName}环境的接口地址`)
      }
    }
  }

  // 获取swaggger接口信息
  public async getApi(showMsg: boolean) {
    let url = this.getApiUrl()
    if (!url) {
      return
    }
    try {
      const res = await this.explerer.fetch({
        method: 'get',
        url: url
      })
      IntfProvider.apiCompletionItem = []
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
          this.api[apiName] = {
            reqPath: apiPath,
            annotation: annotation,
            description: reqBody.description || '',
            filePath: path.join(this.projectRootPath, this.projectApiPath, `${apiPaths[0] || apiPaths[1]}.${this.fileType}`),
            method: reqMtd,
            params: reqBody.parameters
          }

          // 接口生成文本拼装
          let insertText = `const res = await ${apiName}({\n`
          if (reqBody.parameters && reqBody.parameters.length > 0) {
            // 参数排序
            let params: any = {}
            reqBody.parameters.forEach((param: any) => {
              if (param.in) {
                if (params[param.in]) {
                  params[param.in].push(param)
                } else {
                  params[param.in] = [param]
                }
              }
            })
            for (const key in params) {
              const paramList = params[key]
               let assemble = this.assembleParameters(key, paramList)
               if (assemble.position === 'append') {
                 insertText += assemble.value
               } else if (assemble.position === 'top') {
                insertText = assemble.value + insertText
               }
            }
          }
          if (reqBody.requestBody && reqBody.requestBody.content) {
            for (const key in reqBody.requestBody.content) {
              const reqBodyParams = reqBody.requestBody.content[key]
              switch (key) {
                case 'multipart/form-data':
                  if (reqBodyParams.schema && reqBodyParams.schema.properties) {
                    let assembe = this.assembleParametersInRequestBody(key, reqBodyParams.schema.properties)
                    insertText = assembe.prepend + insertText
                    insertText += assembe.append
                  }
                  break;
                case 'application/json':
                  if (reqBodyParams.schema && reqBodyParams.schema.$ref) {
                    let assembe = this.assembleParametersInRequestBody(key, reqBodyParams.schema.$ref)
                    insertText += assembe.append
                  }
                  break;
              
                default:
                  break;
              }
            }
          }
          insertText += '})'

          let completionItem = new CompletionItem(apiName)
          completionItem.kind = CompletionItemKind.Function
          completionItem.insertText = insertText
          completionItem.documentation = new MarkdownString(`##### ${reqBody.description} \n存放路径：${path.join(this.projectApiPath, `${apiPaths[0] || apiPaths[1]}.${this.fileType}`)}`)
          completionItem.sortText = '444' + IntfProvider.apiCompletionItem.length
          // completionItem.command = { command: 'meteor.apiGenerateFileExtra', title: 'meteor.apiGenerateFileExtra', arguments: [{
          //   apiName
          // }]}
          IntfProvider.apiCompletionItem.push(completionItem)
        }
      }
      if (showMsg) {
        window.showInformationMessage('同步完成')
      }
    } catch (error) {
      if (showMsg) {
        window.showInformationMessage((error as any).message)
      }
    }
  }

  public assembleParametersInRequestBody(type: string, params: any) {
    let prepend = ''
    let append = ''
    switch (type) {
      case 'multipart/form-data':
        for (const key in params) {
          if (!prepend) {
            prepend += `const formData = new FormData()\n`
          }
          prepend += `formData.append('${key}', {})\n`
        }
        append += `${this.tabSpace}data: formData,\n`
        append += `${this.tabSpace}headers: {\n`
        append += `${this.tabSpace}${this.tabSpace}"Content-Type": "multipart/form-data",\n`
        append += `${this.tabSpace}},\n`
        break;
      case 'application/json':
        if (params) {
          let refs = params.split('/')
          let ref = refs[refs.length - 1]
          if (this.definitions[ref] && this.definitions[ref].properties) {
            for (const key in this.definitions[ref].properties) {
              const param = this.definitions[ref].properties[key]
              if (!append) {
                append += `${this.tabSpace}data: {\n`
              }
              append += `${this.tabSpace}${this.tabSpace}${key}: ${this.paramsDefault[param.type] || "''"},\n`
            }
          }
        }
        break;    
      default:
        break;
    }
    return {
      append,
      prepend
    }
  }

  // 拼装请求参数 key: ['header', 'body', 'query', 'path', 'formData']
  // ['string', 'array', 'boolean', 'integer', 'ref', 'file’, ‘object’]
  public assembleParameters(key: string, paramList: any []) {
    let params = ''
    let position = 'append'
    let paramsKey = this.paramsKeys[key]
    if (paramsKey) {
      paramList.forEach(param => {
        switch (key) {
          case 'header':
          case 'body':
          case 'query':
          case 'path':
            if (!params) {
              params += `${this.tabSpace}${paramsKey}: {\n`
            }
            if (param.schema) {
              if (param.schema.originalRef) {
                params += `${this.tabSpace}${this.tabSpace}${param.name}: {},\n`
              } else if (param.schema.type === 'array') {
                if (key === 'query') {
                  // query中数组格式参数需要序列化
                  let serializer = `${this.tabSpace}paramsSerializer: params => {\n`
                  serializer += `${this.tabSpace}${this.tabSpace}return qs.stringify(params, { indices: false })\n`
                  serializer += `${this.tabSpace}},\n`
                  params = serializer + params
                }
                params += `${this.tabSpace}${this.tabSpace}${param.name}: [],\n`
              } else {
                params += `${this.tabSpace}${this.tabSpace}${param.name}: '',\n`
              }
            } else {
              params += `${this.tabSpace}${this.tabSpace}${param.name}: ${this.paramsDefault[param.type] || "''"},\n`
            }
            break;
          case 'formData':
            if (!params) {
              params += `const formData = new FormData()\n`
            }
            params += `formData.append('${param.name}', {})\n`
            break;
          default:
            break;
        }
      });
      if (key === 'formData') {
        position = 'top'
      } else {
        params += `${this.tabSpace}},\n`
      }
    }
    return {
      value: params,
      position: position
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

class ApiCompletionItemProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    const word = getCurrentWord(document, position)
    if (['p', 'g', 'd'].includes(word[0])) {
      return IntfProvider.apiCompletionItem
    }
  }
  // resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
  //   throw new Error('Method not implemented.');
  // }
}