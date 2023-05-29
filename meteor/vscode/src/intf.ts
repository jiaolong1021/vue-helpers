import { commands, ExtensionContext, TextDocument, window, Position, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, 
  ProviderResult, languages, MarkdownString, QuickPickItem } from 'vscode'
import { getWorkspaceRoot, open, setTabSpace, getCurrentWord, getSwaggerKey } from './util/util'
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
  [prop: string]: {
    [prop: string]: ApiItem
  }
}

export class IntfProvider {
  public context: ExtensionContext;
  public explorer: ExplorerProvider
  // 获取到的swagger数据信息
  public api: Api = {}
  public url: string[] = []
  // public version = 2 // 目前支持2.0 3.0
  private fileType: String = 'ts' // 生成文件类型
  private projectRootPath: string = '' // 工程所在位置
  public static apiCompletionItem: CompletionItem[] = []
  public projectApiPath: string = ''
  public requestPath: string = ''
  public rootPrefix: string = ''
  public rootReplace: string = ''
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

  constructor(context: ExtensionContext, explorer: ExplorerProvider) {
    this.context = context
    this.explorer = explorer
    this.projectRootPath = getWorkspaceRoot('')
    this.fileType = fs.existsSync(path.join(this.projectRootPath, 'tsconfig.json')) ? 'ts' : 'js'
    this.projectApiPath = 'api'
    this.tabSpace = setTabSpace()
    this.setConfig()
  }

  public setConfig() {
    if (this.explorer.config.rootPath) {
      if (this.explorer.config.rootPath.api) {
        this.projectApiPath = this.explorer.config.rootPath.api
      }
      if (this.explorer.config.rootPath.request) {
        this.requestPath = this.explorer.config.rootPath.request
      }
      if (this.explorer.config.rootPath.root) {
        let prefix = this.explorer.config.rootPath.root
        if (prefix) {
          this.rootPrefix = prefix.split('=')[0]
          this.rootReplace = prefix.split('=')[1]
        }
      }
    }
  }

  public register() {
    this.context.subscriptions.push(commands.registerCommand('meteor.interfaceSetting', async () => {
      this.explorer.openConfigInKey('swaggerUrl')
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.interfaceSync', () => {
      this.setConfig()
      this.getSwaggerUrl(true)
      this.url && this.getApi(true)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.interfaceVisit', () => {
      this.getSwaggerUrl(true)
      if (this.url.length === 1) {
        this.url && open(this.url[0])
      } else if (this.url.length > 1) {
        let items: QuickPickItem[] = [];
        this.url.forEach(urlItem => {
          items.push({
            label: urlItem
          })
        });
        const quickPick = window.createQuickPick()
        quickPick.title = `swagger地址访问`
        quickPick.placeholder = 'swagger地址'
        quickPick.value = ''
        quickPick.items = items
        quickPick.onDidChangeSelection((selection) => {
          if (selection[0] && selection[0].label) {
            open(selection[0].label)
          }
          quickPick.hide()
        })
        quickPick.onDidHide(() => {
          quickPick.dispose()
        })
        quickPick.show() 
      }
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.generateApiFile', (params) => {
      this.generateImport(params.apiName, params.url)
      this.generateApiFile(params.apiName, params.url)
    }))
    this.context.subscriptions.push(
      languages.registerCompletionItemProvider(['vue', 'javascript', 'typescript', 'html', 'wxml'], new ApiCompletionItemProvider(), '')
    )
    this.getSwaggerUrl(false)
    this.url && this.getApi(false)
  }

