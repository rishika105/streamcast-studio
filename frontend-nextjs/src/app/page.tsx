"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { VideoIcon, RadioIcon } from "lucide-react"
import { useStreaming } from "@/hooks/use-streaming"
import { VideoPreview } from "@/components/video-preview"
import { RTMPConfig } from "@/components/rtmp-config"
import { StreamControls } from "@/components/stream-controls"
import { StreamStats } from "@/components/stream-stats"
import { StreamPlatforms } from "@/components/stream-platforms"

export default function StreamingStudio() {
  const [rtmpKey, setRtmpKey] = useState("")
  const [streamTitle, setStreamTitle] = useState("")

  const {
    isStreaming,
    connectionStatus,
    viewerCount,
    error,
    startStreaming,
    stopStreaming,
    initializeCamera,
    getMediaStream,
  } = useStreaming()

  const handleStartStreaming = async () => {
    const success = await startStreaming({
      rtmpKey,
      streamTitle,
      serverUrl: "http://localhost:3001",
    })

    if (!success && error) {
      console.error("Failed to start streaming:", error)
    }
  }

  const handleQuickSetup = (platform: string, fullRtmpUrl: string) => {
    setRtmpKey(fullRtmpUrl)
    console.log(`Configured for ${platform}:`, fullRtmpUrl)
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500"
      case "connecting":
        return "bg-yellow-500"
      default:
        return "bg-red-500"
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Live"
      case "connecting":
        return "Connecting"
      default:
        return "Offline"
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <VideoIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">StreamCast Studio</h1>
              <p className="text-muted-foreground">Professional live streaming platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={connectionStatus === "connected" ? "default" : "secondary"} className="gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              {getStatusText()}
            </Badge>
            {isStreaming && (
              <Badge variant="outline" className="gap-2">
                <RadioIcon className="w-3 h-3" />
                {viewerCount} viewers
              </Badge>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Preview */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPreview mediaStream={getMediaStream()} isStreaming={isStreaming} />

            {/* Stream Platforms */}
            <StreamPlatforms />
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Stream Configuration */}
            <RTMPConfig
              rtmpKey={rtmpKey}
              streamTitle={streamTitle}
              onRtmpKeyChange={setRtmpKey}
              onStreamTitleChange={setStreamTitle}
              onQuickSetup={handleQuickSetup}
              disabled={isStreaming}
            />

            {/* Stream Controls */}
            <StreamControls
              isStreaming={isStreaming}
              connectionStatus={connectionStatus}
              onStartStreaming={handleStartStreaming}
              onStopStreaming={stopStreaming}
              onInitializeCamera={initializeCamera}
              disabled={!rtmpKey.trim()}
            />

            {/* Stream Stats */}
            <StreamStats connectionStatus={connectionStatus} viewerCount={viewerCount} isStreaming={isStreaming} />
          </div>
        </div>
      </div>
    </div>
  )
}
