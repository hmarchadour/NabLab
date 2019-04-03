import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  createConnection
} from "monaco-languageclient";

import { install, create, get } from "./CustomMonacoService";

import { listen, MessageConnection } from "vscode-ws-jsonrpc";
import { FEATURE, LANGUAGE_ID, HOST, PORT } from "./const";
import { Resource } from "../dto/Resource";
const monaco = require("monaco-editor-core");
const normalizeUrl = require("normalize-url");
const ReconnectingWebSocket = require("reconnecting-websocket");

monaco.languages.register({
  id: LANGUAGE_ID,
  extensions: ["." + LANGUAGE_ID],
  aliases: [LANGUAGE_ID.toUpperCase(), LANGUAGE_ID],
  mimetypes: ["text/" + LANGUAGE_ID]
});
monaco.languages.setMonarchTokensProvider("nabla", {
  // Set defaultToken to invalid to see what you do not tokenize yet
  // defaultToken: 'invalid',

  keywords: [
    "\u2115",
    "\u211D",
    "\u211D\u00B2",
    "\u211D\u00B2\u02E3\u00B2",
    "\u211D\u00B3",
    "\u211D\u00B3\u02E3\u00B3",
    "\u213E",
    "\u2192",
    "\u2200",
    "\u2205",
    "\u2208",
    "\u25BA",
    "\u25C4",
    "cell",
    "connectivities",
    "const",
    "else",
    "face",
    "false",
    "functions",
    "if",
    "module",
    "node",
    "true",
    "with"
  ],

  typeKeywords: [
    "boolean",
    "double",
    "byte",
    "int",
    "short",
    "char",
    "void",
    "long",
    "float"
  ],

  operators: [
    "=",
    ">",
    "<",
    "!",
    "~",
    "?",
    ":",
    "==",
    "<=",
    ">=",
    "!=",
    "&&",
    "||",
    "++",
    "--",
    "+",
    "-",
    "*",
    "/",
    "&",
    "|",
    "^",
    "%",
    "<<",
    ">>",
    ">>>",
    "+=",
    "-=",
    "*=",
    "/=",
    "&=",
    "|=",
    "^=",
    "%=",
    "<<=",
    ">>=",
    ">>>="
  ],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [
        /[a-zA-Z\u0394-\u03F2\u220F-\u221C_][a-zA-Z\u0394-\u03F20-9\u2211_]*/,
        {
          cases: {
            "@typeKeywords": "keyword",
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ],
      [/[A-Z][\w\$]*/, "type.identifier"], // to show class names nicely

      // whitespace
      { include: "@whitespace" },

      // delimiters and operators
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "operator",
            "@default": ""
          }
        }
      ],

      // @ annotations.
      // As an example, we emit a debugging log message on these tokens.
      // Note: message are supressed during the first load -- change some lines to see them.
      [
        /@\s*[a-zA-Z_\$][\w\$]*/,
        { token: "annotation", log: "annotation token: $0" }
      ],

      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],

      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

      // characters
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"]
    ],

    comment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"], // nested comment
      ["\\*/", "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ]
  }
} as any);

export class LSPServices {
  public service;

  public createLSPEditor(
    domContainer: HTMLElement,
    resource: Resource,
    initialValue: string,
    latexListener: (formula: string) => any
  ): monaco.editor.IStandaloneCodeEditor {
    let model = monaco.editor.createModel(
      initialValue,
      LANGUAGE_ID,
      monaco.Uri.parse(
        `platform:/resource/${resource.project}/${resource.path}`
      )
    );

    const editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(
      domContainer,
      {
        model: model,
        glyphMargin: true,
        lightbulb: {
          enabled: true
        }
      }
    );

    // create the web socket
    const url = this.createUrl(HOST, PORT);
    const socketOptions = {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      connectionTimeout: 10000,
      maxRetries: Infinity,
      debug: false
    };
    const webSocket = new ReconnectingWebSocket(url, undefined, socketOptions);
    // listen when the web socket is opened
    listen({
      webSocket,
      onConnection: connection => {
        // create and start the language client
        const languageClient = this.createLanguageClient(connection);
        const disposable = languageClient.start();
        connection.onClose(() => disposable.dispose());
      }
    });
    this.service = install(<any>editor, latexListener);
    return editor;
  }

  public deleteLSPEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    const service2 = get();
    const model = editor.getModel();
    if (model !== null) {
      model.dispose();
    }
    editor.dispose();
    var global = window;
    var symbol = Symbol("Services");
    // hack to avoid "Language Client services has been overriden"
    global[symbol] = undefined;
  }

  public createLanguageClient(
    connection: MessageConnection
  ): MonacoLanguageClient {
    return new MonacoLanguageClient({
      name: FEATURE,
      clientOptions: {
        // use a language id as a document selector
        documentSelector: [LANGUAGE_ID],
        // disable the default error handler
        errorHandler: {
          error: () => ErrorAction.Continue,
          closed: () => CloseAction.DoNotRestart
        }
      },
      // create a language client connection from the JSON RPC connection on demand
      connectionProvider: {
        get: (errorHandler, closeHandler) => {
          return Promise.resolve(
            createConnection(connection, errorHandler, closeHandler)
          );
        }
      }
    });
  }

  private createUrl(host: string, port: string): string {
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    return normalizeUrl(`${protocol}://${host}:${port}/${LANGUAGE_ID}/lsp`);
  }
}
