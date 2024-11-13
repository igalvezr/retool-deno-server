import { MongoClient } from "mongodb";
import User from "../../interfaces/User.ts";

export default function createUser(user: User) {
    return async (client: MongoClient) => {
        const result = await client
            .db(Deno.env.get("DB_NAME"))
            .collection("users")
            .insertOne(user);

        return result.insertedId;
    };
}
