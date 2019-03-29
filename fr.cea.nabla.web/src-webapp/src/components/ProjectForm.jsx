import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import { createProject } from "../services/ProjectServices";
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

class ProjectForm extends React.Component {
  state = {
    project: "",
    saving: false,
    error: false
  };

  handleSave = () => {
    this.setState({ saving: true });
    createProject(this.state.project).then(success => {
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
    this.setState({ project: event.target.value });
  };

  render() {
    const { classes } = this.props;

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
          placeholder="Edit the project name here"
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

ProjectForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProjectForm);
