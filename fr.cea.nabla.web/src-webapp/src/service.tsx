import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import { HOST, PORT } from "./const";

const client = new ApolloClient({
  uri: `http://${HOST}:${PORT}/api/graphql`
});

export function saveContent(projectName:string, filePath:string, content:string):Promise<any> {
  return client.query<any>({
    query: gql`
    mutation (
      $projectName: String!,
      $filePath: String!,
      $content: String!) {
      updateTextFile(projectName: $projectName, filePath: $filePath, description: { content: $content}) {
        name
      }
    }
    `,
    variables:{
      "projectName": projectName,
      "filePath": filePath,
      "content": content
    }

  }).then(result => {});
}

export function getContent(projectName:string, filePath:string):Promise<string> {
  return client.query<any>({
    query: gql`
    query (
      $projectName: String!,
      $filePath: String!) {
      viewer {
        project(name:$projectName) {
          resourceByPath(path: $filePath) {
            ...on File {
              content
            }
          }
        }
      }
    }
    `,
    variables:{
      "projectName": projectName,
      "filePath": filePath
    }

  }).then(result => result.data.viewer.project.resourceByPath.content);
}