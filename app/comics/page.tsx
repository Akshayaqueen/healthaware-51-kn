"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Download,
  Search,
  Filter,
  Heart,
  Brain,
  Apple,
  Shield,
  Users,
  Baby,
  Eye,
  MoreVertical,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"
import { createClient as createSupabaseClient } from "@/lib/supabase/client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

const comicCategories = [
  { name: "All", icon: BookOpen, count: 24 },
  { name: "Nutrition", icon: Apple, count: 6 },
  { name: "Mental Health", icon: Brain, count: 4 },
  { name: "Heart Health", icon: Heart, count: 5 },
  { name: "Prevention", icon: Shield, count: 4 },
  { name: "Family Health", icon: Users, count: 3 },
  { name: "Child Care", icon: Baby, count: 2 },
]

const comics = [
  {
    id: 1,
    title: "The Water Warriors",
    description: "Join Maya and her friends as they discover the importance of staying hydrated",
    category: "Nutrition",
    pages: 8,
    downloads: 1250,
    image: "/placeholder.svg?height=300&width=200&text=Water+Warriors+Comic",
  },
  {
    id: 2,
    title: "Stress-Free Sam",
    description: "Follow Sam's journey to manage stress and anxiety through simple techniques",
    category: "Mental Health",
    pages: 12,
    downloads: 980,
    image: "/placeholder.svg?height=300&width=200&text=Stress+Free+Sam+Comic",
  },
  {
    id: 3,
    title: "Heart Hero Adventures",
    description: "Learn about heart health through exciting superhero adventures",
    category: "Heart Health",
    pages: 10,
    downloads: 1450,
    image: "/placeholder.svg?height=300&width=200&text=Heart+Hero+Comic",
  },
  {
    id: 4,
    title: "The Vaccine Defenders",
    description: "Discover how vaccines protect communities in this action-packed story",
    category: "Prevention",
    pages: 14,
    downloads: 2100,
    image: "/placeholder.svg?height=300&width=200&text=Vaccine+Defenders+Comic",
  },
  {
    id: 5,
    title: "Healthy Family Chronicles",
    description: "A family's journey to better health habits and wellness routines",
    category: "Family Health",
    pages: 16,
    downloads: 1680,
    image: "/placeholder.svg?height=300&width=200&text=Family+Health+Comic",
  },
  {
    id: 6,
    title: "Little Hands, Big Health",
    description: "Teaching children about hygiene and health through fun characters",
    category: "Child Care",
    pages: 6,
    downloads: 890,
    image: "/placeholder.svg?height=300&width=200&text=Little+Hands+Comic",
  },
  {
    id: 7,
    title: "Sleep Kingdom",
    description: "Princess Luna teaches the importance of good sleep habits",
    category: "Mental Health",
    pages: 8,
    downloads: 1120,
    image: "/placeholder.svg?height=300&width=200&text=Sleep+Kingdom+Comic",
  },
  {
    id: 8,
    title: "Exercise Explorers",
    description: "Adventure through different exercises with Captain Fitness and crew",
    category: "Heart Health",
    pages: 12,
    downloads: 1340,
    image: "/placeholder.svg?height=300&width=200&text=Exercise+Explorers+Comic",
  },
  {
    id: 9,
    title: "Nutrition Ninjas",
    description: "Secret agents teaching kids about healthy eating habits",
    category: "Nutrition",
    pages: 10,
    downloads: 1567,
    image: "/placeholder.svg?height=300&width=200&text=Nutrition+Ninjas+Comic",
  },
  {
    id: 10,
    title: "Mindful Moments",
    description: "Learn meditation and mindfulness techniques for better mental health",
    category: "Mental Health",
    pages: 14,
    downloads: 1234,
    image: "/placeholder.svg?height=300&width=200&text=Mindful+Moments+Comic",
  },
  {
    id: 11,
    title: "Immunity Squad",
    description: "Superheroes explaining how the immune system protects our body",
    category: "Prevention",
    pages: 12,
    downloads: 1789,
    image: "/placeholder.svg?height=300&width=200&text=Immunity+Squad+Comic",
  },
  {
    id: 12,
    title: "Healthy Habits Heroes",
    description: "Daily routines that keep families healthy and happy",
    category: "Family Health",
    pages: 16,
    downloads: 2045,
    image: "/placeholder.svg?height=300&width=200&text=Healthy+Habits+Comic",
  },
]

export default function ComicsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredComics = comics.filter((comic) => {
    const matchesCategory = selectedCategory === "All" || comic.category === selectedCategory
    const matchesSearch =
      comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comic.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())
  const { data, error, mutate } = useSWR<{
    comics: Array<{ id: string; title: string; first_panel_text?: string | null }>
  }>("/api/comics", fetcher, { revalidateOnFocus: false })
  const dynamicComics = data?.comics ?? []

  useEffect(() => {
    const supabase = createSupabaseClient()
    const channel = supabase
      .channel("realtime-comics")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comics" }, async () => {
        await mutate() // refresh list on new storyline
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [mutate])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/comics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      // optimistic refresh
      await mutate()
    } catch {
      // silent fail; UI will refresh on next load
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Health Comics</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Engaging comic strip templates that make health education fun and accessible for all ages
          </p>
        </motion.div>

        {/* Quick Create CTA */}
        <div className="flex justify-end mb-4">
          <Link href="/comics/new">
            <Button>Create Dynamic Storyline</Button>
          </Link>
        </div>

        {/* Dynamic Storylines (Supabase) */}
        {error ? (
          <p className="text-sm text-red-600 mb-6">Failed to load storylines</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-xl font-semibold mb-3">Latest Storylines</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dynamicComics.map((comic) => (
                <Card key={comic.id} className="h-full card-hover accent-card overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-lg line-clamp-2">{comic.title}</CardTitle>
                        {comic.first_panel_text && (
                          <CardDescription className="mt-2 line-clamp-4">{comic.first_panel_text}</CardDescription>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(comic.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Link href={`/comics/${comic.id}/preview`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {dynamicComics.length === 0 && (
                <div className="text-sm text-gray-500">No storylines yet. Create the first one!</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search comics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter by category:</span>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {comicCategories.map((category, index) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                  selectedCategory === category.name
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {category.icon && <category.icon className="h-4 w-4" />}
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Comics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredComics.map((comic, index) => (
            <motion.div
              key={comic.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full card-hover accent-card overflow-hidden">
                <div className="relative">
                  <Image
                    src={comic.image || "/placeholder.svg"}
                    alt={comic.title}
                    width={200}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">{comic.pages} pages</Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{comic.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-3">{comic.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Badge variant="outline">{comic.category}</Badge>
                    <span className="text-sm text-gray-500">{comic.downloads.toLocaleString()} downloads</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex space-x-2">
                    <Button className="flex-1" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Link href={`/comics/${comic.id}/preview`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredComics.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No comics found</h3>
            <p className="text-gray-500">Try adjusting your search terms or category filter</p>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          <Card className="text-center accent-card">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Educational Content</h3>
              <p className="text-sm text-gray-600">
                Medically accurate information presented in an engaging, easy-to-understand format
              </p>
            </CardContent>
          </Card>

          <Card className="text-center accent-card">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Free Downloads</h3>
              <p className="text-sm text-gray-600">
                All comics are available for free download and can be shared within communities
              </p>
            </CardContent>
          </Card>

          <Card className="text-center accent-card">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Community Focused</h3>
              <p className="text-sm text-gray-600">
                Designed with rural communities in mind, featuring relatable characters and scenarios
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
