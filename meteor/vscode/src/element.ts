import { ExtensionContext, languages, CompletionItemProvider, Range, CompletionItem, CompletionList, Position, ProviderResult, TextDocument,
  window, Selection, CompletionItemKind, SnippetString, workspace, HoverProvider, TextLine, Hover } from "vscode";
import { ExplorerProvider } from "./explorer";
import * as fs from 'fs'
import * as path from 'path'
import { setTabSpace, getWorkspaceRoot, getRelativePath, getCurrentWord, winRootPathHandle } from './util/util'
import { getGlobalAttrs } from './globalAttribute/index';
import { getTags, getJsTags } from './tags/index';
import { getDocuments } from './documents/index'
import { getTip } from './tip/index'
import Traverse from './util/traverse'
// const pretty = require('pretty');

export interface TagObject {
  text: string,
  offset: number
};

export default class ElementProvider {
  public explorer: ExplorerProvider
  public context: ExtensionContext
  public version: string[] = []
  public pathAlias = {
    alias: '',
    path: ''
  }

  constructor(explorer: ExplorerProvider, context: ExtensionContext) {
    this.explorer = explorer
    this.context = context
    try {
      const pkg = fs.readFileSync(winRootPathHandle(path.join(this.explorer.projectRootPath, 'package.json')), 'utf-8')
      if (pkg.includes('element-plus')) {
        this.version.push('element-plus')
      } 
      if (pkg.includes('element-ui')) {
        this.version.push('element-ui')
      }
      if (pkg.includes('ant-design-vue')) {
        this.version.push('ant-design-vue')
      }
    } catch (error) {
      
    }
    if (this.explorer.config.rootPath) {
      let alias = this.explorer.config.rootPath.root.split('=')
      this.pathAlias.alias = alias[0]
      this.pathAlias.path = alias[1]
    }
  }

  register() {
    this.context.subscriptions.push(languages.registerCompletionItemProvider(['vue', 'javascript', 'typescript', 'html', 'wxml'], new ElementCompletionItemProvider(this), '', ':', '<', '"', "'", '/', '@', '(', '>', '{'))
    this.context.subscriptions.push(languages.registerHoverProvider(['vue', 'wxml'], new ElementHoverProvider(this)))
  }
}

