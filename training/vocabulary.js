const fs = require("fs");
const path = require("path");
const { tokenize } = require("./tokenizer");

const dataPath = path.join(__dirname, "intentData.json");

function buildVocabulary() {
    const raw = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const vocab = new Set();

    raw.forEach(item => {
        const tokens = tokenize(item.text);
        tokens.forEach(token => vocab.add(token));
    });

    return Array.from(vocab);
}

module.exports = { buildVocabulary };
