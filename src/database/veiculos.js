import { database } from "../db.js";

class VeiculosRepository {
	async getVeiculos() {
		let db = await database.connect();
		let veiculosCollection = await db
			.collection("veiculo")
			.find()
			.toArray();
		return veiculosCollection;
	}

	async deleteVeiculo(id) {
		let db = await database.connect();
		let veiculosCollection = await db
			.collection("veiculo")
			.deleteOne({ _id: id });
		return true;
	}
	
	async updateVeiculo(veiculo){
		let db = await database.connect(); // Conecta-se com o banco
		let insertUser = await db.collection("veiculo").updateOne(dados); 
		return true; 
	}

	async setVeiculo(dados) {
		let db = await database.connect(); // Conecta-se com o banco
		let insertUser = await db.collection("veiculo").insertOne(dados); // Insere um dado em uma colecao
		return true; //retorna verdade caso tudo tenha funcionado certo
	}
}

export const veiculosRepository = new VeiculosRepository();
