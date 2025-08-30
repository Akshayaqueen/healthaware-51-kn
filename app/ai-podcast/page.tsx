"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic, Clock, Users, Download, RefreshCw } from "lucide-react"
import { useRealTime } from "@/hooks/use-real-time"

const podcastEpisodes = [
  {
    id: 1,
    title: "Daily Health Podcast",
    description: "AI-generated weekly health awareness in RJ style",
    duration: "2-3 min",
    category: "Weekly Health Tips",
    listeners: 2156,
    audioUrl: "/audio/daily_podcast.mp3",
    isLive: true,
    isGenerated: true,
  },
  {
    id: 2,
    title: "Nutrition Spotlight",
    description: "Weekly nutrition tips for rural communities",
    duration: "3 min",
    category: "Nutrition",
    listeners: 1834,
    audioUrl: "/audio/nutrition_podcast.mp3",
    isLive: false,
    isGenerated: false,
  },
  {
    id: 3,
    title: "Mental Wellness Hour",
    description: "Breaking mental health stigma with friendly advice",
    duration: "2 min",
    category: "Mental Health",
    listeners: 1642,
    audioUrl: "/audio/mental_health_podcast.mp3",
    isLive: false,
    isGenerated: false,
  },
  {
    id: 4,
    title: "Child Care Corner",
    description: "Essential childcare tips for parents",
    duration: "3 min",
    category: "Child Health",
    listeners: 1923,
    audioUrl: "/audio/child_care_podcast.mp3",
    isLive: false,
    isGenerated: false,
  },
]

