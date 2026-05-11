import { getChannel } from "../config/rabbitmq.js";
import OrderService from "../modules/orders/orders.service.js";

const COMPLETED_QUEUE = 'order.completed';
const FAILED_QUEUE = 'order.failed';

export async function startOrderConsumer() {
    const ch = await getChannel();

    await ch.assertQueue(COMPLETED_QUEUE, { durable: true });
    await ch.assertQueue(FAILED_QUEUE, { durable: true });

    ch.prefetch(1);

    
    ch.consume(COMPLETED_QUEUE, async (msg) => {
        if (!msg) return;

        const { data } = JSON.parse(msg.content.toString());

        try {
            await OrderService.updateStatus(data.order_id, 'completed');
            console.log('[orders] Order', data.order_id, 'marked as completed');
            ch.ack(msg);
        } catch (err) {
            console.error('[orders] Failed to update order status:', err.message);
            ch.nack(msg, false, true);
        }
    });

    ch.consume(FAILED_QUEUE, async (msg) => {

        if (!msg) return;

        const { data, reason } = JSON.parse(msg.content.toString()); 

        try {
            await OrderService.updateStatus(data.order_id, 'failed');
            console.warn('[orders] Order', data.order_id, 'marked as failed. Reason:', reason);
            ch.ack(msg);
        } catch (err) {
            console.error('[orders] Failed to update order status:', err.message);
            ch.nack(msg, false, true);
        }
    });
}
