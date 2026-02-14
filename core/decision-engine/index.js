function decideStrategy(intent, capabilities) {
  const available = capabilities[intent];

  if (!available) {
    return {
      strategy: "DENY",
      confidence: 0,
      autonomy: "DENY"
    };
  }

  let strategy = null;

  if (available.api) strategy = "API";
  else if (available.system) strategy = "SYSTEM";
  else if (available.manual) strategy = "MANUAL";
  else strategy = "DENY";

  const confidence = calculateConfidence(strategy);
  const autonomy = determineAutonomy(confidence);

  return {
    strategy,
    confidence,
    autonomy
  };
}

function calculateConfidence(strategy) {
  if (strategy === "API") return 0.9;
  if (strategy === "SYSTEM") return 0.7;
  if (strategy === "MANUAL") return 0.6;
  return 0;
}

function determineAutonomy(confidence) {
  if (confidence >= 0.85) return "ASK";
  if (confidence >= 0.6) return "ASK";
  return "DENY";
}

module.exports = { decideStrategy };
