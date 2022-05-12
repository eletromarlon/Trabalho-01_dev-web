import { database } from "../db.js";


// Classe para cadastro de usuários no banco;
class UsersRepository {
	async setUser(dados) { 
		let db = await database.connect(); // Conecta-se com o banco
		let insertUser = await db.collection("users").insertOne(dados) // Insere um dado em uma colecao
		return true; //retorna verdade caso tudo tenha funcionado certo
	}
}

export const usersRepository = new UsersRepository();
