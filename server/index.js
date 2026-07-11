const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db.js");
const colors = require("colors");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const chatRoutes = require("./routes/chatRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { apiLimiter } = require("./middleware/rateLimiters.js");
const User = require("./models/userModel.js");
const presence = require("./utils/presence.js");

const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const { PORT, CLIENT_ACCESS_URL } = require("./config/keys.js");

// Use a safe default port in development when PORT is not provided

const UNSAFE_PORTS = new Set([
  6000, 6665, 6666, 6667, 6668, 6669, 6697, 10080, 1719, 1720, 1723, 2049, 3659,
  4045,
]);
let port = Number(PORT) || 4000;
if (UNSAFE_PORTS.has(port)) {
  console.warn(
    `Configured port ${port} is browser-unsafe. Falling back to 4000.`
  );
  port = 4000;
}

const app = express();
connectDB();

const http = require("http");

// CORS restricted to the configured client origin(s) (comma-separated allowed)
const allowedOrigins = (CLIENT_ACCESS_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser clients (no Origin header) and configured origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json()); // to accept json data
app.use(mongoSanitize()); // strip $/. keys to block NoSQL operator injection

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to V-Talk Server",
  });
});

// Routes
app.use("/api", apiLimiter);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

// PORT
// const PORT = PORT || 4000;

server.listen(port, () => {
  console.log(
    `Server is Running on PORT: http://localhost:${port}`.yellow.bold
  );
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// expose io to route controllers (settings toggle broadcasts presence changes)
app.set("io", io);

io.on("connection", (socket) => {
  // a client connected

  socket.on("setup", async (userData) => {
    if (!userData || !userData._id) {
      return;
    }
    const userId = String(userData._id);
    socket.join(userId);
    socket.data.userId = userId;
    console.log(`${userData.name} with _id: ${userId} is connected.`);
    socket.emit("connected");

    // visibility is read from the DB, not trusted from the client payload.
    // lastSeen is stamped on connect too, so it stays populated even if the
    // server dies before the disconnect handler runs, and existing accounts
    // get a value the first time they open the app.
    let visible = true;
    try {
      const dbUser = await User.findByIdAndUpdate(
        userId,
        { lastSeen: new Date() },
        { new: true }
      ).select("showOnlineStatus");
      visible = dbUser ? dbUser.showOnlineStatus !== false : true;
    } catch (err) {
      console.error("presence lookup failed:", err.message);
    }

    const isFirst = presence.addSocket(userId, socket.id, visible);
    socket.emit("online users", presence.getVisibleOnlineUserIds());
    if (isFirst && visible) {
      socket.broadcast.emit("user online", userId);
    }
  });

  socket.on("disconnect", async () => {
    const userId = socket.data.userId;
    if (!userId) {
      return;
    }
    const { isLast, wasVisible } = presence.removeSocket(userId, socket.id);
    if (!isLast) {
      return;
    }
    const lastSeen = new Date();
    try {
      // always persist, even when hidden, so a truthful value exists if the
      // user re-enables visibility later
      await User.findByIdAndUpdate(userId, { lastSeen });
    } catch (err) {
      console.error("lastSeen update failed:", err.message);
    }
    if (wasVisible) {
      io.emit("user offline", { userId, lastSeen: lastSeen.toISOString() });
    }
  });

  socket.on("join chat", (room) => {
    if (!room) {
      return console.log(`no room is selected by user`);
    }
    socket.join(room);
    console.log(`user joined room. Room _id : ${room._id}`);
  });

  socket.on("typing", (room) =>
    socket.in(room).emit("typing", {
      senderId: room.senderId,
    })
  );
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat) {
      return;
    }
    // if (!chat.users) {
    //   retconsole.log("chat.users is not defined");
    // }

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        return;
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // forward updates like reactions and deletions
  socket.on("message updated", (updatedMessage) => {
    const chat = updatedMessage.chat;
    if (!chat) return;
    chat.users.forEach((user) => {
      if (user._id == updatedMessage.sender._id) return;
      socket.in(user._id).emit("message updated", updatedMessage);
    });
  });
});
