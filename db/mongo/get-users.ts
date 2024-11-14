import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { MongoClient } from "mongodb";
import User from "../../interfaces/User.ts";

export default async function getUsers(client: MongoClient) {
    const usersArray = await client
        .db(Deno.env.get("DB_NAME"))
        .collection("users")
        .find()
        .toArray();
    console.log(`Users: `);
    usersArray.forEach((user, index) => console.log(`${index}: ${user}`));

    return usersArray;
}

export function getUserByIdAndPassword(user: User) {
    return async (client: MongoClient) => {
        const result = await client
            .db(Deno.env.get("DB_NAME"))
            .collection("users")
            .findOne(user);
        console.log(`User lookup result:`);
        console.log(result);

        return result;
    };
}
