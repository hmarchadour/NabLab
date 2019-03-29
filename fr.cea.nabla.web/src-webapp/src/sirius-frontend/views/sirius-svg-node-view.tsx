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
import { RenderingContext, SNode, RectangularNodeView } from "sprotty/lib";

import { VNode } from "snabbdom/vnode";
import * as snabbdom from "snabbdom-jsx";

const JSX = { createElement: snabbdom.svg };

/**
 * The view used to display nodes with an SVG image.
 */
export class SiriusSVGNodeView extends RectangularNodeView {
  /**
   * Renders the given node in the context.
   * @param node The node
   * @param context The context
   */
  public render(node: SNode, context: RenderingContext): VNode {
    const svgData = (node as any).svgData;

    const rect: any = JSX.createElement(
      "image",
      {
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        href: `data:image/svg+xml;utf,${svgData}`
      },
      null
    );

    return JSX.createElement("g", null, [rect, context.renderChildren(node)]);

    /*return (
      <g>
        <image x="0" y="0" href={`data:image/svg+xml;utf,${svgData}`} width={30} height={30} />
        {context.renderChildren(node)}
      </g>
    );*/
  }
}
