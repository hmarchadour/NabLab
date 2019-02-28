import gql from "graphql-tag";
import { client } from "./const";

export class Resource {
  constructor(public name: string, public path: string) {}
}
export function getResources(projectName: string): Promise<Resource[]> {
  return client
    .query<any>({
      query: gql`
        query($projectName: String!) {
          viewer {
            project(name: $projectName) {
              resources(first: 10, after: null) {
                edges {
                  node {
                    name
                    path
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        projectName: projectName
      }
    })
    .then(result => {
      const edges = result.data.viewer.project.resources.edges;
      const resources: Resource[] = [];
      edges.forEach(edge => {
        const name = edge.node.name;
        const path = edge.node.path;
        resources.push(new Resource(name, path));
      });
      return resources;
    });
}
export function updateTextFile(
  projectName: string,
  filePath: string,
  content: string
): Promise<boolean> {
  return client
    .mutate<any>({
      mutation: gql`
        mutation($projectName: String!, $filePath: String!, $content: String!) {
          updateTextFile(
            projectName: $projectName
            filePath: $filePath
            description: { content: $content }
          ) {
            name
          }
        }
      `,
      variables: {
        projectName: projectName,
        filePath: filePath,
        content: content
      }
    })
    .then(result => {
      client.resetStore();
      return result.data.updateTextFile !== undefined;
    });
}
export function createTextFile(
  projectName: string,
  fileName: string
): Promise<boolean> {
  // To debug
  return client
    .mutate<any>({
      mutation: gql`
        mutation(
          $projectName: String!
          $containerPath: String!
          $description: FileCreationDescription!
        ) {
          createFile(
            projectName: $projectName
            containerPath: $containerPath
            description: $description
          )
        }
      `,
      variables: {
        projectName,
        containerPath: "",
        description: {
          kind: "plain/text",
          name: fileName
        }
      }
    })
    .then(result => {
      client.resetStore();
      return result.data.createFile !== undefined;
    });
}

export function deleteFile(
  projectName: string,
  fileName: string
): Promise<any> {
  // To debug
  return client
    .mutate<any>({
      mutation: gql`
        mutation(
          $projectName: String!
          $containerPath: String!
          $fileName: String!
        ) {
          deleteFile(
            projectName: $projectName
            containerPath: $containerPath
            fileName: $fileName
          )
        }
      `,
      variables: {
        projectName: projectName,
        containerPath: "",
        fileName: fileName
      }
    })
    .then(result => {
      client.resetStore();
      return result.data.deleteFile !== undefined;
    });
}

export function getContent(
  projectName: string,
  filePath: string
): Promise<string> {
  return client
    .query<any>({
      query: gql`
        query($projectName: String!, $filePath: String!) {
          viewer {
            project(name: $projectName) {
              resourceByPath(path: $filePath) {
                ... on File {
                  content
                }
              }
            }
          }
        }
      `,
      variables: {
        projectName: projectName,
        filePath: filePath
      }
    })
    .then(result => {
      let res = "";
      if (result.data.viewer.project !== undefined) {
        res = result.data.viewer.project.resourceByPath.content;
      }
      return res;
    });
}
