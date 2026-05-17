import app from "./app.js";
import dotenv from "dotenv";
import { startOrderConsumer } from "./events/skill.order.consumer.js";
import { startUserValidatedConsumer } from "./events/skill.userValidated.consumer.js"

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Skills service running on port ${PORT}`);
    await startOrderConsumer();
    await startUserValidatedConsumer();
});