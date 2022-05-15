import { database } from "./src/db.js";
import { veiculosRepository } from "./src/database/veiculos.js";
import { usersRepository } from "./src/database/users.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sendMail } from "./src/sendEmail.js";
import basicAuth from "express-basic-auth";
import multerIMPORT from "multer";

const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = await database.connect(); // conecta ao banco de dados
const multer = multerIMPORT;

// Enable CORS
server.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

// Configuração de armazenamento
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		//pasta de destino
		cb(null, "public/images/");
	},
	filename: function (req, file, cb) {
		// Extração da extensão do arquivo original:
		const extensaoArquivo = file.originalname.split(".")[1];

		// Cria um código randômico que será o nome do arquivo
		//const novoNomeArquivo = require('crypto')
		//  .randomBytes(64)
		//.toString('hex');

		// Indica o novo nome do arquivo:
		cb(null, `${file.originalname.split(".")[0]}.${extensaoArquivo}`);
	},
});

const upload = multer({ storage });

server.use(express.urlencoded({ extended: true })); //habilita o uso do post dentro das rotas
server.use(express.static(path.join(__dirname + "/public"))); //habilita o uso de arquivos estaticos
server.set("views", path.join(__dirname + "/src/views")); //define a pasta de views
server.set("view engine", "ejs"); //define o motor de views

const mongoAuthorizer = (email, password, cb) => {
	let status = 1;
	password = btoa(password);
	db.collection("users")
		.findOne({ email, password, status })
		.then((user) => {
			return cb(null, !!user);
		});
};


server.use(
	"/admloja",
	basicAuth({
		authorizer: mongoAuthorizer,
		authorizeAsync: true,
		challenge: true,
	})
);

//Página inicial
server.get("/", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	res.render("index", { veiculos });
});

// Parte do Login e Cadastrar
server.get("/singin", (req, res) => {
	res.render("singin", { erroLogin: false });
});

server.post("/singin", async (req, res) => {
	//verificar se o usuario é válido
	let user = await usersRepository.getUser(
		req.body.email,
		btoa(req.body.password)
	);

	if (user) {
		let veiculos = await veiculosRepository.getVeiculos();
		res.render("loja", { veiculos });
	} else {
		res.render("singin", { erroLogin: true });
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
		if (getUser[i].email == email) {
			var senha = getUser[i].password;
		}
	}

	if (senha) {
		senha = atob(senha);
		sendMail.run(senha, email);
	} else {
		res.send("<h1>Email não encontrado<h1>");
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
					status: userData.status,
				}
			);
			if (users) {
				res.render("singin", { erroLogin: "" }); // Caso users seja true redireciona para "singin"
			}
		}
	}
});

// Parte do Usuário
server.get("/loja", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	res.render("loja", { veiculos });
});

server.post("/lojabuscar", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	let busca = req.body.busca;
	let resultado = [];
	veiculos.forEach((veiculo) => {
		if (
			veiculo.nome.indexOf(busca) !== -1 ||
			veiculo.marca.indexOf(busca) !== -1
		) {
			resultado.push(veiculo);
		}
	});
	res.render("loja", { veiculos: resultado });
});

server.get("/loja-alugar", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	let car = req.query.car;
	res.render("lojaAlugar", { veiculos, car });
});

// Parte do Administrator
server.get("/admin", (req, res) => {
	res.render("admin", {});
});

server.get("/admloja", async (req, res) => {
	let basic = Buffer.from(req.headers.authorization.split(" ")[1], "base64")
		.toString()
		.split(":");
	let veiculos = await veiculosRepository.getVeiculos();
	res.render("admLoja", { veiculos });
});

server.get("/editLoja", async (req, res) => {
	let veiculos = await veiculosRepository.getVeiculos();
	let id = req.query.id;
	
	res.render("editLoja", { veiculos, id });
});

server.post("/editLoja", upload.single('filepond'), async (req, res) => {
	
	let veiculo;
	
	if(req.file != undefined){
		
		let src = "/images/" + req.file.filename;
	
	    veiculo = await veiculosRepository.updateVeiculo({
			_id: req.body._id,
			nome: req.body.nome,
			marca: req.body.marca,
			cor: req.body.cor,
			diaria: req.body.diaria,
			foto: src
		});
	}else{
	    veiculo = await veiculosRepository.updateVeiculo({
			_id: req.body._id,
			nome: req.body.nome,
			marca: req.body.marca,
			cor: req.body.cor,
			diaria: req.body.diaria
		});
	}
	if (veiculo) {
		res.redirect("/admLoja");
	} else {
		res.render("/addloja", { cad: false });
	}
	
});

server.get("/addLoja", (req, res) => {
	res.render("addLoja", { cad: false });
});

server.post("/addLoja", upload.single('filepond'), async (req, res, next) => {	
	
	//console.log(req.file)
	
	let src = "/images/" + req.file.filename;
	
	let veiculos = await veiculosRepository.setVeiculo({
		nome: req.body.nome,
		marca: req.body.marca,
		cor: req.body.cor,
		diaria: req.body.diaria,
		foto: src,
		status: 1
	});
	if (veiculos) {
		res.redirect("/admLoja");
	} else {
		res.render("/addloja", { cad: false });
	}
});



server.listen(3000, () => {
	console.log(`Server is running on port 3000`);
});
