import React, { Component } from "react";
import { Resource } from "../../dto/Resource";
import { Representation } from "../../dto/Representation";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAIRDResource } from "../../services/SiriusServices";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { URI } from "../../services/const";
interface Props extends RouteComponentProps<any> {
  resource: Resource;

  viewpoint: string;
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
      content = (
        <div>
          TODO : afficher {representation.desc.viewpointName}/
          {representation.desc.representationName}/{representation.name}
        </div>
      );
    } else {
      content = <CircularProgress />;
    }

    return (
      <div>
        <div ref={this.siriusDom} id="sirius" />
        {content}
      </div>
    );
  }

  componentDidMount() {
    const dom = this.siriusDom.current;
    if (dom == null) {
      return;
    }
    const { resource, representationName, viewpoint } = this.props;
    getAIRDResource(resource).then(airdResource => {
      airdResource.representations.forEach(representation => {
        if (
          viewpoint === representation.desc.viewpointName &&
          representationName === representation.name
        ) {
          this.setState({ representation });
          /*initializeSiriusDiagram(
            airdResource.project,
            airdResource.name,
            representation.name,
            URI,
            dom.id
          );*/
          return;
        }
      });
    });
  }
}
export default withRouter(RepresentationViewer);
