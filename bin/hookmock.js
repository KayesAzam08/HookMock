#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple ANSI color codes for zero-dependency terminal styling
const colors = {
    reset: "\x1b[0m", bright: "\x1b[1m", fgGreen: "\x1b[32m", 
    fgYellow: "\x1b[33m", fgBlue: "\x1b[34m", fgRed: "\x1b[31m", fgCyan: "\x1b[36m"
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Dynamically load all flows from the 'flows' directory
function loadFlows() {
    const flows = {};
    const flowsDir = path.join(__dirname, '..', 'flows');
    
    if (fs.existsSync(flowsDir)) {
        const files = fs.readdirSync(flowsDir).filter(file => file.endsWith('.js'));
        for (const file of files) {
            const flowData = require(path.join(flowsDir, file));
            Object.assign(flows, flowData);
        }
    }
    return flows;
}

async function executeFlow(flowId, targetUrl, FLOWS) {
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
        }
        console.log('----------------------------------------');
    }
    console.log(`\n${colors.bright}${colors.fgGreen}🎉 Flow execution completed successfully!${colors.reset}\n`);
}

function main() {
    const FLOWS = loadFlows();
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === 'help') {
        console.log(`\n${colors.bright}🪝 HookMock CLI${colors.reset}`);
        console.log(`Usage:`);
        console.log(`  hookmock trigger <flow_id> --url <target_url>`);
        console.log(`  hookmock ui  (Starts the visual dashboard)`);
        console.log(`\nAvailable flows: \n  ${Object.keys(FLOWS).join('\n  ') || 'None found. Add files to /flows.'}\n`);
        process.exit(0);
    }

    if (args[0] === 'ui') {
        console.log(`${colors.fgGreen}Starting UI dashboard on http://localhost:4040...${colors.reset}`);
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
        
        executeFlow(flowId, args[urlIndex + 1], FLOWS);
    }
}

main();
