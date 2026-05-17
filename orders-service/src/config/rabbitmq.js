import amqp from 'amqplib';

const URL = process.env.RABBITMQ_URL;

let connection = null;
let channel = null;

export async function getChannel() {
    if (channel) return channel;

    let attempts = 5;
    while (attempts > 0) {
        try {
            connection = await amqp.connect(URL);
            channel = await connection.createChannel();
            console.log('[RabbitMQ] Connection established');
            return channel;
        } catch (err) {
            attempts--;
            console.warn(`[RabbitMQ] Retrying... (${attempts} remaining)`);
            await new Promise(r => setTimeout(r, 3000));
        }
    }
    throw new Error('[RabbitMQ] Could not connect');
}