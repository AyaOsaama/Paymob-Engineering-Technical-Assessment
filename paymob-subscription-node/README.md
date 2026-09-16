# Paymob Subscription Integration — Node.js

A Node.js/Express implementation of the Paymob Engineering Technical Assessment, based directly on the supplied README and assessment PDF.

The assessment covers authentication, subscription-plan creation, subscription creation through a payment intention and 3DS checkout, webhook handling, adding a secondary card, changing the primary card, suspending a subscription, and webhook registration. The supplied README also defines the testing flow and security requirements.

## Implemented features

- Generate a Paymob authentication token.
- Create a subscription plan.
- Create a subscription using a payment intention.
- Build the Paymob Unified Checkout URL from the returned client secret.
- Receive Paymob webhook events.
- Create an intention for adding a secondary card.
- Retrieve subscription card tokens.
- Change the subscription primary card.
- Suspend a subscription.
- Register/update the subscription webhook URL.
- Postman collection for the complete API flow.

## Source mapping

The supplied README specifies the core flow: authentication → subscription plan → intention → payment → subscription creation → webhook → secondary card. It also states that credentials must remain in environment variables and `.env` should not be committed. The assessment PDF provides the concrete Paymob endpoints and the advanced card/suspend/webhook operations.

## Tech stack

- Node.js 20+
- Express 5
- Axios
- dotenv
- Postman

## Project structure

```text
paymob-subscription-node/
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── env.js
│   │   └── paymob.js
│   ├── controllers/
│   │   ├── paymob.controller.js
│   │   └── webhook.controller.js
│   ├── middleware/
│   │   └── error-handler.js
│   ├── routes/
│   │   └── paymob.routes.js
│   ├── services/
│   │   └── paymob.service.js
│   └── utils/
│       └── paymob-response.js
├── postman/
│   └── Paymob-Subscription-Integration.postman_collection.json
├── data/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 1. Installation

```bash
npm install
```

Copy the environment template:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Then fill in your real Paymob credentials.

## 2. Environment variables

```env
PORT=5000
PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_PUBLIC_KEY=your_paymob_public_key
PAYMOB_INTEGRATION_ID=5404200
PAYMOB_MOTO_INTEGRATION_ID=5911776
PAYMOB_WEBHOOK_URL=https://your-public-url.example.com/webhooks/paymob
PAYMOB_PLAN_ID=11949
PAYMOB_SUBSCRIPTION_ID=13386
PAYMOB_API_BASE_URL=https://accept.paymob.com
PAYMOB_CHECKOUT_BASE_URL=https://eg.checkout.paymob.com
```

Do not commit `.env`, API keys, authentication tokens, or client secrets.

## 3. Run

Development:

```bash
npm run dev
```

Production-style local run:

```bash
npm start
```

Health check:

```text
GET http://localhost:5000/health
```

## 4. API endpoints

### Authentication

```text
POST /api/paymob/auth
```

The server calls:

```text
POST https://accept.paymob.com/api/auth/tokens
```

with the configured `PAYMOB_API_KEY`.

### Create subscription plan

```text
POST /api/paymob/subscription-plans
Authorization: <auth-token>
```

Example body:

```json
{
  "frequency": 30,
  "name": "Aya Monthly Subscription",
  "webhook_url": "https://your-public-url.example.com/webhooks/paymob",
  "reminder_days": 3,
  "retrial_days": 2,
  "plan_type": "rent",
  "number_of_deductions": null,
  "amount_cents": 10000,
  "use_transaction_amount": false,
  "is_active": true,
  "integration": 5911776
}
```

### Create subscription intention

```text
POST /api/paymob/intentions
Token: <auth-token>
```

Example body:

```json
{
  "amount": 200000,
  "currency": "EGP",
  "payment_methods": [5404200],
  "subscription_plan_id": "11949",
  "billing_data": {
    "first_name": "Aya",
    "last_name": "Osama",
    "email": "aya@example.com",
    "phone_number": "01118227661",
    "country": "EG",
    "city": "Cairo",
    "street": "Test Street",
    "building": "1",
    "floor": "1",
    "apartment": "1"
  }
}
```

The response contains the Paymob `client_secret`. This API additionally returns a convenience `checkout_url`:

```text
https://eg.checkout.paymob.com/?publicKey={publicKey}&clientSecret={clientSecret}
```

Complete the 3DS payment through that checkout flow. The assessment describes subscription creation as completing a 3DS transaction that saves the customer's card and connects it to the subscription.

### Add a secondary card

```text
POST /api/paymob/subscriptions/:subscriptionId/secondary-card-intention
Token: <auth-token>
```

The server adds the required `subscriptionv2_id` to the intention request. Complete the returned checkout flow to associate the new card with the existing subscription.

### Get subscription card tokens

```text
GET /api/paymob/subscriptions/:subscriptionId/card-tokens
Authorization: <auth-token>
```

### Change primary card

```text
POST /api/paymob/subscriptions/:subscriptionId/change-primary-card
Authorization: <auth-token>
Content-Type: application/json
```

Body:

```json
{
  "card": 13555
}
```

The assessment demonstrates retrieving the subscription's card tokens first and then sending the selected card id as the `card` value.

### Suspend subscription

```text
POST /api/paymob/subscriptions/:subscriptionId/suspend
Authorization: <auth-token>
```

### Register webhook

```text
POST /api/paymob/subscriptions/:subscriptionId/register-webhook
Authorization: <auth-token>
Content-Type: application/json
```

Body:

```json
{
  "url": "https://your-public-url.example.com/webhooks/paymob"
}
```

### Receive Paymob webhook

```text
POST /webhooks/paymob
```

The handler acknowledges the event and logs the event type, subscription id, transaction id, and status when available.

The supplied assessment shows webhook events such as `Subscription Created`, `Successful Transaction`, `add_secondry_card`, and `suspended`.

## 5. Testing order

Use the supplied Postman collection in:

```text
postman/Paymob-Subscription-Integration.postman_collection.json
```

Recommended order:

```text
Authentication
   ↓
