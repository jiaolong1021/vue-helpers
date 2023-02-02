import { Event, ExtensionContext, ProviderResult, TreeDataProvider, TreeItem, window, TreeItemCollapsibleState, ThemeIcon, TreeView, commands, 
  languages, CompletionItemProvider, CompletionItem, CompletionList, Position, TextDocument, CompletionItemKind, HoverProvider, Hover, Uri, workspace
  } from 'vscode'
import { getWorkspaceRoot, getCurrentWordByHover, open, url } from './util/util'
import * as path from 'path'
import * as fs from 'fs'
import { config } from './util/constant'
import { getLocation } from 'jsonc-parser'
import { execa } from 'execa'

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
  private packageName: string = 'meteor.json'
  private activeEnv: string = 'development'

  constructor(context: ExtensionContext) {
    this.context = context
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
    this.context.subscriptions.push(commands.registerCommand('meteor.componentSee', () => {
      open(url.component)
    }))
  }

  // meteor.json hover, item provider
  public addJsonProvider() {
    let selector = [{ language: 'json', scheme: '*', pattern: '**/' + this.packageName }]
    this.context.subscriptions.push(languages.registerCompletionItemProvider(selector, new JSONCompletionItemProvider(), '"', ':'))
    this.context.subscriptions.push(languages.registerHoverProvider(selector, new JsonHoverProvider()))
  }

  public setEnv(env: string, envName: string) {
    this.activeEnv = env
    this.view && (this.view.title = `meteor集成环境[${envName}]`)
  }

  public generateMeteorJson() {
    this.projectRootPath = getWorkspaceRoot('')
    let meteorJsonPath = path.join(this.projectRootPath, this.packageName)
    let gitignorePath = path.join(this.projectRootPath, '.gitignore')
    if (fs.existsSync(meteorJsonPath)) {
      let meteorConfig: any = fs.readFileSync(meteorJsonPath, 'utf-8')
      if (meteorConfig) {
        meteorConfig = JSON.parse(meteorConfig)
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
    cloudUrl: '容器云访问地址',
    cloudUsername: '容器云登录账号',
    cloudPassword: '容器云登录密码',
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