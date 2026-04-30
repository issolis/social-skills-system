
import RequestValidator from "../../helpers/requestValidator/request.validator.js";

export class AuthValidator{
    static login(req, res, next){
        
        const fieldsError = RequestValidator.validateFields(req.body, ["username", "password"]); 

        if(!fieldsError)
            return res.status(400).json({
                status: "error",
                error: "Username and password are required"
            }); 
        
        if(typeof req.body.username !== "string")
            return res.status(400).json({
                status: "error",
                error: "Username must be a string"
            });
        
        if(typeof req.body.password !== "string")
            return res.status(400).json({
                status: "error",
                error: "Password must be a string"
            });
            
        next(); 
    }
}