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
  endpoint: `http://prism-Publi-QFLSI7Z8T7FQ-426721346.us-east-1.elb.amazonaws.com`,
  secret: `protecting-my-prisma-server`
});
exports.prisma = new exports.Prisma();
