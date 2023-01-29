import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('meteor activate', context.extension.id)

  context.subscriptions.push(vscode.commands.registerCommand('hello', () => {
    vscode.window.showInformationMessage('哈哈, nihao')
  }))
}