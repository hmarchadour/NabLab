/*******************************************************************************
 * Copyright (c) 2018 Obeo.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Obeo - initial API and implementation
 *******************************************************************************/
import {
  Action,
  ActionHandlerRegistry,
  IActionHandler,
  ICommand,
  RequestModelAction,
  TYPES,
  WebSocketDiagramServer
} from "sprotty/lib";
import { RequestLayersAction } from "../actions/request-layers-action";
import { RequestToolsAction } from "../actions/request-tools-action";
import { SetLayersAction } from "../actions/set-layers-action";
import { SetToolsAction } from "../actions/set-tools-action";
import { createContainer } from "../di.config";
import { SiriusWebSocketDiagramServer } from "../sirius-websocket-diagram-server";
import { Tool } from "../types/tool";
import {
  canHandleTool,
  cleanDOMElement,
  createDOMElementForLayers,
  createDOMElementsForTools
} from "./tools-utils";

require("reconnecting-websocket");

export interface ISiriusAction<T extends Action> extends IActionHandler {
  handle(action: T): ICommand | Action | void;
}

/* tslint:disable */
export class SetLayersActionHandler implements ISiriusAction<SetLayersAction> {
  private readonly diagramServer: WebSocketDiagramServer;

  constructor(diagramServer: WebSocketDiagramServer) {
    this.diagramServer = diagramServer;
  }

  /**
   * Handles the given action received by the server.
   * @param action The action
   */
  public handle(action: SetLayersAction): void {
    this.handleSetLayersAction(action);
  }

  /**
   * Handles the set layers action.
   * @param action The action
   */
  private handleSetLayersAction(action: SetLayersAction) {
    cleanDOMElement(document.getElementById("layers-palette"));
    createDOMElementForLayers(this.diagramServer, action.layers);
  }
}
/* tslint:enable */

/* tslint:disable */
export class SetToolsActionHandler implements ISiriusAction<SetToolsAction> {
  private readonly diagramServer: WebSocketDiagramServer;

  constructor(diagramServer: WebSocketDiagramServer) {
    this.diagramServer = diagramServer;
  }

  /**
   * Handles the given action received by the server.
   * @param action The action
   */
  handle(action: SetToolsAction): void {
    this.handleSetToolsAction(action);
  }

  /**
   * Handles the set tools action.
   * @param action The action
   */
  private handleSetToolsAction(action: SetToolsAction) {
    const tools: Array<Tool> = action.tools.filter((tool: Tool) => {
      return canHandleTool(tool);
    });
    cleanDOMElement(document.getElementById("tools-palette"));
    createDOMElementsForTools(this.diagramServer, tools);
  }
}
/* tslint:enable */

/**
 * Creates the Sirius diagram and connect it to the server.
 *
 * @sbegaudeau
 */
export function initializeSiriusDiagram(
  defaultProject: string,
  defaultAird: string,
  defaultRepresentationName: string,
  host: string,
  domId: string
) {
  const websocket = new WebSocket("ws://" + host + "/diagrams/api");
  const container = createContainer(domId);

  const diagramServer = container.get<SiriusWebSocketDiagramServer>(
    TYPES.ModelSource
  );
  diagramServer.listen(websocket);

  const actionHandlerRegistry = container.get<ActionHandlerRegistry>(
    TYPES.ActionHandlerRegistry
  );
  actionHandlerRegistry.register(
    SetLayersAction.KIND,
    new SetLayersActionHandler(diagramServer)
  );
  actionHandlerRegistry.register(
    SetToolsAction.KIND,
    new SetToolsActionHandler(diagramServer)
  );

  // Connect to the diagram server
  websocket.addEventListener("open", event => {
    const url = new URL(window.location.href);
    const parameters = new URLSearchParams(url.search);
    const project: string = parameters.get("project") || defaultProject;
    const aird: string = parameters.get("aird") || defaultAird;
    const representationName: string =
      parameters.get("representationName") || defaultRepresentationName;

    diagramServer.clientId = `__PROJECT__${project}__AIRD__${aird}__REPRESENTATION__${representationName}__CLIENT_ID__${Math.random()}`;
    diagramServer.handle(new RequestToolsAction());
    diagramServer.handle(new RequestLayersAction());
    diagramServer.handle(
      new RequestModelAction({
        project,
        aird,
        representationName
      })
    );
  });
}
