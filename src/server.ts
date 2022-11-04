import "reflect-metadata";

import express from "express";
import path from "node:path";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { resolvers } from "./resolvers/all-resolvers";
import { config } from "./config";

const main = async () => {
  const app = express();
  const graphQL = "/graphql";

  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const context = {
        req,
        user: req.user,
      };
      return context;
    },
  });

  await server.start()
  server.applyMiddleware({ app, path: graphQL });

  app.listen(config.PORT, () => {
    console.log(`🚀 HTTP server running on PORT ${config.PORT}`)
  })
};

main();
