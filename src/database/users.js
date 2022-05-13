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
	
	async getUser(email, password){
		let db = await database.connect();
		let user = await db.collection('users').findOne({email, password})
		return user
	}
}

export const usersRepository = new UsersRepository();