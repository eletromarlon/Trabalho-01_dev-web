import { database } from "./src/db.js";
import { veiculosRepository } from "./src/database/veiculos.js";

import express from "express";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await database.connect();

const server = express();

server.use(express.static(path.join(__dirname + "/public")));

server.set("views", path.join(__dirname + "/src/views"));
server.set("view engine", "ejs");

server.get("/", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	res.render("index", { veiculos });
});

server.get("/singin", (req, res) => {
	res.render("singin", {});
});

server.listen(3000, () => {
	console.log(`Server is running on port 3000`);
});
