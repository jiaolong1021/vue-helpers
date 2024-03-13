var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/is-wsl@1.1.0/node_modules/is-wsl/index.js
var require_is_wsl = __commonJS({
  "../../node_modules/.pnpm/is-wsl@1.1.0/node_modules/is-wsl/index.js"(exports2, module2) {
    "use strict";
    var os2 = require("os");
    var fs = require("fs");
    var isWsl = () => {
      if (process.platform !== "linux") {
        return false;
      }
      if (os2.release().includes("Microsoft")) {
        return true;
      }
      try {
        return fs.readFileSync("/proc/version", "utf8").includes("Microsoft");
      } catch (err) {
        return false;
      }
    };
    if (process.env.__IS_WSL_TEST__) {
      module2.exports = isWsl;
    } else {
      module2.exports = isWsl();
    }
  }
});

// ../../node_modules/.pnpm/opn@6.0.0/node_modules/opn/index.js
var require_opn = __commonJS({
  "../../node_modules/.pnpm/opn@6.0.0/node_modules/opn/index.js"(exports2, module2) {
    "use strict";
    var { promisify } = require("util");
    var path3 = require("path");
    var childProcess2 = require("child_process");
    var isWsl = require_is_wsl();
    var pExecFile = promisify(childProcess2.execFile);
    var wslToWindowsPath = async (path4) => {
      const { stdout } = await pExecFile("wslpath", ["-w", path4]);
      return stdout.trim();
    };
    module2.exports = async (target, options) => {
      if (typeof target !== "string") {
        throw new TypeError("Expected a `target`");
      }
      options = {
        wait: false,
        ...options
      };
      let command;
      let appArguments = [];
      const cliArguments = [];
      const childProcessOptions = {};
      if (Array.isArray(options.app)) {
        appArguments = options.app.slice(1);
        options.app = options.app[0];
      }
      if (process.platform === "darwin") {
        command = "open";
        if (options.wait) {
          cliArguments.push("-W");
        }
        if (options.app) {
          cliArguments.push("-a", options.app);
        }
      } else if (process.platform === "win32" || isWsl) {
        command = "cmd" + (isWsl ? ".exe" : "");
        cliArguments.push("/c", "start", '""', "/b");
        target = target.replace(/&/g, "^&");
        if (options.wait) {
          cliArguments.push("/wait");
        }
        if (options.app) {
          if (isWsl && options.app.startsWith("/mnt/")) {
            const windowsPath = await wslToWindowsPath(options.app);
            options.app = windowsPath;
          }
          cliArguments.push(options.app);
        }
        if (appArguments.length > 0) {
          cliArguments.push(...appArguments);
        }
      } else {
        if (options.app) {
          command = options.app;
        } else {
          const useSystemXdgOpen = process.versions.electron || process.platform === "android";
          command = useSystemXdgOpen ? "xdg-open" : path3.join(__dirname, "xdg-open");
        }
        if (appArguments.length > 0) {
          cliArguments.push(...appArguments);
        }
        if (!options.wait) {
          childProcessOptions.stdio = "ignore";
          childProcessOptions.detached = true;
        }
      }
      cliArguments.push(target);
      if (process.platform === "darwin" && appArguments.length > 0) {
        cliArguments.push("--args", ...appArguments);
      }
      const subprocess = childProcess2.spawn(command, cliArguments, childProcessOptions);
      if (options.wait) {
        return new Promise((resolve, reject) => {
          subprocess.once("error", reject);
          subprocess.once("close", (exitCode) => {
            if (exitCode > 0) {
              reject(new Error(`Exited with code ${exitCode}`));
              return;
            }
            resolve(subprocess);
          });
        });
      }
      subprocess.unref();
      return subprocess;
    };
  }
});

