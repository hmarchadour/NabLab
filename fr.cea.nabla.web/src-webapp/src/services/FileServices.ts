import gql from "graphql-tag";
import { client } from "./const";
import { Resource } from "../dto/Resource";

export function getTextFile(resource: Resource): Promise<string> {
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
        projectName: resource.project,
        filePath: resource.path
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

export function updateTextFile(
  resource: Resource,
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
        projectName: resource.project,
        filePath: resource.path,
        content: content
      }
    })
    .then(result => {
      client.resetStore();
      return result.data.updateTextFile !== undefined;
    });
}
export function createFile(
  container: Resource | string,
  fileName: string
): Promise<boolean> {
  let projectName;
  let containerPath;
  if (container instanceof Resource) {
    projectName = container.project;
    containerPath = container.path;
  } else {
    projectName = container;
    containerPath = "";
  }
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
          ) {
            name
          }
        }
      `,
      variables: {
        projectName: projectName,
        containerPath: containerPath,
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

export function deleteFile(file: Resource): Promise<any> {
  const lastIndex = file.path.lastIndexOf("/");
  let containerPath = lastIndex > 0 ? file.path.substr(0, lastIndex) : "";

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
        projectName: file.project,
        containerPath: containerPath,
        fileName: file.name
      }
    })
    .then(result => {
      client.resetStore();
      return result.data.deleteFile !== undefined;
    });
}