export default function AIPodcastPage() {
  const [currentEpisode, setCurrentEpisode] = useState(podcastEpisodes[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([75])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentTime2 = useRealTime()
  const [episodes, setEpisodes] = useState(podcastEpisodes)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/audio/episodes.json", { cache: "no-store" })
        if (res.ok) {
          const list: {
            title: string
            description?: string
            category?: string
            duration?: string
            listeners?: number
            filename: string
          }[] = await res.json()
          if (!active) return
          if (Array.isArray(list) && list.length) {
            const mapped = list.map((e, idx) => ({
              id: 1000 + idx,
              title: e.title,
              description: e.description || "AI-generated weekly health awareness in RJ style",
              duration: e.duration || "2-3 min",
              category: e.category || "Weekly Health Tips",
              listeners: e.listeners ?? 1000,
              audioUrl: `/audio/${e.filename}`,
              isLive: false,
              isGenerated: true,
            }))
            setEpisodes((prev) => {
              const combined = [...mapped, ...prev.filter((p) => !p.isGenerated)]
              // Ensure currentEpisode stays valid
              if (!combined.find((c) => c.id === currentEpisode.id)) {
                setCurrentEpisode(combined[0])
              }
              return combined
            })
          }
        }
      } catch {}
    })()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || 0)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      setError("Failed to load podcast episode")
      setIsLoading(false)
      setIsPlaying(false)
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      // Auto-play next episode
      const currentIndex = episodes.findIndex((episode) => episode.id === currentEpisode.id)
      if (currentIndex < episodes.length - 1) {
        setCurrentEpisode(episodes[currentIndex + 1])
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentEpisode])

  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        setError("")
        await audio.play()
        setIsPlaying(true)
      }
    } catch (err) {
      setError("Failed to play podcast. Please check if the file exists.")
      setIsPlaying(false)
    }
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = value[0] / 100
    setVolume(value)
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(0, audio.currentTime - 10)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.min(duration, audio.currentTime + 10)
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const playEpisode = (episode: (typeof podcastEpisodes)[0]) => {
    if (currentEpisode.id === episode.id) return

    setCurrentEpisode(episode)
    setIsPlaying(false)
    setCurrentTime(0)
    setError("")
  }

  const generateNewEpisode = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch("/api/podcasts", { method: "POST" })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Failed to generate")
      const newEp = {
        id: Math.max(...episodes.map((e) => e.id)) + 1,
        title: j.title,
        description: "AI-generated weekly health awareness in RJ style",
        duration: "2-3 min",
        category: "Weekly Health Tips",
        listeners: 0,
        audioUrl: `/audio/${j.filename}`,
        isLive: false,
        isGenerated: true,
      }
      setEpisodes([newEp, ...episodes])
      setCurrentEpisode(newEp)
      setIsGenerating(false)
      const audio = audioRef.current
      if (audio) {
        audio.load()
      }
    } catch (err) {
      setError("Failed to generate new episode")
      setIsGenerating(false)
    }
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
              <Mic className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">AI Health Podcast</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-generated weekly podcast episodes in Radio Jockey style for health awareness
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player Section */}
            <div className="lg:col-span-2">
              <Card className="accent-card mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{currentEpisode.title}</CardTitle>
                      <CardDescription className="text-lg mt-2">{currentEpisode.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {currentEpisode.isGenerated && (
                        <Button
                          onClick={generateNewEpisode}
                          disabled={isGenerating}
                          size="sm"
                          variant="outline"
                          className="bg-purple-50 border-purple-200 hover:bg-purple-100"
                        >
                          {isGenerating ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          )}
                          {isGenerating ? "Generating..." : "Generate New"}
                        </Button>
                      )}
                      {currentEpisode.isLive && (
                        <Badge variant="destructive" className="animate-pulse">
                          LIVE
                        </Badge>
                      )}
                      {currentEpisode.isGenerated && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          AI Generated
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Audio Element */}
                    <audio ref={audioRef} src={currentEpisode.audioUrl} preload="metadata" crossOrigin="anonymous" />

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 text-sm">{error}</p>
                        <p className="text-red-600 text-xs mt-1">
                          Make sure podcast files are generated and placed in the /public/audio/ directory
                        </p>
                      </div>
                    )}

                    {/* Generation Status */}
                    {isGenerating && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <RefreshCw className="h-5 w-5 text-purple-600 animate-spin" />
                          <div>
                            <p className="text-purple-700 text-sm font-medium">Generating New Episode...</p>
                            <p className="text-purple-600 text-xs mt-1">
                              Creating script with AI and converting to audio
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Slider
                        value={[progressPercentage]}
                        max={100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="w-full"
                        disabled={!duration || isLoading}
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={skipBackward}
                        disabled={!duration}
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={togglePlayPause}
                        size="lg"
                        className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6 ml-1" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={skipForward}
                        disabled={!duration}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-3">
                      <Volume2 className="h-4 w-4 text-gray-500" />
                      <Slider value={volume} max={100} step={1} onValueChange={handleVolumeChange} className="flex-1" />
                      <span className="text-sm text-gray-500 w-8">{volume[0]}%</span>
                    </div>

                    {/* Episode Info */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{currentEpisode.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{currentEpisode.listeners.toLocaleString()} listeners</span>
                        </div>
                      </div>
                      <Badge variant="outline">{currentEpisode.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Podcast Generation Instructions */}
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Download className="h-5 w-5 text-purple-600" />
                    <span>AI Podcast Generation Setup</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-purple-800">
                  <div className="space-y-3">
                    <p>
                      <strong>To generate new podcast episodes:</strong>
                    </p>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <p className="font-medium mb-2">Quick Generation:</p>
                      <code className="text-xs bg-white px-2 py-1 rounded">npm run generate-podcast</code>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Manual Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-4 text-xs">
                        <li>
                          Generate script:{" "}
                          <code className="bg-purple-100 px-1 rounded">node podcast-service/generate_script.js</code>
                        </li>
                        <li>
                          Convert to audio:{" "}
                          <code className="bg-purple-100 px-1 rounded">python podcast-service/tts.py</code>
                        </li>
                        <li>Refresh this page to play the new episode</li>
                      </ol>
                    </div>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-xs text-purple-700">
                        <strong>Requirements:</strong> Node.js, Python, gTTS library, and GitHub AI API access
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Episodes List */}
            <div>
              <Card className="accent-card">
                <CardHeader>
                  <CardTitle>Available Episodes</CardTitle>
                  <CardDescription>Choose from our health podcast library</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {episodes.map((episode) => (
                      <motion.div key={episode.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={`cursor-pointer transition-colors ${
                            currentEpisode.id === episode.id ? "border-purple-500 bg-purple-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => playEpisode(episode)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-sm">{episode.title}</h3>
                              <div className="flex items-center space-x-1">
                                {episode.isLive && (
                                  <Badge variant="destructive" className="text-xs animate-pulse">
                                    LIVE
                                  </Badge>
                                )}
                                {episode.isGenerated && (
                                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                    AI
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{episode.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{episode.duration}</span>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{episode.listeners}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {episode.category}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
