//@deno-types="npm:@types/express"
import express from "express";
import { auth_token } from "./auth.ts";
import doDatabaseOp from "../db/mongo/client.ts";
import getUsers from "../db/mongo/get-users.ts";
import { validateBody } from "./auth.ts";
import createUser from "../db/mongo/create-user.ts";
import deleteUserByUsername from "../db/mongo/delete-user.ts";

const users_router = express.Router();

// Authorize the token of the request
users_router.use(auth_token);

// Get all registered users
users_router.get("/users", async (_req, res) => {
    const users = await doDatabaseOp(getUsers);
    res.json(users);
});

// Create a new user in db
users_router.post("/user", validateBody, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Invalid data" });
        return;
    }

    const insertedId = await doDatabaseOp(createUser({ username, password }));

    res.json({ ok: `User created with id ${insertedId}` });
});

// Delete user by username
users_router.delete("/:username", async (req, res) => {
    const username = req.params.username;

    if (!username) {
        res.status(401).json({ error: "Invalid username" });
        return;
    }

    const result = await doDatabaseOp(deleteUserByUsername(username));

    res.json({
        ok: `${result.deletedCount} document${
            result.deletedCount > 1 ? "s" : ""
        } deleted`,
    });
});

export default users_router;
