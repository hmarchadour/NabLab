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
 * Action used to toggle a layer.
 *
 * @author gcoutable
 */
export class ToggleLayerAction implements Action {

  /**
   * The kind of the action.
   */
  public static readonly KIND: string = 'toggleLayer';

  /**
   * The kind of the action.
   */
  public readonly kind: string = ToggleLayerAction.KIND;

  /**
   * The name of the layer.
   */
  public readonly layerName: string;

  /**
   * The new state of the layer.
   */
  public readonly newState: boolean;

  /**
   * The constructor.
   * @param layerName The name of the layer
   * @param newState The new state of the layer
   */
  constructor(layerName: string, newState: boolean) {
    this.layerName = layerName;
    this.newState = newState;
  }
}