import { AuthService } from "./auth.service.js";

export class AuthController{
    static async login(req, res){
        try {
            const {username, password} = req.body; 
            const result = await AuthService.login(username, password); 

            return res.status(200).json({
                status: "success", 
                data: result
            }); 
        } catch (error) {
            return res.status(error.status || 500).json({
                status: "error", 
                message: error.message
            }); 
        }
    }
}