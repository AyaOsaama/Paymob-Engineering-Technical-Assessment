const express = require('express');
const env = require('./config/env');
const paymobRoutes = require('./routes/paymob.routes');
const { handleWebhook } = require('./controllers/webhook.controller');
const { notFound, errorHandler } = require('./middleware/error-handler');

const app = express();

app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'paymob-subscription-integration',
  });
});

app.use('/api/paymob', paymobRoutes);
app.post('/webhooks/paymob', handleWebhook);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Paymob integration server running on http://localhost:${env.port}`);
});
