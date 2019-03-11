import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import { Resource } from "../dto/Resource";
import { createFile } from "../services/FileServices";
import { createFolder } from "../services/FolderServices";
import SaveIcon from "@material-ui/icons/Save";

const styles = theme => ({
  container: {
    display: "flex"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  iconSmall: {
    fontSize: 20
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100 %"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  }
});

interface Props {
  container: Resource | string;
  folder?: boolean;
  history: History;

  classes: any;
  onSubmit: () => void;
}

interface State {
  resourceName: string;
  saving: boolean;
  error: boolean;
}

class ResourceForm extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { resourceName: "", saving: false, error: false };
  }

  handleSave = () => {
    this.setState({ saving: true });
    const createFn = this.props.folder
      ? createFolder(this.props.container, this.state.resourceName)
      : createFile(this.props.container, this.state.resourceName);
    createFn.then(success => {
      if (success) {
        this.props.onSubmit();
      } else {
        this.setState({ saving: false, error: true });
      }
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.handleSave();
  };

  handleChange = event => {
    this.setState({ resourceName: event.target.value });
  };

  render() {
    const { classes, folder, container } = this.props;
    const title = folder
      ? "Edit the folder name here"
      : " Edit the file name here";
    return (
      <form
        onSubmit={this.handleSubmit}
        className={classes.container}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-full-width"
          label="Name"
          style={{ margin: 8 }}
          onChange={this.handleChange}
          placeholder={title}
          fullWidth
          margin="normal"
        />
        <div className={classes.buttons}>
          <IconButton
            color="primary"
            className={classes.button}
            component="span"
            onClick={this.handleSave}
          >
            <SaveIcon />
            Save
          </IconButton>
        </div>
      </form>
    );
  }
}

export default withStyles(styles)(ResourceForm);
