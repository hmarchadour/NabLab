import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient from "apollo-boost";
import * as monaco from "monaco-editor-core";
import { createLSPEditor } from './lsp';
import { getContent, saveContent } from './service';
const client = new ApolloClient({
  uri: "http://localhost:5007/api/graphql"
});


const projectName = "Sample";
const filePath = "mathfunctions.nabla";

class App extends Component {

  private editorDom: React.RefObject<HTMLDivElement>;

  private editor: monaco.editor.IStandaloneCodeEditor|null;


  constructor(props:any) {
    super(props);
    this.editorDom = React.createRef();
    this.editor = null;
    // This binding is necessary to make `this` work in the callback
    this.save = this.save.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const dom = this.editorDom.current;
    if(dom!== null) {
      getContent(projectName, filePath).then(content => {
        this.editor = createLSPEditor(dom, projectName, filePath, content);
        var myBinding = this.editor .addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function() {
          alert('SAVE pressed!');
      }, "toto");
    });
    } 
  }

  render() {
    return (
      <div className="App" onKeyDown={this.handleKeyDown}>
       <button onClick={this.save}> Save</button>
       <div ref={this.editorDom} id="container2">
       </div>
      </div>
    );
  }

  handleKeyDown(e:any) {
    console.log(e);
  }

   save(e:any) {
    if(this.editor !== null) {
      const model = this.editor.getModel();
      saveContent(projectName, filePath,model.getValue()).then(
        () => {
          console.log("Saved");
        }
      );
    }
  }
}

export default App;
