const env = require('../config/env');
const paymobService = require('../services/paymob.service');
const { sanitizeAxiosError, sendPaymobResponse } = require('../utils/paymob-response');

function getToken(req) {
  return req.body.authToken || req.headers.authorization || req.headers.token;
}

async function authenticate(req, res) {
  try {
    const response = await paymobService.authenticate();
    return sendPaymobResponse(res, response);
  } catch (error) {
    return res.status(error.response?.status || 500).json(sanitizeAxiosError(error));
  }
}

async function createSubscriptionPlan(req, res) {
  const authToken = getToken(req);
  if (!authToken) return res.status(400).json({ message: 'authToken is required' });

  const payload = req.body.payload || req.body;
  delete payload.authToken;

  try {
    const response = await paymobService.createSubscriptionPlan(authToken, payload);
    return sendPaymobResponse(res, response);
  } catch (error) {
    return res.status(error.response?.status || 500).json(sanitizeAxiosError(error));
  }
}

async function createIntention(req, res) {
  const authToken = getToken(req);
  if (!authToken) return res.status(400).json({ message: 'Token/authToken is required' });

  const payload = req.body.payload || req.body;
  delete payload.authToken;

  try {
    const response = await paymobService.createIntention(authToken, payload);
    const data = response.data;
    const clientSecret = data.client_secret;

    return res.status(response.status).json({
      ...data,
      ...(clientSecret
        ? { checkout_url: paymobService.checkoutUrl(clientSecret) }
        : {}),
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json(sanitizeAxiosError(error));
  }
}

async function addSecondaryCardIntention(req, res) {
  const authToken = getToken(req);
  if (!authToken) return res.status(400).json({ message: 'Token/authToken is required' });

  const { subscriptionId } = req.params;
  const payload = req.body.payload || req.body;
  delete payload.authToken;
  payload.subscriptionv2_id = subscriptionId;

  try {
    const response = await paymobService.createIntention(authToken, payload);
    const data = response.data;
    const clientSecret = data.client_secret;

    return res.status(response.status).json({
      ...data,
      ...(clientSecret
        ? { checkout_url: paymobService.checkoutUrl(clientSecret) }
        : {}),
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json(sanitizeAxiosError(error));
  }
}

async function getCardTokens(req, res) {
  const authToken = getToken(req);
  if (!authToken) return res.status(400).json({ message: 'authToken is required' });

  try {
    const response = await paymobService.getCardTokens(authToken, req.params.subscriptionId);
    return sendPaymobResponse(res, response);
  } catch (error) {
    return res.status(error.response?.status || 500).json(sanitizeAxiosError(error));
  }
}

async function changePrimaryCard(req, res) {
  const authToken = getToken(req);
  if (!authToken) return res.status(400).json({ message: 'authToken is required' });
  if (req.body.card === undefined) return res.status(400).json({ message: 'card is required' });

  try {
    const response = await paymobService.changePrimaryCard(
      authToken,
      req.params.subscriptionId,
      req.body.card,
    );
    return sendPaymobResponse(res, response);
  } catch (error) {
    return res.status(error.response?.status || 500).json(sanitizeAxiosError(error));
  }
}

async function suspendSubscription(req, res) {
  const authToken = getToken(req);
  if (!authToken) return res.status(400).json({ message: 'authToken is required' });

  try {
    const response = await paymobService.suspendSubscription(
      authToken,
      req.params.subscriptionId,
    );
    return sendPaymobResponse(res, response);
  } catch (error) {
    return res.status(error.response?.status || 500).json(sanitizeAxiosError(error));
  }
}

async function registerWebhook(req, res) {
  const authToken = getToken(req);
  if (!authToken) return res.status(400).json({ message: 'authToken is required' });

  const url = req.body.url || env.paymob.webhookUrl;
  if (!url) return res.status(400).json({ message: 'url is required' });

  try {
    const response = await paymobService.registerWebhook(
      authToken,
      req.params.subscriptionId,
      url,
    );
    return sendPaymobResponse(res, response);
  } catch (error) {
    return res.status(error.response?.status || 500).json(sanitizeAxiosError(error));
  }
}

module.exports = {
  authenticate,
  createSubscriptionPlan,
  createIntention,
  addSecondaryCardIntention,
  getCardTokens,
  changePrimaryCard,
  suspendSubscription,
  registerWebhook,
};
