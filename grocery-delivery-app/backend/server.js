const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// Connect to MongoDB
connectDB();

// Register all routes — original app features
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

// Register new feature routes
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/support", require("./routes/supportRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*" },
});

io.on("connection", (socket) => {
  socket.on("join-order-room", (orderId) => {
    socket.join(`order-${orderId}`);
  });

  socket.on("send-location", ({ orderId, lat, lng }) => {
    io.to(`order-${orderId}`).emit("receive-location", { lat, lng });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));