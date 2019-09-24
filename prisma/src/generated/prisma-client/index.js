"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Poster",
    embedded: false
  },
  {
    name: "ImageType",
    embedded: false
  },
  {
    name: "Category",
    embedded: false
  },
  {
    name: "Parish",
    embedded: false
  },
  {
    name: "Deanery",
    embedded: false
  },
  {
    name: "Diocese",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
