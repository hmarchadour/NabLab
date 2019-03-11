export class Resource {
  constructor(
    public project: string,
    public name: string,
    public path: string,
    public isFolder?: boolean
  ) {}
}
