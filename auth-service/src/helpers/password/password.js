import bcrypt from "bcrypt"

export class Password{
    static async verify(password, passwordHash){
        return await bcrypt.compare(password, passwordHash);
    }
}