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

/**
 * Action used to execute node creation tools.
 *
 * @gcoutable
 */
export class ExecuteNodeCreationToolAction implements Action {

  /**
   * The kind of the action.
   */
  public static readonly KIND = 'executeNodeCreationTool';

  /**
   * The type of the action.
   */
  public static readonly TYPE = 'NodeCreationDescriptionImpl';

  /**
   * The kind of the action.
   */
  public readonly kind = ExecuteNodeCreationToolAction.KIND;

  /**
   * The name of the node creation tool to execute.
   */
  public readonly toolName: string;

  /**
   * The constructor.
   * @param toolName The name of the tool to execute
   */
  constructor(toolName: string) {
    this.toolName = toolName;
  }

}