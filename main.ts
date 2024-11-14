//@deno-types="npm:@types/express"
import express from "express";
import auth_router from "./routes/auth.ts";
import users_router from "./routes/users.ts";

const PORT = parseInt(Deno.env.get("PORT") || "8080");

const server = express();

// Parse the json from all incoming requests
server.use(express.json());

server.use("/auth", auth_router);
server.use("/users", users_router);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
