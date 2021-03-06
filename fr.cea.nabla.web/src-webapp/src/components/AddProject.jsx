import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";

import ProjectForm from "./ProjectForm";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
    top: `25%`,
    left: `25%`
  }
});

class AddProject extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAddProject = () => {
    this.props.onRefresh();
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <span>
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.fab}
          onClick={this.handleOpen}
        >
          <AddIcon />
        </Fab>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              Create a project
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description" />
            <ProjectForm onSubmit={this.handleAddProject} />
          </div>
        </Modal>
      </span>
    );
  }
}

export default withStyles(styles)(AddProject);
