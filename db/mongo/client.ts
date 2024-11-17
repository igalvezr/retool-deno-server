import "https://deno.land/x/dotenv@v3.2.2/load.ts"; // WARNING: Delete for deployment in Deno deploy
import { MongoClient } from "mongodb";

const client = new MongoClient(Deno.env.get("MONGO_URI") || "else");
console.log(`Client initialized with URI: ${Deno.env.get("MONGO_URI")}`);

export default async function doDatabaseOp(
    callback: (param: MongoClient) => Promise<any> | null
): Promise<any> {
    try {
        await client.connect();
        const result = await callback(client);

        return result;
    } catch (err) {
        console.error("Error while doing a query to mongodb");
        console.error(err);
    } finally {
        await client.close();
    }
}
