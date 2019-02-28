import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";

export const FEATURE = "NabLab";
export const LANGUAGE_ID = "nabla";
export const HOST = "localhost";
export const PORT = "5007";
export const URI_API = `http://${HOST}:${PORT}/api`;
export const URI_GRAPHQL = `${URI_API}/graphql`;

const cache = new InMemoryCache();
export const client = new ApolloClient({
  uri: URI_GRAPHQL,
  cache
});
