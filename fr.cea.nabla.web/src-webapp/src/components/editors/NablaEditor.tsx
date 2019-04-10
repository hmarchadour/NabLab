import React, { Component } from "react";
import "./NablaEditor.css";
import classNames from "classnames";
import { LSPServices } from "../../services/LSPServices";
import { getTextFile, updateTextFile } from "../../services/FileServices";

import Button from "@material-ui/core/Button";

import { Resource } from "../../dto/Resource";
import { withStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import MathJax from "react-mathjax-preview";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  button: {
    margin: "10px"
  },
  buttonsWrapper: {
    "text-align": "left"
  }
});

interface Props {
  resource: Resource;
  classes: Object;
}

interface State {
  formula: string | null;
  height: number;
  width: number;
}
class NablaEditor extends Component<Props, State> {
  private editorDom: React.RefObject<HTMLDivElement>;

  private editor: monaco.editor.IStandaloneCodeEditor | null;

  private lspService: LSPServices;

  constructor(props: any) {
    super(props);
    this.state = {
      formula: null,
      height: window.innerHeight,
      width: window.innerWidth
    };
    this.lspService = new LSPServices();
    this.editorDom = React.createRef();
    this.editor = null;
    // This binding is necessary to make `this` work in the callback
    this.save = this.save.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    const dom = this.editorDom.current;
    const { resource } = this.props;
    if (dom !== null) {
      getTextFile(resource).then(content => {
        this.editor = this.lspService.createLSPEditor(
          dom,
          resource,
          content,
          (formula: string) => {
            this.setState({ formula: "$$" + formula + "$$" });
          }
        );
        var myBinding = this.editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
          function() {
            alert("SAVE pressed!");
          },
          "toto"
        );
      });
    }
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    if (this.editor !== null) {
      this.lspService.deleteLSPEditor(this.editor);
    }
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
    });

    if (this.editor !== null) {
      this.editor.layout();
    }
  }

  render() {
    const classes: any = this.props.classes;
    const { formula } = this.state;
    return (
      <div className="editor-wrapper">
        <div className={classes.buttonsWrapper}>
          <Button
            variant="contained"
            size="small"
            className={classes.button}
            onClick={this.save}
          >
            <SaveIcon
              className={classNames(classes.leftIcon, classes.iconSmall)}
            />
            Save
          </Button>
        </div>
        <div ref={this.editorDom} className="editor" />
        <div>
          {formula !== undefined && formula !== null && (
            <MathJax math={formula} />
          )}
        </div>
      </div>
    );
  }

  handleKeyDown(e: any) {
    console.log(e);
  }

  save(e: any) {
    if (this.editor !== null) {
      const model = this.editor.getModel();
      if (model !== null) {
        const { resource } = this.props;
        updateTextFile(resource, model.getValue()).then(() => {
          console.log("Saved");
        });
      }
    }
  }
}

export default withStyles(styles)(NablaEditor);
