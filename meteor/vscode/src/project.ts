import * as path from 'path';
import * as os from 'os'
import { window, StatusBarAlignment, ExtensionContext, commands, WebviewPanel, ViewColumn, Uri, Disposable, OpenDialogOptions, workspace } from 'vscode'
import { getHtmlForWebview, store } from './util/util'
import * as fs from 'fs'
import { execa } from 'execa'

export class ProjectProvider {
  private projectCommandId: string = 'meteor.newProject'
  private readonly viewType = 'meteorProject'
  public context: ExtensionContext
  public activeView: WebviewPanel | undefined;
  private _disposables: Disposable[] = [];
  private projectDir: string = ''
  public init: Function

  constructor(context: ExtensionContext, init: Function) {
    this.context = context
    this.init = init
  }

  // 通过状态栏创建工程
  public showInStatusBar() {
    const newProjectStatus = window.createStatusBarItem(StatusBarAlignment.Right, -99999)
    newProjectStatus.command = this.projectCommandId
    newProjectStatus.text = '$(diff-insert) 新工程'
    newProjectStatus.tooltip = '创建工程'
    newProjectStatus.show()
    this.context.subscriptions.push(newProjectStatus)

    const packageStatus = window.createStatusBarItem(StatusBarAlignment.Right, -99998)
    packageStatus.command = 'meteor.packageRun'
    packageStatus.text = '$(debug-start) 打包'
    packageStatus.tooltip = 'Jenkins打包'
    packageStatus.show()
    this.context.subscriptions.push(packageStatus)

    const deployStatus = window.createStatusBarItem(StatusBarAlignment.Right, -99997)
    deployStatus.command = 'meteor.deployRun'
    deployStatus.text = '$(debug-start) 部署'
    deployStatus.tooltip = '容器云部署'
    deployStatus.show()
    this.context.subscriptions.push(deployStatus)
  }

  // 注册新建工程命令
  public registerCommand() {
    const newProjectCmd = commands.registerCommand('meteor.newProject', () => {
      this.openView()
    })
    const openProjectCmd = commands.registerCommand("meteor.openProject", () => {
      let projectDir = this.projectDir;
      if (os.platform().includes('win')) {
        projectDir = '/' + projectDir.replace(/\\/gi, '/');
      }
      commands.executeCommand("vscode.openFolder", Uri.parse(projectDir), false).then(() => {
        if (workspace.workspaceFolders) {
          this.init(this.context)
        }
      }, () => window.showInformationMessage("打开工程失败！"));
    });
    this.context.subscriptions.push(newProjectCmd)
    this.context.subscriptions.push(openProjectCmd)
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
			'创建新工程',
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
        case 'create':
          this.create(message);
          return;
        case 'selBaseDir':
          this.selBaseDir();
          return;
      }
    }, null, this._disposables)
    this.loadHtml()
  }

  // 创建工程
  public async create(message: any) {
    // 删除某个目录下所有内容
    function deleteAllInFold(path: string) {
			var files = [];
			if (fs.existsSync(path)) {
				files = fs.readdirSync(path);
				files.forEach(function(file: any) {
					var curPath = path + '/' + file;
					if (fs.statSync(curPath).isDirectory()) {
						deleteAllInFold(curPath);
					} else {
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(path);
			}
		}
    if (!message.baseDir) {
			this.activeView?.webview.postMessage({ command: 'done'});
			return window.showWarningMessage('请选择项目目录！');
		}
		if (!message.projectName) {
			this.activeView?.webview.postMessage({ command: 'done'});
			return window.showWarningMessage('请输入工程名称！');
		}
		if (!message.url) {
			this.activeView?.webview.postMessage({ command: 'done'});
			return window.showWarningMessage('请输入模板地址！');
		}
		if (!message.hub) {
			this.activeView?.webview.postMessage({ command: 'done'});
			return window.showWarningMessage('请输入仓库地址！');
		}
    let dir = path.join(message.baseDir, message.projectName);
    let hasHub: boolean = false;
    // 判断git地址是否存在！
    try {
      await execa('git', ['ls-remote', message.hub]);
      hasHub = true;
    } catch (error) {
    }
    if (hasHub) {
      this.activeView?.webview.postMessage({ command: 'done'});
      return window.showWarningMessage('仓库地址已存在');
    }
    try {
      // 通过账号、密码登录
      if (/^http/gi.test(message.url) && message.account) {
        let url = message.url.split('//');
        message.url = `${url[0]}//${message.account.name}:${message.account.password}@${url[1]}`;
      }
      await execa('git', ['clone', message.url, dir]);
      if (os.platform().includes('win')) {
        deleteAllInFold(path.join(dir, '.git'));
      } else {
        await execa('rm', ['-rf', path.join(dir, '.git')]);
      }
      await execa('git', ['init'], { cwd: dir });
      await execa('git', ['add', '.'], { cwd: dir });
      await execa('git', ['commit', '-m', 'init'], { cwd: dir });
      await execa('git', ['remote', 'add', 'origin', message.hub], { cwd: dir });
      await execa('git', ['push', '-u', 'origin', 'master'], { cwd: dir });
      // 切换分支
      await execa('git', ['checkout', '-q', '-b', 'develop', '--no-track', 'HEAD'], { cwd: dir })
      await execa('git', ['push', '-u', 'origin', 'develop'], { cwd: dir })
      this.activeView?.webview.postMessage({ command: 'done'});
      this.projectDir = dir
      window.showInformationMessage('恭喜，工程初始化成功！ [打开工程](command:meteor.openProject)');
    } catch (error: any) {
      if (error.message.includes('mkdir')) {
        window.showErrorMessage('创建工程目录' + dir + '失败！');
      } else if (error.message.includes('git clone')) {
        // 拷贝失败
        if (error.message.includes('could not read Username') || error.message.includes('Authentication failed')) {
          if (/^http/gi.test(message.url)) {
            // 没有账号，提示提供账号
            this.activeView?.webview.postMessage({ command: 'account' });
          } else {
            window.showErrorMessage('暂未提供ssh账号登录功能！\n请使用http请求');
          }
        } else {
          window.showErrorMessage('拷贝模板工程失败！\n 请在本地命令行执行 git clone ' + message.url + ' 查看原因');
        }
      } else if (error.message.includes('correct access rights')) {
        window.showErrorMessage('请检查组名是否正确或是否拥有权限！');
      }
      this.activeView?.webview.postMessage({ command: 'done'});
    }
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
      this.activeView.title = '创建新工程'
      this.activeView.webview.html = getHtmlForWebview(this.activeView.webview, this.context.extensionPath, '/createProject', '创建新工程')
    }
  }
}