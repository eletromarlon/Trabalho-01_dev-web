import { database } from "../db.js";

// Classe para cadastro de usuários no banco;
class UsersRepository {
	async setUser(dados) {
		let db = await database.connect(); // Conecta-se com o banco
		let insertUser = await db.collection("users").insertOne(dados) // Insere um dado em uma colecao
		return true; //retorna verdade caso tudo tenha funcionado certo
	}

	async getUsers() {
		let db = await database.connect();
		let usersCollection = await db
			.collection("users")
			.find()
			.toArray();
		return usersCollection;
	}

	async getUsersADM() {
		let db = await database.connect();
		let usersCollection = await db
			.collection("users")
			.find({status:1})
			.toArray();
		return usersCollection;
	}

	async getUser(email, password){

		let db = await database.connect();
		let user = await db.collection("users").findOne({email:email})
		return user
	}

	async updateStatusLoginUserADM(user){
		let db = await database.connect();
		let updateUser = await db.collection("users").updateOne(
			{_id:user._id, status:1},//CRITÉRIO DE UPDATE
			{$set:{statusLogin:user.statusLogin}});
		return user
	}

	async updateUser(nome, email, data, telefone, genero, id ){
		let db = await database.connect();

		let novos = {
			name: nome,
			date: data,
			telefone: telefone,
			genero: genero,
			email: email
		};

		console.log("dentro de updateUser", novos, "\nvalores", nome, email, id );

		let user = await db.collection('users').updateOne({"_id": id},{$set: novos }, { upsert: true }, async (erro, resultado)=> {
			if (erro) throw erro
			await console.log(resultado.modifiedCount + ` Confirmado`);
		});
	}

	async updateUserPassword(id, novaSenha){
		let db = await database.connect();

		let novos = {
			password: novaSenha
		};

		console.log("dentro de updateUser", novos, "\nvalores", id, novaSenha );

		let user = await db.collection('users').updateOne({"_id": id},{$set: novos }, { upsert: true }, async (erro, resultado)=> {
			if (erro) throw erro
			await console.log(resultado.modifiedCount + ` Confirmado`);
		});
	}
}

export const usersRepository = new UsersRepository();