Create Subscription Plan
   ↓
Create Intention
   ↓
Open Checkout URL / complete 3DS payment
   ↓
Subscription Created
   ↓
Webhook
   ↓
Add Secondary Card Intention
   ↓
Complete Payment
   ↓
Get Card Tokens
   ↓
Change Primary Card
   ↓
Suspend Subscription
   ↓
Register Webhook
```

For local webhook testing, expose the local server through a public tunnel or use a webhook testing service, as described in the supplied README.

## 6. Important implementation notes

### Authentication headers

The supplied assessment shows `Authorization: <token>` for the subscription-plan and subscription-management endpoints. The intention request is sent using the Paymob `Token` authentication header.

### No database

The supplied README describes an API integration and does not require a database. This implementation therefore keeps the integration stateless and delegates subscription state to Paymob.

### Webhook verification

The assessment examples contain an `hmac` field in webhook payloads, but the supplied files do not document the exact HMAC verification algorithm/secret needed to validate it. This implementation therefore receives and acknowledges webhook events without claiming to verify their HMAC. The raw event is not persisted.

## Security

- Keep the Paymob API key in `.env`.
- Never commit `.env`.
- Never expose authentication tokens or client secrets in GitHub.
- Do not hard-code production credentials.
- Use HTTPS for a production webhook URL.

## Assessment evidence reflected in this implementation

The supplied assessment shows a subscription plan with frequency `30`, amount `10000` cents, integration `5911776`, and a webhook URL. It also shows an initial intention using online card integration `5404200`, a returned client secret, a subscription created after the 3DS flow, secondary-card handling through `subscriptionv2_id`, card-token retrieval, primary-card change, subscription suspension, and webhook registration.

## Author

Aya Osama
