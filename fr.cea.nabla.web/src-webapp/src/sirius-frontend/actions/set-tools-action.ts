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
import { Action } from 'sprotty/lib';

import { Tool } from '../types/tool';

/**
 * Action used to set the tools of the diagram.
 *
 * @gcoutable
 */
export class SetToolsAction implements Action {
  /**
   * The kind of the action.
   */
  public static readonly KIND = 'setTools';

  /**
   * The kind of the action.
   */
  public readonly kind = SetToolsAction.KIND;

  /**
   * The tools of the diagram.
   */
  public readonly tools: [ Tool ];

  /**
   * The constructor.
   * @param tools The tools of the diagram
   */
  constructor(tools: [ Tool ]) {
    this.tools = tools;
  }
}