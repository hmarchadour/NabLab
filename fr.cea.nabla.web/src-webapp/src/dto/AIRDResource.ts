import { Resource } from "./Resource";
import { Representation } from "./Representation";

export class AIRDResource {
  constructor(
    public project: string,
    public name: string,
    public path: string,
    public representations: Representation[]
  ) {}
}
