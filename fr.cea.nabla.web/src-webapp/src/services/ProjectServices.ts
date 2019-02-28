import gql from "graphql-tag";
import { client } from "./const";
export class Project {
  constructor(public name: string, public description: string) {}
}

export function getProjects(): Promise<Project[]> {
  return client
    .query<any>({
      query: gql`
        query {
          viewer {
            projects(first: 10, after: null) {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      `
    })
    .then(result => {
      const edges = result.data.viewer.projects.edges;
      const projects: Project[] = [];
      edges.forEach(edge => {
        const name = edge.node.name;
        const description = edge.node.description;
        projects.push(new Project(name, description));
      });
      return projects;
    });
}

export function getProject(name: string): Promise<Project> {
  return client
    .query<any>({
      query: gql`
        query {
          viewer {
            project(name: $projectName) {
              name
            }
          }
        }
      `
    })
    .then(result => {
      const project = result.data.viewer.project;
      const name = project.node.name;
      const description = project.node.description;
      return new Project(name, description);
    });
}

export function createProject(name: string): Promise<boolean> {
  return client
    .mutate<any>({
      mutation: gql`
        mutation($projectCreationDescription: ProjectCreationDescription!) {
          createProject(description: $projectCreationDescription) {
            description
          }
        }
      `,
      variables: {
        projectCreationDescription: {
          kind: "default",
          name
        }
      }
    })
    .then(result => {
      client.resetStore();
      return result.data.createProject !== undefined;
    });
}

export function deleteProject(projectName: string): Promise<boolean> {
  return client
    .mutate<any>({
      mutation: gql`
        mutation($projectName: String!) {
          deleteProject(projectName: $projectName)
        }
      `,
      variables: {
        projectName: projectName
      }
    })
    .then(result => {
      client.resetStore();
      return result.data.deleteProject !== undefined;
    });
}
