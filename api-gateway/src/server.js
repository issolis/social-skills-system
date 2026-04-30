import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[API GATEWAY] Running on port ${PORT}`);
    console.log(`[API GATEWAY] Auth service: ${process.env.AUTH_SERVICE_URL}`);
    console.log(`[API GATEWAY] Users service: ${process.env.USERS_SERVICE_URL}`);
    console.log(`[API GATEWAY] Skills service: ${process.env.SKILLS_SERVICE_URL}`);
    console.log(`[API GATEWAY] Orders service: ${process.env.ORDERS_SERVICE_URL}`);
});
