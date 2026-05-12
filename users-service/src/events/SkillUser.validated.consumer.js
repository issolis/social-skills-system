import { getChannel } from "../config/user.rabbitMq.js";
import UserSkillService from "../modules/user_skills/user_skill.service.js";

const IN_QUEUE = 'inventory.confirmed';
const FAILED_QUEUE = 'order.failed';
const COMPLETED_QUEUE = 'order.completed';

export async function startInventoryConfirmedConsumer(params) {
    const ch = await getChannel();

    await ch.assertQueue(IN_QUEUE, { durable: true });
    await ch.assertQueue(FAILED_QUEUE, { durable: true });
    await ch.assertQueue(COMPLETED_QUEUE, { durable: true });

    ch.prefetch(1);

    ch.consume(IN_QUEUE, async (msg) => {
        if (!msg) return;

        const payload = JSON.parse(msg.content.toString());
        const { order_id, user_id, skill_id, pts_assigned } = payload.data;

        try {
            await UserSkillService.addExperience(user_id, skill_id, pts_assigned);

            ch.sendToQueue(COMPLETED_QUEUE,
                Buffer.from(JSON.stringify({
                    event: 'order.completed',
                    timestamp: new Date().toISOString(),
                    data: { order_id, user_id, skill_id, pts_assigned }
                })),
                { persistent: true }
            );
            console.log('[users] Skill assigned to user', user_id, '— order', order_id, 'completed');
            ch.ack(msg);


        } catch (serviceErr) {
            console.warn('[users] Failed to assign skill for order', order_id, ':', serviceErr.message);

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