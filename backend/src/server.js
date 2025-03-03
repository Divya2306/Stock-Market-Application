const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const transactionRoutes = require("./routes/transaction");
const { setupSocket } = require("./config/socket");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Create HTTP Server
const httpServer = createServer(app);

// Setup WebSocket Server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// Initialize socket events
setupSocket(io);

// API Routes
app.use("/api", transactionRoutes);

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
