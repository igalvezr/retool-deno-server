//@deno-types="npm:@types/express"
import express from "express";
import users_db from "../db/users-db.ts";
import { auth_token } from "./auth.ts";
import doSomethig from "../db/mongo/client.ts";
import getUsers from "../db/mongo/get-users.ts";
import { validateBody } from "./auth.ts";
import createUser from "../db/mongo/create-user.ts";

const users_router = express.Router();

users_router.use(auth_token);

users_router.get("/users", async (_req, res) => {
    const users = await doSomethig(getUsers);
    res.json(users);
});

users_router.post("/user", validateBody, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Invalid data" });
        return;
    }

    const insertedId = await doSomethig(createUser({ username, password }));

    res.json({ ok: `User created with id ${insertedId}` });
});

export default users_router;
