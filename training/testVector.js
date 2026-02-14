const { buildVocabulary } = require("./vocabulary");
const { vectorize } = require("./vectorizer");

const vocab = buildVocabulary();

const testSentence = "check my email";
const vector = vectorize(testSentence, vocab);

console.log("Vector length:", vector.length);
console.log("Non-zero values:", vector.filter(v => v > 0).length);
