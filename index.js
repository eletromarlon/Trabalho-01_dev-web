import { database } from "./src/db.js";
import { veiculosRepository } from "./src/database/veiculos.js";
import { usersRepository } from "./src/database/users.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sendMail } from "./src/sendEmail.js";
import basicAuth from "express-basic-auth";
import multerIMPORT from "multer";
import mongo from "mongodb";

const ObjectId = mongo.ObjectId;
const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = await database.connect(); // conecta ao banco de dados
const multer = multerIMPORT;

var loginatual = "";

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

	var getUser = await usersRepository.getUsers();

	getUser.forEach((user) => {
		//Verifica os dados no banco relacionados ao ID -> email
		let email = user.email;

		if (email == req.body.email) {
			loginatual = user._id;
			//console.log(loginatual);
		}
	});

	let user = await usersRepository.getUser(
		req.body.email,
		btoa(req.body.password)
	);

	if (user) {
		res.redirect("/loja");
		// let veiculos = await veiculosRepository.getVeiculos();
		// res.render("loja", { veiculos });
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

	res.render("singin", { erroLogin: false });
});

server.post("/singup-cadastrar", async (req, res) => {
	var userData = req.body;
	userData.status = 0;
	userData.statusLogin = 1;
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
					_id: ObjectId().toHexString(),
					name: userData.name,
					date: userData.nascimento,
					telefone: userData.telefone,
					genero: userData.genero,
					email: userData.email,
					password: senha, // Password em primeira posicao
					status: userData.status,
					statusLogin: userData.statusLogin,
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
		let nome = veiculo.nome;
		let marca = veiculo.marca;

		nome = nome.toLowerCase(); //coloca nome para minusculas
		marca = marca.toLowerCase(); //coloca marca para minusculas

		if (
			nome.indexOf(busca.toLowerCase()) !== -1 ||
			marca.indexOf(busca.toLowerCase()) !== -1
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

server.get("/user-conta", async (req, res) => {
	var getUser = await usersRepository.getUsers();
	let dadosUser = [];

	getUser.forEach((user) => {
		let id = user._id;

		if (id == loginatual) {
			dadosUser.push(user.name);
			dadosUser.push(user.email);
			dadosUser.push(user.password);
			dadosUser.push(user.date);
			dadosUser.push(user.telefone);
			dadosUser.push(user.genero);
		}
	});

	res.render("conta", { dados: dadosUser });
});

server.get("/editar-perfil", async (req, res) => {
	var getUser = await usersRepository.getUsers();
	let dadosUser = [];

	getUser.forEach((user) => {
		let id = user._id;

		if (id == loginatual) {
			dadosUser.push(user.name);
			dadosUser.push(user.email);
			dadosUser.push(user.password);
			dadosUser.push(user.date);
			dadosUser.push(user.telefone);
			dadosUser.push(user.genero);
		}
	});
	res.render("editPerfil", { dados: dadosUser });
});

server.post("/update-perfil", async (req, res) => {
	let users = await usersRepository.updateUser(
		req.body.nome,
		req.body.email,
		req.body.nascimento,
		req.body.telefone,
		req.body.genero,
		loginatual
	);

	var getUser = await usersRepository.getUsers();
	let dadosUser = [];

	getUser.forEach((user) => {
		let id = user._id;

		if (id == loginatual) {
			dadosUser.push(user.name);
			dadosUser.push(user.email);
			dadosUser.push(user.password);
			dadosUser.push(user.date);
			dadosUser.push(user.telefone);
			dadosUser.push(user.genero);
		}
	});
	res.render("editPerfil", { dados: dadosUser });
});

server.get("/alterar-senha", (req, res) => {
	res.render("alterarSenhaConta", {});
});
server.get("/meus-alugueis", (req, res) => {
	res.render("meusAlugueis", {});
});

server.post("/loja-alugar", async (req, res) => {
	var dados = req.body;
	let aluguel = await veiculosRepository.setAluguel(
		// Dados em formato JSON para cadastro no banco
		{
			_id: ObjectId().toHexString(),
			veiculoId: req.query.car,
			userEmail: loginatual,
			inicioAluguel: dados.dataini,
			fimAluguel: dados.datafim,
			pagamento: dados.pagamento,
			status: 1,
		}
	);

	if (aluguel) {
		res.render("meusAlugueis", {});
	}
});

server.post("/admloja", async (req, res) => {
	let password = btoa(req.body.password);
	let email = req.body.email;

	let usuario = await usersRepository.getUser(email, password);

	if (usuario.statusLogin == 1) {
		let veiculos = await veiculosRepository.getVeiculos();
		res.render("admLoja", { veiculos });
	} else {
		console.log("SEM ACESSO AO LOGIN!");
	}
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

server.post("/editLoja", upload.single("filepond"), async (req, res) => {
	let veiculo;

	if (req.file != undefined) {
		let src = "/images/" + req.file.filename;

		veiculo = await veiculosRepository.updateVeiculo({
			_id: req.body._id,
			nome: req.body.nome,
			marca: req.body.marca,
			cor: req.body.cor,
			diaria: req.body.diaria,
			foto: src,
		});
	} else {
		veiculo = await veiculosRepository.updateVeiculo({
			_id: req.body._id,
			nome: req.body.nome,
			marca: req.body.marca,
			cor: req.body.cor,
			diaria: req.body.diaria,
		});
	}
	if (veiculo) {
		res.redirect("/admLoja");
	} else {
		res.render("/addloja", { cad: false });
	}
});

server.get("/veiculoDeletado", async (req, res) => {
	let veiculo = await veiculosRepository.deleteVeiculo(req.query.excluir);

	if (veiculo) {
		res.redirect("/admLoja");
	} else {
		res.render("/addloja", { cad: false });
	}
});

server.get("/addLoja", (req, res) => {
	res.render("addLoja", { cad: false });
});

server.post("/addLoja", upload.single("filepond"), async (req, res, next) => {
	//console.log(req.file)

	let src = "/images/" + req.file.filename;

	let veiculos = await veiculosRepository.setVeiculo({
		_id: ObjectId().toHexString(),
		nome: req.body.nome,
		marca: req.body.marca,
		cor: req.body.cor,
		diaria: req.body.diaria,
		foto: src,
		status: 1,
	});
	if (veiculos) {
		res.redirect("/admLoja");
	} else {
		res.render("/addloja", { cad: false });
	}
});

server.get("/admAlugueis", (req, res) => {
	res.render("admAlugueis", {});
});

server.get("/admUsuarios", async (req, res) => {
	let usuarios = await usersRepository.getUsersADM();

	res.render("admUsuarios", { usuarios });
});

server.post("/addADM", async (req, res) => {
	var userData = req.body;
	userData.status = 1;
	userData.statusLogin = 1;
	var getUser = await usersRepository.getUsers();
	var userList = JSON.stringify(getUser); //Transformando JSON em objeto
	// Debbugs para entender o body
	// console.log(userData.password[0]);
	// console.log(userData);

	let senha = btoa(userData.password[0]); // para converter de volta é atob

	if (userList.indexOf(userData.email) !== -1) {
		console.log("E-mail já utilizado!!");
		res.render("recoveryPassword", { error: true });
	} else {
		let users = await usersRepository.setUser(
			// Dados em formato JSON para cadastro no banco
			{
				_id: ObjectId().toHexString(),
				name: userData.nome,
				telefone: userData.telefone,
				email: userData.email,
				password: senha, // Password em primeira posicao
				status: userData.status,
				statusLogin: userData.statusLogin,
			}
		);
		if (users) {
			res.render("admin", { erroLogin: "" }); // Caso users seja true redireciona para "singin"
		}
	}

});

server.get("/statusLoginAdm", async (req, res) => {
	let usuario = await usersRepository.getUser(
		req.query.email,
		req.query.password
	);

	if (req.query.statusLogin == 1) {
		usuario.statusLogin = 1;
	} else {
		usuario.statusLogin = 0;
	}

	let updateUsuario = await usersRepository.updateStatusLoginUserADM(usuario);

	let usuarios = await usersRepository.getUsersADM();

	if (updateUsuario) {
		res.render("admUsuarios", { usuarios });
	} else {
		console.log("DEU RUIM");
	}
});

server.get("/admAddUsuario", (req, res) => {
	res.render("admAddUsuario", {});
});

server.get("/admEditUsuario", async (req, res) => {
	let id = req.query.user;
	let usuarios = await usersRepository.getUsersADM();
	let nome = "";
	let email = "";
	let password = "";
	let telefone = "";

	for (let i = 0; i < usuarios.length; i++) {
		if (usuarios[i]._id == id) {
			nome = usuarios[i].name;
			email = usuarios[i].email;
			password = usuarios[i].password;
			telefone = usuarios[i].telefone;
		}
	}
	res.render("admEditUsuario", { nome, email, password, telefone, id });
});

server.post("/updateUserADM", async (req, res) => {

 	let userData  = req.body

	let senha = btoa(userData.password);

	let updateUser = await usersRepository.updateUserADM(
		// Dados em formato JSON para cadastro no banco
		{
			_id: userData.id,
			name: userData.nome,
			telefone: userData.telefone,
			email: userData.email,
			password: senha // Password em primeira posicao
		}
	);

	let usuarios = await usersRepository.getUsersADM();

		if (updateUser) {
			res.render("admUsuarios", { usuarios });
		} else {
			console.log("DEU RUIM");
		}

});

server.listen(3000, () => {
	console.log(`Server is running on port 3000`);
});
