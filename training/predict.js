const fs = require("fs");
const path = require("path");

const { vectorize } = require("./vectorizer");
const { dot, relu, softmax } = require("./model");

const modelPath = path.join(__dirname, "trainedModel.json");

const model = JSON.parse(fs.readFileSync(modelPath, "utf8"));

function predict(text) {
    const x = [vectorize(text, model.vocabulary)];

    const z1 = dot(x, model.W1);
    const a1 = relu(z1);
    const z2 = dot(a1, model.W2);
    const yHat = softmax(z2);

    const probabilities = yHat[0];

    const maxIndex = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[maxIndex];

    return {
        intent: model.labels[maxIndex],
        confidence
    };
}

module.exports = { predict };
