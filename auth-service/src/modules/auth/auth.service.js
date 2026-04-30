import { Auth } from "./auth.model.js";
import { Password } from "../../helpers/password/password.js";
import { privateKey } from "../../config/keys.js";
import jwt from "jsonwebtoken";

export class AuthService {
    static async login(username, password) {
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
            { id: foundUser.id, username: username, role: foundUser.role_id },
            privateKey,
            { algorithm: "RS256", expiresIn: "1h" }
        );

        return {
            token,
            user: { id: foundUser.id, username: username }
        };
    }
}