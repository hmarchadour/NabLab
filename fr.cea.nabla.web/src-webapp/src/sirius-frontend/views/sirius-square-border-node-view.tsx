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
import { RenderingContext, SPort, RectangularNodeView } from 'sprotty/lib';

import { VNode } from 'snabbdom/vnode';
import * as snabbdom from 'snabbdom-jsx';

const JSX = { createElement: snabbdom.svg };

/**
 * The view used to display a border node nodes with a square style.
 *
 * @hmarchadour
 */
export class SiriusSquareBorderNodeView extends RectangularNodeView {
  /**
   * Renders the given port in the context.
   * @param port The port
   * @param context The context
   */
  public render(port: SPort, context: RenderingContext): VNode {
    const style: string = (port as any).style;
    const styleObject: any = JSON.parse(style);
    const rect: any = JSX.createElement(
      'rect',
      {
        'class-selected': port.selected,
        'class-mouseover': port.hoverFeedback,
        x: 0,
        y: 0,
        rx: '5',
        ry: '5',
        width: Math.max(0, port.bounds.width),
        height: Math.max(0, port.bounds.height),
        style: styleObject
      },
      null
    );

    return JSX.createElement('g', null, [rect, context.renderChildren(port)]);
    /*return (
      <g>
        <rect
              class-selected={port.selected}
              class-mouseover={port.hoverFeedback}
              x={0} y ={0}
              width={Math.max(5, port.bounds.width)}
              height={Math.max(5, port.bounds.height)}
              style={JSON.parse(style)} />
        {context.renderChildren(port)}
      </g>
    );*/
  }
}
