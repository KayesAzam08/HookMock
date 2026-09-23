# Contributing to HookMock

First off, thanks for taking the time to contribute! 🎉 
HookMock is built by developers, for developers, and we'd love your help adding new platform flows (PayPal, LemonSqueezy, Slack, etc.) or improving the core engine.

## How to Contribute

1. **Fork the Repository**: Create your own branch from `main`.
2. **Add Your Feature/Flow**: 
   - If adding a new provider, create a new file in the `/flows` directory (e.g., `flows/paypal.js`).
   - Follow the existing schema used in `flows/stripe.js`.
3. **Test Your Changes**: Run `npm test` locally to ensure you haven't broken existing logic.
4. **Submit a Pull Request**: Provide a clear description of the problem you solved or the flow you added. Include JSON payload examples if applicable.

## Code of Conduct
Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. Be kind, be constructive, and let's build awesome tools together.