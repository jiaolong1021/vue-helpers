import * as path from 'path';
import * as fs from 'fs'
import { ExtensionContext, commands, window, WebviewPanel, ViewColumn, Uri, Disposable, workspace, ConfigurationTarget, TextEditor,
  QuickPickItem, Position, ProgressLocation } from 'vscode'
import { open, url, getHtmlForWebview, winRootPathHandle, getWorkspaceRoot, getRelativePath } from './util/util'
import axios, { AxiosInstance } from 'axios';
import vuePropsDef from './util/vueProps';

export class ComponentProvider {
  public context: ExtensionContext
  public activeView: WebviewPanel | undefined;
  private readonly viewType = 'meteorComponent'
  private _disposables: Disposable[] = [];
  private activeTextEditor: TextEditor | undefined
  // 页面对应模板页面列表
  public pick: string = ''; // 生成页面类型
  public pageName: string = ''; // 页面名称
  public pageTemplateList: any = {};
  public uri: Uri | undefined;
  public rootPathConfig: any = {};
  public noSelectFolder: Boolean = false;
  public pages: any[] = [];
  public projectRoot: string = ''; // 工程根路径
  public GenerateWay = {
    PAGE: '1',
    COMPONENT: '2'
  };
  public Category = {
    VUE: 'vue',
    REACT: 'react'
  };
  public way: string = ''; // 操作方式：page, component
  public templateRoot: string = 'asset/template';
  public componentRoot: string = 'asset/component';
  public selectedFolder: string = ''
  public fetch: AxiosInstance

  constructor(context: ExtensionContext) {
    this.context = context
    this.fetch = axios.create({
      baseURL: url.base,
      withCredentials: false
    })
  }

  public register() {
    this.context.subscriptions.push(commands.registerCommand('meteor.componentSee', () => {
      open(url.component)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.componentUpload', () => {
      this.openView()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.componentSync', () => {
      this.sync()
    }))
  }

  // 打开视图
  public openView() {
    const viewColumn = window.activeTextEditor
			? window.activeTextEditor.viewColumn
			: undefined;
    // 当前面板存在，加载
    if (this.activeView) {
      return this.activeView.reveal(viewColumn)
    }
    // 创建一个新的面板
    this.activeView = window.createWebviewPanel(
			this.viewType,
			'Meteor',
			ViewColumn.Two,
			{
				// webview允许使用javascript
				enableScripts: true,
				localResourceRoots: [Uri.file(path.join(this.context.extensionPath, 'media'))]
			}
		);
    // 关闭
    this.activeView.onDidDispose(() => {
      this.dispose()
    }, null, this._disposables)
    // 切换
    this.activeView.onDidChangeViewState(() => {
      if (this.activeView?.visible) {
        // console.log('onDidChangeViewState')
      }
    }, null, this._disposables)
    // 处理来自webview的信息
    this.activeView.webview.onDidReceiveMessage((message) => {
      console.log(message.command)
      switch (message.command) {
        case 'getPageConfig':
          this.getPageConfig();
          return;
        case 'modifyPageConfig':
          this.modifyPageConfig(message);
          return;
        // 添加组件
        case 'addPage':
          this.addComponentByOnline(message.config.page)
          break;
        case 'inPage':
          this.inPage()
          break;
      }
    }, null, this._disposables)
    this.loadHtml()
  }

  inPage() {
    if (window.activeTextEditor) {
      this.activeTextEditor = window.activeTextEditor
    }
  }

  // 修改页面配置信息
	modifyPageConfig(message: any) {
		if (message.config.user) {
			workspace.getConfiguration('meteor').update('user', message.config.user, ConfigurationTarget.Global);
		}
		this.activeView?.webview.postMessage({ command: 'modifyConfigDone'});
	}
  // 获取页面配置信息
	getPageConfig() {
		const config = workspace.getConfiguration('meteor');
		this.activeView?.webview.postMessage({ command: 'backConfig', config});
	}

  // 面板关闭
  public dispose() {
    this.activeView?.dispose()
    while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
    this.activeView = undefined
  }

  // 加载html
  public loadHtml() {
    if (this.activeView) {
      this.activeView.title = 'Meteor'
      this.activeView.webview.html = getHtmlForWebview(this.activeView.webview, this.context.extensionPath, '/page', '创建页面')
    }
  }

