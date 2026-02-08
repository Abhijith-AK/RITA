function decideStrategy(intent, capabilities) {
    const available = capabilities[intent];

    if (!available) return "DENY";

    if (available.api) return "API";
    if (available.system) return "SYSTEM";
    if (available.manual) return "MANUAL";

    return "DENY";
}

module.exports = { decideStrategy };
