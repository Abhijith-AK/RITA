const { buildVocabulary } = require("./vocabulary");

const vocab = buildVocabulary();

console.log("Vocabulary size:", vocab.length);
console.log(vocab);
