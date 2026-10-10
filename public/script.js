
const termInput = document.getElementById("termInput");
const termSlider = document.getElementById("termSlider");
const sliderValue = document.getElementById("sliderValue");

const generateBtn = document.getElementById("generateBtn");
const themeToggle = document.getElementById("themeToggle");
const errorMessage = document.getElementById("errorMessage");

const totalTerms = document.getElementById("totalTerms");
const firstTerm = document.getElementById("firstTerm");
const lastTerm = document.getElementById("lastTerm");

const sequenceList = document.getElementById("sequenceList");
const chartCanvas = document.getElementById("fibonacciChart");
const spiralCanvas = document.getElementById("fibonacciSpiral");

let fibonacciChart = null;
let currentSequence = [];
let isLightMode = false;

let activeController = null;
let latestRequestId = 0;
let sliderTimer = null;

// Format large numbers consistently
function formatNumber(number) {
    return Number(number).toLocaleString("en-US");
}

// Keep the number input and slider synchronized
function syncSlider(value) {
    termInput.value = value;
    termSlider.value = value;
    sliderValue.textContent = `${value} terms`;
}

// Display Fibonacci values below the graph
function displaySequence(sequence) {
    sequenceList.replaceChildren();

    const fragment = document.createDocumentFragment();

    sequence.forEach((number, index) => {
        const item = document.createElement("div");
        item.className = "sequence-item";

        const position = document.createElement("span");
        position.className = "position";
        position.textContent = `Term ${index + 1}`;

        const value = document.createElement("span");
        value.className = "number";
        value.textContent = formatNumber(number);

        item.append(position, value);
        fragment.appendChild(item);
    });

    sequenceList.appendChild(fragment);
}

// Create or update the animated Chart.js graph
function displayGraph(sequence) {
    const styles = getComputedStyle(document.body);

    const textColor = styles.getPropertyValue("--muted").trim();
    const gridColor = styles.getPropertyValue("--grid").trim();
    const blue = styles.getPropertyValue("--blue").trim();
    const purple = styles.getPropertyValue("--purple").trim();

    const labels = sequence.map((_, index) => index + 1);

    // Update the existing chart instead of recreating it
    if (fibonacciChart) {
        fibonacciChart.data.labels = labels;
        fibonacciChart.data.datasets[0].data = sequence;

        fibonacciChart.data.datasets[0].borderColor = blue;
        fibonacciChart.data.datasets[0].pointBackgroundColor = purple;
        fibonacciChart.data.datasets[0].backgroundColor =
            isLightMode
                ? "rgba(37, 99, 235, 0.10)"
                : "rgba(96, 165, 250, 0.12)";

        fibonacciChart.options.scales.x.ticks.color = textColor;
        fibonacciChart.options.scales.x.title.color = textColor;
        fibonacciChart.options.scales.x.grid.color = gridColor;

        fibonacciChart.options.scales.y.ticks.color = textColor;
        fibonacciChart.options.scales.y.title.color = textColor;
        fibonacciChart.options.scales.y.grid.color = gridColor;

        fibonacciChart.options.plugins.legend.labels.color = textColor;

        fibonacciChart.update();
        return;
    }

    fibonacciChart = new Chart(chartCanvas, {
        type: "line",

        data: {
            labels,

            datasets: [{
                label: "Fibonacci Number",
                data: sequence,

                borderColor: blue,
                backgroundColor: isLightMode
                    ? "rgba(37, 99, 235, 0.10)"
                    : "rgba(96, 165, 250, 0.12)",

                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: purple,
                pointBorderColor: "#ffffff",
                pointBorderWidth: 1,

                fill: true,
                tension: 0.25
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 450,
                easing: "easeOutQuart"
            },

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return " Value: " + formatNumber(context.raw);
                        }
                    }
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Term Position",
                        color: textColor
                    },

                    ticks: {
                        color: textColor,
                        maxTicksLimit: 12
                    },

                    grid: {
                        color: gridColor
                    }
                },

                y: {
                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Fibonacci Value",
                        color: textColor
                    },

                    ticks: {
                        color: textColor,

                        callback: function (value) {
                            return formatNumber(value);
                        }
                    },

                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

// Draw Fibonacci-sized squares and quarter-circle arcs
function displaySpiral(sequence) {
    const ctx = spiralCanvas.getContext("2d");
    const rect = spiralCanvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    spiralCanvas.width = Math.round(rect.width * dpr);
    spiralCanvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const styles = getComputedStyle(document.body);
    const lineColor = styles.getPropertyValue("--blue").trim();
    const textColor = styles.getPropertyValue("--muted").trim();

    // Start with 1, 1, 2, 3, 5...
    // Limit the spiral to keep it readable.
    const sizes = sequence.slice(1, 10).map(Number);

    if (sizes.length === 0) {
        sizes.push(1);
    }

    const squares = [];

    // Each square stores its bottom-left-style world position,
    // size, and placement direction.
    let minX = 0;
    let minY = 0;
    let maxX = sizes[0];
    let maxY = sizes[0];

    squares.push({
        x: 0,
        y: 0,
        size: sizes[0],
        direction: 0
    });

    for (let i = 1; i < sizes.length; i++) {
        const size = sizes[i];
        const direction = (i - 1) % 4;

        let x;
        let y;

        if (direction === 0) {
            x = maxX;
            y = minY;
        } else if (direction === 1) {
            x = minX;
            y = minY - size;
        } else if (direction === 2) {
            x = minX - size;
            y = minY;
        } else {
            x = minX;
            y = maxY;
        }

        squares.push({ x, y, size, direction });

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + size);
        maxY = Math.max(maxY, y + size);
    }

    const worldWidth = maxX - minX;
    const worldHeight = maxY - minY;

    const padding = 24;

    const scale = Math.min(
        (rect.width - padding * 2) / worldWidth,
        (rect.height - padding * 2) / worldHeight
    );

    const offsetX = (rect.width - worldWidth * scale) / 2;
    const offsetY = (rect.height - worldHeight * scale) / 2;

    // Draw the squares
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;

    squares.forEach(square => {
        const x = offsetX + (square.x - minX) * scale;
        const y = offsetY + (square.y - minY) * scale;
        const size = square.size * scale;

        ctx.strokeRect(x, y, size, size);
    });

    // Draw quarter-circle arcs inside the squares
    squares.forEach((square, index) => {
        const x = offsetX + (square.x - minX) * scale;
        const y = offsetY + (square.y - minY) * scale;
        const size = square.size * scale;

        let cx;
        let cy;
        let startAngle;

        if (index === 0) {
            cx = x + size;
            cy = y + size;
            startAngle = Math.PI;
        } else if (square.direction === 0) {
            cx = x;
            cy = y + size;
            startAngle = Math.PI * 1.5;
        } else if (square.direction === 1) {
            cx = x + size;
            cy = y + size;
            startAngle = Math.PI;
        } else if (square.direction === 2) {
            cx = x + size;
            cy = y;
            startAngle = 0;
        } else {
            cx = x;
            cy = y;
            startAngle = Math.PI * 0.5;
        }

        ctx.beginPath();
        ctx.arc(
            cx,
            cy,
            size,
            startAngle,
            startAngle + Math.PI / 2
        );
        ctx.stroke();
    });

    // Label the square sizes
    ctx.font = "12px Arial";
    ctx.fillStyle = textColor;

    squares.forEach(square => {
        const x = offsetX + (square.x - minX) * scale;
        const y = offsetY + (square.y - minY) * scale;
        const size = square.size * scale;

        if (size >= 28) {
            ctx.fillText(
                String(square.size),
                x + 5,
                y + 15
            );
        }
    });
}

