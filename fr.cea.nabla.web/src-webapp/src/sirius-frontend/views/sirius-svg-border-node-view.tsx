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
 * The view used to display an SVG border node.
 *
 * @hmarchadour
 */
export class SiriusSvgBorderNodeView extends RectangularNodeView {
  /**
   * Renders the given port in the context.
   * @param port The port
   * @param context The context
   */
  public render(port: SPort, context: RenderingContext): VNode {
    const url = (port as any).url;
    const rect: any = JSX.createElement(
      'image',
      {
        x: 0,
        y: 0,
        width: '10',
        height: '10',
        href: url
      },
      null
    );

    return JSX.createElement('g', null, rect);

    /* return (
      <g>
        <image x="0" y="0" height="10" width="10" href={url}/>
      </g>
    );¨*/
  }
}
