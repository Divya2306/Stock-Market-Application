const express = require("express");
const router = express.Router();

// Store transactions in memory
let transactions = [];

/**
 * Store a new transaction and notify clients.
 */
router.post("/transactions", (req, res) => {
  const { stockName, type, quantity, price, status, stockSymbol } = req.body;

  if (
    !stockName ||
    !stockSymbol ||
    !type ||
    quantity === undefined ||
    !price ||
    !status
  ) {
    return res.status(400).json({ error: "Missing transaction fields" });
  }

  const newTransaction = {
    id: `${stockName}-${Date.now()}`,
    stockName,
    stockSymbol,
    type,
    quantity: quantity || 0,
    price,
    timestamp: new Date().toISOString(),
    status,
  };

  transactions.unshift(newTransaction);

  // Emit transaction event through WebSocket
  req.app.get("io").emit("newTransaction", newTransaction);

  res.status(201).json(newTransaction);
});

/**
 * Get all stored transactions.
 */
router.get("/transactions", (_req, res) => {
  res.json(transactions);
});

module.exports = router;