// Fetch the Fibonacci sequence from the Express backend
async function generateGraph() {
    const rawValue = termInput.value.trim();
    const n = Number(rawValue);

    if (
        rawValue === "" ||
        !Number.isInteger(n) ||
        n < 1 ||
        n > 50
    ) {
        errorMessage.textContent =
            "Please enter a whole number between 1 and 50.";
        return;
    }

    errorMessage.textContent = "";

    // Cancel an older request if the user moves the slider again
    if (activeController) {
        activeController.abort();
    }

    const controller = new AbortController();
    activeController = controller;

    const requestId = ++latestRequestId;

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";

    try {
        const response = await fetch(
            `/api/fibonacci?n=${encodeURIComponent(n)}`,
            { signal: controller.signal }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Request failed.");
        }

        // Ignore stale responses
        if (requestId !== latestRequestId) return;

        currentSequence = result.sequence;

        totalTerms.textContent = result.count;
        firstTerm.textContent = formatNumber(result.firstTerm);
        lastTerm.textContent = formatNumber(result.lastTerm);

        displaySequence(currentSequence);
        displayGraph(currentSequence);
        displaySpiral(currentSequence);

    } catch (error) {
        if (error.name === "AbortError") return;

        if (requestId === latestRequestId) {
            errorMessage.textContent =
                error.message || "Could not connect to the server.";
        }
    } finally {
        if (requestId === latestRequestId) {
            generateBtn.disabled = false;
            generateBtn.textContent = "Generate Graph";
            activeController = null;
        }
    }
}

// Manual number input
termInput.addEventListener("input", function () {
    const rawValue = termInput.value.trim();
    const n = Number(rawValue);

    if (
        rawValue !== "" &&
        Number.isInteger(n) &&
        n >= 1 &&
        n <= 50
    ) {
        termSlider.value = n;
        sliderValue.textContent = `${n} terms`;
        errorMessage.textContent = "";
    }
});

// Generate using the button
generateBtn.addEventListener("click", generateGraph);

// Automatically update when the slider moves.
// A short debounce avoids sending a request for every tiny movement.
termSlider.addEventListener("input", function () {
    syncSlider(termSlider.value);
    errorMessage.textContent = "";

    clearTimeout(sliderTimer);

    sliderTimer = setTimeout(() => {
        generateGraph();
    }, 100);
});

// Also allow Enter in the number field
termInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        generateGraph();
    }
});

// Light/dark theme toggle
themeToggle.addEventListener("click", function () {
    isLightMode = !isLightMode;

    document.body.classList.toggle("light-theme", isLightMode);

    themeToggle.textContent = isLightMode
        ? "🌙 Dark mode"
        : "☀️ Light mode";

    themeToggle.setAttribute(
        "aria-label",
        isLightMode ? "Switch to dark mode" : "Switch to light mode"
    );

    if (currentSequence.length > 0) {
        displayGraph(currentSequence);
        displaySpiral(currentSequence);
    }
});

// Redraw spiral on browser resize
let resizeTimer;

window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        if (currentSequence.length > 0) {
            displaySpiral(currentSequence);
        }
    }, 100);
});

// Initial state
syncSlider(termSlider.value);
generateGraph();
