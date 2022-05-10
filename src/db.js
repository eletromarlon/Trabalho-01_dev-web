import { MongoClient } from "mongodb";

const url = "mongodb://root:rootpwd@localhost:27017/";
const client = new MongoClient(url);
const dbName = "locaCar";

class Database {
	async connect() {
		try {
			await client.connect();
			const db = client.db(dbName);
			console.log("Mongo Connected");
			return db;
		} catch (e) {
			console.log(e);
		}
	}
}
export const database = new Database();
