module.exports = {
    'shopify:order-fulfillment': {
        name: 'Shopify: Order Creation to Fulfillment',
        provider: 'Shopify',
        steps: [
            { event: 'orders/create', delay: 500, payload: { id: 820982911946154500, email: "john@example.com" } },
            { event: 'orders/paid', delay: 1500, payload: { id: 820982911946154500, financial_status: "paid" } },
            { event: 'fulfillments/create', delay: 2500, payload: { id: 123456, order_id: 820982911946154500, status: "success" } }
        ]
    }
};
