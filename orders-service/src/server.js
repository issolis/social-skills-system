import "dotenv/config";
import app from "./app.js";
import { startOrderConsumer } from "./events/order.consumer.js";

const PORT = process.env.PORT || 3003;

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Orders service running on port ${PORT}`);
    await startOrderConsumer();
});