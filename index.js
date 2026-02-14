const fs = require("fs");
const { detectIntent } = require("./core/intent-engine");
const { decideStrategy } = require("./core/decision-engine");
const { executeAction } = require("./actions/executor");
const capabilities = require("./core/capability-resolver/capabilities.json");
const readline = require("readline");


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

runRITA("Check my emails and summarize them");
