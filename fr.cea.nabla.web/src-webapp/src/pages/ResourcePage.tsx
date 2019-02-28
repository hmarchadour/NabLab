import React, { Component } from "react";

import NablaEditor from "../components/editors/NablaEditor";
import Breadcrumb from "../components/Breadcrumb";
interface Props {
  projectName: string;
  resourcePath: string;
}
class ResourcePage extends Component<Props> {
  render() {
    const { projectName, resourcePath, ...others } = this.props;
    return (
      <div>
        <Breadcrumb projectName={projectName} resourcePath={resourcePath} />
        <NablaEditor
          {...others}
          project={projectName}
          resource={resourcePath}
        />
      </div>
    );
  }
}

export default ResourcePage;
