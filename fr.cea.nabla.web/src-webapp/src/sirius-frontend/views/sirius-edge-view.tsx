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
import { PolylineEdgeView, RenderingContext, SEdge, Point, toDegrees, angle } from 'sprotty/lib';

import { VNode } from 'snabbdom/vnode';
import * as snabbdom from 'snabbdom-jsx';

const JSX = { createElement: snabbdom.svg };

const STROKE_DASHARRAY = 'stroke-dasharray';

const DASH_PATTERN = '10,10';
const DOT_PATTERN = '3,3';
const DASH_DOT_PATTERN = '20,10,3,3,3,10';

/**
 * The view used to display Sirius edges.
 *
 * @sbegaudeau
 * @hmarchadour
 */
export class SiriusEdgeView extends PolylineEdgeView {
  /**
   * Renders the line of the edge with a specific style configured.
   * @param edge The edge
   * @param segments The segments
   * @param context The context
   */
  protected renderLine(edge: SEdge, segments: Point[], context: RenderingContext): VNode {
    const style: string = (edge as any).style;
    const styleObject = JSON.parse(style);
    styleObject.fill = 'transparent';
    switch ((edge as any).lineStyle) {
      case 1:
        // dash
        styleObject[STROKE_DASHARRAY] = DASH_PATTERN;
        break;
      case 2:
        // dot
        styleObject[STROKE_DASHARRAY] = DOT_PATTERN;
        break;
      case 3:
        // dash && dot
        styleObject[STROKE_DASHARRAY] = DASH_DOT_PATTERN;
        break;
      default:
        // solid nothing todo
        break;
    }
    const firstPoint = segments[0];
    const strokeWidth = styleObject !== undefined ? styleObject['stroke-width'] : 1;
    let path = `M ${firstPoint.x + strokeWidth},${firstPoint.y}`;
    for (let i = 1; i < segments.length; i++) {
      const p = segments[i];
      path += ` L ${p.x - strokeWidth},${p.y}`;
    }
    return JSX.createElement('path', { 'class-sprotty-edge': true, d: path, style: styleObject }, null);
    //return <path class-sprotty-edge={true} d={path} style={styleObject} />;
  }

  /**
   * Renders additionals element for the given Edge. This method is overriden in order to let
   * us add decorators to the beggining or the end of the edge (to create an arrow for example).
   * @param edge The edge
   * @param segments The segments
   * @param context The context
   */
  protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
    const source = this.renderSource(edge, segments, context);
    const target = this.renderTarget(edge, segments, context);
    return [...source, ...target];
  }

  private renderSource(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
    const p1 = segments[1];
    const p2 = segments[0];
    const style: string = (edge as any).style;
    const styleObject = JSON.parse(style);
    return this.renderArrow(p1, p2, (edge as any).sourceArrow, styleObject);
  }

  private renderTarget(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
    const p1 = segments[segments.length - 2];
    const p2 = segments[segments.length - 1];
    const style: string = (edge as any).style;
    const styleObject = JSON.parse(style);
    return this.renderArrow(p1, p2, (edge as any).targetArrow, styleObject);
  }

  private renderArrow(p1: Point, p2: Point, arrowType: number, styleObject: any) {
    const strokeWidth = styleObject !== undefined ? styleObject['stroke-width'] : 1;
    const basicArrowPath = 'M 0,0 7,3.5 0,7';
    switch (arrowType) {
      // Output Arrow
      case 1:
      // Input Arrow
      case 2: {
        const isOutput = arrowType === 1;
        styleObject.fill = 'transparent';
        const offsetX = isOutput ? -7 + strokeWidth : -7 - strokeWidth;
        const offsetY = -3.5;
        const x = p2.x + offsetX;
        const y = p2.y + offsetY;
        const rotation = isOutput ? toDegrees(angle(p2, p1)) : toDegrees(angle(p1, p2));
        const rotationX = p2.x;
        const rotationY = p2.y;
        return [this.buildPath(basicArrowPath, x, y, styleObject, rotation, rotationX, rotationY)];
      }

      // Output Closed Arrow
      case 3:
      // Input Closed Arrow
      case 4:
      // Output Fill Closed Arrow
      case 5:
      // Input Fill Closed Arrow
      case 6: {
        const isOutput = arrowType === 3 || arrowType === 5;
        const isFill = arrowType === 5 || arrowType === 6;

        styleObject.fill = isFill ? styleObject.stroke : 'white';
        const offsetX = isOutput ? 0 + strokeWidth : -7 - strokeWidth;
        const offsetY = -3.5;
        const x = p2.x + offsetX;
        const y = p2.y + offsetY;
        const rotation = isOutput ? toDegrees(angle(p2, p1)) : toDegrees(angle(p1, p2));
        const rotationX = p2.x;
        const rotationY = p2.y;
        return [this.buildPath(basicArrowPath + 'z', x, y, styleObject, rotation, rotationX, rotationY)];
      }

      // Diamond
      case 7:
      // Fill Diamond
      case 8: {
        const isFill = arrowType === 8;
        styleObject.fill = isFill ? styleObject.stroke : 'white';
        const offsetX = 0 + strokeWidth;
        const offsetY = 0;
        const x = p2.x + offsetX;
        const y = p2.y + offsetY;
        const rotation = toDegrees(angle(p2, p1));
        const rotationX = p2.x;
        const rotationY = p2.y;
        return [this.buildPath('M 0,0 L 7,-3.5 L 14,0 L 7,3.5 z', x, y, styleObject, rotation, rotationX, rotationY)];
      }

      // Input Arrow With Diamond
      case 9:
      // Input Arrow With Fill Diamond
      case 10: {
        const isFill = arrowType === 10;
        styleObject.fill = isFill ? styleObject.stroke : 'white';
        const offsetX = 0 + strokeWidth;
        const offsetY = 0;
        const x = p2.x + offsetX;
        const y = p2.y + offsetY;
        const rotation = toDegrees(angle(p2, p1));
        const rotationX = p2.x;
        const rotationY = p2.y;
        return [
          this.buildPath(
            'M 0,0 L 7,-3.5 L 14,0 L 7,3.5 z M 14,0 21,-3.5 14,0 21,3.5',
            x,
            y,
            styleObject,
            rotation,
            rotationX,
            rotationY
          )
        ];
      }

      default:
        return [];
    }
  }

  private buildPath(
    path: string,
    translateX: number,
    translateY: number,
    styleObject: any,
    rotationAngle?: number,
    rotationX?: number,
    rotationY?: number
  ): VNode {
    let rotation = '';
    if (rotationAngle !== undefined) {
      if (rotationX !== undefined && rotationY !== undefined) {
        rotation = `rotate(${rotationAngle} ${rotationX} ${rotationY})`;
      } else {
        rotation = `rotate(${rotationAngle})`;
      }
    }
    const transform = `${rotation} translate(${translateX} ${translateY})`;

    return JSX.createElement(
      'path',
      { 'class-edge': true, 'class-arrow': true, d: path, transform: transform, style: styleObject },
      null
    );
    // return <path class-edge={true} class-arrow={true} d={path} transform={transform} style={styleObject} />;
  }
}
