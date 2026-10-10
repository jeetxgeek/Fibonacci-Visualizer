
const express = require("express");
const path = require("path");

const fibonacciRoutes = require("./src/routes/fibonacci.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve HTML, CSS and JavaScript from public/
app.use(express.static(path.join(__dirname, "public")));

// Fibonacci API
app.use("/api/fibonacci", fibonacciRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
