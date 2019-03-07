/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import {
  MonacoToProtocolConverter,
  ProtocolToMonacoConverter,
  MonacoCommands,
  MonacoLanguages,
  MonacoWorkspace,
  ConsoleWindow,
  Services,
  DocumentSelector,
  MonacoModelIdentifier,
  DocumentHighlightProvider
} from "monaco-languageclient";

export interface MonacoServices extends Services {
  commands: MonacoCommands;
  languages: MonacoLanguages;
  workspace: MonacoWorkspace;
  window: ConsoleWindow;
}
export interface Options {
  rootUri?: string;
}
export type Provider = () => MonacoServices;
export function create(
  editor: monaco.editor.IStandaloneCodeEditor,
  latexListener: (formula: string) => any,
  options: Options = {}
): MonacoServices {
  const m2p = new MonacoToProtocolConverter();
  const p2m = new ProtocolToMonacoConverter();
  return {
    commands: new MonacoCommands(editor),
    languages: new CustomMonacoLanguages(p2m, m2p, latexListener),
    workspace: new MonacoWorkspace(p2m, m2p, options.rootUri),
    window: new ConsoleWindow()
  };
}
export function install(
  editor: monaco.editor.IStandaloneCodeEditor,
  latexListener: (formula: string) => any,
  options: Options = {}
): MonacoServices {
  const services = create(editor, latexListener, options);
  Services.install(services);
  return services;
}
export function get(): MonacoServices {
  return Services.get() as MonacoServices;
}

export class CustomMonacoLanguages extends MonacoLanguages {
  constructor(
    readonly p2m: ProtocolToMonacoConverter,
    readonly m2p: MonacoToProtocolConverter,
    private latexListener: (formula: string) => any
  ) {
    super(p2m, m2p);
  }

  protected createDocumentHighlightProvider(
    selector: DocumentSelector,
    provider: DocumentHighlightProvider
  ): monaco.languages.DocumentHighlightProvider {
    return {
      provideDocumentHighlights: (model, position, token) => {
        if (
          !this.matchModel(selector, MonacoModelIdentifier.fromModel(model))
        ) {
          return [];
        }
        const params = this.m2p.asTextDocumentPositionParams(model, position);
        return provider
          .provideDocumentHighlights(params, token)
          .then(result => {
            const documentHighlights = this.p2m.asDocumentHighlights(result);
            if (result.length > 0 && result[0]["formula"] !== undefined) {
              this.latexListener(result[0]["formula"]);
            }
            return documentHighlights;
          });
      }
    };
  }
}
