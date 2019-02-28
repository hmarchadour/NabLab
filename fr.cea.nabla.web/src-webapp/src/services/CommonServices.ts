import { URI_API } from "./const";

export function available(): Promise<boolean> {
  return fetch(URI_API, {
    method: "get",
    mode: "no-cors"
  })
    .then(() => true)
    .catch(e => false);
}