  // 添加组件
  public addComponentByOnline(page: any) {
    if (!this.activeTextEditor) {
      return window.showInformationMessage('请选择插入组件位置')
    }
    // 在线模式下，生成pages，不取本地
    let obj: any = {};
    obj[page.description.name] = {
      category: page.category,
      type: page.type,
      block: page.block
    };
    let pages: any = [];
    page.code.forEach((codeItem: any) => {
      let dotPosition = codeItem.name.lastIndexOf('.');
      pages.push({
        template: page.id + '/' + codeItem.name,
        type: codeItem.type,
        fileName: codeItem.name.substr(0, dotPosition),
        poster: codeItem.name.substr(dotPosition, codeItem.name.length),
        onlineCode: codeItem.code,
        position: codeItem.position
      });
    });
    obj[page.description.name].pages = pages;
    if (page.type === '0') {
      // 组件
      let edior: TextEditor | undefined = this.activeTextEditor
      if (edior) {
        // 生成组件
        // 获取文件所在文件夹
        let uriPath = edior.document.uri.path
        if (uriPath.includes('.')) {
          uriPath = uriPath.replace(/[\/|\\]\w*.\w*$/gi, '')
        }
        this.init(Uri.file(uriPath));
        this.way = this.GenerateWay.COMPONENT;
        this.pick = page.description.name;
        this.pageName = page.description.name;
        this.pageTemplateList = obj
        this.generate();
      } else {
        window.showInformationMessage('请选择插入位置！')
      }
    } else if (page.type === '1') {
      // 页面
      if (this.selectedFolder) {
        this.init(Uri.file(this.selectedFolder));
        this.way = this.GenerateWay.PAGE;
        this.setPage();
        this.getQuickPickItems()
        this.pick = page.description.name;
        this.pageName = page.description.name;
        this.pageTemplateList = obj
        this.showGenerateNameInput(page.description || '');
      } else {
        window.showInformationMessage('请选择生成页面目录！')
      }
    }
  }

  /**
   * 显示输入名称弹框
   */
  public async showGenerateNameInput(category: string) {
    let placeholder = '前缀 - 页面生成规则为【前缀+文件名】';
    if (category === '(miniapp)') {
      placeholder = '页面名称';
    }
    let name = await window.showInputBox({
      placeHolder: placeholder
    });
    if (name) {
      this.pageName = name;
      this.generate();
    }
  }

  public getQuickPickItems() {
    const items: QuickPickItem[] = [];
    this.pages.forEach((item: any) => {
      items.push({
        label: item.label,
        description: item.description
      });
    });
    return items;
  }

  public setPage() {
    // 插件配置信息
    let configPath = path.join(this.context.extensionUri.path, this.templateRoot, 'page.json');
    try {
      configPath = winRootPathHandle(configPath);
      let config: string = fs.readFileSync(configPath, 'utf-8');
      this.setPageByConfig(config);
    } catch (error) {
      window.showWarningMessage('插件中page.json文件出错！');
    }
  }

  // 通过配置设置页面参数
  public setPageByConfig(config: string) {
    if (config) {``
      let conf = JSON.parse(config);
      let pages = [];
      for (const key in conf) {
        pages.push({
          label: key,
          description: `(${conf[key].category})`
        });
      }
      this.pageTemplateList = Object.assign(this.pageTemplateList, conf);
      this.pages = this.pages.concat(pages);
    }
  }

  public async init(uri: Uri) {
    if (uri) {
      this.uri = uri;
    } else if (workspace.workspaceFolders) {
      this.uri = workspace.workspaceFolders[0].uri;
      this.noSelectFolder = true;
    }
    this.pageTemplateList = {};
    this.pages = [];
    this.setProjectRoot();
  }

  // 设置工程根路径
  public setProjectRoot() {
    if (workspace.workspaceFolders) {
      workspace.workspaceFolders.forEach(workspaceFolder => {
        if (this.uri?.path.includes(workspaceFolder.uri.path)) {
          this.projectRoot = workspaceFolder.uri.path;
        }
      });
    }
    let meteorJsonPath = path.join(this.projectRoot, 'meteor.json')
    if (fs.existsSync(meteorJsonPath)) {
      let meteorConfig: any = fs.readFileSync(meteorJsonPath, 'utf-8')
      if (meteorConfig) {
        this.rootPathConfig = JSON.parse(meteorConfig).rootPath
      }
    }
  }

