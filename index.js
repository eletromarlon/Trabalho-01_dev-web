import { database } from "./src/db.js";
import { veiculosRepository } from "./src/database/veiculos.js";

import express from "express";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await database.connect(); // conecta ao banco de dados

const server = express();
server.use(express.urlencoded({ extended: true })); //habilita o uso do post dentro das rotas
server.use(express.static(path.join(__dirname + "/public"))); //habilita o uso de arquivos estaticos

server.set("views", path.join(__dirname + "/src/views")); //define a pasta de views
server.set("view engine", "ejs"); //define o motor de views

server.get("/", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	res.render("index", { veiculos });
});

server.get("/singin", (req, res) => {
	res.render("singin", {});
});

server.get("/singup", (req, res) => {
	res.render("singup", {});
});

server.get("/admin", (req, res) => {
	res.render("admin", {});
});

server.listen(3000, () => {
	console.log(`Server is running on port 3000`);
});
