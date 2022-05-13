import { database } from "./src/db.js";
import { veiculosRepository } from "./src/database/veiculos.js";
import { usersRepository } from "./src/database/users.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sendMail } from "./src/sendEmail.js";
import basicAuth from 'express-basic-auth'

const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = await database.connect(); // conecta ao banco de dados

server.use(express.urlencoded({ extended: true })); //habilita o uso do post dentro das rotas
server.use(express.static(path.join(__dirname + "/public"))); //habilita o uso de arquivos estaticos
server.set("views", path.join(__dirname + "/src/views")); //define a pasta de views
server.set("view engine", "ejs"); //define o motor de views

const mongoAuthorizer = (name, password, cb) => {
	
	let status = 1;
	password = btoa(password); 
	db.collection('users').findOne({name, password, status}).then(user => {
		return cb(null, !!user)
	});
}

server.use('/admloja', basicAuth({authorizer: mongoAuthorizer, authorizeAsync: true, challenge: true}))

server.get("/", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	res.render("index", { veiculos });
});

server.get("/singin", (req, res) => {
	res.render("singin", {erroLogin:''});
});

server.post("/singin", async (req, res) => {
	//verificar se o usuario é válido
	let user = await usersRepository.getUser(req.body.email, btoa(req.body.password));
	
	if (user) {
		res.render("loja", {})
	} else {
		res.render("singin", {erroLogin :'Atenção, dados Inválidos!!!'})
	}
});

server.get("/recovery", (req, res) => {
	res.render("recoveryPassword", { error: false });
});

server.get("/singup", (req, res) => {
	res.render("singup");
});

server.post("/recoveryPasswd", async (req, res) => {
	var email = req.body.email;
	var getUser = await usersRepository.getUsers();
	//var userList = JSON.stringify(getUser);
	var numElementos = Object.keys(getUser).length;

	for (let i = 0; i < numElementos; i++) {
		if (getUser[i].email == email){
			var senha = getUser[i].password;
		}
	}

	if (senha) {
		senha = atob(senha);
		sendMail.run(senha, email);
	} else {
		res.send("<h1>Email não encontrado<h1>")
	}
	// console.log("email em getUser[0] ",getUser[0].email);

	res.render("singin", {});
});

server.post("/singup-cadastrar", async (req, res) => {
	var userData = req.body;
	userData.status = 0;
	var getUser = await usersRepository.getUsers();
	var userList = JSON.stringify(getUser); //Transformando JSON em objeto
	// Debbugs para entender o body
	// console.log(userData.password[0]);
	// console.log(userData);

	let senha = btoa(userData.password[0]); // para converter de volta é atob

	if (userData.password[0] == userData.password[1]) {
		if (userList.indexOf(userData.email) !== -1) {
			//console.log("E-mail já utilizado!!");
			res.render("recoveryPassword", { error: true });
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
					status:userData.status
				}
			);
			if (users) {
				res.render("singin", {erroLogin: ''}); // Caso users seja true redireciona para "singin"
			}
		}
	}
});

server.get("/admin", (req, res) => {
	res.render("admin", {});
});

server.get("/admloja", async (req, res) => {
	let basic = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':')
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
