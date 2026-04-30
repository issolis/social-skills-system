import bcrypt from "bcrypt"


const MINIMAL_SIZE = 12;
const PASSWORD_TYPE = "string";
const SALT_ROUNDS = 10;


export class Password {
    static validatePassword(password) {
        if (!this.#validatePasswordType(password)) {
            return "Password must be a string";
        }

        if (!this.#validatePasswordSize(password)) {
            return "Invalid password size. Minimum 12 characters";
        }

        if (!this.#validateUpperAppears(password)) {
            return "Password must contain uppercase letters";
        }

        if (!this.#validateLowerAppears(password)) {
            return "Password must contain lowercase letters";
        }

        if (!this.#validateNumsAppears(password)) {
            return "Password must contain numbers";
        }

        if (!this.#validateSpecialCharsAppears(password)) {
            return "Password must contain special chars";
        }

        return true;
    }

    static #validatePasswordType(password) {
        return typeof password === PASSWORD_TYPE;
    }

    static #validatePasswordSize(password) {
        return password.length >= MINIMAL_SIZE;
    }

    static #validateUpperAppears(password) {
        return /\p{Lu}/u.test(password);
    }

    static #validateLowerAppears(password) {
        return /\p{Ll}/u.test(password);
    }

    static #validateNumsAppears(password) {
        return /[0-9]/.test(password);
    }

    static #validateSpecialCharsAppears(password) {
        return /[^\p{L}\p{N}]/u.test(password); 
    }

    static async encrypt(password){
        return await bcrypt.hash(password, SALT_ROUNDS); 
    }
}