  /**
   * 页面生成
   */
  public async generate() {
    //  1. 获取页面列表
    let pagesInfo = this.pageTemplateList[this.pick];
    if (!pagesInfo) {
      return
    }
    // 2. 读取相关页面，并替换为页面名称
    let pages: any[] = pagesInfo.pages;
    let codeBlocks: any[] = []
    let fileList: any[] = []
    pages.forEach(page => {
      let pagePath = '';
      switch (page.type) {
        case 'page':
        case 'component':
        case 'func':
        case 'funcFile':
          // 通过是否存在文件名来判断是不是代码块
          if (page.fileName) {
            // 页面
            if (page.type === 'page') {
              // 名称组装
              let name = this.pageName + page.fileName[0].toUpperCase() + page.fileName.substr(1, page.fileName.length);
              if (pagesInfo.category === 'miniapp') {
                name = this.pageName;
              }
              if (this.uri) {
                if (this.noSelectFolder) {
                  return window.showInformationMessage('请先选择目录')
                } else {
                  pagePath = path.join(this.uri.path, name + page.poster);
                }
              }
            } else {
              // 组件
              let componentDir = path.join(this.projectRoot, this.rootPathConfig.component, this.pick)
              // 创建组件目录
              try {
                componentDir = winRootPathHandle(componentDir);
                fs.statSync(componentDir);
              } catch (error) {
                fs.mkdirSync(componentDir)
              }
              pagePath = path.join(this.projectRoot, this.rootPathConfig.component, this.pick, page.fileName + page.poster)
            }
            try {
              pagePath = winRootPathHandle(pagePath);
              fs.statSync(pagePath);
              // vscode.window.showInformationMessage(`文件${pagePath}已存在`)
            } catch (error) {
              if (page.onlineCode) {
                this.fileWrite(pagePath, page.onlineCode)
              } else {
                // 离线模式
                this.fileGenerate(pagePath, path.join(this.context.extensionUri.path, this.way === this.GenerateWay.PAGE ? this.templateRoot : this.componentRoot, page.template), page.type, {});
              }
            }
          } else {
            // 代码块
            codeBlocks.push(page)
          }
          break;
        case 'store':
          let storeJs = path.join(this.projectRoot, this.rootPathConfig.store, 'modules', this.pageName + '.js');
          let storeIndexJs = path.join(this.projectRoot, this.rootPathConfig.store, 'index.js');
          try {
            storeJs = winRootPathHandle(storeJs);
            fs.statSync(storeJs);
          } catch (error) {
            this.fileGenerate(storeJs, path.join(this.context.extensionUri.path, this.templateRoot, page.template), 'file', {});
            this.fileGenerate(storeIndexJs, storeIndexJs, page.type, {});
          }
          break;
        case 'api':
          pagePath = path.join(this.projectRoot, this.rootPathConfig.api, this.pageName + '.js');
          try {
            pagePath = winRootPathHandle(pagePath);
            fs.statSync(pagePath);
          } catch (error) {
            this.fileGenerate(pagePath, path.join(this.context.extensionUri.path, this.templateRoot, page.template), page.type, {});
          }
          break;
        case 'file':
          fileList.push({
            url: `${this.pick}_${page.fileName}${page.poster}`,
            name: `${page.fileName}${page.poster}`
          })
          break;
        default:
          break;
      }
    });
    // 代码块统一处理
    if (codeBlocks.length > 0) {
      this.codeBlockFill(codeBlocks, pagesInfo.category);
    }
    // 图片、excel文件处理
    this.otherFileDownload(fileList)
  }

  // 内容生成
  public fileWrite(pagePath: string, str: string) {
    try {
      fs.writeFileSync(pagePath, str);
    } catch (error) {
      
    }
  }

  // 完整文件下载，比如图片，excel等
  public otherFileDownload(fileList: any[]) {
    for (let i = 0; i < fileList.length; i++) {
      const fileItem = fileList[i];
      if (this.uri) {
        let filePath = path.join(this.uri.path, fileItem.name)
        axios({
          url: `https://www.80fight.cn/zlst/${fileItem.url}`,
          responseType: 'stream',
          method: 'get'
        }).then((res) => {
          res.data.pipe(fs.createWriteStream(filePath))
        })
      }
    }
  }

  /**
   * 代码块填充
   * @param page 
   */
  public codeBlockFill(pages: any[], category: string) {
    // 规定所有文件都取自 index.txt
    switch (category) {
      case 'vue2':
      case 'vue3':
        this.codeBlockFillVue(pages, category);
        break;
      case 'miniapp':
        this.codeBlockFillMiniapp(pages);
        break;
    
      default:
        break;
    }
  }

