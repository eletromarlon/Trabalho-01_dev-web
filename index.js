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

server.post("/singin", (req, res) => {
	//verificar se o usuario é válido
	let user = false;
	if (user) {
		res.render("loja", {}); //caso o usuario exista vai para /loja
	} else {
		res.render("alert", {});
	}
});

server.get("/singup", (req, res) => {
	res.render("singup", {});
});

server.post("/singup-cadastrar", async (req, res) => {
	var userData = req.body;
	var getUser = await usersRepository.getUsers();
	var userList = JSON.stringify(getUser); //Transformando JSON em objeto
	// Debbugs para entender o body
	// console.log(userData.password[0]);
	// console.log(userData);

	let senha = btoa(userData.password[0]); // para converter de volta é atob

	if (userData.password[0] == userData.password[1]) {
		if (userList.indexOf(userData.email) !== -1) {
			//console.log("E-mail já utilizado!!");
			res.render("recoveryPassword", {});
		} else {
			let users = await usersRepository.setUser(
				// Dados em formato JSON para cadastro no banco
				{
					name: userData.name,
					date: userData.nascimento,
					telefone: userData.telefone,
					genero: userData.genero,
					email: userData.email,
					password: senha, // Password em primeira posicao
				}
			);
			if (users) {
				res.render("singin", {}); // Caso users seja true redireciona para "singin"
			}
		}
	}
});

server.get("/admin", (req, res) => {
	res.render("admin", {});
});

server.get("/admloja", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	res.render("admLoja", { veiculos });
});
server.get("/editLoja", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	let id = req.query.id;
	res.render("editLoja", { veiculos, id });
});
server.get("/addLoja", (req, res) => {
	res.render("addLoja", {});
});
server.get("/veiculoDeletado", async (req, res) => {
	let id = req.query.excluir;
	let veiculos = await veiculosRepository.deleteVeiculo(id);
	res.redirect("/admloja");
});
server.listen(3000, () => {
	console.log(`Server is running on port 3000`);
});
