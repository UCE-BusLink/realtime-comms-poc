const amqp = require('amqplib');

async function registerUser(email) {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('emails_welcome', { durable: true });

  const menssaje = JSON.stringify({
    to: email,
    subject: 'Welcome to Our Service!',
    timestamp: Date.now()
  });

  ch.sendToQueue('emails_welcome', Buffer.from(menssaje), { persistent: true });
  console.log(`📨 Email dispatched for ${email}`);

  await ch.close();
  await conn.close();
}

registerUser('ana.garcia@gmail.com');
registerUser('juan.perez@gmail.com');
registerUser('maria.lopez@gmail.com');