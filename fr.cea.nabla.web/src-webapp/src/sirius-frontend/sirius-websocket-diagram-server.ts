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
import { Action, ActionHandlerRegistry, WebSocketDiagramServer } from 'sprotty/lib';


/**
 * The Sirius WebSocket diagram server used to communicate with the remote server.
 *
 * @gcoutable
 */
export class SiriusWebSocketDiagramServer extends WebSocketDiagramServer {

  /**
   * Initializes the given action handler registry.
   * @param registry The action handler registry
   */
  public initialize(registry: ActionHandlerRegistry): void {
    super.initialize(registry);
  }

  /**
   * Handles the given action received by the server.
   * @param action The action
   */
  public handle(action: Action) {
    switch (action.kind) {
      default:
        super.handle(action);
      break;
    }
  }
}