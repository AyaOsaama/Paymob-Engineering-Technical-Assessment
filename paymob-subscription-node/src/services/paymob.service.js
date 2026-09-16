const axios = require('axios');
const env = require('../config/env');
const { endpoints, buildCheckoutUrl } = require('../config/paymob');

class PaymobService {
  constructor() {
    this.client = axios.create({
      baseURL: env.paymob.apiBaseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async authenticate() {
    return this.client.post(endpoints.auth, {
      api_key: env.paymob.apiKey,
    });
  }

  async createSubscriptionPlan(authToken, payload) {
    return this.client.post(endpoints.subscriptionPlans, payload, {
      headers: { Authorization: authToken },
    });
  }

  async createIntention(authToken, payload) {
    return this.client.post(endpoints.intention, payload, {
      headers: { Token: authToken },
    });
  }

  async getCardTokens(authToken, subscriptionId) {
    return this.client.get(endpoints.subscriptionCardTokens(subscriptionId), {
      headers: { Authorization: authToken },
    });
  }

  async changePrimaryCard(authToken, subscriptionId, cardId) {
    return this.client.post(
      endpoints.changePrimaryCard(subscriptionId),
      { card: cardId },
      { headers: { Authorization: authToken } },
    );
  }

  async suspendSubscription(authToken, subscriptionId) {
    return this.client.post(
      endpoints.suspendSubscription(subscriptionId),
      {},
      { headers: { Authorization: authToken } },
    );
  }

  async registerWebhook(authToken, subscriptionId, url) {
    return this.client.post(
      endpoints.registerWebhook(subscriptionId),
      { url },
      { headers: { Authorization: authToken } },
    );
  }

  checkoutUrl(clientSecret) {
    return buildCheckoutUrl(clientSecret);
  }
}

module.exports = new PaymobService();
