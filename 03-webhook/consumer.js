const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  const { event, amount, customer, orderId } = req.body;

  console.log('📬 Webhook received:');
  console.log(`   Event:   ${event}`);
  console.log(`   Customer:  ${customer}`);
  console.log(`   Order:    ${orderId}`);
  console.log(`   Amount:    $${amount}`);

  if (event === 'payment.success') {
    console.log('✅ Payment confirmed — processing order...');
  }

  res.status(200).json({ received: true });
});

app.listen(4000);
console.log('👂 Consumer listening on http://localhost:4000/webhook');