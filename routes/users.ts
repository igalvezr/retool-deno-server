//@deno-types="npm:@types/express"
import express, { Request, Response, NextFunction } from "express";
import { auth_token } from "./auth.ts";
import doDatabaseOp from "../db/mongo/client.ts";
import getUsers from "../db/mongo/get-users.ts";
import { validateBody } from "./auth.ts";
import createUser from "../db/mongo/create-user.ts";
import deleteUserByUsername from "../db/mongo/delete-user.ts";
import getPermissionsForRole from "../db/mongo/get-permissions.ts";

const users_router = express.Router();

// Authorize the token of the request
users_router.use(auth_token);

// Middleware for authorizing read user permissions
async function authReadPermissions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const permissionList: string[] = await doDatabaseOp(
        getPermissionsForRole(req.body.decoded.role_code)
    );

    if (permissionList === null) {
        res.status(401).json({
            error: "No permissions found for role code provided",
        });
        return;
    }

    if (!permissionList.find((el) => el === "user_read")) {
        res.status(401).json({ error: "No read permissions provided" });
        return;
    }

    console.log(
        `Read permission granted for user ${req.body.decoded.username}`
    );

    next();
}

// Middleware for authorizing write permissions
async function authWritePermissions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const permissionList: string[] = await doDatabaseOp(
        getPermissionsForRole(req.body.decoded.role_code)
    );

    if (permissionList === null) {
        res.status(401).json({
            error: "No permissions found for role code provided",
        });
        return;
    }

    if (!permissionList.find((el) => el === "user_write")) {
        res.status(401).json({ error: "No write permissions provided" });
        return;
    }

    console.log(
        `Write permission granted for user ${req.body.decoded.username}`
    );

    next();
}

// Get all registered users
users_router.get("/users", authReadPermissions, async (_req, res) => {
    const users = await doDatabaseOp(getUsers);
    res.json(users);
});

// Create a new user in db
users_router.post(
    "/user",
    validateBody,
    authWritePermissions,
    async (req, res) => {
        const { username, password, role_code } = req.body;

        if (!username || !password || !role_code) {
            res.status(400).json({ error: "Invalid data" });
            return;
        }

        const insertedId = await doDatabaseOp(
            createUser({ username, password, role_code })
        );

        res.json({ ok: `User created with id ${insertedId}` });
    }
);

// Delete user by username
users_router.delete("/:username", authWritePermissions, async (req, res) => {
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
