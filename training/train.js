const fs = require("fs");
const path = require("path");

const { buildVocabulary } = require("./vocabulary");
const { vectorize } = require("./vectorizer");
const { getIntentLabels, encodeLabel } = require("./labelEncoder");
const { randomMatrix, dot, relu, softmax } = require("./model");

const dataPath = path.join(__dirname, "intentData.json");
const modelOutputPath = path.join(__dirname, "trainedModel.json");

const rawData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const vocabulary = buildVocabulary();
const labels = getIntentLabels();

const inputSize = vocabulary.length;
const hiddenSize = 32;
const outputSize = labels.length;
const learningRate = 0.01;
const epochs = 200;

// Initialize weights
let W1 = randomMatrix(inputSize, hiddenSize);
let W2 = randomMatrix(hiddenSize, outputSize);

function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function subtract(a, b) {
    return a.map((row, i) =>
        row.map((val, j) => val - b[i][j])
    );
}

function multiplyScalar(matrix, scalar) {
    return matrix.map(row =>
        row.map(val => val * scalar)
    );
}

function train() {
    for (let epoch = 0; epoch < epochs; epoch++) {
        let totalLoss = 0;

        rawData.forEach(sample => {
            const x = [vectorize(sample.text, vocabulary)];
            const y = [encodeLabel(sample.intent, labels)];

            // Forward pass
            const z1 = dot(x, W1);
            const a1 = relu(z1);
            const z2 = dot(a1, W2);
            const yHat = softmax(z2);

            // Loss (cross entropy)
            const loss = -y[0].reduce((sum, val, i) =>
                sum + val * Math.log(yHat[0][i] + 1e-8), 0);
            totalLoss += loss;

            // Backprop
            const dZ2 = subtract(yHat, y);
            const dW2 = dot(transpose(a1), dZ2);

            const dA1 = dot(dZ2, transpose(W2));
            const dZ1 = a1.map((row, i) =>
                row.map((val, j) => val > 0 ? dA1[i][j] : 0)
            );
            const dW1 = dot(transpose(x), dZ1);

            // Update weights
            W2 = subtract(W2, multiplyScalar(dW2, learningRate));
            W1 = subtract(W1, multiplyScalar(dW1, learningRate));
        });

        if (epoch % 20 === 0) {
            console.log(`Epoch ${epoch} Loss: ${(totalLoss / rawData.length).toFixed(4)}`);
        }
    }

    fs.writeFileSync(modelOutputPath, JSON.stringify({
        W1,
        W2,
        vocabulary,
        labels
    }, null, 2));

    console.log("Training complete. Model saved.");
}

train();
