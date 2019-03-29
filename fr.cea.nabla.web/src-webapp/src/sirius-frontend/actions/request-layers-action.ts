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
 * Action used to retrieve the layers of the diagram.
 *
 * @gcoutable
 */
export class RequestLayersAction implements Action {

  /**
   * The kind of the action.
   */
  public static readonly KIND = 'requestLayers';

  /**
   * The kind of the action.
   */
  public readonly kind = RequestLayersAction.KIND;
}