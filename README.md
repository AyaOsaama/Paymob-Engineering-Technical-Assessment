# Paymob-Engineering-Technical-Assessment
# Paymob Subscription Integration

This project implements Paymob subscription integration, including subscription plan creation, subscription creation through payment intentions, webhook handling, and adding a secondary card to an existing subscription.

## Features

* Generate Paymob authentication token
* Create a subscription plan
* Create a subscription using an intention
* Handle Paymob webhook events
* Add a secondary card to an existing subscription
* Test the integration using Postman

## Prerequisites

Before running the project, make sure you have:

* Python 3.10+
* Paymob account
* Paymob API credentials
* Postman
* Git

## Installation

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

### 2. Create a Virtual Environment

For Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

For Linux/macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## Dependencies

The project uses the following main dependencies:

```text
Flask
requests
python-dotenv
```

You can install them using:

```bash
pip install Flask requests python-dotenv
```

## Environment Variables

Create a `.env` file in the project root:

```env
PAYMOB_API_KEY=your_api_key
PAYMOB_INTEGRATION_ID=your_integration_id
PAYMOB_IFRAME_ID=your_iframe_id
PAYMOB_WEBHOOK_URL=your_webhook_url
```

Do not commit your real API credentials or tokens to GitHub.

## How to Run

After activating the virtual environment and installing the dependencies, run:

```bash
python app.py
```

The application will start locally.

Example:

```text
http://127.0.0.1:5000
```

## Paymob Subscription Flow

### 1. Generate Authentication Token

Send a request to Paymob's authentication endpoint using your API key.

The returned authentication token is used to authorize subsequent API requests.

### 2. Create Subscription Plan

Create a subscription plan by providing the required plan information such as:

* Frequency
* Amount
* Integration
* Webhook URL

The response contains the `subscription_plan_id`.

### 3. Create Subscription

Create a payment intention and include the subscription plan ID.

Example:

```json
{
    "subscription_plan_id": "<SUBSCRIPTION_PLAN_ID>"
}
```

The response provides the required client secret/payment information used to complete the payment flow.

### 4. Complete the Payment

Use the returned client secret to complete the payment and authentication flow.

After successful payment, Paymob creates the subscription.

### 5. Handle Webhooks

The webhook endpoint receives Paymob events related to the subscription and transactions.

The application can use these events to determine:

* Subscription creation
* Successful transactions
* Subscription status
* Subscription ID
* Next billing information

## Advanced Task: Add Secondary Card

The advanced task allows adding a secondary card to an existing subscription.

### Steps

1. Get the existing subscription ID.
2. Create a new payment intention.
3. Send the `subscriptionv2_id` in the intention request.
4. Complete the payment/card flow.
5. Paymob adds the new card to the existing subscription.

Example request:

```json
{
    "subscriptionv2_id": "<SUBSCRIPTION_ID>"
}
```

After completing the payment successfully, the new card is associated with the subscription as a secondary card.

## Testing

You can test the APIs using Postman.

Recommended testing sequence:

```text
Authentication
     ↓
Create Subscription Plan
     ↓
Create Intention
     ↓
Complete Payment
     ↓
Subscription Created
     ↓
Webhook
     ↓
Add Secondary Card
     ↓
Successful Transaction
```

For local webhook testing, you can use a webhook testing service or expose your local application through a tunneling service.

## Project Structure

Example project structure:

```text
project/
│
├── app.py
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

## Security

* Never upload your Paymob API key to GitHub.
* Never expose authentication tokens or client secrets.
* Store sensitive credentials in environment variables.
* Add `.env` to `.gitignore`.

Example:

```text
.env
venv/
__pycache__/
```

## Result

The integration supports the complete subscription flow and the Advanced Task of adding a secondary card to an existing Paymob subscription.

## Author

Aya Osama
