import { RepresentationDesc } from "./RepresentationDesc";

export class Representation {
  constructor(
    public id: string,
    public name: string,
    public desc: RepresentationDesc
  ) {}
}
