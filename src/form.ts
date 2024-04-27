import * as path from 'path';
import * as os from 'os'
import { window, ExtensionContext, commands, WebviewPanel, ViewColumn, Uri, Disposable, OpenDialogOptions, workspace } from 'vscode'
import { getHtmlForWebview, store, getWorkspaceRoot } from './util/util'
import { ExplorerProvider } from './explorer'
import { generate } from './util/formGenerate';
import { execa } from 'execa'
import * as fs from 'fs';

export class FormProvider {
  private readonly viewType = 'meteorForm'
  public context: ExtensionContext
  public activeView: WebviewPanel | undefined;
  private _disposables: Disposable[] = [];
  public explorer: ExplorerProvider
  public uri: Uri | undefined

  constructor(explorer: ExplorerProvider, context: ExtensionContext) {
    this.context = context
    this.explorer = explorer
  }

  // 注册表单页面生成器命令
  public register() {
    const newFormCmd = commands.registerCommand('meteor.newForm', (uri: Uri) => {
      this.uri = uri
      this.openView()
    })
    this.context.subscriptions.push(newFormCmd)
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
			'表单页面生成器',
			viewColumn || ViewColumn.One,
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
        case 'selBaseDir':
          this.selBaseDir();
          return;
        case 'updateUser':
          store.set('user', message.user)
          return;
        case 'updateFormTemplate':
          store.set('formTemplate', message.formTemplate)
          return;
        case 'getPageConfig':
          this.getPageConfig()
          return;
        case 'columns':
          this.getColumns(message.tableName)
          break;
        case 'generate':
          let projectPath = getWorkspaceRoot('')
          message.params.path = this.uri?.path
          if (fs.existsSync(path.join(projectPath, 'formCompiler.js'))) {
            this.generateForm(message)
          } else {
            try {
              generate(message.params)
              this.activeView?.webview.postMessage({ command: 'formSuccess'})
            } catch (error) {
              
            }
          }
          break;
      }
    }, null, this._disposables)
    this.loadHtml()
  }

  public async generateForm(message: any) {
    const { stdout } = await execa('node', ['formCompiler.js', JSON.stringify(message.params)], { cwd:  getWorkspaceRoot('')})
    console.log(stdout)
  }

  public getColumns(tableName: string) {
    this.explorer.queryDbColumns(tableName, (rows: any[]) => {
      this.activeView?.webview.postMessage({ command: 'columns', columns: rows})
    })
  }

  // 获取页面配置信息
	public getPageConfig() {
		const config = workspace.getConfiguration('meteor');
		this.activeView?.webview.postMessage({ command: 'backConfig', config, pluginParam: {
      tableList: this.explorer.tableList
    }});
	}
  
  // 选择目录
	public async selBaseDir() {
		let rootPath = <string>store.get('rootPath');
		// windows平台
		if (os.platform().includes('win')) {
			rootPath = '/' + rootPath;
		}
		const options: OpenDialogOptions = {
			canSelectFolders: true,
			canSelectFiles: false,
			canSelectMany: false,
			openLabel: 'Open'
		};
		if (rootPath) {
		  options.defaultUri = Uri.parse(rootPath);
		}
		const folderUri = await window.showOpenDialog(options);
		if (folderUri && Array.isArray(folderUri)) {
			let basePath = folderUri[0].path;
			// windows平台
			if (os.platform().includes('win')) {
				basePath = basePath.substr(1, basePath.length);
			}
      store.set('rootPath', basePath);
      this.activeView?.webview.postMessage({ command: 'path', path: basePath });
		}
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
      this.activeView.title = '表单页面生成器'
      this.activeView.webview.html = getHtmlForWebview(this.activeView.webview, this.context.extensionPath, 'form', '表单页面生成器')
    }
  }
}