// out/util/util.js
var require_util = __commonJS({
  "out/util/util.js"(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getSwaggerKey = exports2.getCurrentWordByHover = exports2.getCurrentWord = exports2.store = exports2.getHtmlForWebview = exports2.winRootPathHandle = exports2.asNormal = exports2.open = exports2.setTabSpace = exports2.getRelativePath = exports2.getWorkspaceRoot = exports2.getPlatform = exports2.url = void 0;
    var os2 = require("os");
    var vscode_12 = require("vscode");
    var path3 = require("path");
    var opn = require_opn();
    exports2.url = {
      base: "http://www.80fight.cn:8080",
      official: "http://www.80fight.cn",
      component: "http://front.80fight.cn"
    };
    function getPlatform() {
      return os2.platform().includes("win");
    }
    exports2.getPlatform = getPlatform;
    function getWorkspaceRoot(documentUrl) {
      var _a, _b;
      let url2 = "";
      if (((_a = vscode_12.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.length) === 1) {
        return vscode_12.workspace.workspaceFolders[0].uri.path;
      }
      (_b = vscode_12.workspace.workspaceFolders) === null || _b === void 0 ? void 0 : _b.forEach((workspaceFolder) => {
        if (documentUrl.includes(workspaceFolder.uri.path)) {
          url2 = workspaceFolder.uri.path;
        }
      });
      return url2;
    }
    exports2.getWorkspaceRoot = getWorkspaceRoot;
    function getRelativePath(src, dist) {
      let vfPath = path3.relative(src, dist);
      if (vfPath.startsWith("../")) {
        vfPath = vfPath.substr(1, vfPath.length);
      }
      return vfPath;
    }
    exports2.getRelativePath = getRelativePath;
    function setTabSpace() {
      let veturConfig = vscode_12.workspace.getConfiguration("vetur");
      const tabSize = vscode_12.workspace.getConfiguration("editor").tabSize;
      let space = "";
      if (veturConfig && veturConfig.format && veturConfig.format.options) {
        for (let i = 0; i < veturConfig.format.options.tabSize; i++) {
          space += " ";
        }
      } else {
        for (let i = 0; i < tabSize; i++) {
          space += " ";
        }
      }
      if (space.length === 0) {
        space = "  ";
      }
      return space;
    }
    exports2.setTabSpace = setTabSpace;
    function open(url2) {
      opn(url2);
    }
    exports2.open = open;
    function asNormal(key, modifiers) {
      switch (key) {
        case "enter":
          if (modifiers === "ctrl") {
            return vscode_12.commands.executeCommand("editor.action.insertLineAfter");
          } else {
            return vscode_12.commands.executeCommand("type", { source: "keyboard", text: "\n" });
          }
        case "tab":
          if (vscode_12.workspace.getConfiguration("emmet").get("triggerExpansionOnTab")) {
            return vscode_12.commands.executeCommand("editor.emmet.action.expandAbbreviation");
          } else if (modifiers === "shift") {
            return vscode_12.commands.executeCommand("editor.action.outdentLines");
          } else {
            return vscode_12.commands.executeCommand("tab");
          }
        case "backspace":
          return vscode_12.commands.executeCommand("deleteLeft");
      }
    }
    exports2.asNormal = asNormal;
    function winRootPathHandle(pagePath) {
      if (os2.platform().includes("win") && pagePath.length > 0 && pagePath[0] === "\\") {
        return pagePath.substr(1, pagePath.length);
      } else {
        return pagePath;
      }
    }
    exports2.winRootPathHandle = winRootPathHandle;
    function _toUri(webview, extensionPath, basePath, fileName) {
      return webview.asWebviewUri(vscode_12.Uri.file(path3.join(extensionPath, basePath, fileName)));
    }
    function getNonce() {
      let text = "";
      const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
    function getHtmlForWebview(webview, extensionPath, path4, title) {
      const nonce = getNonce();
      const cssChunk = _toUri(webview, extensionPath, "media", "/css/chunk-vendors.css");
      const cssUri = _toUri(webview, extensionPath, "media", "css/app.css");
      const vendor = _toUri(webview, extensionPath, "media", "js/chunk-vendors.js");
      const app = _toUri(webview, extensionPath, "media", "js/app.js");
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
    <script>var rootPath = '${path4}'<\/script>
    <script nonce="${nonce}" src="${vendor}"><\/script>
    <script nonce="${nonce}" src="${app}"><\/script>
  </body>
  
  </html>`;
    }
    exports2.getHtmlForWebview = getHtmlForWebview;
    exports2.store = {
      set: (key, value) => {
        vscode_12.workspace.getConfiguration("meteor").update(key, value, vscode_12.ConfigurationTarget.Global);
      },
      get: (key) => {
        return vscode_12.workspace.getConfiguration("meteor").get(key);
      }
    };
    function getCurrentWord(document, position) {
      let i = position.character - 1;
      const text = document.lineAt(position.line).text;
      while (i >= 0 && ' 	\n\r\v":{[,'.indexOf(text.charAt(i)) === -1) {
        i--;
      }
      return text.substring(i + 1, position.character);
    }
    exports2.getCurrentWord = getCurrentWord;
    function getCurrentWordByHover(document, position) {
      const line = document.lineAt(position.line);
      const textSplite = [" ", "<", ">", '"', "'", ".", "\\", "=", ":"];
      let posIndex = position.character;
      let textMeta = line.text.substr(posIndex, 1);
      let selectText = "";
      while (textSplite.indexOf(textMeta) === -1 && posIndex <= line.text.length) {
        selectText += textMeta;
        textMeta = line.text.substr(++posIndex, 1);
      }
      posIndex = position.character - 1;
      textMeta = line.text.substr(posIndex, 1);
      while (textSplite.indexOf(textMeta) === -1 && posIndex > 0) {
        selectText = textMeta + selectText;
        textMeta = line.text.substr(--posIndex, 1);
      }
      textMeta = line.text.substr(posIndex, 1);
      return selectText;
    }
    exports2.getCurrentWordByHover = getCurrentWordByHover;
    function getSwaggerKey(url2) {
      return url2.replace(/.*\/\//gi, "").replace(/\..*/gi, "").replace(/-/gi, "_");
    }
    exports2.getSwaggerKey = getSwaggerKey;
  }
});

// ../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js
var require_windows = __commonJS({
  "../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs = require("fs");
    function checkPathExt(path3, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path3.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path3, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path3, options);
    }
    function isexe(path3, options, cb) {
      fs.stat(path3, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path3, options));
      });
    }
    function sync(path3, options) {
      return checkStat(fs.statSync(path3), path3, options);
    }
  }
});

// ../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js
var require_mode = __commonJS({
  "../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs = require("fs");
    function isexe(path3, options, cb) {
      fs.stat(path3, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync(path3, options) {
      return checkStat(fs.statSync(path3), options);
    }
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// ../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js
var require_isexe = __commonJS({
  "../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js"(exports2, module2) {
    var fs = require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path3, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve, reject) {
          isexe(path3, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve(is);
            }
          });
        });
      }
      core(path3, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path3, options) {
      try {
        return core.sync(path3, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// ../../node_modules/.pnpm/which@2.0.2/node_modules/which/which.js
var require_which = __commonJS({
  "../../node_modules/.pnpm/which@2.0.2/node_modules/which/which.js"(exports2, module2) {
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path3 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i) => new Promise((resolve, reject) => {
        if (i === pathEnv.length)
          return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path3.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve(subStep(p, i, 0));
      });
      const subStep = (p, i, ii) => new Promise((resolve, reject) => {
        if (ii === pathExt.length)
          return resolve(step(i + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve(p + ext);
          }
          return resolve(subStep(p, i, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i = 0; i < pathEnv.length; i++) {
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path3.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module2.exports = which;
    which.sync = whichSync;
  }
});

// ../../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js
var require_path_key = __commonJS({
  "../../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js"(exports2, module2) {
    "use strict";
    var pathKey2 = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module2.exports = pathKey2;
    module2.exports.default = pathKey2;
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/resolveCommand.js"(exports2, module2) {
    "use strict";
    var path3 = require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env[getPathKey({ env })],
          pathExt: withoutPathExt ? path3.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path3.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/escape.js"(exports2, module2) {
    "use strict";
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(\\*)"/g, '$1$1\\"');
      arg = arg.replace(/(\\*)$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module2.exports.command = escapeCommand;
    module2.exports.argument = escapeArgument;
  }
});

// ../../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "../../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = /^#!(.*)/;
  }
});

// ../../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "../../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js"(exports2, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path3, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path3.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/readShebang.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs.openSync(command, "r");
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/parse.js"(exports2, module2) {
    "use strict";
    var path3 = require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path3.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command,
        args,
        options,
        file: void 0,
        original: {
          command,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/enoent.js"(exports2, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed, "spawn");
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module2.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/index.js"(exports2, module2) {
    "use strict";
    var cp = require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn(command, args, options) {
      const parsed = parse(command, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command, args, options) {
      const parsed = parse(command, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn;
    module2.exports.spawn = spawn;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// ../../node_modules/.pnpm/strip-final-newline@3.0.0/node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
  const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
  const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
  if (input[input.length - 1] === LF) {
    input = input.slice(0, -1);
  }
  if (input[input.length - 1] === CR) {
    input = input.slice(0, -1);
  }
  return input;
}
var init_strip_final_newline = __esm({
  "../../node_modules/.pnpm/strip-final-newline@3.0.0/node_modules/strip-final-newline/index.js"() {
  }
});

// ../../node_modules/.pnpm/path-key@4.0.0/node_modules/path-key/index.js
function pathKey(options = {}) {
  const {
    env = process.env,
    platform = process.platform
  } = options;
  if (platform !== "win32") {
    return "PATH";
  }
  return Object.keys(env).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}
var init_path_key = __esm({
  "../../node_modules/.pnpm/path-key@4.0.0/node_modules/path-key/index.js"() {
  }
});

// ../../node_modules/.pnpm/npm-run-path@5.1.0/node_modules/npm-run-path/index.js
function npmRunPath(options = {}) {
  const {
    cwd = import_node_process.default.cwd(),
    path: path_ = import_node_process.default.env[pathKey()],
    execPath = import_node_process.default.execPath
  } = options;
  let previous;
  const cwdString = cwd instanceof URL ? import_node_url.default.fileURLToPath(cwd) : cwd;
  let cwdPath = import_node_path.default.resolve(cwdString);
  const result = [];
  while (previous !== cwdPath) {
    result.push(import_node_path.default.join(cwdPath, "node_modules/.bin"));
    previous = cwdPath;
    cwdPath = import_node_path.default.resolve(cwdPath, "..");
  }
  result.push(import_node_path.default.resolve(cwdString, execPath, ".."));
  return [...result, path_].join(import_node_path.default.delimiter);
}
function npmRunPathEnv({ env = import_node_process.default.env, ...options } = {}) {
  env = { ...env };
  const path3 = pathKey({ env });
  options.path = env[path3];
  env[path3] = npmRunPath(options);
  return env;
}
var import_node_process, import_node_path, import_node_url;
var init_npm_run_path = __esm({
  "../../node_modules/.pnpm/npm-run-path@5.1.0/node_modules/npm-run-path/index.js"() {
    import_node_process = __toESM(require("node:process"), 1);
    import_node_path = __toESM(require("node:path"), 1);
    import_node_url = __toESM(require("node:url"), 1);
    init_path_key();
  }
});

// ../../node_modules/.pnpm/mimic-fn@4.0.0/node_modules/mimic-fn/index.js
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name);
  return to;
}
var copyProperty, canCopyProperty, changePrototype, wrappedToString, toStringDescriptor, toStringName, changeToString;
var init_mimic_fn = __esm({
  "../../node_modules/.pnpm/mimic-fn@4.0.0/node_modules/mimic-fn/index.js"() {
    copyProperty = (to, from, property, ignoreNonConfigurable) => {
      if (property === "length" || property === "prototype") {
        return;
      }
      if (property === "arguments" || property === "caller") {
        return;
      }
      const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
      const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
      if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
        return;
      }
      Object.defineProperty(to, property, fromDescriptor);
    };
    canCopyProperty = function(toDescriptor, fromDescriptor) {
      return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
    };
    changePrototype = (to, from) => {
      const fromPrototype = Object.getPrototypeOf(from);
      if (fromPrototype === Object.getPrototypeOf(to)) {
        return;
      }
      Object.setPrototypeOf(to, fromPrototype);
    };
    wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`;
    toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
    toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
    changeToString = (to, from, name) => {
      const withName = name === "" ? "" : `with ${name.trim()}() `;
      const newToString = wrappedToString.bind(null, withName, from.toString());
      Object.defineProperty(newToString, "name", toStringName);
      Object.defineProperty(to, "toString", { ...toStringDescriptor, value: newToString });
    };
  }
});

// ../../node_modules/.pnpm/onetime@6.0.0/node_modules/onetime/index.js
var calledFunctions, onetime, onetime_default;
var init_onetime = __esm({
  "../../node_modules/.pnpm/onetime@6.0.0/node_modules/onetime/index.js"() {
    init_mimic_fn();
    calledFunctions = /* @__PURE__ */ new WeakMap();
    onetime = (function_, options = {}) => {
      if (typeof function_ !== "function") {
        throw new TypeError("Expected a function");
      }
      let returnValue;
      let callCount = 0;
      const functionName = function_.displayName || function_.name || "<anonymous>";
      const onetime2 = function(...arguments_) {
        calledFunctions.set(onetime2, ++callCount);
        if (callCount === 1) {
          returnValue = function_.apply(this, arguments_);
          function_ = null;
        } else if (options.throw === true) {
          throw new Error(`Function \`${functionName}\` can only be called once`);
        }
        return returnValue;
      };
      mimicFunction(onetime2, function_);
      calledFunctions.set(onetime2, callCount);
      return onetime2;
    };
    onetime.callCount = (function_) => {
      if (!calledFunctions.has(function_)) {
        throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
      }
      return calledFunctions.get(function_);
    };
    onetime_default = onetime;
  }
});

// ../../node_modules/.pnpm/human-signals@3.0.1/node_modules/human-signals/build/src/realtime.js
var getRealtimeSignals, getRealtimeSignal, SIGRTMIN, SIGRTMAX;
var init_realtime = __esm({
  "../../node_modules/.pnpm/human-signals@3.0.1/node_modules/human-signals/build/src/realtime.js"() {
    getRealtimeSignals = function() {
      const length = SIGRTMAX - SIGRTMIN + 1;
      return Array.from({ length }, getRealtimeSignal);
    };
    getRealtimeSignal = function(value, index) {
      return {
        name: `SIGRT${index + 1}`,
        number: SIGRTMIN + index,
        action: "terminate",
        description: "Application-specific signal (realtime)",
        standard: "posix"
      };
    };
    SIGRTMIN = 34;
    SIGRTMAX = 64;
  }
});

// ../../node_modules/.pnpm/human-signals@3.0.1/node_modules/human-signals/build/src/core.js
var SIGNALS;
var init_core = __esm({
  "../../node_modules/.pnpm/human-signals@3.0.1/node_modules/human-signals/build/src/core.js"() {
    SIGNALS = [
      {
        name: "SIGHUP",
        number: 1,
        action: "terminate",
        description: "Terminal closed",
        standard: "posix"
      },
      {
        name: "SIGINT",
        number: 2,
        action: "terminate",
        description: "User interruption with CTRL-C",
        standard: "ansi"
      },
      {
        name: "SIGQUIT",
        number: 3,
        action: "core",
        description: "User interruption with CTRL-\\",
        standard: "posix"
      },
      {
        name: "SIGILL",
        number: 4,
        action: "core",
        description: "Invalid machine instruction",
        standard: "ansi"
      },
      {
        name: "SIGTRAP",
        number: 5,
        action: "core",
        description: "Debugger breakpoint",
        standard: "posix"
      },
      {
        name: "SIGABRT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "ansi"
      },
      {
        name: "SIGIOT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "bsd"
      },
      {
        name: "SIGBUS",
        number: 7,
        action: "core",
        description: "Bus error due to misaligned, non-existing address or paging error",
        standard: "bsd"
      },
      {
        name: "SIGEMT",
        number: 7,
        action: "terminate",
        description: "Command should be emulated but is not implemented",
        standard: "other"
      },
      {
        name: "SIGFPE",
        number: 8,
        action: "core",
        description: "Floating point arithmetic error",
        standard: "ansi"
      },
      {
        name: "SIGKILL",
        number: 9,
        action: "terminate",
        description: "Forced termination",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGUSR1",
        number: 10,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
      },
      {
        name: "SIGSEGV",
        number: 11,
        action: "core",
        description: "Segmentation fault",
        standard: "ansi"
      },
      {
        name: "SIGUSR2",
        number: 12,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
      },
      {
        name: "SIGPIPE",
        number: 13,
        action: "terminate",
        description: "Broken pipe or socket",
        standard: "posix"
      },
      {
        name: "SIGALRM",
        number: 14,
        action: "terminate",
        description: "Timeout or timer",
        standard: "posix"
      },
      {
        name: "SIGTERM",
        number: 15,
        action: "terminate",
        description: "Termination",
        standard: "ansi"
      },
      {
        name: "SIGSTKFLT",
        number: 16,
        action: "terminate",
        description: "Stack is empty or overflowed",
        standard: "other"
      },
      {
        name: "SIGCHLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "posix"
      },
      {
        name: "SIGCLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "other"
      },
      {
        name: "SIGCONT",
        number: 18,
        action: "unpause",
        description: "Unpaused",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGSTOP",
        number: 19,
        action: "pause",
        description: "Paused",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGTSTP",
        number: 20,
        action: "pause",
        description: 'Paused using CTRL-Z or "suspend"',
        standard: "posix"
      },
      {
        name: "SIGTTIN",
        number: 21,
        action: "pause",
        description: "Background process cannot read terminal input",
        standard: "posix"
      },
      {
        name: "SIGBREAK",
        number: 21,
        action: "terminate",
        description: "User interruption with CTRL-BREAK",
        standard: "other"
      },
      {
        name: "SIGTTOU",
        number: 22,
        action: "pause",
        description: "Background process cannot write to terminal output",
        standard: "posix"
      },
      {
        name: "SIGURG",
        number: 23,
        action: "ignore",
        description: "Socket received out-of-band data",
        standard: "bsd"
      },
      {
        name: "SIGXCPU",
        number: 24,
        action: "core",
        description: "Process timed out",
        standard: "bsd"
      },
      {
        name: "SIGXFSZ",
        number: 25,
        action: "core",
        description: "File too big",
        standard: "bsd"
      },
      {
        name: "SIGVTALRM",
        number: 26,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
      },
      {
        name: "SIGPROF",
        number: 27,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
      },
      {
        name: "SIGWINCH",
        number: 28,
        action: "ignore",
        description: "Terminal window size changed",
        standard: "bsd"
      },
      {
        name: "SIGIO",
        number: 29,
        action: "terminate",
        description: "I/O is available",
        standard: "other"
      },
      {
        name: "SIGPOLL",
        number: 29,
        action: "terminate",
        description: "Watched event",
        standard: "other"
      },
      {
        name: "SIGINFO",
        number: 29,
        action: "ignore",
        description: "Request for process information",
        standard: "other"
      },
      {
        name: "SIGPWR",
        number: 30,
        action: "terminate",
        description: "Device running out of power",
        standard: "systemv"
      },
      {
        name: "SIGSYS",
        number: 31,
        action: "core",
        description: "Invalid system call",
        standard: "other"
      },
      {
        name: "SIGUNUSED",
        number: 31,
        action: "terminate",
        description: "Invalid system call",
        standard: "other"
      }
    ];
  }
});

// ../../node_modules/.pnpm/human-signals@3.0.1/node_modules/human-signals/build/src/signals.js
var import_os, getSignals, normalizeSignal;
var init_signals = __esm({
  "../../node_modules/.pnpm/human-signals@3.0.1/node_modules/human-signals/build/src/signals.js"() {
    import_os = require("os");
    init_core();
    init_realtime();
    getSignals = function() {
      const realtimeSignals = getRealtimeSignals();
      const signals = [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
      return signals;
    };
    normalizeSignal = function({
      name,
      number: defaultNumber,
      description,
      action,
      forced = false,
      standard
    }) {
      const {
        signals: { [name]: constantSignal }
      } = import_os.constants;
      const supported = constantSignal !== void 0;
      const number = supported ? constantSignal : defaultNumber;
      return { name, number, description, supported, action, forced, standard };
    };
  }
});

// ../../node_modules/.pnpm/human-signals@3.0.1/node_modules/human-signals/build/src/main.js
var import_os2, getSignalsByName, getSignalByName, signalsByName, getSignalsByNumber, getSignalByNumber, findSignalByNumber, signalsByNumber;
var init_main = __esm({
  "../../node_modules/.pnpm/human-signals@3.0.1/node_modules/human-signals/build/src/main.js"() {
    import_os2 = require("os");
    init_realtime();
    init_signals();
    getSignalsByName = function() {
      const signals = getSignals();
      return signals.reduce(getSignalByName, {});
    };
    getSignalByName = function(signalByNameMemo, { name, number, description, supported, action, forced, standard }) {
      return {
        ...signalByNameMemo,
        [name]: { name, number, description, supported, action, forced, standard }
      };
    };
    signalsByName = getSignalsByName();
    getSignalsByNumber = function() {
      const signals = getSignals();
      const length = SIGRTMAX + 1;
      const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals));
      return Object.assign({}, ...signalsA);
    };
    getSignalByNumber = function(number, signals) {
      const signal = findSignalByNumber(number, signals);
      if (signal === void 0) {
        return {};
      }
      const { name, description, supported, action, forced, standard } = signal;
      return {
        [number]: {
          name,
          number,
          description,
          supported,
          action,
          forced,
          standard
        }
      };
    };
    findSignalByNumber = function(number, signals) {
      const signal = signals.find(({ name }) => import_os2.constants.signals[name] === number);
      if (signal !== void 0) {
        return signal;
      }
      return signals.find((signalA) => signalA.number === number);
    };
    signalsByNumber = getSignalsByNumber();
  }
});

// ../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/error.js
var getErrorPrefix, makeError;
var init_error = __esm({
  "../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/error.js"() {
    init_main();
    getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
      if (timedOut) {
        return `timed out after ${timeout} milliseconds`;
      }
      if (isCanceled) {
        return "was canceled";
      }
      if (errorCode !== void 0) {
        return `failed with ${errorCode}`;
      }
      if (signal !== void 0) {
        return `was killed with ${signal} (${signalDescription})`;
      }
      if (exitCode !== void 0) {
        return `failed with exit code ${exitCode}`;
      }
      return "failed";
    };
    makeError = ({
      stdout,
      stderr,
      all,
      error,
      signal,
      exitCode,
      command,
      escapedCommand,
      timedOut,
      isCanceled,
      killed,
      parsed: { options: { timeout } }
    }) => {
      exitCode = exitCode === null ? void 0 : exitCode;
      signal = signal === null ? void 0 : signal;
      const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
      const errorCode = error && error.code;
      const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
      const execaMessage = `Command ${prefix}: ${command}`;
      const isError = Object.prototype.toString.call(error) === "[object Error]";
      const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
      const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
      if (isError) {
        error.originalMessage = error.message;
        error.message = message;
      } else {
        error = new Error(message);
      }
      error.shortMessage = shortMessage;
      error.command = command;
      error.escapedCommand = escapedCommand;
      error.exitCode = exitCode;
      error.signal = signal;
      error.signalDescription = signalDescription;
      error.stdout = stdout;
      error.stderr = stderr;
      if (all !== void 0) {
        error.all = all;
      }
      if ("bufferedData" in error) {
        delete error.bufferedData;
      }
      error.failed = true;
      error.timedOut = Boolean(timedOut);
      error.isCanceled = isCanceled;
      error.killed = killed && !timedOut;
      return error;
    };
  }
});

// ../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/stdio.js
var aliases, hasAlias, normalizeStdio, normalizeStdioNode;
var init_stdio = __esm({
  "../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/stdio.js"() {
    aliases = ["stdin", "stdout", "stderr"];
    hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
    normalizeStdio = (options) => {
      if (!options) {
        return;
      }
      const { stdio } = options;
      if (stdio === void 0) {
        return aliases.map((alias) => options[alias]);
      }
      if (hasAlias(options)) {
        throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
      }
      if (typeof stdio === "string") {
        return stdio;
      }
      if (!Array.isArray(stdio)) {
        throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
      }
      const length = Math.max(stdio.length, aliases.length);
      return Array.from({ length }, (value, index) => stdio[index]);
    };
    normalizeStdioNode = (options) => {
      const stdio = normalizeStdio(options);
      if (stdio === "ipc") {
        return "ipc";
      }
      if (stdio === void 0 || typeof stdio === "string") {
        return [stdio, stdio, stdio, "ipc"];
      }
      if (stdio.includes("ipc")) {
        return stdio;
      }
      return [...stdio, "ipc"];
    };
  }
});

// ../../node_modules/.pnpm/signal-exit@3.0.7/node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "../../node_modules/.pnpm/signal-exit@3.0.7/node_modules/signal-exit/signals.js"(exports2, module2) {
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
      );
    }
    if (process.platform === "linux") {
      module2.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// ../../node_modules/.pnpm/signal-exit@3.0.7/node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "../../node_modules/.pnpm/signal-exit@3.0.7/node_modules/signal-exit/index.js"(exports2, module2) {
    var process4 = global.process;
    var processOk = function(process5) {
      return process5 && typeof process5 === "object" && typeof process5.removeListener === "function" && typeof process5.emit === "function" && typeof process5.reallyExit === "function" && typeof process5.listeners === "function" && typeof process5.kill === "function" && typeof process5.pid === "number" && typeof process5.on === "function";
    };
    if (!processOk(process4)) {
      module2.exports = function() {
        return function() {
        };
      };
    } else {
      assert = require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process4.platform);
      EE = require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process4.__signal_exit_emitter__) {
        emitter = process4.__signal_exit_emitter__;
      } else {
        emitter = process4.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module2.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process4.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process4.emit = originalProcessEmit;
        process4.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module2.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process4.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process4.kill(process4.pid, sig);
          }
        };
      });
      module2.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process4.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process4.emit = processEmit;
        process4.reallyExit = processReallyExit;
      };
      module2.exports.load = load;
      originalProcessReallyExit = process4.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process4.exitCode = code || 0;
        emit("exit", process4.exitCode, null);
        emit("afterexit", process4.exitCode, null);
        originalProcessReallyExit.call(process4, process4.exitCode);
      };
      originalProcessEmit = process4.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process4.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process4.exitCode, null);
          emit("afterexit", process4.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// ../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/kill.js
var import_node_os, import_signal_exit, DEFAULT_FORCE_KILL_TIMEOUT, spawnedKill, setKillTimeout, shouldForceKill, isSigterm, getForceKillAfterTimeout, spawnedCancel, timeoutKill, setupTimeout, validateTimeout, setExitHandler;
var init_kill = __esm({
  "../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/kill.js"() {
    import_node_os = __toESM(require("node:os"), 1);
    import_signal_exit = __toESM(require_signal_exit(), 1);
    DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
    spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
      const killResult = kill(signal);
      setKillTimeout(kill, signal, options, killResult);
      return killResult;
    };
    setKillTimeout = (kill, signal, options, killResult) => {
      if (!shouldForceKill(signal, options, killResult)) {
        return;
      }
      const timeout = getForceKillAfterTimeout(options);
      const t = setTimeout(() => {
        kill("SIGKILL");
      }, timeout);
      if (t.unref) {
        t.unref();
      }
    };
    shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
    isSigterm = (signal) => signal === import_node_os.default.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
    getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
      if (forceKillAfterTimeout === true) {
        return DEFAULT_FORCE_KILL_TIMEOUT;
      }
      if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
        throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
      }
      return forceKillAfterTimeout;
    };
    spawnedCancel = (spawned, context) => {
      const killResult = spawned.kill();
      if (killResult) {
        context.isCanceled = true;
      }
    };
    timeoutKill = (spawned, signal, reject) => {
      spawned.kill(signal);
      reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
    };
    setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
      if (timeout === 0 || timeout === void 0) {
        return spawnedPromise;
      }
      let timeoutId;
      const timeoutPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
          timeoutKill(spawned, killSignal, reject);
        }, timeout);
      });
      const safeSpawnedPromise = spawnedPromise.finally(() => {
        clearTimeout(timeoutId);
      });
      return Promise.race([timeoutPromise, safeSpawnedPromise]);
    };
    validateTimeout = ({ timeout }) => {
      if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
        throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
      }
    };
    setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
      if (!cleanup || detached) {
        return timedPromise;
      }
      const removeExitHandler = (0, import_signal_exit.default)(() => {
        spawned.kill();
      });
      return timedPromise.finally(() => {
        removeExitHandler();
      });
    };
  }
});

