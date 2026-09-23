module.exports = {
    'stripe:sub-failed': {
        name: 'Stripe: Subscription Payment Failed',
        provider: 'Stripe',
        steps: [
            { event: 'customer.created', delay: 500, payload: { id: "cus_Mock123", object: "customer", email: "dev@example.com" } },
            { event: 'customer.subscription.created', delay: 1200, payload: { id: "sub_Mock123", object: "subscription", status: "incomplete", customer: "cus_Mock123" } },
            { event: 'invoice.created', delay: 800, payload: { id: "in_Mock123", object: "invoice", amount_due: 1500, status: "draft" } },
            { event: 'invoice.payment_failed', delay: 2000, payload: { id: "in_Mock123", object: "invoice", amount_due: 1500, status: "open", payment_intent: "pi_Mock123" } }
        ]
    },
    'stripe:checkout-success': {
        name: 'Stripe: Checkout Session Completed',
        provider: 'Stripe',
        steps: [
            { event: 'checkout.session.completed', delay: 1000, payload: { id: "cs_test_Mock123", object: "checkout.session", payment_status: "paid", amount_total: 4500 } },
            { event: 'payment_intent.succeeded', delay: 500, payload: { id: "pi_Mock123", object: "payment_intent", status: "succeeded", amount: 4500 } }
        ]
    }
};
