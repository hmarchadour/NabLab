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
  SModelElementSchema,
  SModelRootSchema,
  RequestPopupModelAction,
  PreRenderedElementSchema
} from 'sprotty/lib';

/**
 * Creates a popup for the given action.
 * @param request The request popup model action
 * @param element The model element schema
 */
export const siriusPopupModelFactory = (request: RequestPopupModelAction, element?: SModelElementSchema): SModelRootSchema | undefined => {
  if (element !== undefined && element.type === 'node:svg') {
    return {
      type: 'html',
      id: 'popup',
      children: [
        <PreRenderedElementSchema> {
          type: 'pre-rendered',
          id: 'popup-title',
          code: `<div class="popup-title">Class ${element.id === 'node0' ? 'Foo' : 'Bar'}</div>`
        },
        <PreRenderedElementSchema> {
          type: 'pre-rendered',
          id: 'popup-body',
          code: '<div class="popup-body">Hello World</div>'
        }
      ]
    };
  }
  return undefined;
};
