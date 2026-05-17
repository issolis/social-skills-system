import { getChannel } from '../config/rabbitmq.js';
 
const QUEUE = 'order.created';
 
export async function publishOrderCreated(orderData) {
    const ch = await getChannel();
 
    await ch.assertQueue(QUEUE, { durable: true });
 
    const msg = Buffer.from(JSON.stringify({
        event: 'order.created',
        timestamp: new Date().toISOString(),
        data: {
            order_id:     orderData.id,
            user_id:      orderData.user_id,
            skill_id:     orderData.skill_id,
            pts_assigned: orderData.pts_assigned
        }
    }));
 
    ch.sendToQueue(QUEUE, msg, { persistent: true });
    console.log('[orders] Event published: order.created — order_id:', orderData.id);
}
 