  // 文件生成
  public async fileGenerate(pagePath: string, template: string, type: string, options: any) {
    // 读取模板文件，替换，生成
    template = winRootPathHandle(template);
    let tempStr = fs.readFileSync(template, 'utf-8');
    if (type === 'page' || type === 'component') {
      tempStr = tempStr.replace(/\$\$/gi, this.pageName).replace(/##/gi, this.pageName[0].toUpperCase() + this.pageName.substr(1, this.pageName.length));
    } else if (type === 'store') {
      // 存储
      let tempArr = tempStr.split('\n');
      let tempContent = tempArr[0] + '\n';
      let len = tempArr.length;
      for (let i = 1; i < len; i++) {
        const temp = tempArr[i];
        if (i + 1 === len) {
          tempContent += temp;
        } else if (tempArr[i - 1].includes('import ') && !temp.includes('import ')) {
          tempContent += `import ${this.pageName} from './modules/${this.pageName}'\n`;
          tempContent += temp + '\n';
        } else if (tempArr[i - 1].includes('modules:') && !temp.includes('modules:')) {
          let tempTrim = temp.trim();
          tempContent += temp.substr(0, temp.indexOf(tempTrim)) + `${this.pageName},\n`;
          tempContent += temp + '\n';
        } else {
          tempContent += temp + '\n';
        }
      }
      tempStr = tempContent;
    } else if (type === 'router') {
      // 路由操作
      let tempArr = tempStr.split('\n');
      let tempContent = tempArr[0] + '\n';
      let len = tempArr.length;
      let rootFound = false; // 找到 '/'
      for (let i = 1; i < len; i++) {
        const temp = tempArr[i];
        if (temp.includes("'/'")) {
          rootFound = true;
        }
        if (i + 1 === len) {
          tempContent += temp;
        } else if (rootFound && temp.includes('children')) {
          let tempTrim = temp.trim();
          let space = temp.substr(0, temp.indexOf(tempTrim));
          tempContent += temp + '\n';
          tempContent += options.routers.replace(/#/gi, space);
          rootFound = false;
        } else {
          tempContent += temp + '\n';
        }
      }
      tempStr = tempContent;
    } else if (type === 'apiEach') {
      // 单个api生成
      tempStr += options.api;
    } else if (type === 'apiEachStore') {
      // 单个api对应的store
      let apiPath = options.apiStore.apiPath.replace(/.js/, '');
      let workspaceRoot = getWorkspaceRoot('')
      let relativePath = getRelativePath(path.join(workspaceRoot, this.rootPathConfig.store, 'modules/store'), path.join(workspaceRoot, this.rootPathConfig.api))
      tempStr = tempStr.replace(/##/gi, path.join(relativePath, apiPath));
      let tempArr = tempStr.split('\n');
      let tempContent = '';
      let len = tempArr.length;
      let step = 1; // 1：import 2： state 3: mutations 4: actions 5: 结束
      for (let i = 0; i < len; i++) {
        const temp = tempArr[i];
        if (i + 1 === len) {
          tempContent += temp;
        } else if (step === 1) {
          if (temp.includes("/" + apiPath + "'")) {
            step = 2;
            if (temp.includes('{}')) {
              tempContent += temp.replace(/\s?}/gi, ` ${options.apiStore.apiName} }`);
            } else {
              tempContent += temp.replace(/\s?}/gi, `, ${options.apiStore.apiName} }`);
            }
            tempContent += '\n';
            continue;
          } else {
            tempContent += temp + '\n';
          }
        } else if (step === 2) {
          if (temp.includes('state') && !/.*state.*\(.*\).*{.*/gi.test(temp)) {
            step = 3;
            tempContent += temp + '\n';
            continue;
          }
          if (temp.includes('return')) {
            step = 3;
            tempContent += temp + '\n';
          } else {
            tempContent += temp + '\n';
          }
        } else if (step === 3) {
          if (temp.includes('mutations')) {
            step = 4;
            tempContent += temp + '\n';
            let tempTrim = temp.trim();
            let space = temp.substr(0, temp.indexOf(tempTrim));
            if (tempArr[i + 1]) {
              // 里面没有内容
              if (tempArr[i + 1].endsWith('}')) {
                tempContent += space + '  ' + options.apiStore.mutations + '\n';
              } else {
                tempContent += space + '  ' + options.apiStore.mutations + ',\n';
              }
            }
          } else {
            tempContent += temp + '\n';
          }
        } else if (step === 4) {
          if (temp.includes('actions')) {
            step = 5;
            tempContent += temp + '\n';
            let tempTrim = temp.trim();
            let space = temp.substr(0, temp.indexOf(tempTrim));
            if (tempArr[i + 1].endsWith('}')) {
              tempContent += space + '  ' + options.apiStore.actions + '\n';
            } else {
              tempContent += space + '  ' + options.apiStore.actions + ',\n';
            }
          } else {
            tempContent += temp + '\n';
          }
        } else {
          tempContent += temp + '\n';
        }
      }
      tempStr = tempContent;
    }
    pagePath = winRootPathHandle(pagePath);
    try {
      fs.writeFileSync(pagePath, tempStr);
    } catch (error) {
      
    }
  }

  /**
   * vue代码块填充
   * @param page 
   */
  public codeBlockFillVue(pages: any [], category: string) {
    let editor: TextEditor | undefined = this.activeTextEditor;
    if (editor) {
      // 合并代码块内容, 拼装规则为，func内容在slot-name来替换组件内容
      let names: string[] = [];
      let templateObj: any = {};
      pages.forEach(page => {
        let templatePath = ''
        if (!page.onlineCode) {
          templatePath = path.join(this.context.extensionUri.path, this.way === this.GenerateWay.PAGE ? this.templateRoot : this.componentRoot, page.template + (page.position ? page.position + '.txt' : 'index.txt'));
        }
        let template = ''
        // 在线代码存在
        if (page.onlineCode) {
          template = page.onlineCode
        } else {
          templatePath = winRootPathHandle(templatePath)
          try {
            template = fs.readFileSync(templatePath, 'utf-8');
          } catch (error) {
            console.error('error', error)
          }
        }
        let templateArr = JSON.parse(template);
        for (let i = 0; i < templateArr.length; i++) {
          const tempateItem = templateArr[i];
          if (names.indexOf(tempateItem.name) === -1) {
            names.push(tempateItem.name);
          }
          if (templateObj[tempateItem.name]) {
            if (page.type === 'func') {
              templateObj[tempateItem.name] = templateObj[tempateItem.name].replace(new RegExp(`slot-${page.position}`), tempateItem.code)
            } else {
              templateObj[tempateItem.name] += tempateItem.code;
            }
          } else {
            templateObj[tempateItem.name] = tempateItem.code;
          }
        }
      })
      commands.executeCommand('vscode.executeDocumentSymbolProvider', editor.document.uri).then(async (symbols: any) => {
        // 拼装插入内容位置、内容
        let doc: any[] = []
        if (!symbols) {
          await editor?.edit((editBuilder: any) => {
            editBuilder.insert(editor?.selection.active, templateObj['template']);
          });
          return
        }
        symbols.forEach((symbolItem: any) => {
          doc.push(symbolItem)
          symbolItem.children.forEach((symbolChild: any) => {
            doc.push(symbolChild)
          });
        });
        let insertList: any[] = [];
        if (symbols && symbols.length > 0) {
          // let doc = symbols[0];
          let defaultLine = 0;
          doc.forEach((oneLevelItem: any) => {
            if (oneLevelItem.name === 'template' && names.includes('template')) {
              names.splice(names.indexOf('template'), 1);
              insertList.push({
                position: editor?.selection.active || oneLevelItem.location.range._end,
                code: templateObj['template']
              });
            } else if (oneLevelItem.name.startsWith('script')) {
              if (names.includes('import')) {
                names.splice(names.indexOf('import'), 1);
                let line = oneLevelItem.location.range._start._line
                insertList.push({
                  position: {
                    _line: line,
                    _character: editor?.document.lineAt(line).text.length
                  },
                  code: '\n' + templateObj['import']
                });
              }
              if (category === 'vue2') {
                oneLevelItem.children.forEach((scriptChild: any) => {
                  if (scriptChild.name === 'default') {
                    defaultLine = scriptChild.location.range._start._line;
                    // vue属性
                    scriptChild.children.forEach((vueProp: any) => {
                      if (names.includes(vueProp.name)) {
                        names.splice(names.indexOf(vueProp.name), 1);
                        let line = (vueProp.kind === 5 && vueProp.name === 'data') ? vueProp.location.range._end._line - 2: vueProp.location.range._end._line - 1
                        let code = '';
                        // code存在才处理
                        if (templateObj[vueProp.name]) {
                          if (vueProp.children.length > 0) {
                            code += ',\n';
                          } else {
                            code += '\n'
                          }
                          code += templateObj[vueProp.name];
                          insertList.push({
                            position: {
                              _line: line,
                              _character: editor?.document.lineAt(line).text.length
                            },
                            code: code
                          });
                        }
                      }
                    });
                  }
                });
              }
            } else if (oneLevelItem.name.startsWith('style') && names.includes('style')) {
              names.splice(names.indexOf('style'), 1);
              let line = oneLevelItem.location.range._end._line - 1;
              if (templateObj['style']) {
                insertList.push({
                  position: {
                    _line: line,
                    _character: editor?.document.lineAt(line).text.length
                  },
                  code: '\n' + templateObj['style']
                });
              }
            }
          });
          if (category === 'vue2') {
            names.forEach((name: string) => {
              if (vuePropsDef.vue[name]) {
                insertList.push({
                  position: {
                    _line: defaultLine,
                    _character: editor?.document.lineAt(defaultLine).text.length
                  },
                  code: '\n' + vuePropsDef.vue[name].replace(/##/gi, templateObj[name])
                });
              }
            });
          }
          await editor?.edit((editBuilder: any) => {
            insertList.forEach((insert) => {
              editBuilder.insert(new Position(insert.position._line, insert.position._character), insert.code);
            });
          });
        } else if (templateObj['template'] && editor?.selection.active) {
          await editor?.edit((editBuilder: any) => {
            editBuilder.insert(editor?.selection.active, templateObj['template']);
          });
        }
      }).then(() => {
        if (this.activeTextEditor) {
          // 聚焦进入的页面
          window.showTextDocument(this.activeTextEditor?.document, this.activeTextEditor.viewColumn)
          setTimeout(() => {
            commands.executeCommand('eslint.executeAutofix');
          }, 100);
        }
      })
    }
  }

  /**
   * 小程序代码块生成
   * @param pages 
   */
  public codeBlockFillMiniapp(pages: any) {
    let editor: TextEditor | undefined = this.activeTextEditor;
    if (editor) {
      pages.forEach((page:any) => {
      let templatePath = ''
      if (!page.onlineCode) {
        templatePath = path.join(this.context.extensionUri.path, this.way === this.GenerateWay.PAGE ? this.templateRoot : this.componentRoot, page.template + 'index.txt');
      }
      try {
        let template = ''
        // 在线代码存在
        if (page.onlineCode) {
          template = page.onlineCode
        } else {
          templatePath = winRootPathHandle(templatePath)
          template = fs.readFileSync(templatePath, 'utf-8');
        }
        let templateArr = JSON.parse(template);
        let names: string[] = [];
        let templateObj: any = {};
        // wxml wxss json
        let has = ['', '', '', ''];
        let cursorCode = ''
        for (let i = 0; i < templateArr.length; i++) {
          const tempateItem = templateArr[i];
          if (tempateItem.name === 'wxml') {
            has[0] = tempateItem.code;
          } else if (tempateItem.name === 'wxss') {
            has[1] = tempateItem.code;
          } else if (tempateItem.name === 'json') {
            has[2] = tempateItem.code;
          } else if (tempateItem.name === 'cursor') {
            cursorCode = tempateItem.code;
          } else {
            names.push(tempateItem.name);
            templateObj[tempateItem.name] = tempateItem.code;
          }
        }
        // 小程序分五个文件处理
        let filePath = editor && editor.document.uri.path || ''
        let fileName = filePath.replace(/.*\/(.*)\..*/gi, '$1')
        let docFolder = path.join(filePath, '..');
        // wxml文件
        if (has[0]) {
          let pathXml = path.join(docFolder, fileName + '.wxml');
          try {
            fs.statSync(pathXml);
            if (filePath.endsWith('wxml')) {
              editor?.edit((editBuilder: any) => {
                editBuilder.insert(editor?.selection.active, has[0]);
              });
            } else {
              pathXml = winRootPathHandle(pathXml);
              fs.appendFileSync(pathXml, '\n' + has[0]);
            }
          } catch (error) {
            pathXml = winRootPathHandle(pathXml);
            fs.writeFileSync(pathXml, has[0]);
          }
        }
        // wxss
        if (has[1]) {
          let pathWxss = path.join(docFolder, fileName + '.wxss');
          try {
            fs.statSync(pathWxss);
            if (filePath.endsWith('wxss')) {
              editor?.edit((editBuilder: any) => {
                editBuilder.insert(editor?.selection.active, has[1]);
              });
            } else {
              pathWxss = winRootPathHandle(pathWxss);
              fs.appendFileSync(pathWxss, '\n' + has[1]);
            }
          } catch (error) {
            pathWxss = winRootPathHandle(pathWxss);
            fs.writeFileSync(pathWxss, has[1]);
          }
        }
        // json
        if (has[2]) {
          let pathJson = path.join(docFolder, fileName + '.json');
          try {
            fs.statSync(pathJson);
            pathJson = winRootPathHandle(pathJson);
            let jsonFile: any = fs.readFileSync(pathJson, 'utf-8');
            let codeArr = has[2].split('\n');
            let jsonArr = jsonFile.split('\n');
            let hasComponents = false;
            let endComponent = 0;
            let position = {
              line: 0,
              character: 0,
              space: ''
            };
            let componentList: any[] = [];
            for (let i = 0; i < jsonArr.length; i++) {
              const jsonLine = jsonArr[i];
              if (jsonLine.includes('usingComponents')) {
                hasComponents = true;
              }
              if (hasComponents && endComponent === 0 && jsonLine.includes('}')) {
                endComponent = i;
                position = {
                  line: i-1,
                  character: jsonArr[i-1].length,
                  space: jsonArr[i-1].replace(jsonArr[i-1].trim(), '')
                };
              }
              if (hasComponents && !endComponent) {
                componentList.push(jsonLine.replace(/[\s\"\',]/gi, '').split(':')[0]);
              }
            }
            if (position.line === 0 && position.character === 0) {
              position = {
                line: jsonArr.length - 1,
                character: jsonArr[jsonArr.length - 1].length,
                space: jsonArr[jsonArr.length - 1].replace(jsonArr[jsonArr.length - 1].trim(), '')
              };
            }
            let codes = '';
            codeArr.forEach((code: string) => {
              let codeItem = code.replace(/[\s\"\',]/gi, '').split(':');
              if (codeItem.length === 2) {
                if (componentList.indexOf(codeItem[0]) === -1) {
                  codes += `,\n${position.space}"${codeItem[0]}": "${codeItem[1]}"`;
                }
              }
            });
            if (!hasComponents) {
              codes = codes.substr(1, codes.length);
              codes = `${position.space}"usingComponents": {\n` + codes + `\n${position.space}}`;
            } else if (componentList.length === 0) {
              codes = codes.substr(1, codes.length);
            }
            let jsonStr = '';
            for (let i = 0; i < jsonArr.length; i++) {
              jsonStr += jsonArr[i];
              if (i === position.line) {
                jsonStr += codes + '\n';
              } else {
                jsonStr += '\n';
              }
            }
            fs.writeFileSync(pathJson, jsonStr);
          } catch (error) {
            pathJson = winRootPathHandle(pathJson);
            fs.writeFileSync(pathJson, `{
  "navigationBarTitleText": "",
  "usingComponents": {
    ${has[2]}
  }
}`);
          }
        }
        // js文件处理
        if (cursorCode) {
          // 直接在光标位置添加代码
          editor?.edit((editBuilder: any) => {
            editBuilder.insert(editor?.selection.active, cursorCode);
          });
          return
        }
        let pathJs = path.join(docFolder, fileName + '.js');
        try {
          pathJs = winRootPathHandle(pathJs);
          let jsFile = fs.readFileSync(pathJs, 'utf-8')
          let jsArr = jsFile.split('\n');
          let tag = {
            name: 'import',
            kind: '1', // 1: attr 2: function
            beginLine: 0
          };
          let braceLeftCount = 0;
          let braceRight = 0;
          let braceLeft: any = 0;
          let jsFill = '';
          let isInPage = false;
          for (let i = 0; i < jsArr.length; i++) {
            const jsCont = jsArr[i];
            if (tag.name === 'import' && (!jsCont.trim() || jsCont.includes('Page('))) {
              names.splice(names.indexOf('import'), 1);
              tag.name = '';
              if(templateObj['import']){
                jsFill += templateObj['import'] + '\n';
              }
            }
            if (jsCont.includes('Page(')) {
              isInPage = true;
            }
            if (braceLeftCount === 1) {
              // 获取当前标签
              tag.name = jsCont.replace(/\s*(async\s*)?(\w*)\s*(:|\().*/gi, '$2');
              tag.beginLine = i;
              if (jsCont.includes('(') && jsCont.includes(')')) {
                tag.kind = '2';
              } else {
                tag.kind = '1';
              }
            } 
            braceLeft = jsCont.match(/{/gi)?.length || 0;
            braceRight = jsCont.match(/}/gi)?.length || 0;
            braceLeftCount += braceLeft - braceRight;
            if (braceLeftCount === 1 && tag.name) {
              if (tag.kind === '1') {
                if (i > tag.beginLine + 1) {
                  // 有属性
                  let prevCont = jsArr[i - 1]
                  let space = prevCont.replace(prevCont.trim(), '');
                  if (templateObj[tag.name]) {
                    names.splice(names.indexOf(tag.name), 1);
                    jsFill = jsFill.substr(0, jsFill.length - 1);
                    if (prevCont.trim()) {
                      if (!jsFill.endsWith(',')) {
                        jsFill += ',';
                      }
                      jsFill += '\n' + space + templateObj[tag.name] + '\n';
                    } else {
                      jsFill += space + templateObj[tag.name] + '\n';
                    }
                  }
                } else {
                  // 没有属性
                  let space = jsArr[i].replace(jsArr[i].trim(), '') + '  ';
                  if (templateObj[tag.name]) {
                    names.splice(names.indexOf(tag.name), 1);
                    jsFill = jsFill.substr(0, jsFill.length - 1);
                    // if (!jsFill.endsWith(',')) {
                    //   jsFill += ',';
                    // }
                    jsFill += '\n' + space + templateObj[tag.name] + '\n';
                  }
                }
              } else if (tag.kind === '2') {
                if (i > tag.beginLine + 1) {
                  // 有内容
                  let space = jsArr[i - 1].replace(jsArr[i - 1].trim(), '');
                  if (templateObj[tag.name]) {
                    names.splice(names.indexOf(tag.name), 1);
                    jsFill = jsFill.substr(0, jsFill.length - 1);
                    jsFill += '\n' + space + templateObj[tag.name] + '\n';
                  }
                } else {
                  // 没有内容
                  let space = jsArr[i].replace(jsArr[i].trim(), '') + '  ';
                  if (templateObj[tag.name]) {
                    names.splice(names.indexOf(tag.name), 1);
                    jsFill = jsFill.substr(0, jsFill.length - 1);
                    jsFill += '\n' + space + templateObj[tag.name] + '\n';
                  }
                }
              }
            }
            if (braceLeftCount === 0 && isInPage && tag.name) {
              tag.name = '';
              let space = jsArr[i - 1].replace(jsArr[i - 1].trim(), '');
              if (templateObj['js']) {
                names.splice(names.indexOf('js'), 1);
                jsFill = jsFill.substr(0, jsFill.length - 1);
                if (!jsFill.endsWith(',')) {
                  jsFill += ',';
                }
                jsFill += '\n' + space + templateObj['js'] + '\n';
              }
              // 有未处理的代码段
              names.forEach((name) => {
                if (templateObj[name]) {
                  jsFill = jsFill.substr(0, jsFill.length - 1);
                  // if (!jsFill.endsWith(',')) {
                  //   jsFill += ',';
                  // }
                  jsFill += `\n${space}${name}() {
${space}  ${templateObj[name]}
${space}},\n`;
                }
              });
            }
            jsFill += jsCont + '\n';
            fs.writeFileSync(pathJs, jsFill);
          }
        } catch (error) {
          console.error('in error', error)
        }
      } catch (error) {
        console.error('error', error)
      }
    })
    }
  }

  /**
   * 同步服务器数据
   * @param uri 
   */
  async sync() {
    // 获取页面数据
    const config = workspace.getConfiguration('meteor');
    let user: any = config.get('user')
    let userInfo: any = {}
    if (user) {
      userInfo = JSON.parse(user)
    } else {
      window.showInformationMessage('请先[登录](command:meteor.upload)')
      return
    }
    let res = await this.fetch.get('widget?tag=&type=&searchValue=', {
      headers: {
        token: userInfo.token
      }
    });
    let retPromise: any = null
    window.withProgress({
      location: ProgressLocation.Notification,
      title: 'meteor',
      cancellable: true
    }, (progress, _token) => {
      let msg = '正在同步中，请耐心等待...';
      progress.report({
        increment: 0,
        message: msg
      });
      // 拼接配置文件， 并生成文件
      let current: number = 0;
      let count: number = 1;
      let files: any [] = [];
      if (res.data && res.data.data) {
        let page: any = {};
        let component: any = {};
        new Promise(async (resolve) => {
          let data = res.data.data;
          for (let j = 0; j < data.length; j++) {
            const item: any = data[j];
            let obj = null;
            // type: 0 组件   1 页面
            if (item.type === '1') {
              obj = page;
            } else {
              obj = component;
            }
            obj[item.description.name] = {
              category: item.category,
              type: item.type,
              block: item.block,
              avatar: item.description.avatar,
              remark: item.description.remark,
            };
            let pages: any = [];
            for (let i = 0; i < item.code.length; i++) {
              const codeItem: any = item.code[i];
              if (/^@file:/gi.test(codeItem.code)) {
                const res: any = await this.fetch.get('/getCodeFile?name=' + codeItem.code.replace('@file:', ''), {
                  headers: {
                    token: user.token
                  }
                })
                codeItem.code = res.data.data || ''
              }
              let dotPosition = codeItem.name.lastIndexOf('.');
              pages.push({
                template: item.id + '/' + codeItem.name,
                type: codeItem.type,
                fileName: codeItem.name.substr(0, dotPosition),
                poster: codeItem.name.substr(dotPosition, codeItem.name.length),
                position: codeItem.position
              });
              files.push({
                pageId: item.id,
                pageType: item.type,
                ...codeItem
              });
              count++;
            }
            obj[item.description.name].pages = pages;
          }
          resolve('')
        }).then(() => {
          // 生成page文件
          let rootPagePath = path.join(this.context.extensionUri.path, 'asset/template');
          let pagePath = path.join(rootPagePath, 'page.json');
          let rootComponentPath = path.join(this.context.extensionUri.path, 'asset/component');
          let componentPath = path.join(rootComponentPath, 'component.json');
          current++;
          pagePath = winRootPathHandle(pagePath);
          componentPath = winRootPathHandle(componentPath);
          try {
            fs.writeFileSync(pagePath, JSON.stringify(page));
            fs.writeFileSync(componentPath, JSON.stringify(component));
          } catch (error) {
            console.log(error);
          }
          progress.report({
            increment: current * 100 / count,
            message: msg
          });
          // 生成页面文件
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let root = file.pageType === '1' ? rootPagePath :  rootComponentPath;
            let filePath = path.join(root, file.pageId.toString());
            filePath = winRootPathHandle(filePath);
            try {
              fs.statSync(filePath);
            } catch (error) {
              fs.mkdirSync(filePath);
            }
            // position为代码块名称
            let filePathName = path.join(filePath, file.name || (file.position ? (file.position + '.txt') : 'index.txt'));
            filePathName = winRootPathHandle(filePathName);
            fs.writeFileSync(filePathName, file.code);
            current++;
            progress.report({
              increment: current * 100 / count,
              message: msg
            });
          }
          retPromise()
        }).catch(() => {
          retPromise()
        })
      }
      return new Promise((resolve) => {
        retPromise = resolve
      });
    });
  }
}