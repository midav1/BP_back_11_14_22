const indexR = require("./index");
const usersR = require("./users");
const catsR = require("./categories");
const itemsR = require("./items");
const uploadR = require("./upload");
const activateR = require("./activate");
const cloudR = require("./cloud");
const lotsR = require("./lots");
exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/categories",catsR);
  app.use("/items",itemsR);
  app.use("/upload",uploadR);
  app.use("/cloud",cloudR);
  app.use("/activate",activateR);
  app.use("/lots",lotsR);
}