import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { MongoClient } from "mongodb";

export default function deleteUserByUsername(username: string) {
    return async (client: MongoClient) => {
        const result = await client
            .db(Deno.env.get("DB_NAME"))
            .collection("users")
            .deleteOne({ username });

        console.log(
            `${result.deletedCount} documents ${
                result.deletedCount === 1 ? "was" : "were"
            } deleted`
        );
        return result;
    };
}
