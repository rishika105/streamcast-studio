"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsIcon, KeyIcon, EyeIcon, EyeOffIcon } from "lucide-react"

interface RTMPConfigProps {
  rtmpKey: string
  streamTitle: string
  onRtmpKeyChange: (key: string) => void
  onStreamTitleChange: (title: string) => void
  onQuickSetup: (platform: string, key: string) => void
  disabled?: boolean
}

const STREAMING_PLATFORMS = [
  {
    id: "youtube",
    name: "YouTube Live",
    rtmpUrl: "rtmp://a.rtmp.youtube.com/live2/",
    instructions: "Go to YouTube Studio → Create → Go Live → Stream settings",
    color: "bg-red-500",
  },
  {
    id: "twitch",
    name: "Twitch",
    rtmpUrl: "rtmp://live.twitch.tv/app/",
    instructions: "Go to Creator Dashboard → Settings → Stream → Primary Stream key",
    color: "bg-purple-500",
  },
  {
    id: "facebook",
    name: "Facebook Live",
    rtmpUrl: "rtmps://live-api-s.facebook.com:443/rtmp/",
    instructions: "Go to Creator Studio → Live → Create Live Stream → Use streaming software",
    color: "bg-blue-500",
  },

  {
    id: "custom",
    name: "Custom RTMP",
    rtmpUrl: "rtmp://your-server.com/live/",
    instructions: "Enter your custom RTMP server URL and stream key",
    color: "bg-gray-500",
  },
]

export function RTMPConfig({
  rtmpKey,
  streamTitle,
  onRtmpKeyChange,
  onStreamTitleChange,
  onQuickSetup,
  disabled = false,
}: RTMPConfigProps) {

  const [selectedPlatform, setSelectedPlatform] = useState("youtube")
  const [showKey, setShowKey] = useState(false)
  const [customRtmpUrl, setCustomRtmpUrl] = useState("")

  const handleQuickSetup = () => {
    const platform = STREAMING_PLATFORMS.find((p) => p.id === selectedPlatform)
    if (platform && rtmpKey.trim()) {
      const fullRtmpUrl = selectedPlatform === "custom" ? `${customRtmpUrl}${rtmpKey}` : `${platform.rtmpUrl}${rtmpKey}`
      onQuickSetup(selectedPlatform, fullRtmpUrl)
    }
  }

  const selectedPlatformData = STREAMING_PLATFORMS.find((p) => p.id === selectedPlatform)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          Stream Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Setup</TabsTrigger>
            <TabsTrigger value="manual">Manual Config</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <div className="space-y-2">
              <Label>Streaming Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform} disabled={disabled}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STREAMING_PLATFORMS.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                        {platform.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPlatform === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="custom-rtmp">Custom RTMP URL</Label>
                <Input
                  id="custom-rtmp"
                  placeholder="rtmp://your-server.com/live/"
                  value={customRtmpUrl}
                  onChange={(e) => setCustomRtmpUrl(e.target.value)}
                  disabled={disabled}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="stream-key">Stream Key</Label>
              <div className="relative">
                <Input
                  id="stream-key"
                  type={showKey ? "text" : "password"}
                  placeholder="Enter your stream key"
                  value={rtmpKey}
                  onChange={(e) => onRtmpKeyChange(e.target.value)}
                  disabled={disabled}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {selectedPlatformData && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <KeyIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">How to get your stream key:</p>
                    <p className="text-muted-foreground">{selectedPlatformData.instructions}</p>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleQuickSetup} disabled={!rtmpKey.trim() || disabled} className="w-full">
              Configure for {selectedPlatformData?.name}
            </Button>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stream-title">Stream Title</Label>
              <Input
                id="stream-title"
                placeholder="Enter your stream title"
                value={streamTitle}
                onChange={(e) => onStreamTitleChange(e.target.value)}
                disabled={disabled}
              />
            </div>

            {/* //hdhhdh */}

            <div className="space-y-2">
              <Label htmlFor="manual-rtmp-key">Full RTMP URL + Key</Label>
              <div className="relative">
                <Input
                  id="manual-rtmp-key"
                  type={showKey ? "text" : "password"}
                  placeholder="rtmp://server.com/live/your-stream-key"
                  value={rtmpKey}
                  onChange={(e) => onRtmpKeyChange(e.target.value)}
                  disabled={disabled}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Include the full RTMP URL with your stream key</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Video Quality</p>
                <Badge variant="outline" className="mt-1">
                  1080p 30fps
                </Badge>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Bitrate</p>
                <Badge variant="outline" className="mt-1">
                  2.5 Mbps
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
