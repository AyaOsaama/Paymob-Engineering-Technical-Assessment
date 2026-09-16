require('dotenv').config();

const env = {
  port: Number(process.env.PORT || 5000),
  paymob: {
    apiKey: process.env.PAYMOB_API_KEY,
    publicKey: process.env.PAYMOB_PUBLIC_KEY,
    integrationId: process.env.PAYMOB_INTEGRATION_ID,
    motoIntegrationId: process.env.PAYMOB_MOTO_INTEGRATION_ID,
    webhookUrl: process.env.PAYMOB_WEBHOOK_URL,
    planId: process.env.PAYMOB_PLAN_ID,
    subscriptionId: process.env.PAYMOB_SUBSCRIPTION_ID,
    apiBaseUrl: process.env.PAYMOB_API_BASE_URL || 'https://accept.paymob.com',
    checkoutBaseUrl:
      process.env.PAYMOB_CHECKOUT_BASE_URL || 'https://eg.checkout.paymob.com',
  },
};

module.exports = env;
