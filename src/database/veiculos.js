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
}

export const veiculosRepository = new VeiculosRepository();
