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
 * Action used to retrieve the tools of the diagram.
 *
 * @gcoutable
 */
export class RequestToolsAction implements Action {

  /**
   * The kind of the action.
   */
  public static readonly KIND = 'requestTools';

  /**
   * The kind of the action.
   */
  public readonly kind = RequestToolsAction.KIND;
}