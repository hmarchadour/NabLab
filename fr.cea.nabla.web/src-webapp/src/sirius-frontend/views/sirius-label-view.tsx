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
import { RenderingContext, SLabel, SLabelView, getSubType, setAttr } from 'sprotty/lib';

import { VNode } from 'snabbdom/vnode';
import * as snabbdom from 'snabbdom-jsx';

//const JSX = { createElement: snabbdom.svg };

/**
 * The view used to display labels.
 *
 * @sbegaudeau
 */
export class SiriusLabelView extends SLabelView {
  /**
   * Renders the given label in the context.
   * @param label The label
   * @param context The context
   */
  public render(label: SLabel, context: RenderingContext): VNode {
    const style: string = (label as any).style;
    const styleObject = JSON.parse(style);

    /*const vnode = (
      <text class-sprotty-label={true} style={styleObject}>
        {label.text}
      </text>
    );*/
    const attrs: any = { 'class-sprotty-label': true, style: styleObject };
    const vnode = snabbdom.svg('text', attrs, label.text);
    const subType = getSubType(label);
    if (subType) {
      setAttr(vnode, 'class', subType);
    }
    return vnode;
  }
}
