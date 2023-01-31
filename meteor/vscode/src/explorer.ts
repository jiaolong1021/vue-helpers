import { Event, ExtensionContext, ProviderResult, TreeDataProvider, TreeItem, window, TreeItemCollapsibleState, ThemeIcon } from 'vscode'
// import * as path from 'path'

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

  constructor(context: ExtensionContext) {
    this.context = context
  }
  
  public register() {
    const treeDataProvider = new ExplorerTreeDataProvider(this.context)
    const view = window.createTreeView('meteor', {
      treeDataProvider: treeDataProvider,
      showCollapseAll: false
    })
    this.context.subscriptions.push(view)
  }
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
    console.log('getChildren', current)
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