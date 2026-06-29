const amqp = require('amqplib');

async function startWorker() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('emails_welcome', { durable: true });

  ch.prefetch(1); 

  console.log('👂 Worker waiting for emails in the queue...');

  ch.consume('emails_welcome', (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log(`📧 Sending email to: ${data.to}`);
    console.log(`   Subject: ${data.subject}`);
    console.log(`   Timestamp: ${new Date(data.timestamp).toLocaleTimeString()}`);
    console.log('---');
    ch.ack(msg); 
  });
}

startWorker();