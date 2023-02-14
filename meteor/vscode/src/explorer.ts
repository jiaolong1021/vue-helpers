import { Event, ExtensionContext, ProviderResult, TreeDataProvider, TreeItem, window, TreeItemCollapsibleState, ThemeIcon, TreeView, commands, 
  languages, CompletionItemProvider, CompletionItem, CompletionList, Position, TextDocument, CompletionItemKind, HoverProvider, Hover, Uri, workspace,
  Selection } from 'vscode'
import { getWorkspaceRoot, getCurrentWordByHover, open, url } from './util/util'
import * as path from 'path'
import * as fs from 'fs'
import { config } from './util/constant'
import { getLocation } from 'jsonc-parser'
import { execa } from 'execa'
import axios, { AxiosInstance } from 'axios';
var CryptoJS = require("crypto-js");

// 仓库
class LibraryTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = label;
    this.contextValue = 'libraryTreeItem';
    this.iconPath = new ThemeIcon('git-branch')
  }
}

// 组件
class ComponentTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = label;
    this.contextValue = 'componentTreeItem';
    this.iconPath = new ThemeIcon('symbol-constructor')
  }
}

// 接口
class InterfaceTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = label;
    this.contextValue = 'interfaceTreeItem';
    this.iconPath = new ThemeIcon('symbol-interface')
  }
}

// 打包
class PackageTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = label;
    this.contextValue = 'packageTreeItem';
    this.iconPath = new ThemeIcon('package')
  }
}

// 部署
class DeployTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = label;
    this.contextValue = 'deployTreeItem';
    this.iconPath = new ThemeIcon('server-environment')
  }
}

export class ExplorerProvider {
  private context: ExtensionContext
  public view: TreeView<TreeItem> | undefined
  public projectRootPath: string = ''
  public project: string = ''
  private packageName: string = 'meteor.json'
  public activeEnv: string = 'development'
  public activeEnvName: string = '开发'
  public config: any
  public fetch: AxiosInstance
  public open

  constructor(context: ExtensionContext) {
    this.context = context
    this.fetch = axios.create({
      baseURL: url.base,
      withCredentials: false
    })
    this.open = open
  }
  
  public register() {
    const treeDataProvider = new ExplorerTreeDataProvider(this.context)
    const view = window.createTreeView('meteor', {
      treeDataProvider: treeDataProvider,
      showCollapseAll: false
    })
    this.view = view
    this.context.subscriptions.push(view)
    let envList = [
      {command: 'meteor.envDev', name: '开发', env: 'development'}, 
      {command: 'meteor.envTest', name: '测试', env: 'test'}, 
      {command: 'meteor.envProduct', name: '生产', env: 'product'}
    ]
    envList.forEach(env => {
      this.context.subscriptions.push(
        commands.registerCommand(env.command, () => {
          let meteorConfig = fs.readFileSync(path.join(this.projectRootPath, this.packageName), 'utf-8')
          if (meteorConfig) {
            meteorConfig = meteorConfig.replace(new RegExp(`"activeEnv": "${this.activeEnv}"`, 'gi'), `"activeEnv": "${env.env}"`)
            fs.writeFileSync(path.join(this.projectRootPath, this.packageName), meteorConfig)
          }
          this.config = JSON.parse(meteorConfig)
          this.setEnv(env.env, env.name)
        })
      )
    });
    // meteor.json文件生成
    this.generateMeteorJson()
    this.addJsonProvider()
    this.context.subscriptions.push(commands.registerCommand('meteor.setting', async () => {
      let uri = Uri.file(path.join(this.projectRootPath, this.packageName))
      const document: TextDocument = await workspace.openTextDocument(uri)
      await window.showTextDocument(document, { preserveFocus: true });
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.explain', () => {
      open(url.official)
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.libraryVisit', async () => {
      const remoteCmd = await execa('git', ['remote', '-v'], { cwd: this.projectRootPath })
      if (remoteCmd.stdout) {
        const remoteMatchs = remoteCmd.stdout.match(/http.* /)
        if (remoteMatchs && remoteMatchs?.length > 0) {
          open(remoteMatchs[0].trim())
        }
      }
    }))
    this.watcherProvider()
  }

  public encrypt(psd: string) {
    return CryptoJS.AES.encrypt(psd, 'meteor').toString()
  }

  public decrypt(psd: string) {
    return CryptoJS.AES.decrypt(psd, 'meteor').toString(CryptoJS.enc.Utf8)
  }

