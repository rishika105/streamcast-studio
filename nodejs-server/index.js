import http from "http";
import express from "express";
import path from "path";
import { Server as SocketIO } from "socket.io";
import { spawn } from "child_process";

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const options = [
  "-i", "-",                    // read from stdin (Node piping video)
  "-c:v", "libx264",            // H.264 video codec
  "-preset", "veryfast",        // balance between speed & quality
  "-tune", "zerolatency",       // lower latency (useful for live)
  "-r", "30",                   // FPS (most platforms accept 30/60)
  "-g", "60",                   // GOP size = 2 sec (fps * 2)
  "-keyint_min", "30",          // minimum keyframe interval
  "-pix_fmt", "yuv420p",        // widely supported pixel format
  "-b:v", "2500k",              // video bitrate (change per quality)
  "-maxrate", "2500k",
  "-bufsize", "5000k",

  "-c:a", "aac",                // AAC audio codec
  "-b:a", "128k",               // audio bitrate
  "-ar", "44100",               // audio sample rate
  "-ac", "2",                   // stereo audio

  "-f", "flv",                  // RTMP requires FLV container
  "rtmp://a.rtmp.youtube.com/live2/"
];


const ffmpegProcess = spawn("ffmpeg", options);

ffmpegProcess.stdout.on("data", (data) => {
  console.log(`ffmpeg stdout: ${data}`);
});

ffmpegProcess.stderr.on("data", (data) => {
  console.error(`ffmpeg stderr: ${data}`);
});

ffmpegProcess.on("close", (code) => {
  console.log(`FFmpeg exited with code ${code}`);
  // prevent further writes
  io.sockets.sockets.forEach((socket) => {
    socket.removeAllListeners("binarystream");
  });
});

app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("binarystream", (stream) => {
    // console.log("Binary stream incoming......");
    //throw this stream to ffmpeg which is used for proceessing and streaming data to a rtmp app like yt, fb, etc
    //ffmpeg setup is not very simple use docker
    if (ffmpegProcess.stdin.writable) {
      ffmpegProcess.stdin.write(stream, (err) => {
        if (err) console.error("FFmpeg stdin write error:", err);
      });
    }
  });
});

server.listen(3000, () => console.log("HTTP Server is running on port 3000"));
