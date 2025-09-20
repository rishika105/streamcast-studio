"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ActivityIcon, UsersIcon, WifiIcon, HardDriveIcon, ClockIcon } from "lucide-react"

interface StreamStatsProps {
  connectionStatus: "disconnected" | "connecting" | "connected"
  viewerCount: number
  isStreaming: boolean
}

export function StreamStats({ connectionStatus, viewerCount, isStreaming }: StreamStatsProps) {
  const [streamDuration, setStreamDuration] = useState(0)
  const [bitrate, setBitrate] = useState(2500)
  const [cpuUsage, setCpuUsage] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration((prev) => prev + 1)
        // Simulate bitrate fluctuation
        setBitrate((prev) => prev + (Math.random() - 0.5) * 100)
        // Simulate CPU usage
        setCpuUsage(Math.random() * 60 + 20)
      }, 1000)
    } else {
      setStreamDuration(0)
      setCpuUsage(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStreaming])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
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

  const getStatusVariant = () => {
    switch (connectionStatus) {
      case "connected":
        return "default"
      case "connecting":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ActivityIcon className="w-5 h-5" />
          Stream Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
        </div>

        {/* Stream Duration */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Duration</span>
          </div>
          <span className="font-mono text-sm font-medium">{formatDuration(streamDuration)}</span>
        </div>

        {/* Viewer Count */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Viewers</span>
          </div>
          <span className="font-medium">{viewerCount}</span>
        </div>

        {/* Bitrate */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <WifiIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Bitrate</span>
          </div>
          <span className="font-medium">{Math.round(bitrate)} kbps</span>
        </div>

        {/* Quality Settings */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Quality</span>
          <span className="font-medium">1080p 30fps</span>
        </div>

        {/* CPU Usage */}
        {isStreaming && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HardDriveIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">CPU Usage</span>
              </div>
              <span className="font-medium">{Math.round(cpuUsage)}%</span>
            </div>
            <Progress value={cpuUsage} className="h-2" />
          </div>
        )}

        {/* Network Status */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Upload</p>
              <p className="text-sm font-medium">{isStreaming ? `${(bitrate / 1000).toFixed(1)} Mbps` : "0 Mbps"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Dropped Frames</p>
              <p className="text-sm font-medium">{isStreaming ? Math.floor(Math.random() * 5) : 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