  // 配置文件监听器
  public watcherProvider() {
    if (workspace.workspaceFolders) {
      const watcher = workspace.createFileSystemWatcher('**/meteor.json')
      watcher.onDidChange(() => { this.updateConfig() })
      watcher.onDidCreate(() => { this.updateConfig() })
      watcher.onDidDelete(() => { this.updateConfig() })
    }
  }

  // 更新配置
  public updateConfig() {
    let meteorConfig = fs.readFileSync(path.join(this.projectRootPath, this.packageName), 'utf-8')
    if (meteorConfig) {
      try {
        this.config = JSON.parse(meteorConfig)
      } catch (error) {
      }
    }
  }
  
  // 打开配置文件
  public async openConfigInKey(key: string) {
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
        if (new RegExp(`.*\\"${key}\\"\\s?:.*`, 'gi').test(line)) {
          x = i
          y = line.length - 2
          break
        }
      }
    }
    let uri = Uri.file(meteorJsonPath)
    const document: TextDocument = await workspace.openTextDocument(uri)
    await window.showTextDocument(document, { preserveFocus: true, selection: new Selection(new Position(x, y), new Position(x, y)) });
  }

  // meteor.json hover, item provider
  public addJsonProvider() {
    let selector = [{ language: 'json', scheme: '*', pattern: '**/' + this.packageName }]
    this.context.subscriptions.push(languages.registerCompletionItemProvider(selector, new JSONCompletionItemProvider(), '"', ':'))
    this.context.subscriptions.push(languages.registerHoverProvider(selector, new JsonHoverProvider()))
  }

  public setEnv(env: string, envName: string) {
    this.activeEnv = env
    let nameKey: any = {
      development: '开发',
      test: '测试',
      product: '生产',
    }
    this.activeEnvName = nameKey[env]
    this.view && (this.view.title = `meteor集成环境[${envName}]`)
  }

  public generateMeteorJson() {
    this.projectRootPath = getWorkspaceRoot('')
    const paths = this.projectRootPath.split('/')
    let project = ''
    if (paths.length > 0) {
      project = paths[paths.length - 1]
    }
    // docker仓库不允许大写
    this.project = project.toLowerCase()
    let meteorJsonPath = path.join(this.projectRootPath, this.packageName)
    let gitignorePath = path.join(this.projectRootPath, '.gitignore')
    if (fs.existsSync(meteorJsonPath)) {
      let meteorConfig: any = fs.readFileSync(meteorJsonPath, 'utf-8')
      if (meteorConfig) {
        meteorConfig = JSON.parse(meteorConfig)
        this.config = meteorConfig
        if (meteorConfig.activeEnv) {
          let nameKey: any = {
            development: '开发',
            test: '测试',
            product: '生产',
          }
          this.setEnv(meteorConfig.activeEnv, nameKey[meteorConfig.activeEnv] || '')
        }
      }
    } else {
      fs.writeFileSync(meteorJsonPath, config)
      this.config = config
      if (fs.existsSync(gitignorePath)) {
        fs.appendFileSync(gitignorePath, '\n' + this.packageName)
      }
    }
  }
}

class JsonHoverProvider implements HoverProvider {
  public hoverKeys: any = {
    activeEnv: '当前有效环境',
    development: '开发环境',
    test: '测试环境',
    product: '生产环境',
    interface: '接口配置',
    package: '包配置',
    deploy: '部署配置',
    swaggerUrl: 'swagger地址',
    jenkinsUrl: 'jenkins访问地址',
    jenkinsUsername: 'jenkins登录账号',
    jenkinsPassword: 'jenkins登录密码',
    jenkinsView: 'jenkins放置视图',
    jenkinsBaseProject: 'jenkins复制基本工程',
    cloudUrl: '容器云访问地址',
    cloudUsername: '容器云登录账号',
    cloudPassword: '容器云登录密码',
    rootPath: "根路径",
    view: '页面根路径',
    api: '接口根路径',
    component: '组件根路径',
    store: 'store根路径',
    request: '请求根路径',
    root: '工程根路径',
  }
  provideHover(document: TextDocument, position: Position): ProviderResult<Hover> {
    const currentWord = getCurrentWordByHover(document, position);
    if (currentWord && this.hoverKeys[currentWord]) {
      return new Hover(this.hoverKeys[currentWord])
    }
    return null
  }
}

