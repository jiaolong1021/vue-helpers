import { ExtensionContext, workspace } from 'vscode';
import { ProjectProvider } from './project'
import { ExplorerProvider } from './explorer'
import { ComponentProvider } from './component'
import { IntfProvider } from './intf'
import { PkgProvider } from './pkg';
import { DeployProvider } from './deploy';
import Assist from './assist';
import ElementProvider from './element';

export function activate(context: ExtensionContext) {
  // 工程
  const project = new ProjectProvider(context, init)
  project.showInStatusBar()
  project.registerCommand()

  if (workspace.workspaceFolders) {
    init(context)
  }
}

function init(context: ExtensionContext) {
  const explorer = new ExplorerProvider(context)
    explorer.register()
  
    const component = new ComponentProvider(context)
    component.register()
  
    const intf = new IntfProvider(context, explorer)
    intf.register()
  
    const pkg = new PkgProvider(context, explorer)
    pkg.register()
  
    const deploy = new DeployProvider(context, explorer, pkg)
    deploy.register()
  
    const assist = new Assist(context, explorer)
    assist.register()
    
    const element = new ElementProvider(explorer, context)
    element.register()
}