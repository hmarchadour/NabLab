import React, { Component } from "react";

import NablaEditor from "../components/editors/NablaEditor";
import DefaultViewer from "../components/viewer/DefaultViewer";
import AIRDViewer from "../components/viewer/AIRDViewer";
import RepresentationViewer from "../components/viewer/RepresentationViewer";
import Breadcrumb from "../components/Breadcrumb";
import FolderContents from "../components/FolderContents";
import { getResource } from "../services/ResourceServices";
import { Resource } from "../dto/Resource";
import { LANGUAGE_ID } from "../services/const";
import CircularProgress from "@material-ui/core/CircularProgress";

import { withStyles } from "@material-ui/core/styles";
interface Props {
  projectName: string;
  resourcePath: string;
  viewpoint?: string;
  representationName?: string;
}

interface State {
  resource: Resource | null;
}

const styles = theme => ({});

class ResourcePage extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { resource: null };
  }

  render() {
    const { projectName, resourcePath, ...others } = this.props;
    const { resource } = this.state;
    let resourceContent;
    if (resource !== null) {
      if (resource.isFolder) {
        resourceContent = <FolderContents resource={resource} />;
      } else {
        if (resourcePath.endsWith("." + LANGUAGE_ID)) {
          resourceContent = (
            <NablaEditor
              {...others}
              project={projectName}
              resource={resource}
            />
          );
        } else if (resourcePath.endsWith(".aird")) {
          if (
            this.props.viewpoint !== undefined &&
            this.props.representationName !== undefined
          ) {
            resourceContent = (
              <RepresentationViewer
                {...others}
                resource={resource}
                viewpoint={this.props.viewpoint}
                representationName={this.props.representationName}
              />
            );
          } else {
            resourceContent = <AIRDViewer {...others} resource={resource} />;
          }
        } else {
          resourceContent = <DefaultViewer {...others} resource={resource} />;
        }
      }
    } else {
      resourceContent = <CircularProgress />;
    }
    return (
      <div>
        <Breadcrumb projectName={projectName} resourcePath={resourcePath} />
        {resourceContent}
      </div>
    );
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps) {
    const { projectName, resourcePath } = this.props;
    if (
      projectName !== prevProps.projectName ||
      resourcePath !== prevProps.resourcePath
    ) {
      this.refresh();
    }
  }

  refresh() {
    getResource(this.props.projectName, this.props.resourcePath).then(
      resource => {
        this.setState({ resource });
      }
    );
  }
}

export default withStyles(styles)(ResourcePage);
