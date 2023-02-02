import * as vscode from 'vscode';
import { ProjectProvider } from './project'
import { ExplorerProvider } from './explorer'
import { ComponentProvider } from './component'

export function activate(context: vscode.ExtensionContext) {
  // 工程
  const project = new ProjectProvider(context)
  project.showInStatusBar()
  project.registerCommand()

  const explorer = new ExplorerProvider(context)
  explorer.register()

  const component = new ComponentProvider(context)
  component.register()
}