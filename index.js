const fs = require("fs");
// const { detectIntent } = require("./core/intent-engine");
const { predict } = require("./training/predict");
const { decideStrategy } = require("./core/decision-engine");
const { executeAction } = require("./actions/executor");
const capabilities = require("./core/capability-resolver/capabilities.json");
const readline = require("readline");
const { recordApproval, getApprovalCount } = require("./memory/memory");


function logAction(data) {
    fs.appendFileSync(
        "./logs/actions.log",
        JSON.stringify(data) + "\n"
    );
}

function runRITA(input) {
    console.log("Input:", input);

    const prediction = predict(input);
    const intent = prediction.intent;
    const modelConfidence = prediction.confidence;

    console.log("Model Confidence:", modelConfidence.toFixed(4));
    
    console.log("Detected Intent:", intent);
    
    const decision = decideStrategy(intent, capabilities);

    // ---- MODEL-BASED AUTONOMY CONTROL ----
    if (modelConfidence > 0.85) {
        decision.autonomy = "AUTO";
    } else if (modelConfidence > 0.60) {
        decision.autonomy = "ASK";
    } else {
        decision.autonomy = "DENY";
    }

    if (decision.strategy === "DENY") {
        decision.autonomy = "DENY";
    }

    // ---- MEMORY-BASED ESCALATION ----
    const approvalCount = getApprovalCount(intent);

    if (approvalCount >= 3 && decision.autonomy !== "DENY") {
        decision.autonomy = "AUTO";
        console.log("RITA learned this action is safe. Switching to AUTO mode.");
    }


    console.log("Chosen Strategy:", decision.strategy);
    console.log("Model Confidence:", modelConfidence.toFixed(4));
    console.log("Autonomy:", decision.autonomy);

    logAction({
        timestamp: new Date().toISOString(),
        input,
        intent,
        strategy: decision.strategy,
        confidence: decision.confidence,
        autonomy: decision.autonomy
    });

    if (decision.autonomy === "DENY") {
        console.log("Execution denied due to low confidence.");
    } else if (decision.autonomy === "ASK") {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(
            `RITA wants to execute ${intent} using ${decision.strategy}. Confirm? (yes/no): `,
            answer => {
                if (answer.toLowerCase() === "yes") {
                    recordApproval(intent);
                    const result = executeAction(intent, decision);
                    console.log("Execution Result:");
                    console.log(result.summary || result.message);

                    logAction({
                        timestamp: new Date().toISOString(),
                        intent,
                        result
                    });
                } else {
                    console.log("Execution cancelled by user.");
                }

                rl.close();
                console.log("RITA status: aligned ✅");
            }
        );

        return;
    } else if (decision.autonomy === "AUTO") {
        const result = executeAction(intent, decision);

        console.log("Execution Result:");
        console.log(result.summary || result.message);

        logAction({
            timestamp: new Date().toISOString(),
            intent,
            result
        });
    }

    console.log("RITA status: aligned ✅");
}

runRITA("delete all emails");