import "reflect-metadata";

import path from "node:path";

import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { resolvers } from "./resolvers/all-resolvers";

const main = async () => {
  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

  const server = new ApolloServer({
    schema,
  });

  const { port } = await server.listen();

  console.log(`🚀 HTTP server running on PORT ${port}`);
};

main();
