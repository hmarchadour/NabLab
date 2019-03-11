import React, { Component } from "react";
import AddProject from "../components/AddProject";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import CodeIcon from "@material-ui/icons/Code";

import { withRouter, RouteComponentProps } from "react-router-dom";
import AddResource from "../components/AddResource";
import { Resource } from "../dto/Resource";
import { getSubResources, deleteResource } from "../services/ResourceServices";
import { History } from "history";

interface Props extends RouteComponentProps<any> {
  resource: Resource;
  history: History;
}

interface State {
  resources: Resource[];
}

export class FolderContents extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { resources: [] };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps) {
    const { resource } = this.props;
    if (resource.path !== prevProps.resource.path) {
      this.refresh();
    }
  }

  refresh() {
    const { resource } = this.props;
    getSubResources(resource).then(resources => {
      this.setState({ resources });
    });
  }

  handleRefresh = () => {
    this.refresh();
  };
  render() {
    return (
      <div>
        <List component="nav">
          {this.state.resources.map(resource => (
            <ListItem
              button
              key={resource.name}
              onClick={() => {
                this.props.history.push(
                  "/" +
                    resource.project +
                    "/" +
                    encodeURIComponent(resource.path)
                );
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  {resource.isFolder ? <FolderIcon /> : <CodeIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={resource.name} />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Delete"
                  onClick={this.handleDelete.bind(this, resource)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <AddResource
          {...this.props}
          container={this.props.resource}
          onRefresh={this.handleRefresh.bind(this)}
        />
        <AddResource
          {...this.props}
          folder={true}
          container={this.props.resource}
          onRefresh={this.handleRefresh.bind(this)}
        />
      </div>
    );
  }

  handleDelete(resource) {
    deleteResource(resource).then(deleted => {
      if (deleted) {
        this.refresh();
      }
    });
  }
}
export default withRouter(FolderContents);
