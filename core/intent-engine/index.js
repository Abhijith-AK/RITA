function detectIntent(input) {
    if (input.toLowerCase().includes("email")) {
        return "CHECK_EMAIL";
    }

    return "UNKNOWN";
}

module.exports = { detectIntent };
