import { commands, ExtensionContext, window } from 'vscode'
import { ExplorerProvider } from './explorer'
var CryptoJS = require("crypto-js");

export class PkgProvider {
  public context: ExtensionContext
  public explerer: ExplorerProvider

  constructor(context: ExtensionContext, explerer: ExplorerProvider) {
    this.context = context
    this.explerer = explerer
  }

  public register() {
    this.context.subscriptions.push(commands.registerCommand('meteor.packageSetting', async () => {
      this.explerer.openConfigInKey('jenkinsUrl')
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.encrypt', async () => {
      let psd = await window.showInputBox({
        placeHolder: '请输入原始密码'
      })
      if (window.activeTerminal) {
        window.activeTerminal.sendText(this.encrypt(psd || ''))
      } else {
        const terminal = window.createTerminal('meteor')
        terminal.sendText(this.encrypt(psd || ''))
      }
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.packageVisit', () => {
      this.explerer.open(this.explerer.config[this.explerer.activeEnv].package.jenkinsUrl)
    }))
  }

  public encrypt(psd: string) {
    return CryptoJS.AES.encrypt(psd, 'meteor').toString()
  }

  public decrypt(psd: string) {
    return CryptoJS.AES.decrypt(psd, 'meteor').toString(CryptoJS.enc.Utf8)
  }
}