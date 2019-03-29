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
import { SNode } from 'sprotty/lib';

import { moveFeature } from 'sprotty/lib/features/move/model';

/**
 * A custom SNode used to customize the behavior of some features.
 *
 * @sbegaudeau
 */
export class SiriusNode extends SNode {
  /**
   * Indicates if the node support the given feature.
   * @param feature The feature
   */
  public hasFeature(feature: symbol): boolean {
    if (feature === moveFeature) {
      return false;
    }
    return super.hasFeature(feature);
  }
}