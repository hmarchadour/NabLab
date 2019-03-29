import React, { Component } from "react";
import { getTextFile } from "../../services/FileServices";
import { Resource } from "../../dto/Resource";
import { AIRDResource } from "../../dto/AIRDResource";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAIRDResource } from "../../services/SiriusServices";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import InsertChart from "@material-ui/icons/InsertChart";

import { withRouter, RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps<any> {
  resource: Resource;
}

interface State {
  content: string | null;
  airdResource: AIRDResource | null;
}

class AIRDViewer extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { content: null, airdResource: null };
  }
  render() {
    const airdResource = this.state.airdResource;
    if (airdResource !== undefined && airdResource !== null) {
      return (
        <div>
          <List component="nav">
            {airdResource.representations.map(representation => (
              <ListItem
                button
                key={representation.id}
                onClick={() => {
                  this.props.history.push(
                    "/" +
                      airdResource.project +
                      "/" +
                      encodeURIComponent(airdResource.path) +
                      "/" +
                      encodeURIComponent(representation.name)
                  );
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <InsertChart />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={representation.name} />
              </ListItem>
            ))}
          </List>
        </div>
      );
    }
    return <CircularProgress />;
  }

  componentDidMount() {
    const { resource } = this.props;
    getAIRDResource(resource).then(airdResource => {
      this.setState({ airdResource });
    });
    getTextFile(resource).then(content => {
      this.setState({ content });
    });
  }
}
export default withRouter(AIRDViewer);
