
function generateFibonacci(n) {
    const sequence = [];

    for (let i = 0; i < n; i++) {
        if (i < 2) {
            sequence.push(i);
        } else {
            sequence.push(
                sequence[i - 1] + sequence[i - 2]
            );
        }
    }

    return sequence;
}

module.exports = { generateFibonacci };