interface Items {
  label: string,
  documentation: string
}
class JSONCompletionItemProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    const jsonItems: CompletionItem[] = [];
    let items: Items[] = []
    const offset = document.offsetAt(position);
		const location = getLocation(document.getText(), offset);
    if (location.matches(['activeEnv'])) {
      if (!location.isAtPropertyKey) {
        items = [{
          label: 'development',
          documentation: '开发环境'
        }, {
          label: 'test',
          documentation: '测试环境'
        }, {
          label: 'product',
          documentation: '生产环境'
        }]
      }
    } else if (location.matches(['rootPath'])) {
      if (!location.isAtPropertyKey) {
        items = [{
          label: 'root',
          documentation: '工程根路径'
        }, {
          label: 'view',
          documentation: '页面根路径'
        }, {
          label: 'component',
          documentation: '组件根路径'
        }, {
          label: 'api',
          documentation: '接口根路径'
        }, {
          label: "store",
          documentation: 'store根路径'
        }, {
          label: "request",
          documentation: '请求根路径'
        }]
      }
    } else if (location.matches(['development']) || location.matches(['test']) || location.matches(['product'])) {
      if (location.path.includes('interface')) {
        if (location.isAtPropertyKey) {
          items = [{
            label: 'swaggerUrl',
            documentation: 'swagger地址'
          }]
        }
      } else if (location.path.includes('package')) {
        if (location.isAtPropertyKey) {
          items = [{
            label: 'jenkinsUrl',
            documentation: 'jenkins访问地址'
          }, {
            label: 'jenkinsUsername',
            documentation: 'jenkins登录账号'
          }, {
            label: 'jenkinsPassword',
            documentation: 'jenkins登录密码'
          }, {
            label: 'jenkinsBaseProject',
            documentation: 'jenkins复制基本工程'
          }, {
            label: 'jenkinsView',
            documentation: 'jenkins放置视图'
          }]
        }
      } else if (location.path.includes('deploy')) {
        if (location.isAtPropertyKey) {
          items = [{
            label: 'cloudUrl',
            documentation: '容器云访问地址'
          }, {
            label: 'cloudUsername',
            documentation: '容器云登录账号'
          }, {
            label: 'cloudPassword',
            documentation: '容器云登录密码'
          }]
        }
      } else {
        if (location.isAtPropertyKey) {
          items = [{
            label: 'interface',
            documentation: '接口配置'
          }, {
            label: 'package',
            documentation: '包配置'
          }, {
            label: 'deploy',
            documentation: '部署配置'
          }]
        }
      }
    } else {
      if (location.isAtPropertyKey) {
        items = [{
          label: 'activeEnv',
          documentation: '当前有效环境'
        }, {
          label: 'development',
          documentation: '开发环境'
        }, {
          label: 'test',
          documentation: '测试环境'
        }, {
          label: 'product',
          documentation: '生产环境'
        }]
      }
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let completionItem = new CompletionItem(item.label)
      completionItem.kind = CompletionItemKind.Property
      completionItem.insertText = item.label
      completionItem.documentation = item.documentation
      completionItem.sortText = '000' + i
      jsonItems.push(completionItem)
    }
    return jsonItems
  }
  // resolveCompletionItem?(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
  //   // 完成选中项
  //   console.log('resolveCompletionItem')
  //   console.log(item, token)
  //   return null
  // }

}

// 目录树实现
class ExplorerTreeDataProvider implements TreeDataProvider<TreeItem>  {
  private context: ExtensionContext
  constructor(context: ExtensionContext) {
    this.context = context
  }
  onDidChangeTreeData?: Event<void | TreeItem | TreeItem[] | null | undefined> | undefined
  getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }
  getChildren(current?: TreeItem | undefined): ProviderResult<TreeItem[]> {
    let children: any[] = []
    if (current) {
      return []
    } else {
      children.push(new LibraryTreeItem('仓库', TreeItemCollapsibleState.None))
      children.push(new ComponentTreeItem('组件', TreeItemCollapsibleState.None))
      children.push(new InterfaceTreeItem('接口', TreeItemCollapsibleState.None))
      children.push(new PackageTreeItem('打包', TreeItemCollapsibleState.None))
      children.push(new DeployTreeItem('部署', TreeItemCollapsibleState.None))
      return children
    }
  }
  getParent?(element: TreeItem): ProviderResult<TreeItem> {
    console.log('getParent', element, this.context)
		return null;
  }
  // resolveTreeItem?(item: TreeItem, element: TreeItem, token: CancellationToken): ProviderResult<TreeItem> {
  //   console.log('resolveTreeItem', this.context, item, element, token)
  //   throw new Error('Method not implemented 2.')
  // }

}