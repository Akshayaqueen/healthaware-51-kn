"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Shield,
  Hospital,
  Users,
  Play,
  ArrowRight,
  CheckCircle,
  Heart,
  Zap,
  Globe,
  Award,
  Mic,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>(
    [],
  )

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-emerald-200/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [recOpen, setRecOpen] = useState(false)
  const [recLoading, setRecLoading] = useState(false)
  const [recError, setRecError] = useState<string | null>(null)
  const [recData, setRecData] = useState<{ id: string; suggestions: { text: string }[] } | null>(null)

  const quizQuestions = [
    {
      question: "How many glasses of water should you drink daily?",
      options: ["4-5 glasses", "6-8 glasses", "10-12 glasses", "2-3 glasses"],
      correct: 1,
      explanation:
        "Adults should drink 6-8 glasses (about 2 liters) of water daily for optimal health and proper body function.",
    },
    {
      question: "What is the recommended duration for washing hands?",
      options: ["10 seconds", "20 seconds", "30 seconds", "5 seconds"],
      correct: 1,
      explanation:
        "Washing hands for at least 20 seconds with soap and water effectively removes germs and prevents the spread of infections.",
    },
    {
      question: "How often should adults exercise per week?",
      options: ["Once a week", "2-3 times", "4-5 times", "Every day"],
      correct: 2,
      explanation:
        "Adults should aim for at least 150 minutes of moderate exercise per week, which translates to about 4-5 sessions weekly.",
    },
  ]

  const features = [
    {
      icon: Mic,
      title: t("aiPodcast"),
      description: "Listen to AI-powered health awareness content tailored for rural communities",
      href: "/ai-podcast",
      color: "from-blue-500 to-blue-600",
      stats: "50+ Episodes",
    },
    {
      icon: BookOpen,
      title: t("comics"),
      description: "Interactive visual stories that make health education engaging and memorable",
      href: "/comics",
      color: "from-purple-500 to-purple-600",
      stats: "25+ Comics",
    },
    {
      icon: Shield,
      title: t("mythBuster"),
      description: "Debunk common health myths with scientific facts and evidence-based information",
      href: "/myth-buster",
      color: "from-red-500 to-red-600",
      stats: "100+ Myths",
    },
    {
      icon: Hospital,
      title: t("healthcareInfo"),
      description: "Find nearby healthcare facilities and emergency contact information",
      href: "/healthcare-info",
      color: "from-green-500 to-green-600",
      stats: "500+ Centers",
    },
    {
      icon: Users,
      title: t("community"),
      description: "Connect with others, share experiences, and get support from the community",
      href: "/community",
      color: "from-orange-500 to-orange-600",
      stats: "1000+ Members",
    },
  ]

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
  }

  const correctAnswers = selectedAnswers.filter((answer, index) => answer === quizQuestions[index].correct).length

  const getQuickRecommendations = async () => {
    setRecError(null)
    setRecLoading(true)
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const isJson = res.headers.get("content-type")?.includes("application/json")
      if (!res.ok) {
        const j = isJson ? await res.json().catch(() => ({})) : {}
        throw new Error(j.error || "Failed to generate recommendations")
      }
      const j = isJson ? await res.json() : {}
      const rec = j.recommendation
      if (rec) setRecData({ id: rec.id, suggestions: rec.suggestions || [] })
      else setRecError("No recommendations available right now.")
    } catch (e: any) {
      setRecError(e.message || "Something went wrong")
    } finally {
      setRecLoading(false)
    }
  }

  const sendFeedback = async (liked: boolean) => {
    if (!recData?.id) return
    try {
      const res = await fetch("/api/recommendations/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendation_id: recData.id, liked }),
      })
      const isJson = res.headers.get("content-type")?.includes("application/json")
      const j = isJson ? await res.json().catch(() => ({})) : {}
      // optional: could show a toast based on j.ok
    } catch {
      // silent fail
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Floating Particles */}
      <section className="relative overflow-hidden bg-white">
        <FloatingParticles />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mb-8 shadow-2xl"
            >
              <Heart className="h-10 w-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {t("heroTitle")}
              </span>
              <br />
              <span className="text-gray-800">{t("heroSubtitle")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-600 leading-relaxed"
            >
              {t("heroDescription")}
            </motion.p>

            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <Badge
                  variant="secondary"
                  className="text-lg px-6 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  Welcome back, {user.displayName || user.email?.split("@")[0] || "User"}!
                  {user.isAnonymous && " (Guest)"}
                </Badge>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-xl"
                >
                  <Link href="/ai-podcast">
                    <Play className="mr-2 h-5 w-5" />
                    {t("startLearning")}
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 shadow-lg bg-transparent"
                >
                  <Link href="/community">
                    <Users className="mr-2 h-5 w-5" />
                    {t("joinCommunity")}
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    setRecOpen(true)
                    getQuickRecommendations()
                  }}
                  className="shadow-lg"
                >
                  Get Recommendations
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Active Users", color: "text-emerald-600" },
              { value: "500+", label: "Health Topics", color: "text-blue-600" },
              { value: "50+", label: "Rural Areas", color: "text-purple-600" },
              { value: "95%", label: "Satisfaction Rate", color: "text-red-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                  className={`text-4xl md:text-5xl font-bold ${stat.color}`}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Health Education Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our suite of tools designed to make health education accessible, engaging, and effective for
              rural communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group border-0 shadow-lg bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg`}
                      >
                        <feature.icon className="h-6 w-6" />
                      </motion.div>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium">
                        {feature.stats}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-lg"
                      >
                        <Link href={feature.href}>
                          Explore Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Quiz Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Test Your Health Knowledge</h2>
            <p className="text-xl text-gray-600">
              Take our quick quiz to learn essential health facts and improve your awareness
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white">
              <CardContent className="p-8">
                {!showResults ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-sm font-medium">
                        Question {currentQuestion + 1} of {quizQuestions.length}
                      </Badge>
                      <div className="flex space-x-1">
                        {quizQuestions.map((_, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index <= currentQuestion ? "bg-emerald-500" : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <motion.h3
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-xl font-semibold text-gray-900"
                    >
                      {quizQuestions[currentQuestion].question}
                    </motion.h3>

                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                            selectedAnswers[currentQuestion] === index
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg"
                              : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                          }`}
                        >
                          <span className="font-medium">{option}</span>
                        </motion.button>
                      ))}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswers[currentQuestion] === undefined}
                        className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 shadow-lg"
                      >
                        {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6"
                  >
                    <div className="space-y-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-6xl"
                      >
                        {correctAnswers === quizQuestions.length
                          ? "🎉"
                          : correctAnswers >= quizQuestions.length / 2
                            ? "👍"
                            : "📚"}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900">Quiz Complete!</h3>
                      <p className="text-lg text-gray-600">
                        You got <span className="font-semibold text-emerald-600">{correctAnswers}</span> out of{" "}
                        <span className="font-semibold">{quizQuestions.length}</span> questions correct
                      </p>

                      <div className="flex justify-center">
                        <Badge
                          variant={correctAnswers === quizQuestions.length ? "default" : "secondary"}
                          className={`text-sm px-4 py-1 ${
                            correctAnswers === quizQuestions.length
                              ? "bg-emerald-600"
                              : correctAnswers >= quizQuestions.length / 2
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-white"
                          }`}
                        >
                          {correctAnswers === quizQuestions.length
                            ? "Perfect Score!"
                            : correctAnswers >= quizQuestions.length / 2
                              ? "Good Job!"
                              : "Keep Learning!"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4 text-left">
                      {quizQuestions.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {selectedAnswers[index] === question.correct ? (
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">✕</span>
                              </div>
                            )}
                            <span className="font-medium text-gray-900">Question {index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{question.question}</p>
                          <p className="text-sm text-emerald-600 font-medium">{question.explanation}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="flex-1"
                      >
                        <Button
                          onClick={resetQuiz}
                          variant="outline"
                          className="w-full border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                        >
                          Try Again
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="flex-1"
                      >
                        {user ? (
                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
                          >
                            <Link href="/ai-podcast">
                              Learn More
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
                          >
                            <Link href="/sign-up">
                              Join Platform
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose RuralPulse?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to making health education accessible, engaging, and effective for everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered Content",
                description:
                  "Cutting-edge AI technology delivers personalized health education tailored to rural community needs",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Globe,
                title: "Community Focused",
                description:
                  "Designed specifically for rural communities with culturally relevant and accessible content",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: Award,
                title: "Evidence-Based",
                description: "All content is backed by medical research and validated by healthcare professionals",
                color: "bg-purple-100 text-purple-600",
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <benefit.icon className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={recOpen} onOpenChange={setRecOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Personalized Suggestions</DialogTitle>
            <DialogDescription>Healthcare-focused tips and why they matter in daily life.</DialogDescription>
          </DialogHeader>

          {recLoading && <p className="text-sm text-gray-600">Generating...</p>}
          {recError && <p className="text-sm text-red-600">{recError}</p>}
          {!recLoading && !recError && recData && (
            <div className="space-y-3">
              {(recData.suggestions || []).map((s, idx) => (
                <div key={idx} className="rounded-lg border p-3 text-sm text-gray-800 bg-white">
                  {s.text}
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  sendFeedback(true)
                }}
                aria-label="Like recommendations"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  sendFeedback(false)
                }}
                aria-label="Dislike recommendations"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Dislike
              </Button>
            </div>
            <Button onClick={() => setRecOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
