# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-23

### Added
- Initial release of the HookMock CLI.
- Zero-dependency Node.js engine for payload execution.
- Dynamic loading architecture via the `/flows` directory.
- Built-in multi-step sequences for Stripe (`stripe:sub-failed`, `stripe:checkout-success`).
- Built-in multi-step sequence for Shopify (`shopify:order-fulfillment`).
- Local interactive web dashboard UI (HTML/React).
- Continuous Integration pipeline via GitHub Actions.