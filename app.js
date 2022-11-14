const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
// חובה כדי שנוכל לעבוד עם קבצים
const fileUpload = require("express-fileupload");

const {routesInit} = require("./routes/config_routes")
require("./db/mongoconnect");

const app = express();

app.use(cors());

// מפעיל את האפשרות באקספרס לעבוד עם קבצים
app.use(fileUpload({limits:{fileSize: 1024 * 1024 * 5 }}))

app.use(express.json());
// הגדרת תקיית הפאבליק כתקייה ראשית
app.use(express.static(path.join(__dirname,"public")))

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3001
server.listen(port);