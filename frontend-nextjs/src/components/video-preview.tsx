"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoIcon } from "lucide-react"

interface VideoPreviewProps {
  mediaStream: MediaStream | null
  isStreaming: boolean
  className?: string
}

export function VideoPreview({ mediaStream, isStreaming, className }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream
    }
  }, [mediaStream])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <VideoIcon className="w-5 h-5" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          {isStreaming && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-500 text-white gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </Badge>
            </div>
          )}
          {!mediaStream && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Camera not initialized</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
