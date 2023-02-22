import * as os from 'os'
import { workspace, commands, Webview, Uri, ConfigurationTarget, TextDocument, Position } from 'vscode';
import * as path from 'path'
const opn = require('opn');
export const url = {
  base: 'http://www.80fight.cn:8080',
  official: 'http://www.80fight.cn',
  component: 'http://front.80fight.cn'
}
export function getPlatform() {
  return os.platform().includes('win')
}
export function getWorkspaceRoot(documentUrl: string) {
  let url: string = '';
  if (workspace.workspaceFolders?.length === 1) {
    return workspace.workspaceFolders[0].uri.path 
  }
  workspace.workspaceFolders?.forEach((workspaceFolder) => {
    if(documentUrl.includes(workspaceFolder.uri.path)) {
      url = workspaceFolder.uri.path
    }
  })
  return url
}
export function getRelativePath(src: string, dist: string) {
  let vfPath = path.relative(src, dist)
  if (vfPath.startsWith('../')) {
    vfPath = vfPath.substr(1, vfPath.length)
  }
  return vfPath
}
export function setTabSpace() {
  let veturConfig = workspace.getConfiguration('vetur');
  const tabSize = workspace.getConfiguration('editor').tabSize;
  let space = '';
  if (veturConfig && veturConfig.format && veturConfig.format.options) {
    for (let i = 0; i < veturConfig.format.options.tabSize; i++) {
      space += ' ';
    }
  } else {
    for (let i = 0; i < tabSize; i++) {
      space += ' ';
    }
  }
  if (space.length === 0) {
    space = '  '
  }
  return space
}
export function open(url: string) {
  opn(url);
}

export function asNormal(key: string, modifiers?: string) {
  switch (key) {
    case 'enter':
      if (modifiers === 'ctrl') {
        return commands.executeCommand('editor.action.insertLineAfter');
      } else {
        return commands.executeCommand('type', { source: 'keyboard', text: '\n' });
      }
    case 'tab':
        if (workspace.getConfiguration('emmet').get<boolean>('triggerExpansionOnTab')) {
          return commands.executeCommand('editor.emmet.action.expandAbbreviation');
        } else if (modifiers === 'shift') {
          return commands.executeCommand('editor.action.outdentLines');
        } else {
          return commands.executeCommand('tab');
        }
    case 'backspace':
      return commands.executeCommand('deleteLeft');
  }
}
// windows根路径处理
export function winRootPathHandle(pagePath: string) {
  if (os.platform().includes('win') && pagePath.length > 0 && pagePath[0] === '\\') {
    return pagePath.substr(1, pagePath.length);
  } else {
    return pagePath;
  }
}

// 资源地址转换
function _toUri(webview: Webview, extensionPath: string, basePath: string, fileName: string) {
  return webview.asWebviewUri(Uri.file(path.join(extensionPath, basePath, fileName)));
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// 获取webview内容
export function getHtmlForWebview(webview: Webview, extensionPath: string, path: string, title: string) {
  const nonce = getNonce();
  const cssChunk = _toUri(webview,  extensionPath, 'media', '/css/chunk-vendors.css');
  const cssUri = _toUri(webview,  extensionPath, 'media', 'css/app.css');
  const vendor = _toUri(webview,  extensionPath, 'media', 'js/chunk-vendors.js');
  const app = _toUri(webview,  extensionPath, 'media', 'js/app.js');

  return `<!DOCTYPE html>
  <html lang=en>
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link nonce="${nonce}" href="${cssChunk}" rel=stylesheet>
    <link nonce="${nonce}" href="${cssUri}" rel=stylesheet>
  </head>
  
  <body><noscript><strong>We're sorry but ${title} doesn't work properly without JavaScript enabled. Please enable it to
        continue.</strong></noscript>
    <div id=app></div>
    <script>var rootPath = '${path}'</script>
    <script nonce="${nonce}" src="${vendor}"></script>
    <script nonce="${nonce}" src="${app}"></script>
  </body>
  
  </html>`;
}

export const store = {
  set: (key: string, value: any) => {
    workspace.getConfiguration('meteor').update(key, value, ConfigurationTarget.Global);
  },
  get: (key: string) => {
    return workspace.getConfiguration('meteor').get(key);
  }
}

export function getCurrentWord(document: TextDocument, position: Position) {
  let i = position.character - 1;
  const text = document.lineAt(position.line).text;
  while (i >= 0 && ' \t\n\r\v":{[,'.indexOf(text.charAt(i)) === -1) {
    i--;
  }
  return text.substring(i + 1, position.character);
}

export function getCurrentWordByHover(document: TextDocument, position: Position) {
  const line = document.lineAt(position.line);
  const textSplite = [' ', '<', '>', '"', '\'', '.', '\\', "=", ":"];
  // 通过前后字符串拼接成选择文本
  let posIndex = position.character;
  let textMeta = line.text.substr(posIndex, 1);
  let selectText = '';
  // 前向获取符合要求的字符串
  while(textSplite.indexOf(textMeta) === -1 && posIndex <= line.text.length) {
    selectText += textMeta;
    textMeta = line.text.substr(++posIndex, 1);
  }
  // 往后获取符合要求的字符串
  posIndex = position.character - 1;
  textMeta = line.text.substr(posIndex, 1);
  while(textSplite.indexOf(textMeta) === -1 && posIndex > 0) {
    selectText = textMeta + selectText;
    textMeta = line.text.substr(--posIndex, 1);
  }
  textMeta = line.text.substr(posIndex, 1);
  return selectText
}

export function getSwaggerKey(url: string) {
  return url.replace(/.*\/\//gi, '').replace(/\..*/gi, '').replace(/-/gi, '_')
}