const fs = require("fs")
const path = require("path")

// GitHub AI API configuration
const GITHUB_API_URL = "https://models.inference.ai.azure.com/chat/completions"
const MODEL_NAME = "gpt-4o"

// Health topics for variety
const healthTopics = [
  "daily hydration and its importance",
  "basic nutrition for rural communities",
  "mental health awareness and stress management",
  "child vaccination schedules",
  "preventive care and regular checkups",
  "seasonal health tips",
  "exercise and physical activity",
  "sleep hygiene and rest",
  "food safety and hygiene",
  "managing common illnesses at home",
]

// Get random health topic
function getRandomTopic() {
  return healthTopics[Math.floor(Math.random() * healthTopics.length)]
}

// Generate podcast script using GitHub AI
async function generatePodcastScript() {
  const topic = getRandomTopic()
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const prompt = `Generate a 2-3 minute podcast script about "${topic}" in a friendly Radio Jockey (RJ) style for a health awareness show called "HealthAware Daily". 

Requirements:
- Target audience: Rural communities and general public
- Tone: Warm, friendly, conversational RJ style
- Structure: Intro (30 seconds), 3 practical tips (90 seconds), Outro (30 seconds)
- Include natural transitions and RJ-style phrases
- Make it engaging and easy to understand
- Today's date: ${currentDate}

Format the script with clear sections and natural speech patterns.`

  try {
    console.log("🎙️  Generating podcast script...")
    console.log(`📝 Topic: ${topic}`)

    // Check if GitHub token is available
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      throw new Error("GITHUB_TOKEN environment variable is required")
    }

    const response = await fetch(GITHUB_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a professional podcast script writer specializing in health awareness content for radio shows.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: MODEL_NAME,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`GitHub AI API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    const script = data.choices[0].message.content

    // Ensure output directory exists
    const outputDir = path.join(__dirname)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Save script to file
    const outputPath = path.join(outputDir, "output_script.txt")
    fs.writeFileSync(outputPath, script, "utf8")

    console.log("✅ Script generated successfully!")
    console.log(`📄 Saved to: ${outputPath}`)
    console.log(`📊 Script length: ${script.length} characters`)

    // Preview first 200 characters
    console.log("\n📖 Script preview:")
    console.log("─".repeat(50))
    console.log(script.substring(0, 200) + "...")
    console.log("─".repeat(50))

    return script
  } catch (error) {
    console.error("❌ Error generating script:", error.message)

    // Fallback script if API fails
    const fallbackScript = `
Welcome to HealthAware Daily! I'm your host bringing you today's health tip on ${currentDate}.

Today we're talking about ${topic}. This is such an important topic for our community's wellbeing.

Here are three key points to remember:

First, always prioritize your health by staying informed about basic health practices. Knowledge is your first line of defense against illness.

Second, don't hesitate to consult healthcare professionals when you have concerns. Early intervention can prevent many health issues from becoming serious.

Third, maintain a healthy lifestyle with regular exercise, proper nutrition, and adequate rest. These simple habits can significantly improve your quality of life.

That's all for today's HealthAware Daily. Remember, your health is your wealth. Take care of yourself and your loved ones. Until next time, stay healthy and stay informed!
    `.trim()

    const outputPath = path.join(__dirname, "output_script.txt")
    fs.writeFileSync(outputPath, fallbackScript, "utf8")

    console.log("📄 Fallback script saved to:", outputPath)
    return fallbackScript
  }
}

// Main execution
if (require.main === module) {
  generatePodcastScript()
    .then(() => {
      console.log("\n🎉 Script generation completed!")
      console.log('🔄 Next step: Run "python podcast-service/tts.py" to convert to audio')
    })
    .catch((error) => {
      console.error("💥 Script generation failed:", error)
      process.exit(1)
    })
}

module.exports = { generatePodcastScript }
