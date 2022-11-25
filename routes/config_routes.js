const indexR = require("./index");
const usersR = require("./users");
const catsR = require("./categories");
const foodsR = require("./foods");
const uploadR = require("./upload");
const activateR = require("./activate");
const cloudR = require("./cloud");
exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/categories",catsR);
  app.use("/foods",foodsR);
  app.use("/upload",uploadR);
  app.use("/cloud",cloudR);
  app.use("/activate",activateR);
}