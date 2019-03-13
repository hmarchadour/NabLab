import gql from "graphql-tag";
import { client } from "./const";
import { Resource } from "../dto/Resource";
import { AIRDResource } from "../dto/AIRDResource";
import { Representation } from "../dto/Representation";
import { RepresentationDesc } from "../dto/RepresentationDesc";

export function getAIRDResource(resource: Resource): Promise<AIRDResource> {
  return client
    .query<any>({
      query: gql`
        query($projectName: String!, $filePath: String!) {
          viewer {
            project(name: $projectName) {
              resourceByPath(path: $filePath) {
                ... on File {
                  representations(first: 10, after: null) {
                    edges {
                      node {
                        ... on Diagram {
                          name
                          description {
                            identifier
                            viewpoint {
                              identifier
                            }
                          }
                        }
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
      const representations: Representation[] = [];
      if (
        result.data.viewer.project.resourceByPath.representations.edges !==
        undefined
      ) {
        const representationIter =
          result.data.viewer.project.resourceByPath.representations.edges;
        let inc = 1;
        representationIter.forEach(rep => {
          representations.push(
            new Representation(
              rep.node.name + inc,
              rep.node.name,
              new RepresentationDesc(
                rep.node.description.name,
                rep.node.description.viewpoint.name
              )
            )
          );
          inc++;
        });
      }
      let res = new AIRDResource(
        resource.project,
        resource.name,
        resource.path,
        representations
      );
      return res;
    });
}
