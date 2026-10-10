
const {
    generateFibonacci
} = require("../services/fibonacci.service");

function getFibonacci(req, res) {
    const rawN = req.query.n;

    // Reject missing, empty or non-integer input
    if (
        rawN === undefined ||
        rawN.trim() === "" ||
        !/^\d+$/.test(rawN)
    ) {
        return res.status(400).json({
            error: "Please provide a positive integer as n."
        });
    }

    const n = Number(rawN);

    if (!Number.isSafeInteger(n) || n < 1 || n > 50) {
        return res.status(400).json({
            error: "n must be between 1 and 50."
        });
    }

    const sequence = generateFibonacci(n);

    res.json({
        count: n,
        sequence: sequence,
        firstTerm: sequence[0],
        lastTerm: sequence[sequence.length - 1]
    });
}

module.exports = { getFibonacci };
