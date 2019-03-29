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

import { Layer } from '../types/layer';

/**
 * Action used to set the layers of the diagram.
 *
 * @gcoutable
 */
export class SetLayersAction implements Action {
  /**
   * The kind of the action.
   */
  public static readonly KIND = 'setLayers';

  /**
   * The kind of the action.
   */
  public readonly kind = SetLayersAction.KIND;

  /**
   * The layers of the diagram.
   */
  public readonly layers: [ Layer ];

  /**
   * The constructor.
   * @param layers The layers of the diagram
   */
  constructor(layers: [ Layer ]) {
    this.layers = layers;
  }
}