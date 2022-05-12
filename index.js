import { database } from "./src/db.js";
import { veiculosRepository } from "./src/database/veiculos.js";
import { usersRepository } from "./src/database/users.js";
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

server.post("/singup-cadastrar", (req, res) => {
	let userData = req.body;

	// Debbugs para entender o body
	// console.log(userData.password[0]);
	// console.log(userData);

	if (userData.password[0] == userData.password[1]) {
		let users = usersRepository.setUser(
			// Dados em formato JSON para cadastro no banco
			{
				name: userData.name,
				date: userData.nascimento,
				telefone: userData.telefone,
				genero: userData.genero,
				email: userData.email,
				password: userData.password[0], // Password em primeira posicao
			}
		);
		if (users) {
			res.render("singin", {}); // Caso users seja true redireciona para "singin"
		}
	} else {
		res.render("singup", {}); // Caso password errado retorna para "singup"
	}
});

server.get("/admin", (req, res) => {
	res.render("admin", {});
});

server.get("/admloja", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	res.render("admLoja", { veiculos });
});

server.listen(3000, () => {
	console.log(`Server is running on port 3000`);
});
