const amqp = require('amqplib');

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'report_tasks';

  await channel.assertQueue(queue, { durable: true });

  const task = {
    userId: 'U-9982',
    reportId: 'REP-2026-06',
    webhookUrl: 'http://localhost:3000/api/webhook/report-ready' 
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(task)), { persistent: true });
  console.log(`📦 Task sent to RabbitMQ: Report ${task.reportId}`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

main();