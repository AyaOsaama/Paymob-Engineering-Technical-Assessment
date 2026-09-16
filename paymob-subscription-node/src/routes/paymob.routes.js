const express = require('express');
const controller = require('../controllers/paymob.controller');

const router = express.Router();

router.post('/auth', controller.authenticate);
router.post('/subscription-plans', controller.createSubscriptionPlan);
router.post('/intentions', controller.createIntention);
router.post('/subscriptions/:subscriptionId/secondary-card-intention', controller.addSecondaryCardIntention);
router.get('/subscriptions/:subscriptionId/card-tokens', controller.getCardTokens);
router.post('/subscriptions/:subscriptionId/change-primary-card', controller.changePrimaryCard);
router.post('/subscriptions/:subscriptionId/suspend', controller.suspendSubscription);
router.post('/subscriptions/:subscriptionId/register-webhook', controller.registerWebhook);

module.exports = router;
