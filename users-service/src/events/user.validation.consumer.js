import { getChannel } from "../config/user.rabbitMq.js";
import UserService from "../modules/users/user.service.js"

const IN_QUEUE = 'user.validation.requested';
const VALIDATED_QUEUE = 'user.validated';
const FAILED_QUEUE = 'order.failed';


export async function startUserValidationConsumer(params) {
    const ch = await getChannel();

    await ch.assertQueue(IN_QUEUE, { durable: true });
    await ch.assertQueue(VALIDATED_QUEUE, { durable: true });
    await ch.assertQueue(FAILED_QUEUE, { durable: true });

    ch.prefetch(1);

    ch.consume(IN_QUEUE, async (msg) => {
        if (!msg) return;

        const payload = JSON.parse(msg.content.toString());
        const { order_id, user_id, skill_id, pts_assigned } = payload.data;

        try {
            await UserService.getById(user_id);

            ch.sendToQueue(VALIDATED_QUEUE,
                Buffer.from(JSON.stringify(
                    {
                        event: VALIDATED_QUEUE,
                        timeStamp: new Date().toISOString(),
                        data: { order_id, user_id, skill_id, pts_assigned }
                    }
                ))
            );

            console.log('[users] User', user_id, 'validated for order', order_id);
            ch.ack(msg);
        } catch (serviceErr) {
             console.warn('[users] Validation failed for order', order_id, ':', serviceErr.message);
 
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
    })
}