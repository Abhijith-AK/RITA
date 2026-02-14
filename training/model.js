function randomMatrix(rows, cols) {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.random() * 0.01)
    );
}

function dot(a, b) {
    return a.map(row =>
        b[0].map((_, colIndex) =>
            row.reduce((sum, value, rowIndex) => sum + value * b[rowIndex][colIndex], 0)
        )
    );
}

function relu(matrix) {
    return matrix.map(row =>
        row.map(value => Math.max(0, value))
    );
}

function softmax(matrix) {
    return matrix.map(row => {
        const exps = row.map(v => Math.exp(v));
        const sum = exps.reduce((a, b) => a + b, 0);
        return exps.map(v => v / sum);
    });
}

module.exports = {
    randomMatrix,
    dot,
    relu,
    softmax
};
