const { checkEmailAPI } = require("./api/email");

function executeAction(intent, decision) {
    if (intent === "CHECK_EMAIL" && decision.strategy === "API") {
        return checkEmailAPI();
    }

    return { message: "No valid execution path." };
}

module.exports = { executeAction };
