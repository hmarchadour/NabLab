import React, { Component } from "react";
import AddProject from "../components/AddProject";
import Breadcrumb from "../components/Breadcrumb";
import {
  getProjects,
  Project,
  deleteProject
} from "../services/ProjectServices";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps<any> {}

interface State {
  projects: Project[];
}

export class ProjectsPage extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { projects: [] };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    getProjects().then(projects => {
      this.setState({ projects });
    });
  }

  handleRefresh = () => {
    this.refresh();
  };
  render() {
    return (
      <div>
        <Breadcrumb />
        <List component="nav">
          {this.state.projects.map(project => (
            <ListItem
              button
              key={project.name}
              onClick={() => {
                this.props.history.push("/" + project.name);
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={project.name} />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Delete"
                  onClick={this.handleDelete.bind(this, project.name)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <AddProject onRefresh={this.handleRefresh.bind(this)} />
      </div>
    );
  }

  handleDelete(projectName) {
    deleteProject(projectName).then(deleted => {
      if (deleted) {
        this.refresh();
      }
    });
  }
}
export default withRouter(ProjectsPage);
