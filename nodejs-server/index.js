import http from "http";
import express from "express";
import path from "path";
import { Server as SocketIO } from "socket.io";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


// Store active streams
const activeStreams = new Map();

// Serve static files
app.use(express.static(path.resolve(__dirname, "../public")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    activeStreams: activeStreams.size,
    timestamp: new Date().toISOString(),
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  let ffmpegProcess = null;
  let streamConfig = null;

  // Handle stream configuration
  socket.on("configure-stream", (config) => {
    console.log(`Configuring stream for ${socket.id}:`, {
      title: config.title,
      hasRtmpKey: !!config.rtmpKey,
    });

    streamConfig = config;

    // Create FFmpeg options with user's RTMP key
    const options = [
      "-i",
      "-", // Input from stdin
      "-c:v",
      "libx264", // Video codec
      "-preset",
      "ultrafast", // Encoding speed
      "-tune",
      "zerolatency", // Low latency
      "-r",
      "25", // Frame rate
      "-g",
      "50", // GOP size (2 seconds at 25fps)
      "-keyint_min",
      "25",
      "-crf",
      "25", // Quality
      "-pix_fmt",
      "yuv420p", // Pixel format
      "-sc_threshold",
      "0",
      "-profile:v",
      "main",
      "-level",
      "3.1",
      "-c:a",
      "aac", // Audio codec
      "-b:a",
      "128k", // Audio bitrate
      "-ar",
      "32000", // Audio sample rate
      "-f",
      "flv", // Output format
      config.rtmpKey, // User's RTMP URL + key
    ];

    // Spawn FFmpeg process
    ffmpegProcess = spawn("ffmpeg", options);

    // Store stream info
    activeStreams.set(socket.id, {
      title: config.title,
      startTime: new Date(),
      rtmpDestination: config.rtmpKey.split("/").pop(), // Hide sensitive info
    });

    // Handle FFmpeg output
    ffmpegProcess.stdout.on("data", (data) => {
      console.log(`FFmpeg stdout [${socket.id}]: ${data}`);
    });

    ffmpegProcess.stdin.on("error", (err) => {
      if (err.code !== "EPIPE") {
        console.error(`FFmpeg stdin error [${socket.id}]:`, err);
      }
    });

    ffmpegProcess.stderr.on("data", (data) => {
      const message = data.toString();
      console.log(`FFmpeg stderr [${socket.id}]: ${message}`);

      // Send status updates to client
      if (message.includes("frame=")) {
        socket.emit("stream-stats", {
          status: "streaming",
          message: "Stream active",
        });
      }
    });
    ffmpegProcess.on("close", (code) => {
      console.log(`FFmpeg process [${socket.id}] exited with code ${code}`);
      if (ffmpegProcess && ffmpegProcess.stdin) {
        try {
          ffmpegProcess.stdin.end();
        } catch (e) {}
      }
      activeStreams.delete(socket.id);
      socket.emit("stream-ended", { code });
    });

    ffmpegProcess.on("error", (error) => {
      console.error(`FFmpeg error [${socket.id}]:`, error);
      socket.emit("stream-error", { error: error.message });
    });

    socket.emit("stream-configured", { success: true });
  });

  // Handle binary stream data
  socket.on("binarystream", (stream) => {
    if (ffmpegProcess && ffmpegProcess.stdin.writable) {
      ffmpegProcess.stdin.write(stream, (err) => {
        if (err) {
          console.error(`Stream write error [${socket.id}]:`, err);
          socket.emit("stream-error", { error: "Failed to write stream data" });
        }
      });
    } else {
      console.warn(`FFmpeg stdin not writable for ${socket.id}`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);

    // Clean up FFmpeg process
    if (ffmpegProcess) {
      ffmpegProcess.kill("SIGTERM");
      ffmpegProcess = null;
    }

    // Remove from active streams
    activeStreams.delete(socket.id);
  });

  // Handle manual stream stop
  socket.on("stop-stream", () => {
    console.log(`Manual stream stop requested: ${socket.id}`);

    if (ffmpegProcess) {
      ffmpegProcess.kill("SIGTERM");
      ffmpegProcess = null;
    }

    activeStreams.delete(socket.id);
    socket.emit("stream-stopped", { success: true });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`StreamCast Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");

  // Kill all active FFmpeg processes
  activeStreams.forEach((stream, socketId) => {
    console.log(`Cleaning up stream: ${socketId}`);
  });

  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
