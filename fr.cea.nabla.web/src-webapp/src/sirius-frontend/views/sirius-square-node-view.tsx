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
import { RenderingContext, SNode, RectangularNodeView } from 'sprotty/lib';

import { VNode } from 'snabbdom/vnode';
import * as snabbdom from 'snabbdom-jsx';

const JSX = { createElement: snabbdom.svg };

/**
 * The view used to display nodes with a square style.
 *
 * @sbegaudeau
 */
export class SiriusSquareNodeView extends RectangularNodeView {
  /**
   * Renders the given node in the context.
   * @param node The node
   * @param context The context
   */
  public render(node: SNode, context: RenderingContext): VNode {
    const style: string = (node as any).style;
    const styleObject: any = JSON.parse(style);
    const rect: any = JSX.createElement(
      'rect',
      {
        'class-selected': node.selected,
        'class-mouseover': node.hoverFeedback,
        x: 0,
        y: 0,
        rx: '5',
        ry: '5',
        width: Math.max(0, node.bounds.width),
        height: Math.max(0, node.bounds.height),
        style: styleObject
      },
      null
    );

    return JSX.createElement('g', null, [rect, context.renderChildren(node)]);

    /*return (
      <g>
        <rect class-selected={node.selected}
              class-mouseover={node.hoverFeedback}
              x={0} y={0}
              rx="5" ry="5"
              width={Math.max(0, node.bounds.width)}
              height={Math.max(0, node.bounds.height)}
              style={styleObject} />
        {context.renderChildren(node)}
      </g>
    );*/
  }
}
