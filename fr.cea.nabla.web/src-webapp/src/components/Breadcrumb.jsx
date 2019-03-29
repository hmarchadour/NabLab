import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/lab/Breadcrumbs";

import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";

import { Link as RouterLink } from "react-router-dom";

const styles = theme => ({
  root: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  link: {
    display: "flex"
  },
  icon: {
    marginRight: theme.spacing.unit / 2,
    width: 20,
    height: 20
  }
});

export class Breadcrumb extends Component {
  render() {
    const { classes, projectName } = this.props;
    const pathArray =
      this.props.resourcePath !== undefined
        ? this.props.resourcePath.split("/")
        : [];
    const projectPath = [];
    let computedPath = "";
    for (let subPath of pathArray) {
      computedPath += "/" + encodeURIComponent(subPath);
      projectPath.push({ path: computedPath, name: subPath });
    }
    return (
      <Paper className={classes.root}>
        <Breadcrumbs arial-label="Breadcrumb">
          <Link
            component={RouterLink}
            color="inherit"
            to={"/"}
            className={classes.link}
          >
            <HomeIcon className={classes.icon} />
          </Link>
          {projectName !== undefined && (
            <Link
              component={RouterLink}
              color="inherit"
              to={"/" + projectName}
              className={classes.link}
            >
              <Typography color="textPrimary" className={classes.link}>
                {projectName}
              </Typography>
            </Link>
          )}
          {projectPath.map(item => (
            <Link
              component={RouterLink}
              color="inherit"
              to={"/" + projectName + item.path}
              className={classes.link}
              key={item.path}
            >
              <Typography
                color="textPrimary"
                className={classes.link}
                key={item.name}
              >
                {item.name}
              </Typography>
            </Link>
          ))}

          {this.props.representationName !== undefined && (
            <Typography color="textPrimary" className={classes.link}>
              {this.props.representationName}
            </Typography>
          )}
        </Breadcrumbs>
      </Paper>
    );
  }
}

Breadcrumb.propTypes = {
  classes: PropTypes.object.isRequired,
  projectName: PropTypes.string,
  resourcePath: PropTypes.string
};

export default withStyles(styles)(Breadcrumb);