// ../../node_modules/.pnpm/is-stream@3.0.0/node_modules/is-stream/index.js
function isStream(stream) {
  return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
}
var init_is_stream = __esm({
  "../../node_modules/.pnpm/is-stream@3.0.0/node_modules/is-stream/index.js"() {
  }
});

// ../../node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "../../node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/buffer-stream.js"(exports2, module2) {
    "use strict";
    var { PassThrough: PassThroughStream } = require("stream");
    module2.exports = (options) => {
      options = { ...options };
      const { array } = options;
      let { encoding } = options;
      const isBuffer = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || isBuffer);
      } else {
        encoding = encoding || "utf8";
      }
      if (isBuffer) {
        encoding = null;
      }
      const stream = new PassThroughStream({ objectMode });
      if (encoding) {
        stream.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream.on("data", (chunk) => {
        chunks.push(chunk);
        if (objectMode) {
          length = chunks.length;
        } else {
          length += chunk.length;
        }
      });
      stream.getBufferedValue = () => {
        if (array) {
          return chunks;
        }
        return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream.getBufferedLength = () => length;
      return stream;
    };
  }
});

// ../../node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "../../node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/index.js"(exports2, module2) {
    "use strict";
    var { constants: BufferConstants } = require("buffer");
    var stream = require("stream");
    var { promisify } = require("util");
    var bufferStream = require_buffer_stream();
    var streamPipelinePromisified = promisify(stream.pipeline);
    var MaxBufferError = class extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    async function getStream2(inputStream, options) {
      if (!inputStream) {
        throw new Error("Expected a stream");
      }
      options = {
        maxBuffer: Infinity,
        ...options
      };
      const { maxBuffer } = options;
      const stream2 = bufferStream(options);
      await new Promise((resolve, reject) => {
        const rejectPromise = (error) => {
          if (error && stream2.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
            error.bufferedData = stream2.getBufferedValue();
          }
          reject(error);
        };
        (async () => {
          try {
            await streamPipelinePromisified(inputStream, stream2);
            resolve();
          } catch (error) {
            rejectPromise(error);
          }
        })();
        stream2.on("data", () => {
          if (stream2.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream2.getBufferedValue();
    }
    module2.exports = getStream2;
    module2.exports.buffer = (stream2, options) => getStream2(stream2, { ...options, encoding: "buffer" });
    module2.exports.array = (stream2, options) => getStream2(stream2, { ...options, array: true });
    module2.exports.MaxBufferError = MaxBufferError;
  }
});

// ../../node_modules/.pnpm/merge-stream@2.0.0/node_modules/merge-stream/index.js
var require_merge_stream = __commonJS({
  "../../node_modules/.pnpm/merge-stream@2.0.0/node_modules/merge-stream/index.js"(exports2, module2) {
    "use strict";
    var { PassThrough } = require("stream");
    module2.exports = function() {
      var sources = [];
      var output = new PassThrough({ objectMode: true });
      output.setMaxListeners(0);
      output.add = add;
      output.isEmpty = isEmpty;
      output.on("unpipe", remove);
      Array.prototype.slice.call(arguments).forEach(add);
      return output;
      function add(source) {
        if (Array.isArray(source)) {
          source.forEach(add);
          return this;
        }
        sources.push(source);
        source.once("end", remove.bind(null, source));
        source.once("error", output.emit.bind(output, "error"));
        source.pipe(output, { end: false });
        return this;
      }
      function isEmpty() {
        return sources.length == 0;
      }
      function remove(source) {
        sources = sources.filter(function(it) {
          return it !== source;
        });
        if (!sources.length && output.readable) {
          output.end();
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/stream.js
var import_get_stream, import_merge_stream, handleInput, makeAllStream, getBufferedData, getStreamPromise, getSpawnedResult, validateInputSync;
var init_stream = __esm({
  "../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/stream.js"() {
    init_is_stream();
    import_get_stream = __toESM(require_get_stream(), 1);
    import_merge_stream = __toESM(require_merge_stream(), 1);
    handleInput = (spawned, input) => {
      if (input === void 0 || spawned.stdin === void 0) {
        return;
      }
      if (isStream(input)) {
        input.pipe(spawned.stdin);
      } else {
        spawned.stdin.end(input);
      }
    };
    makeAllStream = (spawned, { all }) => {
      if (!all || !spawned.stdout && !spawned.stderr) {
        return;
      }
      const mixed = (0, import_merge_stream.default)();
      if (spawned.stdout) {
        mixed.add(spawned.stdout);
      }
      if (spawned.stderr) {
        mixed.add(spawned.stderr);
      }
      return mixed;
    };
    getBufferedData = async (stream, streamPromise) => {
      if (!stream) {
        return;
      }
      stream.destroy();
      try {
        return await streamPromise;
      } catch (error) {
        return error.bufferedData;
      }
    };
    getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
      if (!stream || !buffer) {
        return;
      }
      if (encoding) {
        return (0, import_get_stream.default)(stream, { encoding, maxBuffer });
      }
      return import_get_stream.default.buffer(stream, { maxBuffer });
    };
    getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
      const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
      const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
      const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
      try {
        return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
      } catch (error) {
        return Promise.all([
          { error, signal: error.signal, timedOut: error.timedOut },
          getBufferedData(stdout, stdoutPromise),
          getBufferedData(stderr, stderrPromise),
          getBufferedData(all, allPromise)
        ]);
      }
    };
    validateInputSync = ({ input }) => {
      if (isStream(input)) {
        throw new TypeError("The `input` option cannot be a stream in sync mode");
      }
    };
  }
});

// ../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/promise.js
var nativePromisePrototype, descriptors, mergePromise, getSpawnedPromise;
var init_promise = __esm({
  "../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/promise.js"() {
    nativePromisePrototype = (async () => {
    })().constructor.prototype;
    descriptors = ["then", "catch", "finally"].map((property) => [
      property,
      Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
    ]);
    mergePromise = (spawned, promise) => {
      for (const [property, descriptor] of descriptors) {
        const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
        Reflect.defineProperty(spawned, property, { ...descriptor, value });
      }
      return spawned;
    };
    getSpawnedPromise = (spawned) => new Promise((resolve, reject) => {
      spawned.on("exit", (exitCode, signal) => {
        resolve({ exitCode, signal });
      });
      spawned.on("error", (error) => {
        reject(error);
      });
      if (spawned.stdin) {
        spawned.stdin.on("error", (error) => {
          reject(error);
        });
      }
    });
  }
});

// ../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/command.js
var normalizeArgs, NO_ESCAPE_REGEXP, DOUBLE_QUOTES_REGEXP, escapeArg, joinCommand, getEscapedCommand, SPACES_REGEXP, parseCommand;
var init_command = __esm({
  "../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/lib/command.js"() {
    normalizeArgs = (file, args = []) => {
      if (!Array.isArray(args)) {
        return [file];
      }
      return [file, ...args];
    };
    NO_ESCAPE_REGEXP = /^[\w.-]+$/;
    DOUBLE_QUOTES_REGEXP = /"/g;
    escapeArg = (arg) => {
      if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
        return arg;
      }
      return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
    };
    joinCommand = (file, args) => normalizeArgs(file, args).join(" ");
    getEscapedCommand = (file, args) => normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");
    SPACES_REGEXP = / +/g;
    parseCommand = (command) => {
      const tokens = [];
      for (const token of command.trim().split(SPACES_REGEXP)) {
        const previousToken = tokens[tokens.length - 1];
        if (previousToken && previousToken.endsWith("\\")) {
          tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
        } else {
          tokens.push(token);
        }
      }
      return tokens;
    };
  }
});

// ../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/index.js
var execa_exports = {};
__export(execa_exports, {
  execa: () => execa,
  execaCommand: () => execaCommand,
  execaCommandSync: () => execaCommandSync,
  execaNode: () => execaNode,
  execaSync: () => execaSync
});
function execa(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  validateTimeout(parsed.options);
  let spawned;
  try {
    spawned = import_node_child_process.default.spawn(parsed.file, parsed.args, parsed.options);
  } catch (error) {
    const dummySpawned = new import_node_child_process.default.ChildProcess();
    const errorPromise = Promise.reject(makeError({
      error,
      stdout: "",
      stderr: "",
      all: "",
      command,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    }));
    return mergePromise(dummySpawned, errorPromise);
  }
  const spawnedPromise = getSpawnedPromise(spawned);
  const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
  const processDone = setExitHandler(spawned, parsed.options, timedPromise);
  const context = { isCanceled: false };
  spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
  spawned.cancel = spawnedCancel.bind(null, spawned, context);
  const handlePromise = async () => {
    const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
    const stdout = handleOutput(parsed.options, stdoutResult);
    const stderr = handleOutput(parsed.options, stderrResult);
    const all = handleOutput(parsed.options, allResult);
    if (error || exitCode !== 0 || signal !== null) {
      const returnedError = makeError({
        error,
        exitCode,
        signal,
        stdout,
        stderr,
        all,
        command,
        escapedCommand,
        parsed,
        timedOut,
        isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
        killed: spawned.killed
      });
      if (!parsed.options.reject) {
        return returnedError;
      }
      throw returnedError;
    }
    return {
      command,
      escapedCommand,
      exitCode: 0,
      stdout,
      stderr,
      all,
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false
    };
  };
  const handlePromiseOnce = onetime_default(handlePromise);
  handleInput(spawned, parsed.options.input);
  spawned.all = makeAllStream(spawned, parsed.options);
  return mergePromise(spawned, handlePromiseOnce);
}
function execaSync(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  validateInputSync(parsed.options);
  let result;
  try {
    result = import_node_child_process.default.spawnSync(parsed.file, parsed.args, parsed.options);
  } catch (error) {
    throw makeError({
      error,
      stdout: "",
      stderr: "",
      all: "",
      command,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    });
  }
  const stdout = handleOutput(parsed.options, result.stdout, result.error);
  const stderr = handleOutput(parsed.options, result.stderr, result.error);
  if (result.error || result.status !== 0 || result.signal !== null) {
    const error = makeError({
      stdout,
      stderr,
      error: result.error,
      signal: result.signal,
      exitCode: result.status,
      command,
      escapedCommand,
      parsed,
      timedOut: result.error && result.error.code === "ETIMEDOUT",
      isCanceled: false,
      killed: result.signal !== null
    });
    if (!parsed.options.reject) {
      return error;
    }
    throw error;
  }
  return {
    command,
    escapedCommand,
    exitCode: 0,
    stdout,
    stderr,
    failed: false,
    timedOut: false,
    isCanceled: false,
    killed: false
  };
}
function execaCommand(command, options) {
  const [file, ...args] = parseCommand(command);
  return execa(file, args, options);
}
function execaCommandSync(command, options) {
  const [file, ...args] = parseCommand(command);
  return execaSync(file, args, options);
}
function execaNode(scriptPath, args, options = {}) {
  if (args && !Array.isArray(args) && typeof args === "object") {
    options = args;
    args = [];
  }
  const stdio = normalizeStdioNode(options);
  const defaultExecArgv = import_node_process2.default.execArgv.filter((arg) => !arg.startsWith("--inspect"));
  const {
    nodePath = import_node_process2.default.execPath,
    nodeOptions = defaultExecArgv
  } = options;
  return execa(
    nodePath,
    [
      ...nodeOptions,
      scriptPath,
      ...Array.isArray(args) ? args : []
    ],
    {
      ...options,
      stdin: void 0,
      stdout: void 0,
      stderr: void 0,
      stdio,
      shell: false
    }
  );
}
var import_node_buffer, import_node_path2, import_node_child_process, import_node_process2, import_cross_spawn, DEFAULT_MAX_BUFFER, getEnv, handleArguments, handleOutput;
var init_execa = __esm({
  "../../node_modules/.pnpm/execa@6.1.0/node_modules/execa/index.js"() {
    import_node_buffer = require("node:buffer");
    import_node_path2 = __toESM(require("node:path"), 1);
    import_node_child_process = __toESM(require("node:child_process"), 1);
    import_node_process2 = __toESM(require("node:process"), 1);
    import_cross_spawn = __toESM(require_cross_spawn(), 1);
    init_strip_final_newline();
    init_npm_run_path();
    init_onetime();
    init_error();
    init_stdio();
    init_kill();
    init_stream();
    init_promise();
    init_command();
    DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
    getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
      const env = extendEnv ? { ...import_node_process2.default.env, ...envOption } : envOption;
      if (preferLocal) {
        return npmRunPathEnv({ env, cwd: localDir, execPath });
      }
      return env;
    };
    handleArguments = (file, args, options = {}) => {
      const parsed = import_cross_spawn.default._parse(file, args, options);
      file = parsed.command;
      args = parsed.args;
      options = parsed.options;
      options = {
        maxBuffer: DEFAULT_MAX_BUFFER,
        buffer: true,
        stripFinalNewline: true,
        extendEnv: true,
        preferLocal: false,
        localDir: options.cwd || import_node_process2.default.cwd(),
        execPath: import_node_process2.default.execPath,
        encoding: "utf8",
        reject: true,
        cleanup: true,
        all: false,
        windowsHide: true,
        ...options
      };
      options.env = getEnv(options);
      options.stdio = normalizeStdio(options);
      if (import_node_process2.default.platform === "win32" && import_node_path2.default.basename(file, ".exe") === "cmd") {
        args.unshift("/q");
      }
      return { file, args, options, parsed };
    };
    handleOutput = (options, value, error) => {
      if (typeof value !== "string" && !import_node_buffer.Buffer.isBuffer(value)) {
        return error === void 0 ? void 0 : "";
      }
      if (options.stripFinalNewline) {
        return stripFinalNewline(value);
      }
      return value;
    };
  }
});

// out/project.js
var require_project = __commonJS({
  "out/project.js"(exports2) {
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProjectProvider = void 0;
    var path3 = require("path");
    var os2 = require("os");
    var vscode_12 = require("vscode");
    var util_1 = require_util();
    var fs = require("fs");
    var execa_1 = (init_execa(), __toCommonJS(execa_exports));
    var ProjectProvider = class {
      constructor(context, init2) {
        this.projectCommandId = "meteor.newProject";
        this.viewType = "meteorProject";
        this._disposables = [];
        this.projectDir = "";
        this.context = context;
        this.init = init2;
      }
      showInStatusBar() {
        const newProjectStatus = vscode_12.window.createStatusBarItem(vscode_12.StatusBarAlignment.Right, -99999);
        newProjectStatus.command = this.projectCommandId;
        newProjectStatus.text = "$(diff-insert) \u65B0\u5DE5\u7A0B";
        newProjectStatus.tooltip = "\u521B\u5EFA\u5DE5\u7A0B";
        newProjectStatus.show();
        this.context.subscriptions.push(newProjectStatus);
        const packageStatus = vscode_12.window.createStatusBarItem(vscode_12.StatusBarAlignment.Right, -99998);
        packageStatus.command = "meteor.packageRun";
        packageStatus.text = "$(debug-start) \u6253\u5305";
        packageStatus.tooltip = "Jenkins\u6253\u5305";
        packageStatus.show();
        this.context.subscriptions.push(packageStatus);
        const packageVersionStatus = vscode_12.window.createStatusBarItem(vscode_12.StatusBarAlignment.Right, -99997);
        packageVersionStatus.command = "meteor.packageVersion";
        packageVersionStatus.text = "$(explorer-view-icon) \u5305\u53F7";
        packageVersionStatus.tooltip = "\u83B7\u53D6Jenkins\u5305\u53F7";
        packageVersionStatus.show();
        this.context.subscriptions.push(packageVersionStatus);
        const deployStatus = vscode_12.window.createStatusBarItem(vscode_12.StatusBarAlignment.Right, -99996);
        deployStatus.command = "meteor.deployRun";
        deployStatus.text = "$(debug-start) \u90E8\u7F72";
        deployStatus.tooltip = "\u5BB9\u5668\u4E91\u90E8\u7F72";
        deployStatus.show();
        this.context.subscriptions.push(deployStatus);
        const deployWebVisit = vscode_12.window.createStatusBarItem(vscode_12.StatusBarAlignment.Right, -99995);
        deployWebVisit.command = "meteor.deployWebVisit";
        deployWebVisit.text = "$(eye) Web\u8BBF\u95EE";
        deployWebVisit.tooltip = "\u5BB9\u5668\u4E91Web\u8BBF\u95EE";
        deployWebVisit.show();
        this.context.subscriptions.push(deployWebVisit);
      }
      registerCommand() {
        const newProjectCmd = vscode_12.commands.registerCommand("meteor.newProject", () => {
          this.openView();
        });
        const openProjectCmd = vscode_12.commands.registerCommand("meteor.openProject", () => {
          let projectDir = this.projectDir;
          if (os2.platform().includes("win")) {
            projectDir = "/" + projectDir.replace(/\\/gi, "/");
          }
          vscode_12.commands.executeCommand("vscode.openFolder", vscode_12.Uri.parse(projectDir), false).then(() => {
            if (vscode_12.workspace.workspaceFolders) {
              this.init(this.context);
            }
          }, () => vscode_12.window.showInformationMessage("\u6253\u5F00\u5DE5\u7A0B\u5931\u8D25\uFF01"));
        });
        this.context.subscriptions.push(newProjectCmd);
        this.context.subscriptions.push(openProjectCmd);
      }
      openView() {
        const viewColumn = vscode_12.window.activeTextEditor ? vscode_12.window.activeTextEditor.viewColumn : void 0;
        if (this.activeView) {
          return this.activeView.reveal(viewColumn);
        }
        this.activeView = vscode_12.window.createWebviewPanel(this.viewType, "\u521B\u5EFA\u65B0\u5DE5\u7A0B", viewColumn || vscode_12.ViewColumn.One, {
          enableScripts: true,
          localResourceRoots: [vscode_12.Uri.file(path3.join(this.context.extensionPath, "media"))]
        });
        this.activeView.onDidDispose(() => {
          this.dispose();
        }, null, this._disposables);
        this.activeView.onDidChangeViewState(() => {
          var _a;
          if ((_a = this.activeView) === null || _a === void 0 ? void 0 : _a.visible) {
          }
        }, null, this._disposables);
        this.activeView.webview.onDidReceiveMessage((message) => {
          switch (message.command) {
            case "create":
              this.create(message);
              return;
            case "selBaseDir":
              this.selBaseDir();
              return;
          }
        }, null, this._disposables);
        this.loadHtml();
      }
      create(message) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
          function deleteAllInFold(path4) {
            var files = [];
            if (fs.existsSync(path4)) {
              files = fs.readdirSync(path4);
              files.forEach(function(file) {
                var curPath = path4 + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                  deleteAllInFold(curPath);
                } else {
                  fs.unlinkSync(curPath);
                }
              });
              fs.rmdirSync(path4);
            }
          }
          if (!message.baseDir) {
            (_a = this.activeView) === null || _a === void 0 ? void 0 : _a.webview.postMessage({ command: "done" });
            return vscode_12.window.showWarningMessage("\u8BF7\u9009\u62E9\u9879\u76EE\u76EE\u5F55\uFF01");
          }
          if (!message.projectName) {
            (_b = this.activeView) === null || _b === void 0 ? void 0 : _b.webview.postMessage({ command: "done" });
            return vscode_12.window.showWarningMessage("\u8BF7\u8F93\u5165\u5DE5\u7A0B\u540D\u79F0\uFF01");
          }
          if (!message.url) {
            (_c = this.activeView) === null || _c === void 0 ? void 0 : _c.webview.postMessage({ command: "done" });
            return vscode_12.window.showWarningMessage("\u8BF7\u8F93\u5165\u6A21\u677F\u5730\u5740\uFF01");
          }
          if (!message.hub) {
            (_d = this.activeView) === null || _d === void 0 ? void 0 : _d.webview.postMessage({ command: "done" });
            return vscode_12.window.showWarningMessage("\u8BF7\u8F93\u5165\u4ED3\u5E93\u5730\u5740\uFF01");
          }
          let dir = path3.join(message.baseDir, message.projectName);
          let hasHub = false;
          try {
            yield (0, execa_1.execa)("git", ["ls-remote", message.hub]);
            hasHub = true;
          } catch (error) {
          }
          if (hasHub) {
            (_e = this.activeView) === null || _e === void 0 ? void 0 : _e.webview.postMessage({ command: "done" });
            return vscode_12.window.showWarningMessage("\u4ED3\u5E93\u5730\u5740\u5DF2\u5B58\u5728");
          }
          try {
            if (/^http/gi.test(message.url) && message.account) {
              let url2 = message.url.split("//");
              message.url = `${url2[0]}//${message.account.name}:${message.account.password}@${url2[1]}`;
            }
            yield (0, execa_1.execa)("git", ["clone", message.url, dir]);
            if (os2.platform().includes("win")) {
              deleteAllInFold(path3.join(dir, ".git"));
            } else {
              yield (0, execa_1.execa)("rm", ["-rf", path3.join(dir, ".git")]);
            }
            yield (0, execa_1.execa)("git", ["init"], { cwd: dir });
            yield (0, execa_1.execa)("git", ["add", "."], { cwd: dir });
            yield (0, execa_1.execa)("git", ["commit", "-m", "init"], { cwd: dir });
            yield (0, execa_1.execa)("git", ["remote", "add", "origin", message.hub], { cwd: dir });
            yield (0, execa_1.execa)("git", ["push", "-u", "origin", "master"], { cwd: dir });
            yield (0, execa_1.execa)("git", ["checkout", "-q", "-b", "develop", "--no-track", "HEAD"], { cwd: dir });
            yield (0, execa_1.execa)("git", ["push", "-u", "origin", "develop"], { cwd: dir });
            (_f = this.activeView) === null || _f === void 0 ? void 0 : _f.webview.postMessage({ command: "done" });
            this.projectDir = dir;
            vscode_12.window.showInformationMessage("\u606D\u559C\uFF0C\u5DE5\u7A0B\u521D\u59CB\u5316\u6210\u529F\uFF01 [\u6253\u5F00\u5DE5\u7A0B](command:meteor.openProject)");
          } catch (error) {
            if (error.message.includes("mkdir")) {
              vscode_12.window.showErrorMessage("\u521B\u5EFA\u5DE5\u7A0B\u76EE\u5F55" + dir + "\u5931\u8D25\uFF01");
            } else if (error.message.includes("git clone")) {
              if (error.message.includes("could not read Username") || error.message.includes("Authentication failed")) {
                if (/^http/gi.test(message.url)) {
                  (_g = this.activeView) === null || _g === void 0 ? void 0 : _g.webview.postMessage({ command: "account" });
                } else {
                  vscode_12.window.showErrorMessage("\u6682\u672A\u63D0\u4F9Bssh\u8D26\u53F7\u767B\u5F55\u529F\u80FD\uFF01\n\u8BF7\u4F7F\u7528http\u8BF7\u6C42");
                }
              } else {
                vscode_12.window.showErrorMessage("\u62F7\u8D1D\u6A21\u677F\u5DE5\u7A0B\u5931\u8D25\uFF01\n \u8BF7\u5728\u672C\u5730\u547D\u4EE4\u884C\u6267\u884C git clone " + message.url + " \u67E5\u770B\u539F\u56E0");
              }
            } else if (error.message.includes("correct access rights")) {
              vscode_12.window.showErrorMessage("\u8BF7\u68C0\u67E5\u7EC4\u540D\u662F\u5426\u6B63\u786E\u6216\u662F\u5426\u62E5\u6709\u6743\u9650\uFF01");
            }
            (_h = this.activeView) === null || _h === void 0 ? void 0 : _h.webview.postMessage({ command: "done" });
          }
        });
      }
      selBaseDir() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
          let rootPath = util_1.store.get("rootPath");
          if (os2.platform().includes("win")) {
            rootPath = "/" + rootPath;
          }
          const options = {
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            openLabel: "Open"
          };
          if (rootPath) {
            options.defaultUri = vscode_12.Uri.parse(rootPath);
          }
          const folderUri = yield vscode_12.window.showOpenDialog(options);
          if (folderUri && Array.isArray(folderUri)) {
            let basePath = folderUri[0].path;
            if (os2.platform().includes("win")) {
              basePath = basePath.substr(1, basePath.length);
            }
            util_1.store.set("rootPath", basePath);
            (_a = this.activeView) === null || _a === void 0 ? void 0 : _a.webview.postMessage({ command: "path", path: basePath });
          }
        });
      }
      dispose() {
        var _a;
        (_a = this.activeView) === null || _a === void 0 ? void 0 : _a.dispose();
        while (this._disposables.length) {
          const x = this._disposables.pop();
          if (x) {
            x.dispose();
          }
        }
        this.activeView = void 0;
      }
      loadHtml() {
        if (this.activeView) {
          this.activeView.title = "\u521B\u5EFA\u65B0\u5DE5\u7A0B";
          this.activeView.webview.html = (0, util_1.getHtmlForWebview)(this.activeView.webview, this.context.extensionPath, "/createProject", "\u521B\u5EFA\u65B0\u5DE5\u7A0B");
        }
      }
    };
    exports2.ProjectProvider = ProjectProvider;
  }
});

// out/client.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
var vscode_1 = require("vscode");
var project_1 = require_project();
function activate(context) {
  console.log("activate");
  const project = new project_1.ProjectProvider(context, init);
  project.showInStatusBar();
  project.registerCommand();
  if (vscode_1.workspace.workspaceFolders) {
    console.log("init");
    init();
  }
}
exports.activate = activate;
function init() {
}
