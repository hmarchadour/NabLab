import React, { Component } from "react";

import AddResource from "../components/AddResource";

import {
  getResources,
  Resource,
  deleteFile
} from "../services/ResourceServices";

import Breadcrumb from "../components/Breadcrumb";
import {} from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CodeIcon from "@material-ui/icons/Code";
import DeleteIcon from "@material-ui/icons/Delete";
import { History } from "history";
interface Props extends RouteComponentProps<any> {
  projectName: string;
  history: History;
}

interface State {
  resources: Resource[];
}
class ProjectPage extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { resources: [] };
  }

  render() {
    return (
      <div>
        <Breadcrumb projectName={this.props.projectName} />
        <List component="nav">
          {this.state.resources.map(resource => (
            <ListItem
              button
              key={resource.path}
              onClick={() => {
                this.props.history.push(
                  "/" + this.props.projectName + "/" + resource.path
                );
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  <CodeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={resource.name} />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Delete"
                  onClick={this.handleDelete.bind(this, resource.name)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <AddResource
          {...this.props}
          onRefresh={this.handleRefresh.bind(this)}
        />
      </div>
    );
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    getResources(this.props.projectName).then(resources => {
      this.setState({ resources });
    });
  }

  handleDelete(resourceName) {
    deleteFile(this.props.projectName, resourceName).then(deleted => {
      if (deleted) {
        this.refresh();
      }
    });
  }

  handleRefresh = () => {
    this.refresh();
  };
}

export default withRouter(ProjectPage);
