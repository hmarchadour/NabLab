import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import FolderIcon from "@material-ui/icons/Folder";
import CodeIcon from "@material-ui/icons/Code";
import ResourceForm from "./ResourceForm";

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
    outline: "none"
  }
});

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

class AddResource extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAddResource = () => {
    this.props.onRefresh();
    this.setState({ open: false });
  };

  render() {
    const { classes, folder, ...others } = this.props;
    const title = folder ? " Create a folder" : " Create a file";
    return (
      <span>
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.fab}
          onClick={this.handleOpen}
        >
          <AddIcon />
          {folder ? <FolderIcon /> : <CodeIcon />}
        </Fab>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              {title}
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description" />
            <ResourceForm
              folder={folder}
              {...others}
              onSubmit={this.handleAddResource}
            />
          </div>
        </Modal>
      </span>
    );
  }
}

export default withStyles(styles)(AddResource);
