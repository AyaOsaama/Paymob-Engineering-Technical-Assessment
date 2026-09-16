const env = require('./env');

const endpoints = {
  auth: '/api/auth/tokens',
  subscriptionPlans: '/api/acceptance/subscription-plans',
  intention: '/v1/intention/',
  subscriptionCardTokens: (subscriptionId) =>
    `/api/acceptance/subscriptions/${subscriptionId}/card-tokens`,
  changePrimaryCard: (subscriptionId) =>
    `/api/acceptance/subscriptions/${subscriptionId}/change-primary-card`,
  suspendSubscription: (subscriptionId) =>
    `/api/acceptance/subscriptions/${subscriptionId}/suspend`,
  registerWebhook: (subscriptionId) =>
    `/api/acceptance/subscriptions/${subscriptionId}/register_webhook`,
};

const buildCheckoutUrl = (clientSecret) => {
  const url = new URL(env.paymob.checkoutBaseUrl);
  url.searchParams.set('publicKey', env.paymob.publicKey);
  url.searchParams.set('clientSecret', clientSecret);
  return url.toString();
};

module.exports = { endpoints, buildCheckoutUrl };
