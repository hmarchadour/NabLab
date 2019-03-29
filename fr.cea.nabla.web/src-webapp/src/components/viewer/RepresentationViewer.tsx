import React, { Component } from "react";
import { Resource } from "../../dto/Resource";
import { Representation } from "../../dto/Representation";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAIRDResource } from "../../services/SiriusServices";
import { HOST, PORT } from "../../services/const";
import { withRouter, RouteComponentProps } from "react-router-dom";
import sample from "./sample.png";
import "./sprotty.css";
import "./page.css";
import "./diagram.css";
import { initializeSiriusDiagram } from "../../sirius-frontend/app/standalone";
interface Props extends RouteComponentProps<any> {
  resource: Resource;
  representationName: string;
}

interface State {
  representation: Representation | null;
}

class RepresentationViewer extends Component<Props, State> {
  private siriusDom: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.state = { representation: null };

    this.siriusDom = React.createRef();
  }
  render() {
    const representation = this.state.representation;
    let content;
    if (representation !== undefined && representation !== null) {
      content = <div />;
    } else {
      content = <CircularProgress />;
    }

    return (
      <div className="container">
        <div className="diagram-main">
          <div ref={this.siriusDom} id="sirius" className="sprotty">
            {content}
          </div>
        </div>
        <div className="palette-main">
          <h2>Layers</h2>
          <div id="layers-palette" />
        </div>
      </div>
    );
  }

  componentDidMount() {
    const dom = this.siriusDom.current;
    if (dom == null) {
      return;
    }
    const { resource, representationName } = this.props;
    getAIRDResource(resource).then(airdResource => {
      airdResource.representations.forEach(representation => {
        if (representationName === representation.name) {
          this.setState({ representation });
          initializeSiriusDiagram(
            airdResource.project,
            airdResource.name,
            representation.name,
            `${HOST}:${PORT}`,
            dom.id
          );
          return;
        }
      });
    });
  }
}
export default withRouter(RepresentationViewer);
