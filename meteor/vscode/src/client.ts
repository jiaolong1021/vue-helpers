import * as vscode from 'vscode';
import { ProjectProvider } from './project'

export function activate(context: vscode.ExtensionContext) {
  const project = new ProjectProvider(context)
  project.showInStatusBar()
  project.registerCommand() 
}