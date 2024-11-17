import { MongoClient } from "mongodb";

export default function getPermissionsForRole(role_code: string) {
    return async (client: MongoClient) => {
        const result = await client
            .db(Deno.env.get("DB_NAME"))
            .collection("roles")
            .findOne({ code: role_code });

        if (result === null) {
            return null;
        }
        console.log(`Found permissions: ${result.permission_list}`);

        return result.permission_list;
    };
}
