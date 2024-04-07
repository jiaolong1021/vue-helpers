import * as path from 'path';
import * as fs from 'fs'
import { ExtensionContext, commands, window, WebviewPanel, ViewColumn, Uri, Disposable, workspace, ConfigurationTarget, TextEditor,
  QuickPickItem, Position, ProgressLocation, languages, CompletionItemProvider, CompletionItemKind, CompletionItem, CompletionList,
  MarkdownString, ProviderResult, TextDocument, HoverProvider, TextLine, Hover, SnippetString} from 'vscode'
import { open, url, getHtmlForWebview, winRootPathHandle, getWorkspaceRoot, getRelativePath } from './util/util'
import axios, { AxiosInstance } from 'axios';
import vuePropsDef from './util/vueProps';
import { ExplorerProvider } from './explorer';
import { traverseFile } from './util/util'
import { minioUpload, minioGet } from './util/minioUploader';

interface Code {
  code: string
  name: string
  position: string
  type: string
}

interface Plugin {
  id: number
  remark: string
  type: string
  userId: string
  collection: string
  description: {
    name: string
    avatar: string
    remark: string
  }
  className: string
  category: string
  block: number
  apply: string
  applier: string
  code: Code[]
}

export class ComponentProvider {
  public context: ExtensionContext
  public explorer: ExplorerProvider
  public activeView: WebviewPanel | undefined;
  private readonly viewType = 'meteorComponent'
  private _disposables: Disposable[] = [];
  private activeTextEditor: TextEditor | undefined
  // 页面对应模板页面列表
  public pick: string = ''; // 生成页面类型
  public pageName: string = ''; // 页面名称
  public pageTemplateList: any = {};
  // public pageFileTemplateList: any = {}
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
  public suggestions: CompletionItem[] = []
  public pageSuggestions: CompletionItem[] = []
  public category: string = 'miniapp'
  public pluginParam: any = {}
  public pluginList: any[] = []
  public pluginComponentSuggestions: any[] = []
  public pluginComposiableSuggestions: any[] = []
  public pluginPageSuggestions: any[] = []
  public componentHoverProvider: HoverProvider

