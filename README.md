
# StreamCast Studio

A professional live streaming platform built with Next.js and Node.js, featuring real-time video streaming to RTMP endpoints like YouTube, Twitch, and Facebook Live.

---

## Features

- **Professional UI**: Dark theme optimized for streaming workflows  
- **Multi-Platform Support**: Stream to YouTube, Twitch, Facebook, and custom RTMP endpoints  
- **Real-time Streaming**: WebRTC capture with Socket.IO and FFmpeg processing  
- **Simple Architecture**: Single Docker container deployment  
- **Stream Management**: RTMP key configuration, quality settings, and live statistics  
- **Media Controls**: Camera and microphone management with real-time preview  

---

## Tech Stack

| Layer / Role            | Technology / Tool                                     |
|-------------------------|------------------------------------------------------|
| Frontend                | Next.js + React                                      |
| Backend                 | Node.js + Express                                    |
| Realtime Communication  | Socket.IO                                            |
| Media Processing        | FFmpeg (run from Docker)                             |
| Reverse Proxy (optional)| Nginx (for WebSocket proxying and HTTP routing)     |
| Containerization        | Docker, Docker Compose                               |


### Development Setup

1. **Clone and Install Dependencies**

   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd streamcast-studio

   # Frontend dependencies
   npm install

   # Backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Start Development Servers**

   ```bash
   # Terminal 1: Backend (Node.js) - Start this first
   cd server
   npm run dev

   # Terminal 2: Frontend (Next.js)
   npm run dev
   ```

3. **Access Application**

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend Health Check: [http://localhost:3001/health](http://localhost:3001/health)

---

### Docker Deployment

1. **Build and Run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

2. **Access Application**

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Server: [http://localhost:3001](http://localhost:3001)

---

## How to stream (minimal)

1. Obtain stream key/URL from your target platform (YouTube/Twitch/Facebook) — the full RTMP URL looks like:

   * YouTube example: `rtmp://a.rtmp.youtube.com/live2/YOUR_STREAM_KEY`
   * Twitch example: `rtmp://live.twitch.tv/app/YOUR_STREAM_KEY`
   * Facebook example: `rtmps://live-api-s.facebook.com:443/rtmp/YOUR_STREAM_KEY`

2. Open the web UI ([http://localhost:3000](http://localhost:3000))

3. Click **Initialize Camera**

4. Paste full RTMP URL into the RTMP configuration field (the server will spawn FFmpeg with that URL)

5. Click **Start Streaming**


## Technical Details

### Data Flow

```
Browser Camera → MediaRecorder → WebRTC Binary → Socket.IO → 
Node.js Server → FFmpeg → RTMP Stream → YouTube/Twitch/etc.
```

### Stream Quality Settings

* **Resolution**: 1920x1080 (1080p)
* **Frame Rate**: 30 FPS
* **Video Bitrate**: 2.5 Mbps
* **Audio Bitrate**: 128 kbps
* **Video Codec**: H.264 (libx264)
* **Audio Codec**: AAC
* **Container**: WebM (browser) → FLV (RTMP)

---

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend Configuration
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

---

## Security notes

* Treat RTMP keys as secrets. Avoid logging them. The server should store only masked or hashed identifiers if needed.
* If you add user accounts or persistent keys, use an encrypted store / vault.

---

## Future Scope 

1. Integrate platform APIs + OAuth to auto-connect YouTube/Twitch/Facebook without manual RTMP entry.  
2. Scale FFmpeg workloads using multiple worker containers for high availability.  
3. Use Socket.IO adapters (e.g., Redis) to support multiple server instances.  
4. Add centralized logging and monitoring for stream reliability and metrics.  
5. Secure secrets with a manager and run containers with minimal privileges.  
6. Improve UX: presets for quality, stream previews, reconnects, and saved destinations.