class ElementCompletionItemProvider implements CompletionItemProvider {
  public elementProvider: ElementProvider
  public _document: TextDocument | any
  public _position: Position | any
  public tabSpace: string = ''
  public tagReg: RegExp = /<([\w-]+)\s+/g;
  public attrReg: RegExp = /(?:\(|\s*)((\w(-)?)*)=['"][^'"]*/;  // 能够匹配 left-right 属性
  public tagStartReg: RegExp = /<([\w-]*)$/;
  public traverse: Traverse
  public vueFiles: any = []
  public TAGS: any = {}
  public TAGSJs: any = {}
  public TIPS: any = {}
  public GlobalAttrs: any = {}

  constructor(elementProvider: ElementProvider) {
    this.elementProvider = elementProvider
    this.traverse = new Traverse(this.elementProvider.explorer, getWorkspaceRoot(window.activeTextEditor?.document.uri.path || ''))
    this.vueFiles = this.traverse.search('.vue', '')
    this.TAGS = getTags(this.elementProvider.version)
    this.TIPS = getTip(this.elementProvider.version)
    this.TAGSJs = getJsTags(this.elementProvider.version)
    this.GlobalAttrs = getGlobalAttrs(this.elementProvider.version)
    if (workspace.workspaceFolders) {
      const watcher = workspace.createFileSystemWatcher('**/*.vue')
      watcher.onDidCreate(() => { this.vueFiles = this.traverse.search('.vue', '') })
      watcher.onDidDelete(() => { this.vueFiles = this.traverse.search('.vue', '') })
    }
  }
  provideCompletionItems(document: TextDocument, position: Position): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
    this._document = document;
    this._position = position;
    if (this.tabSpace.length === 0) {
      this.tabSpace = setTabSpace()
    }

    // 标签关闭标签
    if (this.isCloseTag()) {
      this.getCloseTagSuggestion();
      return [];
    }

    // 标签、属性
    let tag: TagObject | string | undefined = this.getPreTag();
    let attr = this.getPreAttr();
    let word = getCurrentWord(document, position)
    let hasSquareQuote = document.lineAt(position.line).text.includes('<')
    if (tag && attr && this.isAttrValueStart(tag, attr)) {
      // 属性值开始
      return this.getAttrValueSuggestion(tag.text, attr);
    } else if (tag && this.isAttrStart(tag)) {
      // 属性开始
      if (this.TAGS[tag.text]) {
        return this.getAttrSuggestion(tag.text);
      } else {
        return this.getPropAttr(this._document.getText(), tag.text);
      }
    }
    else if (this.isImport()) {
      return this.importSuggestion();
    } else if (word.includes('e') || word.includes('a')) {
      return this.notInTemplate() ? this.getTagJsSuggestion() : this.getTagSuggestion()
    } else if (word.includes('v')) {
      return this.getTagSuggestion()
    } else if (!tag && hasSquareQuote) {
      return this.notInTemplate() ? [] : this.getElementTagLabelSuggestion()
    } else {
      return []
    }
  }
  // resolveCompletionItem?(item: CompletionItem): ProviderResult<CompletionItem> {
  //   throw new Error("Method not implemented.");
  // }

  // 导入建议
  importSuggestion() {
    let search = this._document.lineAt(this._position.line).text.trim();
    search = search.replace(/^import/, '').trim();
    let suggestions: CompletionItem[] = [];
    if (search) {
      let files = this.traverse.search('', search);
      let pathAlias = this.elementProvider.explorer.config.rootPath.root.split('=')
      let prefix = ''
      if (pathAlias.length === 2) {
        prefix = pathAlias[0]
      }
      files.forEach(vf => {
        let filePath = '';
        if (prefix) {
          filePath = vf.path
        } else {
          filePath = getRelativePath(this._document.uri.path, path.join(this.elementProvider.explorer.projectRootPath, vf.path))
        }
        let camelName = vf.name.replace(/(-[a-z])/g, (_: any, c: any) => {
          return c ? c.toUpperCase() : '';
        }).replace(/-/gi, '');
        let insertPath = filePath
        if (filePath.endsWith('.ts')) {
          insertPath = filePath.substring(0, filePath.length - 3)
        }
        suggestions.push({
          label: vf.name,
          sortText: `0${vf.name}`,
          insertText: new SnippetString(`\${1:${camelName}} from '${insertPath}'`),
          kind: CompletionItemKind.Reference,
          detail: vf.name,
          documentation: `import ${camelName} from ${filePath}`
        });
      });
    }
    return suggestions;
  }

  // 判断是否是导入
  isImport() {
    let lineTxt = this._document.lineAt(this._position.line).text.trim();
    return /^\s*import.*/.test(lineTxt);
  }

  // 编译建议标签
  buildTagSuggestion(tag: string, tagVal: any, id: number) {
    return {
      label: tag,
      sortText: `00${id}${tag}`,
      insertText: new SnippetString(tagVal),
      kind: CompletionItemKind.Snippet,
      detail: `meteor`,
      documentation: ''
    };
  }

  getElementTagLabelSuggestion() {
    let suggestions = [];
    let id = 1;
    // 添加vue组件提示
    for (let i = 0; i < this.vueFiles.length; i++) {
      const vf = this.vueFiles[i];
      suggestions.push({
        label: vf.name,
        sortText: `0${i}${vf.name}`,
        insertText: new SnippetString(`${vf.name}$0></${vf.name}>`),
        kind: CompletionItemKind.Folder,
        detail: 'meteor',
        documentation: '内部组件: ' + vf.path,
        command: { command: 'meteor.funcEnhance', title: 'meteor: funcEnhance' }
      });
    }

    try {
      let labels: string[] = []
      for (let tag in this.TAGS) {
        let label = tag.replace(/:.*/gi, '')
        if (!labels.includes(label)) {
          labels.push(label)
          suggestions.push({
            label: label,
            sortText: `00${id}${label}`,
            insertText: new SnippetString(`${label}$0></${label}>`),
            kind: CompletionItemKind.Snippet,
            detail: `meteor`,
            documentation: this.TAGS[tag]._self.description
          });
          id++;
        }
      }
    } catch (error) {
      console.log(error)
    }
    return suggestions;
  }

  // 获取建议标签
  getTagSuggestion() {
    let suggestions = [];
    let id = 1;
    // 添加vue组件提示
    for (let i = 0; i < this.vueFiles.length; i++) {
      const vf = this.vueFiles[i];
      suggestions.push({
        label: vf.name,
        sortText: `0${i}${vf.name}`,
        insertText: new SnippetString(`${vf.name}$0></${vf.name}>`),
        kind: CompletionItemKind.Folder,
        detail: 'meteor',
        documentation: '内部组件: ' + vf.path,
        command: { command: 'meteor.funcEnhance', title: 'meteor: funcEnhance' }
      });
    }

    try {
      for (let tag in this.TIPS) {
        suggestions.push(this.buildTagSuggestion(tag, this.TIPS[tag], id));
        id++;
      }
    } catch (error) {
      console.log(error)
    }
    return suggestions;
  }

  // 获取js代码提示
  getTagJsSuggestion() {
    let suggestions: any[] = [];
    let id = 1;
    try {
      for (let tag in this.TAGSJs) {
        suggestions.push(this.buildTagSuggestion(tag, this.TAGSJs[tag], id));
        id++;
      }
    } catch (error) {
      console.log(error)
    }
    return suggestions
  }

  // vue文件只在template里面提示，已script作为标记
  notInTemplate(): boolean {
    let line = this._position.line;
    while (line) {
      if (/^\s*<script.*>\s*$/.test(<string>this._document.lineAt(line).text)) {
        return true;
      }
      line--;
    }
    return false;
  }

  // 是否是标签开始
  isTagStart() {
    let txt = this.getTextBeforePosition(this._position);
    return this.tagStartReg.test(txt);
  }

  // 获取props属性值
  getPropAttr(documentText: any, tagName: any) {
    // 1. 找出标签所在路径
    let tagNameUpper = tagName.replace(/(-[a-z])/g, (_: any, c: any) => {
      return c ? c.toUpperCase() : '';
    }).replace(/-/gi, '');
    let pathReg = RegExp('import\\\s+(' + tagName + '|' + tagNameUpper + ')\\\s+from\\\s+[\'\"]([^\'\"]*)', 'g');
    let pathRegArr = documentText.match(pathReg);
    if (pathRegArr && pathRegArr.length > 0) {
      let tagPath = pathRegArr[0];
      tagPath = tagPath.replace(/(.*['"])/, '');
      tagPath = tagPath.replace(this.elementProvider.pathAlias.alias, this.elementProvider.pathAlias.path);
      if (!tagPath.endsWith('.vue')) {
        tagPath += '.vue';
      }
      if (tagPath.indexOf('./') > 0 || tagPath.indexOf('../') > 0) {
        tagPath = path.join(this._document.fileName, '../', tagPath);
      } else {
        tagPath = path.join(workspace.rootPath || '', tagPath);
      }
      documentText = fs.readFileSync(tagPath, 'utf8');
    } else {
      return;
    }

    // 2. 获取标签文件中的prop属性
    let props = [];
    let scriptIndex = documentText.indexOf('<script');
    if (scriptIndex) {
      let docText = documentText.substr(scriptIndex, documentText.length);
      let propIndex = docText.indexOf('props');
      let propStack = 0;
      if (propIndex) {
        docText = docText.substr(propIndex, docText.length);
        let braceBeforeIndex = docText.indexOf('{');
        let braceAfterIndex = 0;
        if (braceBeforeIndex) {
          ++propStack;
          docText = docText.substr(braceBeforeIndex + 1, docText.length);
        }
        let propText = '';
        while(propStack > 0 && docText.length > 0) {
          braceBeforeIndex = docText.indexOf('{');
          braceAfterIndex = docText.indexOf('}');
          if (braceBeforeIndex === -1) {
            docText = '';
          } else if (braceBeforeIndex < braceAfterIndex) {
            if (propStack === 1) {
              propText += docText.substr(0, braceBeforeIndex);
            }
            ++propStack;
            docText = docText.substr(braceBeforeIndex > 0 ? braceBeforeIndex + 1 : 1, docText.length);
          } else {
            --propStack;
            docText = docText.substr(braceAfterIndex > 0 ? braceAfterIndex + 1 : 1, docText.length);
          }
        }
        let propMatch = propText.match(/\s[\w-]*:/gi);
        if (propMatch && propMatch.length > 0) {
          propMatch.forEach((propItem, propIndex) => {
            propItem = propItem.substr(1, propItem.length - 2);
            propItem = propItem.replace(/([A-Z])/g, (_, c) => {
              return c ? '-' + c.toLowerCase() : '';
            });
            props.push({
              label: propItem,
              sortText: '0' + propIndex,
              insertText: new SnippetString(`:${propItem}="$0"`),
              kind: CompletionItemKind.Property,
              documentation: ''
            });
          });
        }
      }
    }
    let emitReg = documentText.match(/\$emit\(\s?['"](\w*)/g);
    if (emitReg && emitReg.length > 0) {
      for (let i = 0; i < emitReg.length; i++) {
        let emitName = emitReg[i];
        emitName = emitName.replace(/(.*['"])/, '');
        props.push({
          label: emitName,
          sortText: '0' + (props.length + 1),
          insertText: new SnippetString(`@${emitName}="$0"`),
          kind: CompletionItemKind.Method,
          documentation: ''
        });
      }
    }
    return props;
  }

  // 获取建议属性
  getAttrSuggestion(tag: string) {
    let suggestions: any[] = [];
    let tagAttrs = this.getTagAttrs(tag);

    let preText = this.getTextBeforePosition(this._position);
    let prefix: any = preText.replace(/['"]([^'"]*)['"]$/, '').split(/\s|\(+/).pop();
    // 方法属性
    const type = prefix[0] === '@' ? 'method' : 'attribute';

    tagAttrs.forEach((attr: any) => {
      if (attr.type === type) {
        suggestions.push(this.buildAttrSuggestion(attr))
      }
    });

    for (let attr in this.GlobalAttrs) {
      let gAttr = this.GlobalAttrs[attr]
      if (gAttr.type === type) {
        suggestions.push(this.buildAttrSuggestion({
          name: attr,
          ...gAttr
        }))
      }
    }
    return suggestions;
  }

  buildAttrSuggestion(attr: any) {
    const completionItem = new CompletionItem(attr.name)
    completionItem.sortText = `000${attr.name}`
    completionItem.insertText = attr.name
    completionItem.kind = attr.type === 'method' ? CompletionItemKind.Method : CompletionItemKind.Property
    completionItem.documentation = attr.description
    return completionItem
  }

  // 获取标签包含的属性
  getTagAttrs(tag: string) {
    let attrs = []
    if (this.TAGS[tag]) {
      for (const key in this.TAGS[tag]) {
        if (key !== '_self') {
          attrs.push({
            name: key,
            ...this.TAGS[tag][key]
          })
        }
      }
    }
    return attrs
  }

  // 属性开始
  isAttrStart(tag: TagObject | undefined) {
    return tag;
  }

  // 获取属性值
  getAttrValues(tag: string, attr: string) {
    let attrValues: string[] = []
    // 全局
    if (this.GlobalAttrs[attr]) {
      attrValues = this.GlobalAttrs[attr].values
    }

    if (this.TAGS[tag] && this.TAGS[tag][attr]) {
      attrValues = this.TAGS[tag][attr].values
    }

    return attrValues
  }
  
  // 获取建议属性值
  getAttrValueSuggestion(tag: string, attr: string): CompletionItem[] {
    let suggestions: any[] = [];
    const values = this.getAttrValues(tag, attr);
    values.forEach((value: string) => {
      suggestions.push({
        sortText: `000${value}`,
        label: value,
        kind: CompletionItemKind.Value
      });
    });
    return suggestions;
  }

  // 属性值开始
  isAttrValueStart(tag: Object | string | undefined, attr: any) {
    return tag && attr;
  }

  // 获取预览属性
  getPreAttr(): string | undefined {
    let txt = this.getTextBeforePosition(this._position).replace(/"[^'"]*(\s*)[^'"]*$/, '');
    let end = this._position.character;
    let start = txt.lastIndexOf(' ', end) + 1;
    let parsedTxt = this._document.getText(new Range(this._position.line, start, this._position.line, end));

    return this.matchAttr(this.attrReg, parsedTxt);
  }

  // 匹配属性
  matchAttr(reg: RegExp, txt: string): string {
    let match: any;
    match = reg.exec(txt);
    return !/"[^"]*"/.test(txt) && match && match[1];
  }

  // 是否是关闭标签
  isCloseTag() {
    let txt = this._document.getText(new Range(new Position(this._position.line, 0), this._position)).trim();
    if(!txt.endsWith('>') || /.*=("[^"]*>|'[^']*>)$/gi.test(txt) || txt.endsWith('/>')) {
      return false;
    }
    let txtArr = txt.match(/<([\w-]+)(\s*|(\s+[\w-_:@\.]+(=("[^"]*"|'[^']*'))?)+)\s*>/gim);
    if(Array.isArray(txtArr) && txtArr.length > 0) {
      let txtStr = txtArr[txtArr.length - 1];
      return /<([\w-]+)(\s*|(\s+[\w-_:@\.]+(=("[^"]*"|'[^']*'))?)+)\s*>$/gi.test(txtStr);
    }
    return false;
  }

  // 自动补全关闭标签
  getCloseTagSuggestion() {
    let txtInfo = this._document.lineAt(this._position.line);
    let txtArr = txtInfo.text.match(/<([\w-]+)(\s*|(\s+[\w-_:@\.]+(=("[^"]*"|'[^']*'))?)+)\s*>/gim);
    let tag = 'div';
    if(txtArr) {
      tag = txtArr[txtArr.length - 1].replace(/<([\w-]+)(\s*|(\s+[\w-_:@\.]+(=("[^"]*"|'[^']*'))?)+)\s*>/gim, '$1');
    }
    let exclude = ['br', 'img'];
    if (exclude.indexOf(tag) === -1) {
      window.activeTextEditor?.edit((editBuilder) => {
        editBuilder.insert(this._position, '</' + tag + '>');
      });
      let newPosition = window.activeTextEditor?.selection.active.translate(0, 0);
      if (window.activeTextEditor && newPosition) {
        window.activeTextEditor.selection = new Selection(newPosition, newPosition);
      }
    }
  }

  // 获取标签
  getPreTag(): TagObject | undefined {
    let line = this._position.line;
    let tag: TagObject | string;
    let txt = this.getTextBeforePosition(this._position);

    while (this._position.line - line < 10 && line >= 0) {
      if (line !== this._position.line) {
        txt = this._document.lineAt(line).text;
      }
      tag = this.matchTag(this.tagReg, txt, line);

      if (tag === 'break') {return;}
      if (tag) {return <TagObject>tag;}
      line--;
    }
    return;
  }

  // 获取本行位置前的文本
  getTextBeforePosition(position: Position): string {
    var start = new Position(position.line, 0);
    var range = new Range(start, position);
    return this._document.getText(range);
  }

  // 匹配标签
  matchTag(reg: RegExp, txt: string, line: number): TagObject | string {
    let match: any;
    let arr: any[] = [];
    if (/<\/?[-\w]+[^<>]*>[\s\w]*<?\s*[\w-]*$/.test(txt) || (this._position.line === line && (/^\s*[^<]+\s*>[^<\/>]*$/.test(txt) || /[^<>]*<$/.test(txt[txt.length - 1])))) {
      return 'break';
    }
    while ((match = reg.exec(txt))) {
      arr.push({
        text: match[1],
        offset: this._document.offsetAt(new Position(line, match.index))
      });
    }
    return arr.pop();
  }
}

// 文档通过 hover 形式查看
class ElementHoverProvider implements HoverProvider {
  public elementProvider: ElementProvider
  public Documents: any

  constructor(elementProvider: ElementProvider) {
    this.elementProvider = elementProvider
    this.Documents = getDocuments(elementProvider.version)
  }

  // 获取属性所属标签
  public getTag(document: any, position: any): String {
    let line = position.line;
    let tagName = '';

    while(line > 0 && !tagName) {
      let lineInfo: TextLine = document.lineAt(line);
      let text = lineInfo.text.trim();
      // 本行则获取光标位置前文本
      if(line === position.line) {
        text = text.substring(0, position.character);
      }
      let txtArr = text.match(/<[^(>/)]+/gim);
      if(txtArr) {
        for (let i = (txtArr.length - 1); i >= 0; i--) {
          if(txtArr[i][0] === '<' && txtArr[i][1] !== '/') {
            if(txtArr[i].indexOf(' ') !== -1) {
              tagName = txtArr[i].replace(/^<(\S*)(\s.*|\s*)/gi, '$1');
            } else {
              tagName = txtArr[i].replace(/^<(.*)/gi, '$1');
            }
            break;
          }
        }
      }
      --line;
    }
    return tagName;
  }
  provideHover(document: TextDocument, position: Position): ProviderResult<import("vscode").Hover> {
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

    // tag标签便利
    if(this.Documents[selectText]) {
      return new Hover(this.Documents[selectText]);
    }

    return null
  }
}