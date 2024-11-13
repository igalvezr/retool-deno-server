import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { MongoClient } from "mongodb";

const client = new MongoClient(Deno.env.get("MONGO_URI") || "else");
console.log(`Deno uri: ${Deno.env.get("MONGO_URI")}`);

export default async function doSomethig(
    callback: (param: MongoClient) => Promise<any> | null
): Promise<any> {
    try {
        await client.connect();
        const result = await callback(client);

        return result;
    } catch {
        console.error("Error while doing a query to mongodb");
    } finally {
        await client.close();
    }
}
