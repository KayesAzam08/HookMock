<div align="center">
  <h1>🪝 HookMock</h1>
  <p><b>The universal, stateful local mock server for testing complex e-commerce webhooks offline.</b></p>
  
  [![npm version](https://badge.fury.io/js/hookmock.svg)](https://badge.fury.io/js/hookmock)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</div>

<br />

## The Pain Point
Testing e-commerce flows locally is a nightmare. It requires `ngrok` tunnels, active internet connections, and manually clicking around sandbox UIs to trigger multi-step webhook events (e.g., *Customer Created* $\rightarrow$ *Subscription Created* $\rightarrow$ *Invoice Paid*). 

## The Solution
**HookMock** instantly fires perfectly timed, cryptographically signed sequences of webhook payloads directly to your `localhost` server. Run full end-to-end billing and fulfillment tests in your CI/CD pipeline or local environment entirely offline, without ever touching the actual Stripe or Shopify APIs.

---

## 🚀 Quick Start

Run HookMock directly without installing:
```bash
npx hookmock trigger stripe:sub-failed --url http://localhost:3000/api/webhooks
```

Or install it globally:
```bash
npm install -g hookmock
```

## 💻 Interactive UI Dashboard

Prefer a visual interface? HookMock comes with a gorgeous local dashboard.

```bash
hookmock ui
```
*(Pro-tip: This opens a local Vercel-like dashboard where you can visually build and trigger sequences!)*

## 📦 Supported Flows

### Stripe
*   `stripe:checkout-success`: Simulates a successful one-time checkout session.
*   `stripe:sub-failed`: Simulates a customer creation followed by a failed recurring subscription payment.

### Shopify
*   `shopify:order-fulfillment`: Simulates an order being placed, paid, and subsequently fulfilled.

## 🛠 Usage Example

When you run a sequence, HookMock automatically calculates the delays between realistic events and signs the headers:

```bash
$ hookmock trigger stripe:checkout-success --url http://localhost:8080/webhooks

[Stripe] Queuing event: checkout.session.completed (Delay: 1000ms)
🚀 POST http://localhost:8080/webhooks
✅ [200 OK] Target acknowledged webhook payload.
----------------------------------------
[Stripe] Queuing event: payment_intent.succeeded (Delay: 500ms)
🚀 POST http://localhost:8080/webhooks
✅ [200 OK] Target acknowledged webhook payload.

🎉 Flow execution completed successfully!
```

## 🤝 Contributing
PRs are welcome! We want to add flows for PayPal, GitHub, Slack, and LemonSqueezy. 

## License
MIT