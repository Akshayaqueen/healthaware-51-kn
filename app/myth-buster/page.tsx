"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { Brain, RotateCcw, CheckCircle, XCircle, Lightbulb, AlertTriangle, BookOpen, Users } from "lucide-react"

const myths = [
  {
    id: 1,
    category: "Nutrition",
    myth: "You need to drink 8 glasses of water every day",
    truth: "Water needs vary by person, activity level, and climate. Listen to your body's thirst signals.",
    explanation:
      "While staying hydrated is important, the '8 glasses' rule isn't based on scientific evidence. Your water needs depend on factors like your size, activity level, climate, and overall health.",
  },
  {
    id: 2,
    category: "Exercise",
    myth: "You must exercise for at least 30 minutes to get any benefit",
    truth: "Even short bursts of activity (5-10 minutes) provide health benefits",
    explanation:
      "Research shows that even brief periods of physical activity can improve cardiovascular health, mood, and energy levels. Every minute of movement counts!",
  },
  {
    id: 3,
    category: "Mental Health",
    myth: "Mental health problems are a sign of weakness",
    truth: "Mental health conditions are medical conditions, not character flaws",
    explanation:
      "Mental health disorders are caused by a complex combination of biological, psychological, and environmental factors. Seeking help shows strength, not weakness.",
  },
  {
    id: 4,
    category: "Vaccines",
    myth: "Natural immunity is always better than vaccine immunity",
    truth: "Vaccines provide safer immunity without the risks of serious illness",
    explanation:
      "While natural infection can provide immunity, it comes with significant risks of severe complications, hospitalization, or death. Vaccines provide protection without these dangers.",
  },
  {
    id: 5,
    category: "Sleep",
    myth: "You can catch up on sleep by sleeping in on weekends",
    truth: "Consistent sleep schedule is more important than 'catching up'",
    explanation:
      "Sleep debt can't be fully repaid by weekend sleep-ins. Maintaining a regular sleep schedule is crucial for optimal health and cognitive function.",
  },
  {
    id: 6,
    category: "Nutrition",
    myth: "All fats are bad for your health",
    truth: "Healthy fats are essential for proper body function",
    explanation:
      "Your body needs healthy fats (like those in nuts, avocados, and fish) for brain function, hormone production, and nutrient absorption. It's trans fats and excessive saturated fats that should be limited.",
  },
]

export default function MythBusterPage() {
  const { t } = useLanguage()
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Nutrition", "Exercise", "Mental Health", "Vaccines", "Sleep"]

  const filteredMyths = myths.filter((myth) => selectedCategory === "All" || myth.category === selectedCategory)

  const toggleCard = (id: number) => {
    setFlippedCards((prev) => (prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]))
  }

  const resetAllCards = () => {
    setFlippedCards([])
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Nutrition: "bg-blue-100 text-blue-800",
      Exercise: "bg-green-100 text-green-800",
      "Mental Health": "bg-purple-100 text-purple-800",
      Vaccines: "bg-red-100 text-red-800",
      Sleep: "bg-indigo-100 text-indigo-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-6 shadow-2xl"
          >
            <Brain className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("mythBusterTitle")}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("mythBusterDesc")}</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg"
                      : "border-purple-200 text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Reset Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              variant="outline"
              onClick={resetAllCards}
              className="flex items-center space-x-2 border-gray-300 hover:bg-gray-50 bg-transparent"
              disabled={flippedCards.length === 0}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset All Cards</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Myth Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredMyths.map((myth, index) => (
            <motion.div
              key={myth.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-80"
            >
              <div
                className="relative w-full h-full cursor-pointer"
                style={{ perspective: "1000px" }}
                onClick={() => toggleCard(myth.id)}
              >
                <motion.div
                  className="relative w-full h-full transition-transform duration-700"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: flippedCards.includes(myth.id) ? 180 : 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Front Side - Myth */}
                  <Card
                    className="absolute inset-0 w-full h-full border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getCategoryColor(myth.category)}>{myth.category}</Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <XCircle className="h-6 w-6 text-red-500" />
                        <CardTitle className="text-lg text-red-700">{t("myth")}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-full pb-6">
                      <p className="text-gray-800 font-medium text-center flex-1 flex items-center justify-center px-2">
                        "{myth.myth}"
                      </p>
                      <div className="text-center mt-4">
                        <p className="text-sm text-gray-500 mb-2">{t("clickReveal")}</p>
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mx-auto" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Back Side - Truth */}
                  <Card
                    className="absolute inset-0 w-full h-full border-2 border-green-200 shadow-lg"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getCategoryColor(myth.category)}>{myth.category}</Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <CardTitle className="text-lg text-green-700">{t("truth")}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col h-full pb-6">
                      <p className="text-gray-800 font-medium mb-4 text-center">"{myth.truth}"</p>
                      <div className="flex-1 flex items-start">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 w-full">
                          <div className="flex items-start space-x-2">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800">{myth.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{flippedCards.length}</div>
                  <p className="text-gray-600">Myths Busted</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{filteredMyths.length}</div>
                  <p className="text-gray-600">Total Myths</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round((flippedCards.length / filteredMyths.length) * 100) || 0}%
                  </div>
                  <p className="text-gray-600">Progress</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Brain,
              title: "Evidence-Based",
              description: "All information is backed by current medical research and expert consensus",
              color: "bg-purple-100 text-purple-600",
            },
            {
              icon: BookOpen,
              title: "Educational",
              description: "Learn not just what's true, but understand the reasoning behind health facts",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: Users,
              title: "Community Impact",
              description: "Help spread accurate health information in your community and combat misinformation",
              color: "bg-blue-100 text-blue-600",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
