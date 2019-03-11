import gql from "graphql-tag";
import { client } from "./const";
import { deleteFile } from "./FileServices";
import { deleteFolder } from "./FolderServices";

import { Resource } from "../dto/Resource";

export function getRootResources(projectName: string): Promise<Resource[]> {
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
                    __typename
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
        const typename = edge.node.__typename;
        resources.push(
          new Resource(projectName, name, path, "Folder" === typename)
        );
      });
      return resources;
    });
}

export function getSubResources(resource: Resource): Promise<Resource[]> {
  return client
    .query<any>({
      query: gql`
        query($projectName: String!, $filePath: String!) {
          viewer {
            project(name: $projectName) {
              resourceByPath(path: $filePath) {
                ... on Folder {
                  resources(first: 10, after: null) {
                    edges {
                      node {
                        name
                        path
                        __typename
                      }
                    }
                  }
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
      const edges = result.data.viewer.project.resourceByPath.resources.edges;
      const resources: Resource[] = [];
      edges.forEach(edge => {
        const name = edge.node.name;
        const path = edge.node.path;
        const typename = edge.node.__typename;
        resources.push(
          new Resource(resource.project, name, path, "Folder" === typename)
        );
      });
      return resources;
    });
}

export function getResource(
  projectName: string,
  path: string
): Promise<Resource> {
  return client
    .query<any>({
      query: gql`
        query($projectName: String!, $filePath: String!) {
          viewer {
            project(name: $projectName) {
              resourceByPath(path: $filePath) {
                name
                path
                __typename
              }
            }
          }
        }
      `,
      variables: {
        projectName: projectName,
        filePath: path
      }
    })
    .then(result => {
      const resourceByPath = result.data.viewer.project.resourceByPath;
      const name = resourceByPath.name;
      const path = resourceByPath.path;
      const typename = resourceByPath.__typename;
      return new Resource(projectName, name, path, "Folder" === typename);
    });
}

export function deleteResource(resource: Resource): Promise<boolean> {
  if (resource.isFolder) {
    return deleteFolder(resource);
  } else {
    return deleteFile(resource);
  }
}
