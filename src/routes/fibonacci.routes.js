
const express = require("express");

const {
    getFibonacci
} = require("../controllers/fibonacci.controller");

const router = express.Router();

// GET /api/fibonacci?n=10
router.get("/", getFibonacci);

module.exports = router;
