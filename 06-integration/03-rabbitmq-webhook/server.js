const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let clients = [];

// Endpoint for the HTML to connect and listen to events
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  clients.push(res);
  
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// The Webhook that receives the alert from the RabbitMQ worker
app.post('/api/webhook/report-ready', (req, res) => {
  const data = req.body;
  console.log(`🔔 [WEBHOOK] Report ready:`, data);
  
  // Notify all connected HTML clients
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
  
  res.status(200).send('Webhook processed');
});

app.listen(3000, () => {
  console.log('🌐 Webhook Server running on http://localhost:3000');
});