const indexR = require("./index");
const usersR = require("./users");
const catsR = require("./categories");
const uploadR = require("./upload");
const activateR = require("./activate");
const temppasswordR = require("./temppassword");
const cloudR = require("./cloud");
const lotsR = require("./lots");
exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/categories",catsR);
  app.use("/upload",uploadR);
  app.use("/cloud",cloudR);
  app.use("/activate",activateR);
  app.use("/temppassword",temppasswordR);
  app.use("/lots",lotsR);
}