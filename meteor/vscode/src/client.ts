import * as vscode from 'vscode';
import { ProjectProvider } from './project'
import { ExplorerProvider } from './explorer'
import { ComponentProvider } from './component'
import { IntfProvider } from './intf'
import { PkgProvider } from './pkg';
import { DeployProvider } from './deploy';

export function activate(context: vscode.ExtensionContext) {
  // 工程
  const project = new ProjectProvider(context)
  project.showInStatusBar()
  project.registerCommand()

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
}