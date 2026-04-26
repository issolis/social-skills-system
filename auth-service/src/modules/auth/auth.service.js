import pool from "../../config/db.js";
import { Auth } from "./auth.model.js";
import { Password } from "../../helpers/password/password.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class AuthService {
    static async login(username, password, client = pool) {
        console.log("hello"); 
        const foundUser = await Auth.getUserByUsername(username);
        if (!foundUser) {
            const error = new Error("User doesn't exists");
            error.status = 404;
            throw error;
        }

        const isValid = await Password.verify(password, foundUser.password_hash);
        if (!isValid) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: foundUser.id, username: foundUser.username },
            process.env.JWT_PRIVATE_KEY,
            { algorithm: "RS256", expiresIn: "1h" }
        );

        return {
            token,
            user: { id: foundUser.id, username: username }
        };
    }
}