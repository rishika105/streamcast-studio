"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLinkIcon, TvIcon } from "lucide-react"

interface Platform {
  id: string
  name: string
  description: string
  color: string
  requirements: string[]
  setupUrl: string
}

const PLATFORMS: Platform[] = [
  {
    id: "youtube",
    name: "YouTube Live",
    description: "Stream to the world's largest video platform",
    color: "bg-red-500",
    requirements: ["YouTube channel", "No recent live streaming restrictions", "Verified phone number"],
    setupUrl: "https://studio.youtube.com",
  },
  {
    id: "twitch",
    name: "Twitch",
    description: "Connect with gaming and creative communities",
    color: "bg-purple-500",
    requirements: ["Twitch account", "Affiliate/Partner status recommended", "Community guidelines compliance"],
    setupUrl: "https://dashboard.twitch.tv",
  },
  {
    id: "facebook",
    name: "Facebook Live",
    description: "Reach your Facebook audience directly",
    color: "bg-blue-500",
    requirements: ["Facebook page or profile", "No recent policy violations", "Stable internet connection"],
    setupUrl: "https://business.facebook.com/creatorstudio",
  },
  {
    id: "linkedin",
    name: "LinkedIn Live",
    description: "Professional networking and business content",
    color: "bg-blue-600",
    requirements: ["LinkedIn company page", "LinkedIn Live access", "Professional content focus"],
    setupUrl: "https://www.linkedin.com/company/setup",
  },
]

interface StreamPlatformsProps {
  onPlatformSelect?: (platformId: string) => void
}

export function StreamPlatforms({ onPlatformSelect }: StreamPlatformsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TvIcon className="w-5 h-5" />
          Supported Platforms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {PLATFORMS.map((platform) => (
            <div key={platform.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${platform.color}`} />
                  <div>
                    <h3 className="font-medium">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">{platform.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(platform.setupUrl, "_blank")}>
                    <ExternalLinkIcon className="w-3 h-3 mr-1" />
                    Setup
                  </Button>
                  {onPlatformSelect && (
                    <Button size="sm" onClick={() => onPlatformSelect(platform.id)}>
                      Select
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Requirements:</p>
                <div className="flex flex-wrap gap-1">
                  {platform.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
