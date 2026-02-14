const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "intentData.json");

function getIntentLabels() {
    const raw = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const labels = new Set();

    raw.forEach(item => labels.add(item.intent));

    return Array.from(labels);
}

function encodeLabel(intent, labels) {
    const vector = new Array(labels.length).fill(0);
    const index = labels.indexOf(intent);
    if (index !== -1) {
        vector[index] = 1;
    }
    return vector;
}

module.exports = { getIntentLabels, encodeLabel };
