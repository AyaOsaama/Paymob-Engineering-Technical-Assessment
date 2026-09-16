function handleWebhook(req, res) {
  const event = req.body || {};
  const type = event.type || event.trigger_type || 'UNKNOWN';
  const subscription = event.subscription_data || {};
  const transaction = event.obj || {};

  console.log('[Paymob Webhook]', {
    type,
    subscriptionId: subscription.id || transaction.payment_key_claims?.subscription_info?.subscription_id,
    transactionId: event.transaction_id || transaction.id,
    status: subscription.state || transaction.payment_status,
  });

  return res.status(200).json({
    received: true,
    event: type,
  });
}

module.exports = { handleWebhook };
