import gql from "graphql-tag";
import { client } from "./const";
import { Resource } from "../dto/Resource";
export function deleteFolder(folder: Resource): Promise<boolean> {
  const lastIndex = folder.path.lastIndexOf("/");
  let containerPath = lastIndex > 0 ? folder.path.substr(0, lastIndex) : "";
  return client
    .mutate<any>({
      mutation: gql`
        mutation(
          $projectName: String!
          $containerPath: String!
          $folderName: String!
        ) {
          deleteFolder(
            projectName: $projectName
            containerPath: $containerPath
            name: $folderName
          )
        }
      `,
      variables: {
        projectName: folder.project,
        containerPath: containerPath,
        folderName: folder.name
      }
    })
    .then(result => {
      client.resetStore();
      return result.data.deleteFolder !== undefined;
    });
}

export function createFolder(
  container: Resource | string,
  folderName: string
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
          $folderName: String!
        ) {
          createFolder(
            projectName: $projectName
            containerPath: $containerPath
            name: $folderName
          ) {
            name
          }
        }
      `,
      variables: {
        projectName: projectName,
        containerPath: containerPath,
        folderName: folderName
      }
    })
    .then(result => {
      client.resetStore();
      return result.data.createFolder !== undefined;
    });
}
