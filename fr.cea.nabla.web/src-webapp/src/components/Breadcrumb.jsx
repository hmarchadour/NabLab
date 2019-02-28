import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';

import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import FolderIcon from '@material-ui/icons/Folder';
import CodeIcon from '@material-ui/icons/Code';

import { Link as RouterLink } from 'react-router-dom';

const styles = theme => ({
  root: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing.unit / 2,
    width: 20,
    height: 20,
  },
});


function Breadcrumb(props) {
  const { classes } = props;
  return (
    <Paper className={classes.root}>
      <Breadcrumbs arial-label="Breadcrumb">
        <Link  component={RouterLink} color="inherit"  to = {"/"} className={classes.link}>
          <HomeIcon className={classes.icon} />
        </Link>
        {props.projectName !== undefined &&
          <Link component={RouterLink} color="inherit" to={"/"+props.projectName} className={classes.link}>
            <FolderIcon className={classes.icon} />
            {props.projectName}
          </Link>
        }
        {props.resourcePath !== undefined &&
          <Typography color="textPrimary" className={classes.link}>
            <CodeIcon className={classes.icon} />
            {props.resourcePath}
          </Typography>
        }
      </Breadcrumbs>
    </Paper>
  );
}

Breadcrumb.propTypes = {
  classes: PropTypes.object.isRequired,
  projectName: PropTypes.string,
  resourcePath: PropTypes.string
};

export default withStyles(styles)(Breadcrumb);