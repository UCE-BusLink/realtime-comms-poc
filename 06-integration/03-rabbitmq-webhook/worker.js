const amqp = require('amqplib');
const axios = require('axios');

async function startWorker() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'report_tasks';

  await channel.assertQueue(queue, { durable: true });
  console.log('👷 RabbitMQ Worker waiting for tasks...');

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const task = JSON.parse(msg.content.toString());
      console.log(`⏳ Processing report task for user: ${task.userId}...`);

      // Simulate a heavy task taking 3 seconds
      setTimeout(async () => {
        console.log(`✅ Report ${task.reportId} generated. Triggering Webhook...`);
        
        try {
          await axios.post(task.webhookUrl, {
            reportId: task.reportId,
            status: 'COMPLETED',
            downloadUrl: `https://mydomain.com/downloads/${task.reportId}.pdf`
          });
          console.log('🚀 Webhook sent successfully.');
        } catch (error) {
          console.error('❌ Error sending Webhook:', error.message);
        }

        channel.ack(msg);
      }, 3000);
    }
  });
}

startWorker();