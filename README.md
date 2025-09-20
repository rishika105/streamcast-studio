# StreamCast Studio

A professional live streaming platform built with Next.js and Node.js, featuring real-time video streaming to RTMP endpoints like YouTube, Twitch, and Facebook Live.

## Features

- **Professional UI**: Dark theme optimized for streaming workflows
- **Multi-Platform Support**: Stream to YouTube, Twitch, Facebook, and custom RTMP endpoints
- **Real-time Streaming**: WebRTC capture with Socket.IO and FFmpeg processing
- **Scalable Architecture**: Docker containerization for easy deployment
- **Stream Management**: RTMP key configuration, quality settings, and live statistics
- **Media Controls**: Camera and microphone management with real-time preview

## Architecture

### Frontend (Next.js)
- **React Components**: Modular UI with shadcn/ui components
- **Real-time Communication**: Socket.IO client for streaming data
- **Media Capture**: WebRTC getUserMedia API for camera/microphone access
- **State Management**: Custom hooks for streaming logic

### Backend (Node.js)
- **Express Server**: HTTP server with Socket.IO integration
- **FFmpeg Integration**: Real-time video processing and RTMP streaming
- **Container Support**: Docker configuration for scalable deployment
- **Stream Management**: Multiple concurrent streams with process isolation

## Quick Start

### Development Setup

1. **Install Dependencies**
   \`\`\`bash
   # Frontend
   npm install
   
   # Backend
   cd server
   npm install
   \`\`\`

2. **Start Development Servers**
   \`\`\`bash
   # Terminal 1: Frontend (Next.js)
   npm run dev
   
   # Terminal 2: Backend (Node.js)
   cd server
   npm run dev
   \`\`\`

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Docker Deployment

1. **Build and Run with Docker Compose**
   \`\`\`bash
   docker-compose up --build
   \`\`\`

2. **Production with Nginx**
   \`\`\`bash
   docker-compose --profile production up --build
   \`\`\`

## Scalability & Container Architecture

### Per-Stream Containers

For maximum scalability, you can deploy individual containers for each stream:

\`\`\`bash
# Create isolated container for each stream
docker run -d \
  --name stream-${USER_ID} \
  -p ${DYNAMIC_PORT}:3001 \
  -e RTMP_KEY=${USER_RTMP_KEY} \
  streamcast-server
\`\`\`

### Kubernetes Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: streamcast-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: streamcast
  template:
    metadata:
      labels:
        app: streamcast
    spec:
      containers:
      - name: streamcast
        image: streamcast-server:latest
        ports:
        - containerPort: 3001
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
\`\`\`

## RTMP Configuration

### Supported Platforms

1. **YouTube Live**
   - RTMP URL: `rtmp://a.rtmp.youtube.com/live2/`
   - Get key: YouTube Studio → Create → Go Live

2. **Twitch**
   - RTMP URL: `rtmp://live.twitch.tv/app/`
   - Get key: Creator Dashboard → Settings → Stream

3. **Facebook Live**
   - RTMP URL: `rtmps://live-api-s.facebook.com:443/rtmp/`
   - Get key: Creator Studio → Live → Create Live Stream

4. **Custom RTMP**
   - Use any RTMP server URL with your stream key

### Stream Quality Settings

- **Resolution**: 1920x1080 (1080p)
- **Frame Rate**: 30 FPS
- **Video Bitrate**: 2.5 Mbps
- **Audio Bitrate**: 128 kbps
- **Codec**: H.264 (libx264) + AAC

## API Endpoints

### Health Check
\`\`\`
GET /health
\`\`\`

### Socket.IO Events

**Client → Server:**
- `configure-stream`: Set RTMP configuration
- `binarystream`: Send video/audio data
- `stop-stream`: Stop streaming

**Server → Client:**
- `stream-configured`: Configuration confirmed
- `stream-stats`: Real-time statistics
- `stream-error`: Error notifications
- `stream-ended`: Stream termination

## Environment Variables

\`\`\`env
# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend Configuration
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
\`\`\`

## Requirements

- **Node.js**: 18.0.0 or higher
- **FFmpeg**: Required for video processing
- **Docker**: Optional, for containerized deployment
- **Modern Browser**: WebRTC support required

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
