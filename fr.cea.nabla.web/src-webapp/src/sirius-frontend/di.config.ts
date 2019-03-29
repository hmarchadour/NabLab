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
import { Container, ContainerModule } from 'inversify';

import {
  boundsModule,
  defaultModule,
  exportModule,
  hoverModule,
  moveModule,
  selectModule,
  undoRedoModule,
  viewportModule,
  overrideViewerOptions,
  ConsoleLogger,
  LogLevel,
  ViewRegistry,
  TYPES,
  HtmlRootView,
  PreRenderedView,
  SCompartmentView,
  SGraphView,
  SLabelView
} from 'sprotty/lib';

import { SiriusEdgeView } from './views/sirius-edge-view';
import { SiriusFreeFormFlatContainerNodeView } from './views/sirius-free-form-flat-container-node-view';
import { SiriusListFlatContainerNodeView } from './views/sirius-list-flat-container-node-view';
import { SiriusSquareBorderNodeView } from './views/sirius-square-border-node-view';
import { SiriusSvgBorderNodeView } from './views/sirius-svg-border-node-view';
import { SiriusLabelView } from './views/sirius-label-view';
import { SiriusSquareNodeView } from './views/sirius-square-node-view';
import { SiriusSVGNodeView } from './views/sirius-svg-node-view';

import { SiriusGraphFactory } from './sirius-graph-factory';

import { siriusPopupModelFactory } from './popup';
import { SiriusWebSocketDiagramServer } from './sirius-websocket-diagram-server';

const siriusContainerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  rebind(TYPES.ILogger)
    .to(ConsoleLogger)
    .inSingletonScope();
  rebind(TYPES.LogLevel).toConstantValue(LogLevel.log);
  rebind(TYPES.IModelFactory)
    .to(SiriusGraphFactory)
    .inSingletonScope();
  bind(TYPES.PopupModelFactory).toConstantValue(siriusPopupModelFactory);
});

/**
 * Create the dependency injection container.
 * @param containerId The identifier of the container
 */
export const createContainer = (containerId: string) => {
  const container = new Container();
  container.load(
    defaultModule,
    selectModule,
    moveModule,
    boundsModule,
    undoRedoModule,
    viewportModule,
    hoverModule,
    exportModule,
    siriusContainerModule
  );

  container
    .bind(TYPES.ModelSource)
    .to(SiriusWebSocketDiagramServer)
    .inSingletonScope();

  overrideViewerOptions(container, {
    needsClientLayout: true,
    needsServerLayout: true,
    baseDiv: containerId,
    hiddenDiv: containerId + '-hidden'
  });

  const viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
  viewRegistry.register('graph', SGraphView);

  viewRegistry.register('node:square', SiriusSquareNodeView);
  viewRegistry.register('node:svg', SiriusSVGNodeView);
  viewRegistry.register('port:square', SiriusSquareBorderNodeView);
  viewRegistry.register('port:image', SiriusSvgBorderNodeView);
  viewRegistry.register('node:freeformflatcontainer', SiriusFreeFormFlatContainerNodeView);
  viewRegistry.register('node:listflatcontainer', SiriusListFlatContainerNodeView);
  viewRegistry.register('comp:listflatcontainer_label', SCompartmentView);
  viewRegistry.register('comp:listflatcontainer_body', SCompartmentView);

  viewRegistry.register('edge:straight', SiriusEdgeView);

  viewRegistry.register('label:inside-left', SiriusLabelView);
  viewRegistry.register('label:inside-center', SiriusLabelView);
  viewRegistry.register('label:inside-right', SiriusLabelView);
  viewRegistry.register('label:outside-left', SiriusLabelView);
  viewRegistry.register('label:outside-center', SiriusLabelView);
  viewRegistry.register('label:outside-right', SiriusLabelView);

  viewRegistry.register('label:text', SLabelView);
  viewRegistry.register('comp:main', SCompartmentView);
  viewRegistry.register('html', HtmlRootView);
  viewRegistry.register('pre-rendered', PreRenderedView);

  return container;
};
