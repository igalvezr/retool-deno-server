import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { MongoClient } from "mongodb";
import User from "../../interfaces/User.ts";

export default async function getUsers(client: MongoClient) {
    const usersArray = await client
        .db(Deno.env.get("DB_NAME"))
        .collection("users")
        .find()
        .toArray();

    return usersArray;
}

export function getUserByUsernameAndPassword({
    username,
    password,
}: User | { username: string; password: string }) {
    return async (client: MongoClient) => {
        const result = await client
            .db(Deno.env.get("DB_NAME"))
            .collection("users")
            .findOne({ username, password });
        console.log(`User lookup result:`);
        console.log(result);

        return result;
    };
}
