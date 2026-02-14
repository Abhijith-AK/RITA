const fs = require("fs");
const { detectIntent } = require("./core/intent-engine");
const { decideStrategy } = require("./core/decision-engine");
const capabilities = require("./core/capability-resolver/capabilities.json");

function logAction(data) {
    fs.appendFileSync(
        "./logs/actions.log",
        JSON.stringify(data) + "\n"
    );
}

function runRITA(input) {
    console.log("Input:", input);

    const intent = detectIntent(input);
    console.log("Detected Intent:", intent);

    const decision = decideStrategy(intent, capabilities);

    console.log("Chosen Strategy:", decision.strategy);
    console.log("Confidence:", decision.confidence);
    console.log("Autonomy:", decision.autonomy);

    logAction({
        timestamp: new Date().toISOString(),
        input,
        intent,
        strategy: decision.strategy,
        confidence: decision.confidence,
        autonomy: decision.autonomy
    });

    console.log("RITA status: aligned ✅");
}

runRITA("Check my emails and summarize them");
