"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, Radio, Clock, Users, Download } from "lucide-react"
import { useRealTime } from "@/hooks/use-real-time"

const radioShows = [
  {
    id: 1,
    title: "Daily Health Tips",
    description: "Essential health tips for everyday wellness",
    duration: "15 min",
    category: "General Health",
    listeners: 1234,
    audioUrl: "/audio/daily-health-tips.mp3",
    isLive: true,
  },
  {
    id: 2,
    title: "Nutrition Basics",
    description: "Understanding proper nutrition for rural communities",
    duration: "20 min",
    category: "Nutrition",
    listeners: 856,
    audioUrl: "/audio/nutrition-basics.mp3",
    isLive: false,
  },
  {
    id: 3,
    title: "Mental Health Awareness",
    description: "Breaking stigma around mental health",
    duration: "25 min",
    category: "Mental Health",
    listeners: 642,
    audioUrl: "/audio/mental-health-awareness.mp3",
    isLive: false,
  },
  {
    id: 4,
    title: "Child Healthcare",
    description: "Essential healthcare tips for children",
    duration: "18 min",
    category: "Child Health",
    listeners: 923,
    audioUrl: "/audio/child-healthcare.mp3",
    isLive: false,
  },
  {
    id: 5,
    title: "Preventive Care",
    description: "Prevention is better than cure - learn how",
    duration: "22 min",
    category: "Prevention",
    listeners: 1156,
    audioUrl: "/audio/preventive-care.mp3",
    isLive: false,
  },
]

export default function AIRadioPage() {
  const [currentShow, setCurrentShow] = useState(radioShows[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([75])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentTime2 = useRealTime()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || 0)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      setError("Failed to load audio file")
      setIsLoading(false)
      setIsPlaying(false)
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      // Auto-play next show
      const currentIndex = radioShows.findIndex((show) => show.id === currentShow.id)
      if (currentIndex < radioShows.length - 1) {
        setCurrentShow(radioShows[currentIndex + 1])
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
  }, [currentShow])

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
      setError("Failed to play audio. Please check if the file exists.")
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

  const playShow = (show: (typeof radioShows)[0]) => {
    if (currentShow.id === show.id) return

    setCurrentShow(show)
    setIsPlaying(false)
    setCurrentTime(0)
    setError("")
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <Radio className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">AI Health Radio</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Listen to AI-powered health awareness content designed for rural communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player Section */}
            <div className="lg:col-span-2">
              <Card className="accent-card mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{currentShow.title}</CardTitle>
                      <CardDescription className="text-lg mt-2">{currentShow.description}</CardDescription>
                    </div>
                    {currentShow.isLive && (
                      <Badge variant="destructive" className="animate-pulse">
                        LIVE
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Audio Element */}
                    <audio ref={audioRef} src={currentShow.audioUrl} preload="metadata" crossOrigin="anonymous" />

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 text-sm">{error}</p>
                        <p className="text-red-600 text-xs mt-1">
                          Make sure audio files are placed in the /public/audio/ directory
                        </p>
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
                        className="w-16 h-16 rounded-full"
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

                    {/* Show Info */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{currentShow.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{currentShow.listeners.toLocaleString()} listeners</span>
                        </div>
                      </div>
                      <Badge variant="outline">{currentShow.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audio Setup Instructions */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Download className="h-5 w-5 text-blue-600" />
                    <span>Audio Setup Instructions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800">
                  <div className="space-y-2">
                    <p>
                      <strong>To add your own audio files:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      <li>
                        Create a folder called <code className="bg-blue-100 px-1 rounded">audio</code> in your{" "}
                        <code className="bg-blue-100 px-1 rounded">public</code> directory
                      </li>
                      <li>
                        Add your .mp3 files to <code className="bg-blue-100 px-1 rounded">public/audio/</code>
                      </li>
                      <li>
                        Update the <code className="bg-blue-100 px-1 rounded">audioUrl</code> paths in the radioShows
                        array
                      </li>
                      <li>Supported formats: MP3, WAV, OGG</li>
                    </ol>
                    <p className="mt-3 text-blue-700">
                      <strong>Example:</strong> Place{" "}
                      <code className="bg-blue-100 px-1 rounded">daily-health-tips.mp3</code> in{" "}
                      <code className="bg-blue-100 px-1 rounded">public/audio/</code>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Playlist Section */}
            <div>
              <Card className="accent-card">
                <CardHeader>
                  <CardTitle>Available Shows</CardTitle>
                  <CardDescription>Choose from our health awareness programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {radioShows.map((show) => (
                      <motion.div key={show.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={`cursor-pointer transition-colors ${
                            currentShow.id === show.id ? "border-black bg-gray-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => playShow(show)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-sm">{show.title}</h3>
                              {show.isLive && (
                                <Badge variant="destructive" className="text-xs animate-pulse">
                                  LIVE
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{show.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{show.duration}</span>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{show.listeners}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {show.category}
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
