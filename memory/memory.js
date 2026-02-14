const fs = require("fs");
const path = require("path");

const memoryPath = path.join(__dirname, "decisionMemory.json");

function loadMemory() {
    return JSON.parse(fs.readFileSync(memoryPath, "utf8"));
}

function saveMemory(memory) {
    fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

function recordApproval(intent) {
    const memory = loadMemory();

    if (!memory[intent]) {
        memory[intent] = { approvals: 0 };
    }

    memory[intent].approvals += 1;
    saveMemory(memory);
}

function getApprovalCount(intent) {
    const memory = loadMemory();
    return memory[intent]?.approvals || 0;
}

module.exports = {
    recordApproval,
    getApprovalCount
};
