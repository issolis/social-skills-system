import express from "express"
import authRouter from "./modules/auth/auth.routes.js"

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.get("/", (req, res)=>{
    res.send("Auth service running")
}); 

app.use("/auth", authRouter);

export default app;