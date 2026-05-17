import dotenv from "dotenv"
import app from "./app.js"

dotenv.config(); 

const PORT = process.env.PORT || 3004; 

app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`[SERVER] Auth service running on port ${PORT}`);
}); 

//Hello