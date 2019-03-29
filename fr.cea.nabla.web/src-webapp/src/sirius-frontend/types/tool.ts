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

/**
 * A Sirius tool.
 *
 * @sgcoutable
 */
export interface Tool {
  /**
   * The identifier.
   */
  readonly id: string;

  /**
   * The name.
   */
  readonly name:  string;

  /**
   * The type.
   */
  readonly toolType: string;
}