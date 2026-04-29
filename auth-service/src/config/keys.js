// config/keys.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const privateKey = fs.readFileSync(path.join(__dirname, "./keys/private.pem"), "utf8");
export const publicKey  = fs.readFileSync(path.join(__dirname, "./keys/public.pem"),  "utf8");