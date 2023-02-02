import { Event, ExtensionContext, ProviderResult, TreeDataProvider, TreeItem, window, TreeItemCollapsibleState, ThemeIcon, TreeView, commands, 
  languages, CompletionItemProvider, CompletionItem, CompletionList, Position, TextDocument, CompletionItemKind
  } from 'vscode'
import { getWorkspaceRoot } from './util/util'
import * as path from 'path'
import * as fs from 'fs'
import { config } from './util/constant'
import { getLocation } from 'jsonc-parser'

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
      {command: 'meteor.envDev', name: '开发'}, 
      {command: 'meteor.envTest', name: '测试'}, 
      {command: 'meteor.envProduct', name: '生产'}
    ]
    envList.forEach(env => {
      this.context.subscriptions.push(
        commands.registerCommand(env.command, () => {
          this.setEnv(env.name)
        })
      )
    });
    // meteor.json文件生成
    this.generateMeteorJson()
    this.addJsonProvider()
  }

  // meteor.json hover, item provider
  public addJsonProvider() {
    let selector = [{ language: 'json', scheme: '*', pattern: '**/meteor.json' }]
    this.context.subscriptions.push(languages.registerCompletionItemProvider(selector, new JSONCompletionItemProvider(), '"', ':'))
  }

  public setEnv(env: string) {
    this.view && (this.view.title = `meteor集成环境[${env}]`)
  }

  public generateMeteorJson() {
    const root = getWorkspaceRoot('')
    let meteorJsonPath = path.join(root, 'meteor.json')
    let gitignorePath = path.join(root, '.gitignore')
    if (!fs.existsSync(meteorJsonPath)) {
      fs.writeFileSync(meteorJsonPath, config)
      if (fs.existsSync(gitignorePath)) {
        fs.appendFileSync(gitignorePath, '\nmeteor.json')
      }
    }
  }
}

class JSONCompletionItemProvider implements CompletionItemProvider {
  // private lastResource: Uri | undefined;

  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    // this.lastResource = document.uri;
    // const currentWord = getCurrentWord(document, position);
    const jsonItems: CompletionItem[] = [];
    // let overwriteRange: Range;

    const offset = document.offsetAt(position);
		const location = getLocation(document.getText(), offset);
    // const node = location.previousNode;
    // if (node && node.offset <= offset && offset <= node.offset + node.length && (node.type === 'property' || node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
		// 	overwriteRange = new Range(document.positionAt(node.offset), document.positionAt(node.offset + node.length));
		// } else {
		// 	overwriteRange = new Range(document.positionAt(offset - currentWord.length), position);
		// }

    if (location.matches(['activeEnv'])) {
      console.log('activeEnv')
      let items = [{
        label: 'development',
        documentation: '开发环境'
      }, {
        label: 'test',
        documentation: '测试环境'
      }, {
        label: 'product',
        documentation: '生产环境'
      }]
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let completionItem = new CompletionItem(item.label)
        completionItem.kind = CompletionItemKind.Property
        completionItem.insertText = item.label
        completionItem.documentation = item.documentation
        completionItem.sortText = '000' + i
        jsonItems.push(completionItem)
      }
    } else if (location.matches(['development']) || location.matches(['test']) || location.matches(['product'])) {
      console.log('env')
    } else {
      let items = [{
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
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let completionItem = new CompletionItem(item.label)
        completionItem.kind = CompletionItemKind.Property
        completionItem.insertText = item.label
        completionItem.documentation = item.documentation
        completionItem.sortText = '000' + i
        jsonItems.push(completionItem)
      }
    }
    // console.log(node?.value)
    
    // console.log(location.isAtPropertyKey)
    // console.log(overwriteRange)

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