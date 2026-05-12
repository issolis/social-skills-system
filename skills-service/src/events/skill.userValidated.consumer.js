import { getChannel } from '../config/rabbitmq.js';
import SkillService from '../modules/skills/skill.service.js';

const IN_QUEUE        = 'user.validated';
const CONFIRMED_QUEUE = 'inventory.confirmed';
const FAILED_QUEUE    = 'order.failed';

export async function startUserValidatedConsumer() {
    const ch = await getChannel();

    await ch.assertQueue(IN_QUEUE,        { durable: true });
    await ch.assertQueue(CONFIRMED_QUEUE, { durable: true });
    await ch.assertQueue(FAILED_QUEUE,    { durable: true });

    ch.prefetch(1);

    console.log('[skills] Listening on queue:', IN_QUEUE);

    ch.consume(IN_QUEUE, async (msg) => {
        if (!msg) return;

        const payload = JSON.parse(msg.content.toString());
        const { order_id, user_id, skill_id, pts_assigned } = payload.data;

        try {
            await SkillService.decreasePoints(skill_id, pts_assigned);

            ch.sendToQueue(CONFIRMED_QUEUE,
                Buffer.from(JSON.stringify({
                    event: 'inventory.confirmed',
                    timestamp: new Date().toISOString(),
                    data: { order_id, user_id, skill_id, pts_assigned }
                })),
                { persistent: true }
            );
            console.log('[skills] Inventory confirmed for order', order_id);
            ch.ack(msg);

        } catch (serviceErr) {
            console.warn('[skills] Order', order_id, 'failed:', serviceErr.message);

            ch.sendToQueue(FAILED_QUEUE,
                Buffer.from(JSON.stringify({
                    event: 'order.failed',
                    timestamp: new Date().toISOString(),
                    reason: serviceErr.message,
                    data: { order_id, user_id, skill_id, pts_assigned }
                })),
                { persistent: true }
            );
            ch.ack(msg);
        }
    });
}