import React, { Component } from "react";

import Button from "@material-ui/core/Button";

import { getTextFile } from "../../services/FileServices";
import { Resource } from "../../dto/Resource";
import SaveIcon from "@material-ui/icons/Save";
import MathJax from "react-mathjax-preview";
import CircularProgress from "@material-ui/core/CircularProgress";
interface Props {
  resource: Resource;
}

interface State {
  content: string | null;
}

class DefaultViewer extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { content: null };
  }
  render() {
    const content = this.state.content;
    if (content !== undefined && content !== null) {
      return <pre>{content}</pre>;
    }
    return <CircularProgress />;
  }

  componentDidMount() {
    const { resource } = this.props;
    getTextFile(resource).then(content => {
      this.setState({ content });
    });
  }
}
export default DefaultViewer;
