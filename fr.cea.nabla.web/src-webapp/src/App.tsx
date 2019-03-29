import "reflect-metadata";
import React, { Component } from "react";
import "./App.css";
import { Route, Switch, match, Link } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import ResourcePage from "./pages/ResourcePage";
import { available } from "./services/CommonServices";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { version, name } from "../package.json";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 1,
    padding: `${theme.spacing.unit * 2}px 0`,
    "background-color": "#f5f5f5"
  },
  content: {
    "min-height": "700px"
  }
});

class App extends Component<
  { classes: any },
  { loading: boolean; servicesAvailable: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { loading: true, servicesAvailable: false };
  }
  componentDidMount() {
    available().then(serviceRespond => {
      this.setState({
        loading: false,
        servicesAvailable: serviceRespond
      });
    });
  }

  render() {
    const { classes } = this.props;
    const renderResource = (
      {
        match
      }: { match: match<{ projectName: string; resourcePath: string }> },
      ...others
    ) => (
      <ResourcePage
        {...others}
        projectName={match.params.projectName}
        resourcePath={decodeURIComponent(match.params.resourcePath)}
      />
    );

    const renderRepresentation = (
      {
        match
      }: {
        match: match<{
          projectName: string;
          resourcePath: string;
          viewpoint: string;
          representationName: string;
        }>;
      },
      ...others
    ) => (
      <ResourcePage
        {...others}
        projectName={match.params.projectName}
        resourcePath={decodeURIComponent(match.params.resourcePath)}
        representationName={match.params.representationName}
      />
    );

    const renderProject = (
      { match }: { match: match<{ projectName: string }> },
      ...others
    ) => <ProjectPage {...others} projectName={match.params.projectName} />;

    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    if (!this.state.servicesAvailable) {
      return <div>Cannot fetch the server</div>;
    }
    return (
      <div className="App">
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h4" color="inherit">
              NabLab (v{version})
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <Switch>
            <Route exact path="/" component={ProjectsPage} />
            <Route
              path="/:projectName/:resourcePath/:representationName"
              render={renderRepresentation}
            />
            <Route path="/:projectName/:resourcePath" render={renderResource} />
            <Route path="/:projectName" render={renderProject} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
