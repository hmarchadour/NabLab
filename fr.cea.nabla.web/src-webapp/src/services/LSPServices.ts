import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MonacoServices,
  createConnection
} from "monaco-languageclient";
import * as monaco from "monaco-editor";
import { listen, MessageConnection } from "vscode-ws-jsonrpc";
import { FEATURE, LANGUAGE_ID, HOST, PORT } from "./const";

const normalizeUrl = require("normalize-url");
const ReconnectingWebSocket = require("reconnecting-websocket");

monaco.languages.register({
  id: LANGUAGE_ID,
  extensions: ["." + LANGUAGE_ID],
  aliases: [LANGUAGE_ID.toUpperCase(), LANGUAGE_ID],
  mimetypes: ["text/" + LANGUAGE_ID]
});

monaco.editor.defineTheme(LANGUAGE_ID, {
  base: "vs",
  inherit: false,
  colors: {
    "editor.foreground": "#000000",
    "editor.background": "#EDF9FA",
    "editorCursor.foreground": "#8B0000",
    "editor.lineHighlightBackground": "#0000FF20",
    "editorLineNumber.foreground": "#008800",
    "editor.selectionBackground": "#88000030",
    "editor.inactiveSelectionBackground": "#88000015"
  },
  rules: [
    { token: "import", foreground: "808080" },
    { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
    { token: "custom-notice", foreground: "FFA500" },
    { token: "custom-date", foreground: "008800" }
  ]
});
monaco.editor.setTheme(LANGUAGE_ID);
export class LSPServices {
  public service;

  public createLSPEditor(
    domContainer: HTMLElement,
    project: string,
    localPath: string,
    initialValue: string
  ): monaco.editor.IStandaloneCodeEditor {
    let model = monaco.editor.createModel(
      initialValue,
      LANGUAGE_ID,
      monaco.Uri.parse(`platform:/resource/${project}/${localPath}`)
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
    this.service = MonacoServices.install(<any>editor);
    return editor;
  }

  public deleteLSPEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    const service2 = MonacoServices.get();
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

  private createWebSocket(url: string): WebSocket {
    const socketOptions = {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      connectionTimeout: 10000,
      maxRetries: Infinity,
      debug: false
    };
    return new ReconnectingWebSocket(url, undefined, socketOptions);
  }
}
