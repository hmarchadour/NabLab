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
 * Action used to execute container creation tools.
 *
 * @sbegaudeau
 */
export class ExecuteContainerCreationToolAction implements Action {

  /**
   * The kind of the action.
   */
  public static readonly KIND = 'executeContainerCreationTool';

  /**
   * The type of the action.
   */
  public static readonly TYPE = 'ContainerCreationDescriptionImpl';

  /**
   * The kind of the action.
   */
  public readonly kind = ExecuteContainerCreationToolAction.KIND;

  /**
   * The name of the container creation tool to execute.
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