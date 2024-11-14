import "https://deno.land/x/dotenv@v3.2.2/load.ts";

//@deno-types="npm:@types/express"
import express, { Request, Response, NextFunction } from "express";

//@deno-types="npm:@types/jsonwebtoken"
import jwt, { VerifyCallback } from "jsonwebtoken";

import users_db from "../db/users-db.ts";
import User from "../interfaces/User.ts";
import doSomethig from "../db/mongo/client.ts";
import { getUserByIdAndPassword } from "../db/mongo/get-users.ts";

const SECRET = Deno.env.get("JWT_SECRET") || "";
console.log(`Secret: ${SECRET}`);

const auth_router = express.Router();

// Middleware to validate the presence of a body
export const validateBody = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body) {
        res.status(400).json({ error: "Invalid body" });
        console.log("Bad body received");

        return;
    }

    next();
};

// Ping the server
auth_router.get("/ping", (_req, res) => {
    res.json({ status: "ok" });
});

// Validate the body for every route from now on
auth_router.use(validateBody);

// Register a new user in the database
auth_router.post("/register", (req, res) => {
    const { username, password } = req.body;

    const user: User = { username, password };

    if (users_db.find((user) => user.username === username)) {
        res.status(401).json({ error: "User already registered" });
        return;
    }

    users_db.push(user);
    res.json({ ok: "User regitered successfuly" });
});

// Get the token - Log in
auth_router.post("/token", async (req, res) => {
    const { username, password } = req.body;

    if (!(await doSomethig(getUserByIdAndPassword({ username, password })))) {
        res.status(401).json({ error: "User not found" });
        return;
    }

    const token = jwt.sign(username, SECRET);

    res.json({ ok: "Token created", token });
});

// Validate the given token
auth_router.post("/authenticate", (req, res) => {
    if (!req.body.token) {
        res.status(401).json({ error: "No token found" });
    }
    const { token } = req.body;

    const callback: VerifyCallback = (err) => {
        if (err) {
            res.status(401).json({ error: "Bad token" });
            return;
        }

        res.json({ ok: "Valid token" });
    };

    jwt.verify(token, SECRET, callback);
});

export default auth_router;

// Middleware to validate the token, used in other routes
export const auth_token = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];

    if (!header) {
        res.status(400).json({ error: "No authorization header" });
        return;
    }

    const token = header.split(" ")[1];

    const callback: VerifyCallback = (err) => {
        if (err) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }

        next();
    };

    jwt.verify(token, SECRET, callback);
};
