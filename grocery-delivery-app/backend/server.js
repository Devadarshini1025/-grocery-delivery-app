const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// Register New Feature Routes
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/support", require("./routes/supportRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));

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