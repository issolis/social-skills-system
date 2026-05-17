import { getChannel } from '../config/rabbitmq.js';

const IN_QUEUE = 'order.created';
const OUT_QUEUE = 'user.validation.requested';


export async function startOrderConsumer() {
    const ch = await getChannel();

    await ch.assertQueue(IN_QUEUE, { durable: true });
    await ch.assertQueue(OUT_QUEUE, { durable: true });

    ch.prefetch(1);

    ch.consume(IN_QUEUE, async (msg) => {
        if (!msg) return;

        const payload = JSON.parse(msg.content.toString());
        const { order_id, user_id, skill_id, pts_assigned } = payload.data;

        try {
            ch.sendToQueue(OUT_QUEUE, Buffer.from(
                JSON.stringify({
                    event: OUT_QUEUE,
                    timeStamp : new Date().toISOString(),
                    data: { order_id, user_id, skill_id, pts_assigned }
                }),
                { persistent: true }
            ));

            console.log('[skills] User validation requested for order', order_id);
            ch.ack(msg);
        } catch (err) {
            console.error('[skills] Failed to process order.created:', err.message);
            ch.nack(msg, false, true);
        }
    });
}