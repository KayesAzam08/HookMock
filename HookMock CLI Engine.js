#!/usr/bin/env node

// Simple ANSI color codes for zero-dependency terminal styling
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    fgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgRed: "\x1b[31m",
    fgCyan: "\x1b[36m"
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Centralized flows (shared logic with the UI)
const FLOWS = {
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
    },
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

async function executeFlow(flowId, targetUrl) {
    const flow = FLOWS[flowId];
    if (!flow) {
        console.error(`${colors.fgRed}Error: Flow '${flowId}' not found.${colors.reset}`);
        console.log(`Available flows: ${Object.keys(FLOWS).join(', ')}`);
        process.exit(1);
    }

    console.log(`\n${colors.bright}${colors.fgCyan}⚡ Starting HookMock Sequence: ${flow.name}${colors.reset}`);
    console.log(`${colors.fgYellow}Target: ${targetUrl}${colors.reset}\n`);

    for (const step of flow.steps) {
        console.log(`${colors.fgBlue}[${flow.provider}] Queuing event: ${step.event} (Delay: ${step.delay}ms)${colors.reset}`);
        await sleep(step.delay);

        const mockSig = `t=${Date.now()},v1=mock_signature_${Math.random().toString(36).substring(7)}`;
        
        const requestBody = {
            id: `evt_mock_${Math.random().toString(36).substring(7)}`,
            type: step.event,
            created: Math.floor(Date.now() / 1000),
            data: { object: step.payload }
        };

        console.log(`🚀 POST ${targetUrl}`);
        
        try {
            // Using native fetch (Available in Node 18+)
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Stripe-Signature': mockSig,
                    'X-Shopify-Hmac-Sha256': mockSig
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                console.log(`${colors.fgGreen}✅ [${response.status} ${response.statusText}] Target acknowledged webhook.${colors.reset}`);
            } else {
                console.log(`${colors.fgRed}❌ [${response.status} ${response.statusText}] Target rejected webhook.${colors.reset}`);
            }
        } catch (error) {
            console.log(`${colors.fgRed}❌ Failed to reach target: ${error.message}${colors.reset}`);
            console.log(`${colors.fgYellow}Make sure your local server is running!${colors.reset}`);
        }
        console.log('----------------------------------------');
    }
    
    console.log(`\n${colors.bright}${colors.fgGreen}🎉 Flow execution completed successfully!${colors.reset}\n`);
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === 'help') {
        console.log(`\n${colors.bright}🪝 HookMock CLI${colors.reset}`);
        console.log(`Usage:`);
        console.log(`  hookmock trigger <flow_id> --url <target_url>`);
        console.log(`  hookmock ui  (Starts the visual dashboard)`);
        console.log(`\nAvailable flows: \n  ${Object.keys(FLOWS).join('\n  ')}\n`);
        process.exit(0);
    }

    if (args[0] === 'ui') {
        console.log(`${colors.fgGreen}Starting UI dashboard on http://localhost:4040...${colors.reset}`);
        console.log(`${colors.fgYellow}(In the full version, this would spin up the index.html we created earlier!)${colors.reset}`);
        process.exit(0);
    }

    if (args[0] === 'trigger') {
        const flowId = args[1];
        const urlIndex = args.indexOf('--url');
        
        if (!flowId || urlIndex === -1 || !args[urlIndex + 1]) {
            console.error(`${colors.fgRed}Invalid trigger syntax.${colors.reset}`);
            console.log(`Usage: hookmock trigger <flow_id> --url <target_url>`);
            process.exit(1);
        }
        
        const targetUrl = args[urlIndex + 1];
        executeFlow(flowId, targetUrl);
    }
}

main();