  // 导入文件生成
  public generateImport(apiName: string, url: string) {
    let editor = window.activeTextEditor;
    if (!editor) { return; }
    let count = editor.document.lineCount
    let insertLine = 0
    let insertCharacter = 0
    let filePath = this.getFullPath(this.api[url][apiName].filePath)
    let insertText = `import { ${apiName} } from '${filePath}'\n`
    let line = 0
    let findPosition = false
    let languageId = editor.document.languageId
    let deep = 6
    let deepNum = 0
    let findImport = false
    let isExist = false

    while (!findPosition) {
      let textOrigin = editor.document.lineAt(line).text
      let text = textOrigin.trim()

      // 查找规则：如果是vue，则先找script位置
      if (languageId === 'vue') {
        if (text.includes('<script ')) {
          insertLine = line
        }
      }

      // 已有引入
      if (text?.includes(`'${filePath}'`) || text?.includes(`"${filePath}"`) || text?.includes(`${filePath}.`)) {
        insertLine = line
        if (!new RegExp(`{.*${apiName}.*}`, 'gi').test(text)) {
          insertCharacter = text.replace(/\s*}.*/gi, '').length
          insertText = `, ${apiName}`
          findPosition = true
          line--
        } else {
          isExist = true
        }
      }

      // 查找已有import，并深入6行
      if(text.startsWith('import ')) {
        findImport = true
      }

      if (findImport) {
        if (text.startsWith('import ') || text.includes(' from ')) {
          deepNum = 0
          insertLine = line
        } else {
          deepNum++
          if (deepNum >= deep) {
            findPosition = true
          }
        }
      }

      line++
      if (line >= count) {
        findPosition = true
      }
    }
    if (!isExist) {
      editor?.edit((editBuilder: any) => {
        editBuilder.insert(new Position(insertLine + 1, insertCharacter), insertText);
      })
    }
  }

  // 获取全路径
  public getFullPath(basePath: string) {
    return basePath.replace(new RegExp(`^${this.rootReplace}`, 'gi'), this.rootPrefix)
  }

  // 生成额外文件
  public generateApiFile(apiName: string, url: string) {
    let apiFilePath = ''
    let api = this.api[url][apiName]
    try {
      apiFilePath = path.join(this.projectRootPath, api.filePath + '.' + this.fileType)
      fs.statSync(apiFilePath)
    } catch (error) {
      let baseURL = ''
      let filePath = this.getFullPath(this.requestPath)
      if (this.explorer.config.rootPath && this.explorer.config.rootPath.swaggerConfig) {
        let swaggerPaths = this.explorer.config.rootPath.swaggerConfig.split(':')
        let swaggerPath = swaggerPaths[0]
        let field = swaggerPaths[1]
        if (this.fileType === 'ts') {
          baseURL += '(window as any).'
        }
        
        let configFile = fs.readFileSync(path.join(this.projectRootPath, swaggerPath), 'utf-8').trim()
        let variable = configFile.replace(/^(var|const)\s*/gi, '').replace(/\s+.*/gi, '')
        baseURL = baseURL + variable + '.' + field + '.' + getSwaggerKey(url)
      }
      fs.writeFileSync(apiFilePath, `import request from \'${filePath}'\nconst baseURL = ${baseURL ? baseURL : "''"}\n`);
    }
    let apiText = fs.readFileSync(apiFilePath, 'utf-8')

    // 存在
    if (new RegExp(`export\\s*function\\s*${apiName}\\(`).test(apiText)) {
      return
    }
    let func = `export function ${apiName}(config${this.fileType === 'ts' ? ': any' : ''}) {
  return request({
    url: \`\${baseURL}${api.reqPath.replace(/{/gi, '${config.path.')}\`,
    method: '${api.method}',
    ...config
  })
}\n`;
    fs.appendFileSync(apiFilePath, api.annotation + func, 'utf-8');
  }

  // 获取已配置swagger地址
  public getSwaggerUrl(showMsg: boolean) {
    let conf = this.explorer.config[this.explorer.activeEnv]
    if (conf && conf.interface && conf.interface.swaggerUrl) {
      this.url = conf.interface.swaggerUrl
    } else {
      this.url = []
      if (showMsg) {
        window.showInformationMessage(`请先[配置](command:meteor.interfaceSetting)${this.explorer.activeEnvName}环境的接口地址`)
      }
    }
  }

  // 获取swaggger接口信息
  public async getApi(showMsg: boolean) {
    let urlList = this.getApiUrl()
    if (urlList.length === 0) {
      return
    }
    try {
      this.definitions = {}
      IntfProvider.apiCompletionItem = []
      for (let i = 0; i < urlList.length; i++) {
        const uri = urlList[i];
        const res = await this.explorer.fetch({
          method: 'get',
          url: uri.api
        })
        switch (uri.version) {
          case 2:
            this.definitions[uri.url] = res.data.definitions
            break;
          case 3:
            if (res.data.components && res.data.components.schemas) {
              this.definitions[uri.url] = res.data.components.schemas
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
            if (!this.api[uri.url]) {
              this.api[uri.url] = {}
            }
            if (this.api[uri.url][apiName]) {
              let name = ''
              if (apiPathLen > 2) {
                name = apiPaths[apiPathLen - 2]
                if (!/^{.*}$/gi.test(name)) {
                  nameList.splice(1, 0, name)
                  apiName = camelCase(nameList);
                }
                if (this.api[uri.url][apiName]) {
                  if (apiPathLen > 3) {
                    name = apiPaths[apiPathLen - 3]
                    if (!/^{.*}$/gi.test(name)) {
                      nameList.splice(1, 0, name)
                      apiName = camelCase(nameList);
                    }
                  }
                  if (this.api[uri.url][apiName]) {
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
            this.api[uri.url][apiName] = {
              reqPath: apiPath,
              annotation: annotation,
              description: reqBody.description || '',
              filePath: path.join(this.projectApiPath, `${apiPaths[0] || apiPaths[1]}`),
              method: reqMtd,
              params: reqBody.parameters
            }
  
            // 接口生成文本拼装
            let insertText = `const res = await ${apiName}({\n`
            if (reqBody.parameters && reqBody.parameters.length > 0) {
              // 参数排序
              let params: any = {}
              reqBody.parameters.forEach((param: any) => {
                if (param.in && !(param.in === 'header' && param.name === 'token')) {
                  if (params[param.in]) {
                    params[param.in].push(param)
                  } else {
                    params[param.in] = [param]
                  }
                }
              })
              for (const key in params) {
                const paramList = params[key]
                 let assemble = this.assembleParameters(key, paramList, uri.url)
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
                      let assembe = this.assembleParametersInRequestBody(key, reqBodyParams.schema.properties, uri.url)
                      insertText = assembe.prepend + insertText
                      insertText += assembe.append
                    }
                    break;
                  case 'application/json':
                    if (reqBodyParams.schema && reqBodyParams.schema.$ref) {
                      let assembe = this.assembleParametersInRequestBody(key, reqBodyParams.schema.$ref, uri.url)
                      insertText += assembe.append
                    }
                    break;
                
                  default:
                    break;
                }
              }
            }
            insertText += '})'
  
            let link = ''
            let linkSimple = reqBody.tags[0] + '/' + reqBody.operationId
            if (reqBody.tags && reqBody.tags.length > 0) {
              link = uri.url + '#/' + linkSimple
            }
            let completionItem = new CompletionItem(apiName)
            completionItem.kind = CompletionItemKind.Function
            completionItem.insertText = insertText
            completionItem.documentation = new MarkdownString(`#### ${reqBody.description}
  接口地址: [${linkSimple}](${link})
  
  存放路径: ${this.getFullPath(path.join(this.projectApiPath, `${apiPaths[0] || apiPaths[1]}.${this.fileType}`))}`)
            completionItem.sortText = '444' + IntfProvider.apiCompletionItem.length
            completionItem.command = { command: 'meteor.generateApiFile', title: 'meteor.generateApiFile', arguments: [{
              apiName,
              url: uri.url
            }]}
            IntfProvider.apiCompletionItem.push(completionItem)
          }
        }
        if (showMsg) {
          window.showInformationMessage(`${i}/${urlList.length}: 同步完成${uri.url}`)
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

  public assembleParametersInRequestBody(type: string, params: any, url: string) {
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
          if (this.definitions[url][ref] && this.definitions[url][ref] && this.definitions[url][ref].properties) {
            for (const key in this.definitions[url][ref].properties) {
              const param = this.definitions[url][ref].properties[key]
              if (!append) {
                append += `${this.tabSpace}data: {\n`
              }
              append += `${this.tabSpace}${this.tabSpace}${key}: ${this.paramsDefault[param.type] || "''"},\n`
            }
            append += `${this.tabSpace}},\n`
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
  public assembleParameters(key: string, paramList: any [], url: string) {
    let params = ''
    let position = 'append'
    let paramsKey = this.paramsKeys[key]
    let paramsType = 'json'
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
                let ref = param.schema.originalRef
                if (this.definitions[url][ref] && this.definitions[url][ref] && this.definitions[url][ref].properties) {
                  for (const key in this.definitions[url][ref].properties) {
                    const paramKey = this.definitions[url][ref].properties[key]
                    if (!params) {
                      params += `${this.tabSpace}data: {\n`
                    }
                    params += `${this.tabSpace}${this.tabSpace}${key}: ${this.paramsDefault[paramKey.type] || "''"},\n`
                  }
                } else {
                  params += `${this.tabSpace}${this.tabSpace}${param.name}: '',\n`
                }
              } else if (param.schema.$ref) {
                let ref = param.schema.$ref.replace(/.*\//gi, '')
                if (this.definitions[url][ref] && this.definitions[url][ref] && this.definitions[url][ref].properties) {
                  for (const key in this.definitions[url][ref].properties) {
                    const paramKey = this.definitions[url][ref].properties[key]
                    if (!params) {
                      params += `${this.tabSpace}data: {\n`
                    }
                    params += `${this.tabSpace}${this.tabSpace}${key}: ${this.paramsDefault[paramKey.type] || "''"},\n`
                  }
                }
              } else if (param.schema.type === 'array') {
                if (key === 'body') {
                  params = `${this.tabSpace}${paramsKey}: [\n`
                  paramsType = 'array'
                  if (param.schema.items && param.schema.items.$ref) {
                    let ref = param.schema.items.$ref.replace(/.*\//gi, '')
                    if (this.definitions[url][ref] && this.definitions[url][ref] && this.definitions[url][ref].properties) {
                      for (const key in this.definitions[url][ref].properties) {
                        const paramKey = this.definitions[url][ref].properties[key]
                        params += `${this.tabSpace}${this.tabSpace}${key}: ${this.paramsDefault[paramKey.type] || "''"},\n`
                      }
                    }
                  }
                } else {
                  if (key === 'query') {
                    // query中数组格式参数需要序列化
                    let serializer = `${this.tabSpace}paramsSerializer: params => {\n`
                    serializer += `${this.tabSpace}${this.tabSpace}return qs.stringify(params, { indices: false })\n`
                    serializer += `${this.tabSpace}},\n`
                    params = serializer + params
                  }
                  params += `${this.tabSpace}${this.tabSpace}${param.name}: [],\n`
                }
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
        if (paramsType === 'json') {
          params += `${this.tabSpace}},\n`
        } else if (paramsType === 'array') {
          params += `${this.tabSpace}],\n`
        }
      }
    }
    return {
      value: params,
      position: position
    }
  }

  // 获取请求地址
  public getApiUrl() {
    let urlList = this.url
    let urls: {
      url: string,
      api: string,
      version: number
    }[] = []
    urlList.forEach(url => {
      let baseUrls = url.match(/http(s)?:\/\/[^\/]*/gi)
      if (baseUrls && baseUrls.length > 0) {
        let baseUrl = baseUrls[0]
        if (url.includes('swagger-ui.')) {
          urls.push({
            url: url,
            api: baseUrl + '/v2/api-docs',
            version: 2
          })
        } else if (url.includes('swagger-ui/')) {
          urls.push({
            url: url,
            api: baseUrl + '/v3/api-docs',
            version: 3
          })
        }
      } else {
        window.showInformationMessage('请检查swagger地址是否正确')
      }
    });
    return urls
  }
}

class ApiCompletionItemProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    const word = getCurrentWord(document, position)
    if (['p', 'g', 'd'].includes(word[0])) {
      return IntfProvider.apiCompletionItem
    } else {
      return []
    }
  }
  // resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
  //   throw new Error('Method not implemented.');
  // }
}