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
  getBasicType,
  HtmlRoot,
  HtmlRootSchema,
  SChildElement,
  SGraphFactory,
  SModelElementSchema,
  SModelRootSchema,
  SModelRoot,
  SParentElement,
  PreRenderedElement,
  PreRenderedElementSchema
} from 'sprotty/lib';

/**
 * The Sirius graph factory used to create all the graph elements.
 *
 * @sbegaudeau
 */
export class SiriusGraphFactory extends SGraphFactory {
  /**
   * Creates the element with the given schema.
   * @param schema The model element schema
   * @param parent The parent element
   */
  public createElement(schema: SModelElementSchema, parent?: SParentElement): SChildElement {
    /*if (this.isNodeSchema(schema)) {
      return this.initializeChild(new SiriusNode(), schema, parent)
    } else */
    if (this.isPreRenderedSchema(schema)) {
      return this.initializeChild(new PreRenderedElement(), schema, parent);
    } else {
      return super.createElement(schema, parent);
    }
  }

  /**
   * Creates the root for the given schema.
   * @param schema The schema
   */
  public createRoot(schema: SModelRootSchema): SModelRoot {
    if (this.isHtmlRootSchema(schema)) {
      return this.initializeRoot(new HtmlRoot(), schema);
    } else {
      return super.createRoot(schema);
    }
  }

  /**
   * Indicates if the given schema is an HTML root schema.
   * @param schema The model root schema
   */
  public isHtmlRootSchema(schema: SModelRootSchema): schema is HtmlRootSchema {
    return getBasicType(schema) === 'html';
  }

  /**
   * Indicates if the given schema is a pre-rendered schema.
   * @param schema The model element schema
   */
  public isPreRenderedSchema(schema: SModelElementSchema): schema is PreRenderedElementSchema {
    return getBasicType(schema) === 'pre-rendered';
  }
}
