import * as vscode from 'vscode';
import { ProjectProvider } from './project'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('hello', () => {
    vscode.window.showInformationMessage('哈哈, nihao')
  }))

  const project = new ProjectProvider(context)
  project.showInStatusBar()
  project.registerCommand()
  
}