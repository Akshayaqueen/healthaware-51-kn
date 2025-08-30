"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Download,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Share2,
  Heart,
  Eye,
  Users,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

type Panel = { id: string; panel_index: number; panel_text: string | null; image_url: string | null }

const comicsData = {
  "1": {
    title: "The Water Warriors",
    description: "Join Maya and her friends as they discover the importance of staying hydrated",
    category: "Nutrition",
    pages: 8,
    downloads: 1250,
    author: "Dr. Sarah Health",
    publishDate: "March 2024",
    tags: ["hydration", "summer", "health-tips"],
    summary:
      "Follow Maya, a young farmer, and her friends as they learn about the vital importance of staying hydrated during hot summer days. Through colorful adventures and practical tips, readers discover how proper hydration affects their energy, health, and daily activities.",
    samplePages: [
      {
        pageNumber: 1,
        image: "/placeholder.svg?height=600&width=400&text=Page+1:+Meet+Maya",
        description: "Meet Maya, a hardworking farmer who starts feeling tired during hot summer days.",
      },
      {
        pageNumber: 2,
        image: "/placeholder.svg?height=600&width=400&text=Page+2:+The+Problem",
        description:
          "Maya's grandmother notices she's not drinking enough water and explains the importance of hydration.",
      },
      {
        pageNumber: 3,
        image: "/placeholder.svg?height=600&width=400&text=Page+3:+Learning+Together",
        description: "Maya and her friends learn about the signs of dehydration and how to prevent it.",
      },
    ],
  },
  "2": {
    title: "Stress-Free Sam",
    description: "Follow Sam's journey to manage stress and anxiety through simple techniques",
    category: "Mental Health",
    pages: 12,
    downloads: 980,
    author: "Dr. Mind Wellness",
    publishDate: "February 2024",
    tags: ["stress", "mental-health", "coping"],
    summary:
      "Sam, a busy student, learns practical stress management techniques from his counselor. This comic teaches readers breathing exercises, time management, and healthy coping strategies for dealing with everyday stress and anxiety.",
    samplePages: [
      {
        pageNumber: 1,
        image: "/placeholder.svg?height=600&width=400&text=Page+1:+Stressed+Sam",
        description: "Sam feels overwhelmed with school, work, and family responsibilities.",
      },
      {
        pageNumber: 2,
        image: "/placeholder.svg?height=600&width=400&text=Page+2:+Seeking+Help",
        description: "Sam talks to his school counselor about feeling stressed and anxious.",
      },
      {
        pageNumber: 3,
        image: "/placeholder.svg?height=600&width=400&text=Page+3:+Breathing+Techniques",
        description: "The counselor teaches Sam simple breathing exercises to manage stress.",
      },
    ],
  },
  "3": {
    title: "Heart Hero Adventures",
    description: "Learn about heart health through exciting superhero adventures",
    category: "Heart Health",
    pages: 10,
    downloads: 1450,
    author: "Dr. Cardio Champion",
    publishDate: "January 2024",
    tags: ["heart-health", "exercise", "superhero"],
    summary:
      "Captain Heart and his team of superheroes teach children about keeping their hearts healthy through exercise, good nutrition, and avoiding harmful habits. Action-packed adventures make learning about cardiovascular health exciting and memorable.",
    samplePages: [
      {
        pageNumber: 1,
        image: "/placeholder.svg?height=600&width=400&text=Page+1:+Captain+Heart",
        description: "Meet Captain Heart, the superhero who protects hearts everywhere!",
      },
      {
        pageNumber: 2,
        image: "/placeholder.svg?height=600&width=400&text=Page+2:+Heart+Villains",
        description: "Captain Heart faces off against the villains that threaten heart health.",
      },
      {
        pageNumber: 3,
        image: "/placeholder.svg?height=600&width=400&text=Page+3:+Exercise+Power",
        description: "Learn how exercise gives Captain Heart his superpowers!",
      },
    ],
  },
}

