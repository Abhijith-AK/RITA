const { tokenize } = require("./tokenizer");

function vectorize(text, vocabulary) {
    const tokens = tokenize(text);
    const vector = new Array(vocabulary.length).fill(0);

    tokens.forEach(token => {
        const index = vocabulary.indexOf(token);
        if (index !== -1) {
            vector[index] += 1;
        }
    });

    return vector;
}

module.exports = { vectorize };
