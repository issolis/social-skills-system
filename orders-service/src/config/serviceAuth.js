// config/serviceAuth.js
import dotenv from "dotenv";
dotenv.config();

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:3004";

let accessToken = null;
let tokenExpiry = null;

async function login() {
    const res = await fetch(`${AUTH_SERVICE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: process.env.SERVICE_USERNAME,
            password: process.env.SERVICE_PASSWORD
        })
    });

    const data = await res.json();

    if (!res.ok) throw new Error("Service login failed");

    accessToken = data.data.token;
    tokenExpiry = Date.now() + 55 * 60 * 1000;
}
export async function getServiceToken() {
    if (!accessToken || Date.now() >= tokenExpiry) {
        await login();
    }
    return accessToken;
}