  constructor(context: ExtensionContext, explorer: ExplorerProvider) {
    this.context = context
    this.explorer = explorer

    this.componentHoverProvider = new ComponentHoverProvider(winRootPathHandle(path.join(this.context.extensionUri.path, 'asset/plugin/document.json')))

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
      this.init()
      this.sync()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.componentCompetion', (plugin: Plugin) => {
      // this.offlineGenerateComponent(component.name)
      this.pluginInsert(plugin)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.openUploadPluginPage', (uri: Uri) => {
      this.init(uri)
      this.openUploadPluginPage()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.addPluginFile', (uri: Uri) => {
      this.init(uri)
      this.addPluginFile(uri)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.uploadFilePlugin', (uri: Uri) => {
      this.init(uri)
      this.openUploadFilePluginDialog(uri)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.generatePage', (uri: Uri) => {
      this.showPick(uri)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.openComponentAddDialog', (uri: Uri) => {
      this.init(uri)
      this.showPickComponent(uri)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.openComposiableAddDialog', (uri: Uri) => {
      this.init(uri)
      this.showPickComposiable(uri)
    }))
    
    this.context.subscriptions.push(languages.registerCompletionItemProvider(['vue', 'javascript', 'typescript', 'html', 'wxml', 'scss', 'css', 'wxss'], new ComponentCompletionItemProvider(this), 'm'))
    // this.initConfig()
    this.context.subscriptions.push(languages.registerHoverProvider(['vue', 'wxml'], this.componentHoverProvider))
    this.openPluginSuggestions()
  }

  // 打开页面选择
  public showPick(uri: Uri) {
    this.init(uri)
    this.way = this.GenerateWay.PAGE

    const pickItems: QuickPickItem[] = [];
    this.pluginList.forEach((item: any) => {
      if (item.type === '5') {
        pickItems.push({
          label: item.description.name,
          description: item.description.remark
        });
      }
    });
    
    const pagePick = window.createQuickPick();
    pagePick.title = '添加页面'
    pagePick.placeholder = '选择页面模板'
    pagePick.items = pickItems
    pagePick.onDidChangeSelection(selection => {
      pagePick.hide();
      // 打开工程才能继续
      if (workspace.workspaceFolders && selection[0] && selection[0].label) {
        this.pick = selection[0].label;
        this.showPageNamePick(selection[0].label || '');
      } else {
        if (!workspace.workspaceFolders) {
          window.showInformationMessage('请先打开工程');
        }
      }
		});
    pagePick.onDidHide(() => pagePick.dispose());
		pagePick.show();
  }

  // 添加组件
  public showPickComponent(uri: Uri) {
    this.init(uri)
    this.way = this.GenerateWay.PAGE

    const pickItems: QuickPickItem[] = [];
    this.pluginList.forEach((item: any) => {
      if (item.type === '2') {
        pickItems.push({
          label: item.description.name,
          description: item.description.remark
        });
      }
    });
    
    const pagePick = window.createQuickPick();
    pagePick.title = '添加组件'
    pagePick.placeholder = '选择组件'
    pagePick.items = pickItems
    pagePick.onDidChangeSelection(selection => {
      pagePick.hide();
      // 打开工程才能继续
      if (workspace.workspaceFolders && selection[0] && selection[0].label) {
        this.pick = selection[0].label;
        this.addPluginByFold(selection[0].label, '')
      } else {
        if (!workspace.workspaceFolders) {
          window.showInformationMessage('请先打开工程');
        }
      }
		});
    pagePick.onDidHide(() => pagePick.dispose());
		pagePick.show();
  }

  // 添加文件
  public showPickComposiable(uri: Uri) {
    this.init(uri)
    this.way = this.GenerateWay.PAGE

    const pickItems: QuickPickItem[] = [];
    this.pluginList.forEach((item: any) => {
      if (item.type === '3') {
        pickItems.push({
          label: item.description.name,
          description: item.description.remark
        });
      }
    });
    
    const pagePick = window.createQuickPick();
    pagePick.title = '添加文件'
    pagePick.placeholder = '选择文件'
    pagePick.items = pickItems
    pagePick.onDidChangeSelection(selection => {
      pagePick.hide();
      // 打开工程才能继续
      if (workspace.workspaceFolders && selection[0] && selection[0].label) {
        this.pick = selection[0].label;
        this.addPluginByFold(selection[0].label, '')
      } else {
        if (!workspace.workspaceFolders) {
          window.showInformationMessage('请先打开工程');
        }
      }
		});
    pagePick.onDidHide(() => pagePick.dispose());
		pagePick.show();
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
        case 'uploadPlugin':
          this.uploadFilePlugin(message.data)
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
    let meteorJsonPath = winRootPathHandle(path.join(this.projectRoot, 'meteor.json'))
    let meteorConfigFile = { language: "vue3" }
    if (fs.existsSync(meteorJsonPath)) {
      meteorConfigFile = JSON.parse(fs.readFileSync(meteorJsonPath, 'utf-8'))
    }
		this.activeView?.webview.postMessage({ command: 'backConfig', config, meteorConfigFile, pluginParam: this.pluginParam});
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
      this.activeView.webview.html = getHtmlForWebview(this.activeView.webview, this.context.extensionPath, 'component', '生成组件')
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
          uriPath = uriPath.replace(/[\/|\\]\w*\.\w*$/gi, '')
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
        this.pick = page.description.name;
        this.pageName = page.description.name;
        this.pageTemplateList = obj
        this.showPageNamePick(page.description || '');
      } else {
        window.showInformationMessage('请选择生成页面目录！')
      }
    }
  }

  /**
   * 显示输入名称弹框
   */
  public async showPageNamePick(category: string) {
    let placeholder = '页面名称';
    // if (category === '(miniapp)') {
    //   placeholder = '页面名称';
    // }
    let name = await window.showInputBox({
      placeHolder: placeholder
    });
    if (name) {
      this.pageName = name;
      this.addPluginByFold(category, name)
    }
  }

  public addPluginByFold(pluginName: string, entryName: string) {
    let pluginItem: any = {}
      for (let i = 0; i < this.pluginList.length; i++) {
        const plugin = this.pluginList[i];
        if (plugin.description.name === pluginName) {
          pluginItem = plugin
        }
      }
      let entryFileName = ''
      let fileList: Code[] = []
      pluginItem.code.forEach((codeItem: Code) => {
        switch (codeItem.type) {
          case 'file':
            fileList.push(codeItem)
            break;
          case 'entry':
            entryFileName = codeItem.name
            break;
          default:
            break;
        }
      });
      let pluginRootPath = path.join(this.context.extensionUri.path, 'asset/plugin')
      if (this.uri) {
        for (let i = 0; i < fileList.length; i++) {
          const fileItem = fileList[i];
          if (entryFileName && entryFileName === fileItem.name) {
            if (!entryName.includes('.')) {
              entryName += '.vue'
            }
            this.copyFile(winRootPathHandle(path.join(pluginRootPath, fileItem.code)), this.uri.path.replace(/[\/|\\]\w*\.\w*$/gi, ''), entryName)
          } else {
            let destinationPath = fileItem.position || fileItem.name
            if (pluginItem.type === '2') {
              destinationPath = pluginName + '/' + destinationPath
            }
            this.copyFile(winRootPathHandle(path.join(pluginRootPath, fileItem.code)), this.uri.path.replace(/[\/|\\]\w*\.\w*$/gi, ''), destinationPath)
          }
        }
      }
  }



  public setPage(root: string, file: string, msg: string, isGenerateSugguestion: boolean) {
    // 插件配置信息
    let configPath = path.join(this.context.extensionUri.path, root, file);
    try {
      configPath = winRootPathHandle(configPath);
      let config: string = fs.readFileSync(configPath, 'utf-8');
      this.setPageByConfig(config, isGenerateSugguestion);
    } catch (error) {
      window.showWarningMessage(msg);
    }
  }

  // 通过配置设置页面参数
  public setPageByConfig(config: string, isGenerateSugguestion: boolean) {
    if (config) {
      let conf = JSON.parse(config);
      let pages = [];
      for (const key in conf) {
        pages.push({
          label: key,
          description: `${conf[key].category}`
        });
      }
      this.pageTemplateList = Object.assign(this.pageTemplateList, conf);
      if (isGenerateSugguestion) {
        this.setSuggestions()
      } else {
        this.pages = this.pages.concat(pages);
      }
    }
  }

  public async init(uri?: Uri) {
    if (uri) {
      this.uri = uri;
    } else if (workspace.workspaceFolders) {
      this.uri = workspace.workspaceFolders[0].uri;
      this.noSelectFolder = true;
    }
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
    let meteorJsonPath = winRootPathHandle(path.join(this.projectRoot, 'meteor.json'))
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
      case 'common':
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
          let defaultLine = 0;
          doc.forEach((oneLevelItem: any) => {
            let endPosition: any = oneLevelItem.location.range.end
            let startPosition: any = oneLevelItem.location.range.start
            if (oneLevelItem.name === 'template' && names.includes('template')) {
              names.splice(names.indexOf('template'), 1);
              insertList.push({
                position: editor?.selection.active || new Position(endPosition.c, endPosition.e),
                code: templateObj['template']
              });
            } else if (oneLevelItem.name.startsWith('script')) {
              if (names.includes('import')) {
                names.splice(names.indexOf('import'), 1);
                let line = startPosition.c
                let text = editor?.document.lineAt(line).text || ''
                insertList.push({
                  position: {
                    line: line,
                    character: text.length
                  },
                  code: '\n' + templateObj['import']
                });
              }
              if (category === 'vue2') {
                oneLevelItem.children.forEach((scriptChild: any) => {
                  if (scriptChild.name === 'default') {
                    defaultLine = scriptChild.location.range.start.c;
                    // vue属性
                    scriptChild.children.forEach((vueProp: any) => {
                      if (names.includes(vueProp.name)) {
                        names.splice(names.indexOf(vueProp.name), 1);
                        let line = (vueProp.kind === 5 && vueProp.name === 'data') ? vueProp.location.range.end.c - 2: vueProp.location.range.end.c - 1
                        let code = '';
                        // code存在才处理
                        if (templateObj[vueProp.name]) {
                          if (vueProp.children && vueProp.children.length > 0) {
                            code += ',\n';
                          } else {
                            code += '\n'
                          }
                          code += templateObj[vueProp.name];
                          let text = editor?.document.lineAt(line).text || ''
                          insertList.push({
                            position: {
                              line: line,
                              character: text.length
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
              let line = endPosition.c - 1;
              let text = editor?.document.lineAt(line).text || ''
              if (templateObj['style']) {
                insertList.push({
                  position: {
                    line: line,
                    character: text.length
                  },
                  code: '\n' + templateObj['style']
                });
              }
            }
          });
          if (category === 'vue2') {
            names.forEach((name: string) => {
              if (vuePropsDef.vue[name]) {
                let text = editor?.document.lineAt(defaultLine).text || ''
                insertList.push({
                  position: {
                    line: defaultLine,
                    character: text.length
                  },
                  code: '\n' + vuePropsDef.vue[name].replace(/##/gi, templateObj[name])
                });
              }
            });
          }
          await editor?.edit((editBuilder: any) => {
            insertList.forEach((insert) => {
              editBuilder.insert(new Position(insert.position.line, insert.position.character), insert.code);
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
    // 获取权限内的所有插件信息
    const config = workspace.getConfiguration('meteor');
    let user: any = config.get('user')
    let userInfo: any = {}
    if (user) {
      userInfo = JSON.parse(user)
    } else {
      window.showInformationMessage('请先[登录](command:meteor.componentUpload)')
      return
    }
    let meteorJsonPath = winRootPathHandle(path.join(this.projectRoot, 'meteor.json'))
    let meteorConfigFile: any = {
      language: 'vue3'
    }
    if (fs.existsSync(meteorJsonPath)) {
      meteorConfigFile = JSON.parse(fs.readFileSync(meteorJsonPath, 'utf-8'))
    }
    let framework = `''`
    if (meteorConfigFile.framework) {
      meteorConfigFile.framework.forEach((frame: string) => {
        framework += `,'${frame}'`
      });
    }
    let res = await this.fetch.get(`widget?tag="common","${meteorConfigFile.language || ''}"&framework=${framework}&type=&searchValue=`, {
      headers: {
        token: userInfo.token
      }
    })
    
    let pluginRootPath = path.join(this.context.extensionUri.path, 'asset/plugin');
    let pluginEntry = winRootPathHandle(path.join(pluginRootPath, 'index.json'));
    let pluginData = res.data.data
    try {
      fs.writeFileSync(pluginEntry, JSON.stringify(pluginData));
    } catch (error) {
      console.log(error)
    }

    // 文件同步, 使用文档生成
    let pluginDocument = '{'
    let pluginFiles: string[] = []
    pluginData.forEach((pluginItem: any, pluginIndex: number) => {
      if (['0', '1', '4'].includes(pluginItem.type)) {
        pluginDocument += `"m${pluginItem.description.name}": "#### 插件名：${pluginItem.description.name} \\n `
        pluginDocument += `描述：${(pluginItem.description.remark || '').replace(/\n/gi, '@@')} \\n `
        pluginDocument += `${pluginItem.description.avatar} \\n `
      }

      let pluginParameterDoc = `#### 入参 \\n | 入参名称 | 默认值 | 必填| 说明 | \\n | :--- | :--- | :--- | :--- | \\n `
      let pluginEventDoc = `#### 事件 \\n | 事件名称 | 事件函数 | 必填| 说明 | \\n | :--- | :--- | :--- | :--- | \\n `
      
      pluginItem.code.forEach((code: any) => {
        if (code.code) {
          if (code.type === 'file') {
            pluginFiles.push(code.code)
          }
          if (code.type === 'parameterIn') {
            let pluginParameterCode = JSON.parse(code.code)
            pluginParameterDoc += `| ${pluginParameterCode.name || ''} | ${pluginParameterCode.def || ''} | ${pluginParameterCode.checked} | ${pluginParameterCode.desc || ''} |`
          }
          if (code.type === 'event') {
            let pluginEventCode = JSON.parse(code.code)
            pluginEventDoc += `| ${pluginEventCode.name || ''} | ${pluginEventCode.def || ''} | ${pluginEventCode.checked} | ${pluginEventCode.desc || ''} |`
          }
        }
      })

      if (['0', '1', '4'].includes(pluginItem.type)) {
        pluginDocument += pluginParameterDoc + ' \\n '
        if (pluginIndex < pluginData.length - 1) {
          pluginDocument += pluginEventDoc + ' \\n ",\n'
        } else {
          pluginDocument += pluginEventDoc + ' \\n "'
        }
      }
    })
    pluginDocument += '}'
    fs.writeFileSync(winRootPathHandle(path.join(this.context.extensionUri.path, 'asset/plugin/document.json')), pluginDocument)
    if (pluginFiles.length > 0) {
      this.minioGetIterator(0, pluginFiles, pluginRootPath)
    } else {
      this.syncDone()
    }
  }

  public syncDone() {
    window.showInformationMessage('同步完成')
    this.openPluginSuggestions()
  }

  // 开启插件建议
  public openPluginSuggestions() {
    let pluginPath = winRootPathHandle(path.join(this.context.extensionUri.path, 'asset/plugin/index.json'))
    let config: any = fs.readFileSync(pluginPath, 'utf-8')
    if (config) {
      this.pluginList = JSON.parse(config)
    }
    this.suggestions = []
    this.pluginList.forEach((plugin) => {
      switch (plugin.type) {
        case '2':
          this.pluginPageSuggestions.push(plugin)
          break;
        case '3':
          this.pluginComposiableSuggestions.push(plugin)
          break;
        case '5':
          this.pluginPageSuggestions.push(plugin)
          break;
        default:
          this.suggestions.push(this.completionItemFactory(plugin))
          break;
      }
    });
  }

  public completionItemFactory(plugin: any) {
    let documentation = ''
    if (plugin.description) {
      if (plugin.description.remark) {
        documentation += `${plugin.description.remark} \n   `
      }
      if (plugin.description.avatar) {
        let avatarPaths = plugin.description.avatar.split('/')
        avatarPaths[avatarPaths.length - 1] = '1' + avatarPaths[avatarPaths.length - 1]
        documentation += `![meteor](${avatarPaths.join('/')}) \n  `
      }
    }
    let completionItem = new CompletionItem(plugin.description.name)
    let label = plugin.description.name
    if (plugin.description.name[0] && plugin.description.name[0] !== 'm') {
      label = 'm' + plugin.description.name
    }
    completionItem.label = label
    completionItem.sortText = `000${plugin.description.name}`
    completionItem.kind = CompletionItemKind.Snippet
    completionItem.detail = plugin.description.description

    if (plugin.type === '0') {
      let insertText = ''
      plugin.code.forEach((codeItem: Code) => {
        if (codeItem.type === 'functionIn') {
          insertText = codeItem.code
        }
      });
      completionItem.insertText = new SnippetString(insertText)
    } else {
      completionItem.insertText = ''
      completionItem.command = { command: 'meteor.componentCompetion', title: 'completions', arguments: [plugin] }
    }

    completionItem.documentation = new MarkdownString(documentation)
    return completionItem
  }

  // 插件插入
  public pluginInsert(plugin: Plugin) {
    // 文件内代码插入
    this.pluginInsertInFile(plugin)
    // 文件拷贝
    // 依赖安装
  }

  public async pluginInsertInFile(plugin: Plugin) {
    // 检验重复引入
    this.activeTextEditor = window.activeTextEditor
    if (!this.activeTextEditor) {
      return
    }
    let isRepeat = false
    let posterName: string | undefined = ''
    let activeEditorDoc = this.activeTextEditor.document.getText()
    if (activeEditorDoc.includes('// ' + plugin.description.name)) {
      isRepeat = true
      posterName = await window.showInputBox({
        placeHolder: '输入后缀，避免重复'
      });
    }

    // 当前位置代码块
    let codeBlockList: Code[] = []
    let jsImportList: Code[] = []
    let jsCodeList: Code[] = []
    let cssList: Code[] = []
    let fileList: Code[] = []
    let parameterList: Code[] = []
    let eventList: Code[] = []
    plugin.code.forEach((codeItem: Code) => {
      switch (codeItem.type) {
        case 'functionIn':
          codeBlockList.push(codeItem)
          break;
        case 'dependency':
          if (!isRepeat) {
            jsImportList.push(codeItem)
          }
          break;
        case 'fileInJs':
          jsCodeList.push(codeItem)
          break;
        case 'fileInCss':
          cssList.push(codeItem)
          break;
        case 'file':
          fileList.push(codeItem)
          break;
        case 'parameterIn':
          parameterList.push(codeItem)
          break
        case 'event':
          eventList.push(codeItem)
          break
        default:
          break;
      }
    });

    // codeBlockList处理
    // 组件codeBlockList需要拼接出来
    let variableCodeList: Code[] = []
    if (plugin.type === '2') {
      let pluginCode = `<${plugin.description.name} `
      // 拼接入参
      parameterList.forEach(parameter => {
        let parameterItem = JSON.parse(parameter.code)
        if (parameterItem.checked) {
          let attrPrefix = ':'
          let attrName = parameterItem.name.replace(/([A-Z])/g, (_: any, c: any) => {
            return c ? '-' + c.toLowerCase() : '';
          })
          let variableName = parameterItem.name.replace(/(-[a-z])/g, (_: any, c: any) => {
            return c ? c.toUpperCase() : '';
          }).replace(/-/gi, '')
          if (attrName.indexOf('v-') === 0) {
            attrPrefix = ''
          }
          if (isRepeat) {
            variableName += posterName
          }
          pluginCode += `${attrPrefix}${attrName}="${variableName}" `
          switch (parameterItem.type) {
            case 'string':
              variableCodeList.push({
                code: `let ${variableName} = ref('${parameterItem.def}')`,
                name: '',
                position: '',
                type: 'fileInJs'
              })
              break;
            case 'integer':
              variableCodeList.push({
                code: `let ${variableName} = ref(${parameterItem.def})`,
                name: '',
                position: '',
                type: 'fileInJs'
              })
              break;
            case 'boolean':
              variableCodeList.push({
                code: `let ${variableName} = ref(${parameterItem.def || 'false'})`,
                name: '',
                position: '',
                type: 'fileInJs'
              })
              break;
            case 'array':
              variableCodeList.push({
                code: `let ${variableName} = ref(${parameterItem.def || '[]'})`,
                name: '',
                position: '',
                type: 'fileInJs'
              })
              break;
            case 'object':
              variableCodeList.push({
                code: `let ${variableName} = ref(${parameterItem.def || '{}'})`,
                name: '',
                position: '',
                type: 'fileInJs'
              })
              break;
            default:
              break;
          }
        }
      });

      // 拼接事件
      eventList.forEach((evt) => {
        let evtItem = JSON.parse(evt.code)
        if (evtItem.checked) {
          let attrPrefix = '@'
          let attrName = evtItem.name.replace(/([A-Z])/g, (_: any, c: any) => {
            return c ? '-' + c.toLowerCase() : '';
          })
          let variableName = evtItem.def.replace(/(-[a-z])/g, (_: any, c: any) => {
            return c ? c.toUpperCase() : '';
          }).replace(/-/gi, '')
          if (isRepeat) {
            variableName += posterName
          }
          pluginCode += `${attrPrefix}${attrName}="${variableName}" `
          variableCodeList.push({
            code: `function ${variableName}() {\n}`,
            name: '',
            position: '',
            type: 'fileInJs'
          })
        }
      })
      pluginCode = pluginCode.trim()
      pluginCode += `></${plugin.description.name}>`
      
      codeBlockList.push({
        name: '',
        code: pluginCode,
        position: '',
        type: 'functionIn'
      })
      jsCodeList = jsCodeList.concat(variableCodeList)
    }

    // codeBlockList jsImportList jsCodeList cssCodeList 插入
    let jsImport = {
      text: '',
      line: 0
    }
    let jsCode = {
      text: '',
      line: 0
    }
    let cssCode = {
      text: '',
      line: 0
    }
    let lineCount = this.activeTextEditor.document.lineCount
    let current = 0
    while (current < lineCount) {
      let lineText = this.activeTextEditor.document.lineAt(current);
      if (/^\s*<script.*>\s*$/.test(lineText.text)) {
        // import位置
        jsImportList.forEach((jsImportItem) => {
          jsImport.text += jsImportItem.code + '\n'
          jsImport.line = current
        })
      }
      if (/^\s*<\/script.*>\s*$/.test(lineText.text)) {
        // javascript代码
        if (jsCodeList.length > 0) {
          jsCode.text = `// ${plugin.description.name}\n`
          jsCodeList.forEach((jsItemItem) => {
            jsCode.text += jsItemItem.code + '\n'
            jsCode.line = current
          })
        }
      }
      if (/^\s*<\/style.*>\s*$/.test(lineText.text)) {
        // css代码
        if (cssList.length > 0) {
          cssList.forEach((cssItem) => {
            cssCode.text += cssItem.code + '\n'
            cssCode.line = current
          })
        }
      }
      current++
    }

    this.activeTextEditor.edit((editBuilder) => {
      if (this.activeTextEditor?.selection.active) {
        let insertText = ''
        codeBlockList.forEach(codeBlock => {
          insertText += codeBlock.code + '\n'
        });
        editBuilder.insert(this.activeTextEditor?.selection.active, insertText.replace(/\$\$/gi, posterName || ''))

        if (jsImport.line > 0) {
          editBuilder.insert(new Position(jsImport.line + 1, 0), jsImport.text.replace(/\$\$/gi, posterName || ''))
        }
        if (jsCode.line > 0) {
          editBuilder.insert(new Position(jsCode.line, 0), jsCode.text.replace(/\$\$/gi, posterName || ''))
        }
        if (cssCode.line > 0) {
          editBuilder.insert(new Position(cssCode.line, 0), cssCode.text.replace(/\$\$/gi, posterName || ''))
        }
      }
    })

    // 文件导入
    if (!isRepeat) {
      let pluginRootPath = path.join(this.context.extensionUri.path, 'asset/plugin')
      for (let i = 0; i < fileList.length; i++) {
        const fileItem = fileList[i];
        this.copyFile(winRootPathHandle(path.join(pluginRootPath, fileItem.code)), this.activeTextEditor.document.uri.path.replace(/[\/|\\]\w*\.\w*$/gi, ''), fileItem.position || fileItem.name)
      }
    }
  }

  public copyFile(source: string, destinationRootPath: string, destination: string) {
    try {
      let destinationList = destination.split('/')
      for (let i = 0; i < destinationList.length - 1; i++) {
        const dir = destinationList[i];
        destinationRootPath = path.join(destinationRootPath, dir)
        if (!fs.existsSync(winRootPathHandle(destinationRootPath))) {
          fs.mkdirSync(winRootPathHandle(destinationRootPath))
        }
      }
      fs.cpSync(source, winRootPathHandle(path.join(destinationRootPath, destinationList[destinationList.length - 1])))
    } catch (error) {
      // window.showWarningMessage('')
    }
  }

  async sync2() {
    // 获取页面数据
    const config = workspace.getConfiguration('meteor');
    let user: any = config.get('user')
    let userInfo: any = {}
    if (user) {
      userInfo = JSON.parse(user)
    } else {
      window.showInformationMessage('请先[登录](command:meteor.componentUpload)')
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
                    token: userInfo.token
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
          this.initConfig()
          retPromise()
          window.showInformationMessage('同步成功')
        }).catch(() => {
          retPromise()
        })
      }
      return new Promise((resolve) => {
        retPromise = resolve
      });
    });
  }

  public initConfig() {
    try {
      const pkg = fs.readFileSync(path.join(this.explorer.projectRootPath, 'package.json'), 'utf-8')
      if (/"vue":\s*".?2.*"/gi.test(pkg)) {
        this.category = 'vue2'
      } else if (/"vue":\s*".?3.*"/gi.test(pkg)) {
        this.category = 'vue3'
      } else if (/"react":\s*".?3.*"/gi.test(pkg)) {
        this.category = 'react'
      } else {
        this.category = 'miniapp'
      }
      this.setPage(this.templateRoot, 'page.json', '插件中page.json文件出错！', false)
      this.setPage(this.componentRoot, 'component.json', '目前还没有内置组件', true)
    } catch (error) {
    }
  }

  public offlineGenerateComponent(name: string) {
    this.activeTextEditor = window.activeTextEditor
    if (!this.activeTextEditor) {
      return
    }
    let uriPath = this.activeTextEditor.document.uri.path
    if (uriPath.includes('.')) {
      uriPath = uriPath.replace(/[\/|\\]\w*\.\w*$/gi, '')
    }
    this.init(Uri.file(uriPath))
    this.way = this.GenerateWay.COMPONENT
    this.pageName = name
    this.pick = name
    this.generate()
  }

  /**
   * 打开生成组件页面
   */
  public openUploadPluginPage() {
    this.pluginParam = {
      opt: 'openPluginDialog'
    }
    
    this.openView()
  }

  public addPluginFile(uri: Uri) {
    let dirPath = winRootPathHandle(uri.path)
    // 入口文件或者文件夹进入，并遍历该目录下的所有文件夹及文件
    try {
      let stat = fs.statSync(dirPath)
      let tree: any[] = []
      let componentName = ''
      let baseProjectPath = ''
      let isPageAddFile = this.pluginParam.opt === 'addPlugin'
      let files: any[] = []

      componentName = dirPath.replace(/.*[\/|\\]/gi, '')

      if (stat.isDirectory()) {
        if (isPageAddFile) {
          tree = traverseFile(dirPath.replace(/.*[\/|\\]/gi, ''), dirPath.replace(/[\/|\\]\w*$/gi, ''))
          baseProjectPath = dirPath.replace(/[\/|\\]\w*$/gi, '')
        } else {
          tree = traverseFile(dirPath.replace(/.*[\/|\\]/gi, ''), dirPath.replace(/[\/|\\]\w*$/gi, ''))
          baseProjectPath = dirPath
        }
      } else {
        baseProjectPath = dirPath.replace(/[\/|\\]\w*\.\w*$/gi, '')

        files.push({
          name: componentName,
          position: componentName,
          url: isPageAddFile ? componentName : new Date().getTime() + componentName
        })
      }

      if (tree.length > 0) {
        files = files.concat(this.traverseTree(tree, '', !isPageAddFile))
      }

      if (isPageAddFile && baseProjectPath !== this.pluginParam.baseProjectPath) {
        return window.showInformationMessage('只能添加同目录下的文件或目录')
      }

      this.pluginParam.baseProjectPath = baseProjectPath

      const config = workspace.getConfiguration('meteor');
      let user: any = config.get('user')
      let userInfo: any = {}
      if (user) {
        userInfo = JSON.parse(user)
      } else {
        window.showInformationMessage('请先[登录](command:meteor.componentUpload)')
        return
      }
      if (files.length > 0) {
        if (isPageAddFile) {
          this.pluginParam.tree = tree
          this.pluginParam.files = this.pluginParam.files.concat(files)
          this.activeView?.webview.postMessage({ command: 'addPluginFile', params: {
            tree,
            files,
            name: componentName,
            baseProjectPath: baseProjectPath,
          }});
        } else {
          this.minioUploadIterator(0, files, `${userInfo.token}/common`, () => {
            this.activeView?.webview.postMessage({ command: 'addPluginFile', params: {
              tree,
              files,
              name: componentName,
              baseProjectPath: baseProjectPath,
            }});
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 打开上传插件弹窗
   */
  public openUploadFilePluginDialog(uri: Uri) {
    let dirPath = winRootPathHandle(uri.path)
    // 入口文件或者文件夹进入，并遍历该目录下的所有文件夹及文件
    try {
      let stat = fs.statSync(dirPath)
      let tree = []
      let componentName = dirPath.replace(/.*[\/|\\]/gi, '')
      let baseProjectPath = ''
      let type = ''
      let entry = ''
      let name = ''
      if (stat.isDirectory()) {
        baseProjectPath = dirPath.replace(/[\/|\\]\w*$/gi, '')
        // 组件
        type = '2'
        tree = traverseFile('', dirPath)
        name = componentName
      } else {
        baseProjectPath = dirPath.replace(/[\/|\\]\w*\.\w*$/gi, '')
        // 页面
        type = '5'
        entry = componentName
        name = componentName
      }
      
      this.pluginParam = {
        tree,
        files: [],
        name: name,
        entry: entry,
        type,
        baseProjectPath: baseProjectPath,
        opt: 'addPlugin'
      }
      this.openView()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 上传插件
   */
  public uploadFilePlugin(data: any) {
    let files: any[] = []
    let isPageAddFile = this.pluginParam.opt === 'addPlugin'

    if (this.pluginParam.tree.length > 0) {
      if (isPageAddFile) {
        let treeDir = ''
        if (this.pluginParam.entry) {
          treeDir = this.pluginParam.tree[0].position.replace(/\/.*/gi, '')
        } else {
          treeDir = this.pluginParam.name
        }
        files = this.traverseTree(this.pluginParam.tree, treeDir)
      } else {
        files = this.traverseTree(this.pluginParam.tree, '')
      }
    }
    const config = workspace.getConfiguration('meteor');
    let user: any = config.get('user')
    let userInfo: any = {}
    if (user) {
      userInfo = JSON.parse(user)
    } else {
      window.showInformationMessage('请先[登录](command:meteor.componentUpload)')
      return
    }
    let uploadBasePath = `${userInfo.token}/${data.type}`
    if (this.pluginParam.entry) {
      uploadBasePath = `${userInfo.token}/${data.type}/${data.description.name}`
    }

    if (this.pluginParam.entry) {
      // 入口文件
      files.push({
        name: this.pluginParam.entry,
        position: this.pluginParam.entry,
        url: this.pluginParam.entry
      })
    }

    if (this.pluginParam.files && this.pluginParam.files.length > 0) {
      // 过滤不在目录下文件
      this.pluginParam.files.forEach((fileItem: any) => {
        if (!fileItem.position.includes('/')) {
          files.push({
            name: fileItem.position,
            position: fileItem.position,
            url: fileItem.position
          })
        }
      });
    }

    if (files.length > 0) {
      this.minioUploadIterator(0, files, uploadBasePath)
    }
  }

  public minioUploadIterator(current: number, files: any[], userPath: string, callback?: Function) {
    const fileItem = files[current];
    let filePath = path.join(this.pluginParam.baseProjectPath, fileItem.name)
    let fileItemLinux = fileItem.url.replace(/\\/gi, '/')
    if (fileItemLinux[0] !== '/') {
      fileItemLinux = '/' + fileItemLinux
    }
    let filePosition = `${userPath}${fileItemLinux}`
    minioUpload({
      uploadFilePath: filePosition,
      filePath,
      success: () => {
        if (files.length > current + 1) {
          this.minioUploadIterator(current + 1, files, userPath, callback)
        } else {
          // 全部上传完成
          if (callback) {
            callback()
          } else {
            this.activeView?.webview.postMessage({ command: 'minioUpload', status: true});
          }
        }
      },
      fail: () => {
        this.activeView?.webview.postMessage({ command: 'minioUpload', status: false});
      }
    })
  }

  public minioGetIterator(current: number, files: any[], userPath: string, callback?: Function) {
    const fileItemPath = files[current]
    minioGet({
      uploadFilePath: '/' + fileItemPath,
      filePath: winRootPathHandle(path.join(userPath, fileItemPath)),
      success: () => {
        if (files.length > current + 1) {
          this.minioGetIterator(current + 1, files, userPath, callback)
        } else {
          // 全部上传完成
          if (callback) {
            callback()
          } else {
            this.syncDone()
          }
        }
      },
      fail: () => {
        window.showInformationMessage(`同步失败，请重试`)
      }
    })
  }

  public traverseTree(tree: any[], dirPrefix: string, randomFileName?: boolean) {
    let ret: {
      name: string
      position: string
      url: string
    }[] = []
    tree.forEach(treeItem => {
      if (treeItem.children) {
        ret = ret.concat(this.traverseTree(treeItem.children, dirPrefix + path.sep + treeItem.label, randomFileName))
      } else {
        if (dirPrefix) {
          if (randomFileName) {
            ret.push({
              name: dirPrefix + path.sep + treeItem.label,
              position: treeItem.position,
              url: dirPrefix + path.sep + new Date().getTime() + treeItem.label
            })
          } else {
            ret.push({
              name: dirPrefix + path.sep + treeItem.label,
              position: treeItem.position,
              url: dirPrefix + path.sep + treeItem.label
            })
          }
        } else {
          if (randomFileName) {
            ret.push({
              name: treeItem.label,
              position: treeItem.position,
              url: new Date().getTime() + treeItem.label
            })
          } else {
            ret.push({
              name: treeItem.label,
              position: treeItem.position,
              url: treeItem.label
            })
          }
        }
      }
    });
    return ret
  }

  public setSuggestions() {
    this.pageSuggestions = []
    this.suggestions = []
    for (const key in this.pageTemplateList) {
      const component = this.pageTemplateList[key]
      if (this.category === component.category || component.category === 'common') {
        let documentation = ''
        if (component.avatar) {
          documentation += `![meteor](${component.avatar}) \n  `
        }
        if (component.remark) {
          documentation += `${component.remark}`
        }
        let completionItem = new CompletionItem(key)
        completionItem.label = key
        completionItem.sortText = `000${key}`
        completionItem.insertText = ''
        completionItem.kind = CompletionItemKind.Snippet
        completionItem.detail = `meteor [${component.category}]`
        completionItem.documentation = new MarkdownString(documentation)
        completionItem.command = { command: 'meteor.componentCompetion', title: 'completions', arguments: [{
          name: key
        }] }
        if (component.type === '1') {
          this.pageSuggestions.push(completionItem)
        } else {
          this.suggestions.push(completionItem)
        }
      }
    }
  }
}

class ComponentCompletionItemProvider implements CompletionItemProvider {
  private componentProvider: ComponentProvider

  constructor(componentProvider: ComponentProvider) {
    this.componentProvider = componentProvider
  }

  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    // 当最前面为m时，不提示
    if (document.lineAt(position.line).text[position.character - 1] !== 'm') {
      return []
    }
    return this.componentProvider.suggestions
  }
  // resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
  //   throw new Error('Method not implemented.');
  // }
  
}

// 文档通过 hover 形式查看
class ComponentHoverProvider implements HoverProvider {
  public Documents: any

  constructor(docPath: string) {
    this.updateDocument(docPath)
  }

  public updateDocument(docPath: string) {
    try {
      let doc = fs.readFileSync(docPath, 'utf-8')
      if (doc) {
        this.Documents = JSON.parse(doc.replace(/@@/gi, '\n'))
      }
    } catch (error) {
      
    }
  }

  // 获取属性所属标签
  public getTag(document: any, position: any): String {
    let line = position.line;
    let tagName = '';

    while(line > 0 && !tagName) {
      let lineInfo: TextLine = document.lineAt(line);
      let text = lineInfo.text.trim();
      // 本行则获取光标位置前文本
      if(line === position.line) {
        text = text.substring(0, position.character);
      }
      let txtArr = text.match(/<[^(>/)]+/gim);
      if(txtArr) {
        for (let i = (txtArr.length - 1); i >= 0; i--) {
          if(txtArr[i][0] === '<' && txtArr[i][1] !== '/') {
            if(txtArr[i].indexOf(' ') !== -1) {
              tagName = txtArr[i].replace(/^<(\S*)(\s.*|\s*)/gi, '$1');
            } else {
              tagName = txtArr[i].replace(/^<(.*)/gi, '$1');
            }
            break;
          }
        }
      }
      --line;
    }
    return tagName;
  }
  provideHover(document: TextDocument, position: Position): ProviderResult<import("vscode").Hover> {
    const line = document.lineAt(position.line);
    const textSplite = [' ', '<', '>', '"', '\'', '.', '\\', "=", ":"];
    // 通过前后字符串拼接成选择文本
    let posIndex = position.character;
    let textMeta = line.text.substr(posIndex, 1);
    let selectText = '';
    // 前向获取符合要求的字符串
    while(textSplite.indexOf(textMeta) === -1 && posIndex <= line.text.length) {
      selectText += textMeta;
      textMeta = line.text.substr(++posIndex, 1);
    }
    // 往后获取符合要求的字符串
    posIndex = position.character - 1;
    textMeta = line.text.substr(posIndex, 1);
    while(textSplite.indexOf(textMeta) === -1 && posIndex > 0) {
      selectText = textMeta + selectText;
      textMeta = line.text.substr(--posIndex, 1);
    }
    textMeta = line.text.substr(posIndex, 1);

    // tag标签便利
    if(this.Documents[selectText]) {
      return new Hover(this.Documents[selectText]);
    }

    return null
  }
}