export default function ComicPreviewPage() {
  const params = useParams()
  const comicId = params.id as string
  const [currentPage, setCurrentPage] = useState(0)

  const comic = comicsData[comicId as keyof typeof comicsData]
  const isDynamic = !comic

  const [panels, setPanels] = useState<Panel[]>([])
  const [loadingPanels, setLoadingPanels] = useState(false)
  const [panelErr, setPanelErr] = useState<string | null>(null)

  useEffect(() => {
    if (!isDynamic) return
    let active = true
    setLoadingPanels(true)
    ;(async () => {
      try {
        const res = await fetch(`/api/comics/${comicId}/panels`, { cache: "no-store" })
        const j = await res.json()
        if (!active) return
        if (!res.ok) throw new Error(j.error || "Failed to load panels")
        setPanels(j.panels || [])
        setCurrentPage(0)
      } catch (err: any) {
        setPanelErr(err.message)
      } finally {
        if (active) setLoadingPanels(false)
      }
    })()
    return () => {
      active = false
    }
  }, [comicId, isDynamic])

  const nextDynamicPanel = async () => {
    try {
      const res = await fetch(`/api/comics/${comicId}/panels`, { method: "POST" })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || "Failed to add panel")
      setPanels((prev) => [...prev, j.panel])
      setCurrentPage((prev) => prev + 1)
    } catch (err: any) {
      setPanelErr(err.message)
    }
  }

  const nextPage = () => {
    if (comic && currentPage < comic.samplePages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (comic && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (!comic && !isDynamic) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Comic Not Found</h2>
          <p className="text-gray-500 mb-4">The comic you're looking for doesn't exist.</p>
          <Link href="/comics">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Comics
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/comics">
            <Button variant="outline" className="mb-6 bg-transparent">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Comics
            </Button>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Comic Info */}
            <div className="lg:col-span-1">
              <Card className="accent-card">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-4">
                    {comic && (
                      <>
                        <Badge variant="outline">{comic.category}</Badge>
                        <Badge variant="secondary">{comic.pages} pages</Badge>
                      </>
                    )}
                  </div>
                  <CardTitle className="text-2xl mb-2">{comic ? comic.title : "Dynamic Comic"}</CardTitle>
                  {comic && <p className="text-gray-600">{comic.description}</p>}
                </CardHeader>
                <CardContent className="space-y-4">
                  {comic && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>By {comic.author}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Published {comic.publishDate}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>{comic.downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>
                  )}

                  {comic && (
                    <div>
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <p className="text-sm text-gray-700">{comic.summary}</p>
                    </div>
                  )}

                  {comic && (
                    <div>
                      <h4 className="font-semibold mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {comic.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    {comic && (
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    )}
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-2">
              <Card className="accent-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {comic ? "Comic Preview" : "Dynamic Comic"}
                    {isDynamic && (
                      <Badge variant="outline">
                        {panels.length ? `Page ${currentPage + 1} of ${panels.length}` : "No panels yet"}
                      </Badge>
                    )}
                    {comic && (
                      <Badge variant="outline">
                        Page {currentPage + 1} of {comic.samplePages.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isDynamic && (
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {panelErr && <p className="text-sm text-red-600 mb-3">{panelErr}</p>}
                      {loadingPanels ? (
                        <p>Loading panels…</p>
                      ) : panels.length === 0 ? (
                        <div className="text-center">
                          <p className="mb-3 text-gray-600">No panels yet. Create the first one!</p>
                          <Button onClick={nextDynamicPanel}>Generate First Panel</Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={panels[currentPage].image_url || "/placeholder.svg"}
                              alt={`Panel ${currentPage + 1}`}
                              width={600}
                              height={800}
                              className="w-full h-auto max-h-96 object-contain"
                            />
                          </div>
                          {panels[currentPage].panel_text && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-blue-900 mb-2">Panel {currentPage + 1}</h4>
                              <p className="text-blue-800 text-sm">{panels[currentPage].panel_text}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                              disabled={currentPage === 0}
                              className="bg-transparent"
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Previous
                            </Button>
                            <div className="flex space-x-2">
                              {panels.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentPage(index)}
                                  className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentPage ? "bg-black" : "bg-gray-300 hover:bg-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setCurrentPage((p) => Math.min(panels.length - 1, p + 1))}
                                disabled={currentPage === panels.length - 1}
                                className="bg-transparent"
                              >
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                              <Button onClick={nextDynamicPanel}>Next Panel</Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {comic && (
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={comic.samplePages[currentPage].image || "/placeholder.svg"}
                          alt={`${comic.title} - Page ${comic.samplePages[currentPage].pageNumber}`}
                          width={600}
                          height={800}
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          Page {comic.samplePages[currentPage].pageNumber}
                        </h4>
                        <p className="text-blue-800 text-sm">{comic.samplePages[currentPage].description}</p>
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-4">
                        <Button
                          variant="outline"
                          onClick={prevPage}
                          disabled={currentPage === 0}
                          className="bg-transparent"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>

                        <div className="flex space-x-2">
                          {comic.samplePages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPage(index)}
                              className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentPage ? "bg-black" : "bg-gray-300 hover:bg-gray-400"
                              }`}
                            />
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          onClick={nextPage}
                          disabled={currentPage === comic.samplePages.length - 1}
                          className="bg-transparent"
                        >
                          Next
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Full Comic CTA */}
              {comic && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-6"
                >
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="pt-6 text-center">
                      <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-900 mb-2">Want to read the full comic?</h3>
                      <p className="text-green-700 mb-4">
                        Download the complete {comic.pages}-page comic with all the adventures and health tips!
                      </p>
                      <Button size="lg" className="bg-green-600 hover:bg-green-700">
                        <Download className="mr-2 h-5 w-5" />
                        Download Full Comic
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Related Comics */}
        {comic && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold mb-6">More Comics in {comic.category}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(comicsData)
                .filter(([id, c]) => c.category === comic.category && id !== comicId)
                .slice(0, 3)
                .map(([id, relatedComic]) => (
                  <Card key={id} className="card-hover accent-card">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{relatedComic.title}</h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{relatedComic.description}</p>
                          <Link href={`/comics/${id}/preview`}>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              Preview
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
