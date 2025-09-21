'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  PlayIcon,
  StampIcon as StopIcon,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  CameraIcon
} from 'lucide-react'

interface StreamControlsProps {
  isStreaming: boolean
  connectionStatus: 'disconnected' | 'connecting' | 'connected'
  onStartStreaming: () => void
  onStopStreaming: () => void
  onInitializeCamera: () => void
  onToggleMute: () => boolean // 👈 new
  onToggleCamera: () => boolean // 👈 new
  disabled?: boolean
}

export function StreamControls ({
  isStreaming,
  connectionStatus,
  onStartStreaming,
  onStopStreaming,
  onInitializeCamera,
  onToggleCamera,
  onToggleMute,
  disabled = false
}: StreamControlsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)

  const handleToggleMute = () => {
    const muted = onToggleMute()
    setIsMuted(muted)
  }

  const handleToggleCamera = () => {
    const cameraOff = onToggleCamera()
    setIsCameraOff(cameraOff)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stream Controls</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Main Stream Control */}
        {!isStreaming ? (
          <Button
            onClick={onStartStreaming}
            className='w-full gap-2'
            size='lg'
            disabled={disabled}
          >
            <PlayIcon className='w-4 h-4' />
            Start Streaming
          </Button>
        ) : (
          <Button
            onClick={onStopStreaming}
            variant='destructive'
            className='w-full gap-2'
            size='lg'
          >
            <StopIcon className='w-4 h-4' />
            Stop Streaming
          </Button>
        )}

        {/* Connection Status */}
        <div className='flex items-center justify-center gap-2 py-2'>
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-green-500'
                : connectionStatus === 'connecting'
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-red-500'
            }`}
          />
          <span className='text-sm text-muted-foreground'>
            {connectionStatus === 'connected'
              ? 'Connected to server'
              : connectionStatus === 'connecting'
              ? 'Connecting...'
              : 'Disconnected'}
          </span>
        </div>

        <Separator />

        {/* Media Controls */}
        <div className='space-y-2'>
          <p className='text-sm font-medium'>Media Controls</p>
          <div className='grid grid-cols-2 gap-2'>
            <Button
              variant={isMuted ? 'destructive' : 'outline'}
              size='sm'
              className='gap-2'
              onClick={handleToggleMute}
              disabled={!isStreaming}
            >
              {isMuted ? (
                <MicOffIcon className='w-4 h-4' />
              ) : (
                <MicIcon className='w-4 h-4' />
              )}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button
              variant={isCameraOff ? 'destructive' : 'outline'}
              size='sm'
              className='gap-2'
              onClick={handleToggleCamera}
              disabled={!isStreaming}
            >
              {isCameraOff ? (
                <VideoOffIcon className='w-4 h-4' />
              ) : (
                <VideoIcon className='w-4 h-4' />
              )}
              {isCameraOff ? 'Camera On' : 'Camera Off'}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Camera Controls */}
        <div className='space-y-2'>
          <p className='text-sm font-medium'>Camera Setup</p>
          <Button
            variant='outline'
            size='sm'
            className='w-full gap-2 bg-transparent'
            onClick={onInitializeCamera}
            disabled={isStreaming}
          >
            <CameraIcon className='w-4 h-4' />
            Initialize Camera
          </Button>
        </div>

        {/* Stream Quality Settings */}
        <div className='space-y-2'>
          <p className='text-sm font-medium'>Quality Settings</p>
          <div className='grid grid-cols-2 gap-2'>
            <div className='text-center p-2 bg-muted rounded'>
              <p className='text-xs text-muted-foreground'>Resolution</p>
              <Badge variant='outline' className='text-xs'>
                1080p
              </Badge>
            </div>
            <div className='text-center p-2 bg-muted rounded'>
              <p className='text-xs text-muted-foreground'>Frame Rate</p>
              <Badge variant='outline' className='text-xs'>
                30 FPS
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
