import dotenv from "dotenv";
import app from "./app.js";
import { startUserValidationConsumer } from "./events/user.validation.consumer.js";
import { startInventoryConfirmedConsumer } from "./events/SkillUser.validated.consumer.js"

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`[SERVER] Users service running on port ${PORT}`);
    await startUserValidationConsumer();
    await startInventoryConfirmedConsumer();
});