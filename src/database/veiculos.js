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
}

export const veiculosRepository = new VeiculosRepository();
