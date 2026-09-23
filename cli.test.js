const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('CLI executable exists', () => {
    const cliPath = path.join(__dirname, '..', 'bin', 'hookmock.js');
    assert.strictEqual(fs.existsSync(cliPath), true, 'hookmock.js should exist in the bin directory');
});

test('Flow files exist and are valid objects', () => {
    const flowsDir = path.join(__dirname, '..', 'flows');
    assert.strictEqual(fs.existsSync(flowsDir), true, 'flows directory should exist');
    
    const stripeFlows = require('../flows/stripe.js');
    const shopifyFlows = require('../flows/shopify.js');

    assert.ok(stripeFlows['stripe:checkout-success'], 'Stripe checkout flow should be defined');
    assert.ok(shopifyFlows['shopify:order-fulfillment'], 'Shopify fulfillment flow should be defined');
});
