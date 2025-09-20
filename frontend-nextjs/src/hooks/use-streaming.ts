"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { io, type Socket } from "socket.io-client"

export interface StreamingState {
  isStreaming: boolean
  connectionStatus: "disconnected" | "connecting" | "connected"
  viewerCount: number
  error: string | null
}

export interface StreamingConfig {
  rtmpKey: string
  streamTitle: string
  serverUrl?: string
}

export function useStreaming() {
  const [state, setState] = useState<StreamingState>({
    isStreaming: false,
    connectionStatus: "disconnected",
    viewerCount: 0,
    error: null,
  })

  const socketRef = useRef<Socket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const viewerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      mediaStreamRef.current = stream
      setState((prev) => ({ ...prev, error: null }))
      return stream
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to access camera"
      setState((prev) => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  const startStreaming = useCallback(
    async (config: StreamingConfig) => {
      if (!config.rtmpKey.trim()) {
        setState((prev) => ({ ...prev, error: "RTMP key is required" }))
        return false
      }

      try {
        setState((prev) => ({ ...prev, connectionStatus: "connecting", error: null }))

        // Get media stream if not already available
        if (!mediaStreamRef.current) {
          await initializeCamera()
        }

        if (!mediaStreamRef.current) {
          throw new Error("Failed to initialize camera")
        }

        // Connect to Socket.IO server
        const serverUrl = config.serverUrl || "http://localhost:3000"
        socketRef.current = io(serverUrl, {
          transports: ["websocket", "polling"],
        })

        // Setup socket event listeners
        socketRef.current.on("connect", () => {
          setState((prev) => ({ ...prev, connectionStatus: "connected" }))
          console.log("Connected to streaming server")
        })

        socketRef.current.on("disconnect", () => {
          setState((prev) => ({ ...prev, connectionStatus: "disconnected" }))
          console.log("Disconnected from streaming server")
        })

        socketRef.current.on("connect_error", (error) => {
          setState((prev) => ({
            ...prev,
            connectionStatus: "disconnected",
            error: `Connection failed: ${error.message}`,
          }))
        })

        // Send RTMP configuration to server
        socketRef.current.emit("configure-stream", {
          rtmpKey: config.rtmpKey,
          title: config.streamTitle,
        })

        // Setup MediaRecorder with optimized settings
        const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
          mimeType: "video/webm;codecs=vp8,opus",
          videoBitsPerSecond: 2500000,
          audioBitsPerSecond: 128000,
        })

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socketRef.current?.connected) {
            socketRef.current.emit("binarystream", event.data)
          }
        }

        mediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error:", event)
          setState((prev) => ({
            ...prev,
            error: "Recording error occurred",
            isStreaming: false,
          }))
        }

        mediaRecorder.start(25) // Send data every 25ms for smooth streaming
        mediaRecorderRef.current = mediaRecorder

        setState((prev) => ({ ...prev, isStreaming: true }))

        // Start viewer count simulation
        viewerIntervalRef.current = setInterval(() => {
          setState((prev) => ({
            ...prev,
            viewerCount: prev.viewerCount + Math.floor(Math.random() * 3),
          }))
        }, 5000)

        return true
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to start streaming"
        setState((prev) => ({
          ...prev,
          connectionStatus: "disconnected",
          error: errorMessage,
        }))
        return false
      }
    },
    [initializeCamera],
  )

  const stopStreaming = useCallback(() => {
    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }

    // Clear viewer count interval
    if (viewerIntervalRef.current) {
      clearInterval(viewerIntervalRef.current)
      viewerIntervalRef.current = null
    }

    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    setState((prev) => ({
      ...prev,
      isStreaming: false,
      connectionStatus: "disconnected",
      viewerCount: 0,
      error: null,
    }))
  }, [])

  const getMediaStream = useCallback(() => {
    return mediaStreamRef.current
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreaming()
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stopStreaming])

  return {
    ...state,
    startStreaming,
    stopStreaming,
    initializeCamera,
    getMediaStream,
  }
}
