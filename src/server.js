let express = require("express");
let env = require("dotenv").config();
let path = require("path");

const server = express();

server.use(express.static(path.join(__dirname, "..", "public")));

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");

server.get("/", (req, res) => {
	res.render("index");
});

server.listen(process.env.PORT);
