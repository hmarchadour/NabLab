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
import { Action, WebSocketDiagramServer } from "sprotty/lib";
import { ExecuteContainerCreationToolAction } from "../actions/execute-container-creation-tool-action";
import { ExecuteNodeCreationToolAction } from "../actions/execute-node-creation-tool-action";
import { ExecuteToolAction } from "../actions/execute-tool-action";
import { ToggleLayerAction } from "../actions/toogle-layers-action";
import { Layer } from "../types/layer";
import { Tool } from "../types/tool";

/**
 * Indicates if the given tool is supported by the diagram.
 * @param tool The tool
 * @returns true if the tool is supported, false otherwise
 */
export function canHandleTool(tool: Tool): boolean {
  let canHandle = false;
  switch (tool.toolType) {
    case ExecuteNodeCreationToolAction.TYPE:
      canHandle = true;
      break;
    case ExecuteContainerCreationToolAction.TYPE:
      canHandle = true;
      break;
    case ExecuteToolAction.TYPE:
      canHandle = true;
      break;
    default:
      canHandle = false;
      break;
  }
  return canHandle;
}

/**
 * Creates the action for the given tool.
 * @param tool The tool
 * @returns The action used to run the given tool or null if the tool is not supported
 */
function createToolAction(tool: Tool): Action | null {
  let action: Action | null = null;
  switch (tool.toolType) {
    case ExecuteNodeCreationToolAction.TYPE:
      action = new ExecuteNodeCreationToolAction(tool.id);
      break;
    case ExecuteContainerCreationToolAction.TYPE:
      action = new ExecuteContainerCreationToolAction(tool.id);
      break;
    case ExecuteToolAction.TYPE:
      action = new ExecuteToolAction(tool.id);
    default:
      break;
  }
  return action;
}

/**
 * Creates the action for the given layer.
 * @param layer The layer
 * @returns The action used to toggle the given layer
 */
function createLayerAction(layer: Layer, newState: boolean): Action {
  return new ToggleLayerAction(layer.id, newState);
}

/**
 * Creates the DOM elements used to execute the given tools.
 * @param diagramServer The diagram server
 * @param tools The tools to display
 */
export function createDOMElementsForTools(
  diagramServer: WebSocketDiagramServer,
  tools: Array<Tool>
): void {
  const toolPaletteElement = document.getElementById("tools-palette");
  if (toolPaletteElement !== null) {
    tools.forEach(tool => {
      const button = document.createElement("button");
      button.setAttribute("type", "button");
      button.setAttribute("class", "tool");
      const toolLabel = tool.name || tool.id;

      const image = document.createElement("img");

      // FIXME Change the computation of the tool image source
      let imageSource = "assets/ToolDescription.gif";
      if (toolLabel.includes("Woman")) {
        imageSource = "assets/woman.svg";
      } else if (toolLabel.includes("Man")) {
        imageSource = "assets/man.svg";
      } else if (toolLabel.includes("New customer")) {
        imageSource = "assets/LaneSet.png";
      } else if (toolLabel.includes("Start")) {
        imageSource = "assets/start.svg";
      } else if (toolLabel.includes("Select")) {
        imageSource = "assets/Task.svg";
      } else if (toolLabel.includes("Order")) {
        imageSource = "assets/Task.svg";
      } else if (toolLabel.includes("Wait")) {
        imageSource = "assets/event-based-gateway.svg";
      } else if (toolLabel.includes("Eat")) {
        imageSource = "assets/end.svg";
      }

      image.setAttribute("src", imageSource);
      button.appendChild(image);

      const label = document.createElement("label");
      label.textContent = toolLabel;
      button.appendChild(label);

      button.addEventListener("click", event => {
        const toolAction = createToolAction(tool);
        if (toolAction !== null) {
          diagramServer.handle(toolAction);
        }
      });
      toolPaletteElement.appendChild(button);
    });
  }
}

/**
 * Creates the DOM elements used to activate or deactivate layers.
 * @param diagramServer The diagram server
 * @param layers The layers to display
 */
export function createDOMElementForLayers(
  diagramServer: WebSocketDiagramServer,
  layers: Array<Layer>
): void {
  const layerPaletteElement = document.getElementById("layers-palette");
  if (layerPaletteElement != null) {
    layers.forEach((layer: Layer) => {
      const layerId = `layer-${layer.id}`;
      const layerContainerElement = document.createElement("div");
      layerContainerElement.setAttribute("class", "layer");

      const layerLabelElement = document.createElement("label");
      layerLabelElement.setAttribute("for", layerId);
      layerLabelElement.textContent = `${layer.name || layer.id} `;
      layerContainerElement.appendChild(layerLabelElement);

      const layerCheckboxElement = document.createElement("input");
      layerCheckboxElement.setAttribute("type", "checkbox");
      if (layer.isActive) {
        layerCheckboxElement.setAttribute("checked", "checked");
      }
      layerCheckboxElement.setAttribute("id", layerId);
      layerCheckboxElement.addEventListener("click", event => {
        const eventTarget = event.target as HTMLInputElement;
        const layerAction = createLayerAction(layer, eventTarget.checked);
        if (layerAction !== null) {
          diagramServer.handle(layerAction);
        }
      });
      layerContainerElement.appendChild(layerCheckboxElement);
      layerPaletteElement.appendChild(layerContainerElement);
    });
  }
}

/**
 * Cleans the content of the HTMLElement.
 * @param element The HTMLElement
 */
export function cleanDOMElement(element: HTMLElement | null): void {
  if (element !== null) {
    for (const index = 0; index < element.children.length; ) {
      const item = element.children.item(index);
      if (item !== null) {
        element.removeChild(item);
      }
    }
  }
}
