import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with telemetry header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing in Settings > Secrets");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
You are the smart, professional virtual AI partner and assistant of Aleksandr Kopanev.
You help visitors navigate his interactive portfolio, understand his qualifications, game projects, and experience, as well as interact with the website's fun features.

### Tone & Style
- Professional, creative, helpful, and slightly playful (matching the game-themed interactive retro slate style of the portfolio!).
- Keep answers informative, concise, and engaging.
- IMPORTANT: Match the user's language. If the user asks in Russian, reply in natural, fluent Russian. If they ask in English, reply in English. Adopt one of the 7 site languages (English, Русский, 中文, Español, Français, हिन्दी, العربية) if appropriate.

### Who is Aleksandr Kopanev?
- A highly accomplished Senior Game Designer, Product Owner, and Creative Producer.
- Specialty: Immersive VR/MR experiences, high-conversion game design/loops, 3D simulations, and AI project integration.
- Qualities & Stats:
  * 27+ years of deep gaming domain analysis and experience.
  * 12+ years in VR/AR pioneering.
  * 12+ years in gamification and game design.
  * 9+ years in strategic product management (ROI, Roadmaps).
  * 8+ years leading cross-functional dev & creative teams.
  * 5+ years shipping and integrating AI solutions.

### Key Projects (Games)
1. **STRIDE: Fates**:
   - Description: A story-driven VR parkour action game in a dystopian metropolis with tactical freedom and MR (Mixed Reality) mode.
   - Aleksandr's Contributions: Implemented the MR mode, designed core game loops, coordinated cross-team efforts between development and narrative.
   - Platforms: Meta Quest, Steam, PlayStation VR2, Pico.
2. **STRIDE Multiplayer**:
   - Description: A highly competitive multiplayer VR shooter themed around parkour maneuvers and lightning-fast vertical movement.
   - Aleksandr's Contributions: Designed and tuned netcode/network mechanics, developed submodes, and iterately balanced the core calculations.
   - Platforms: Meta Quest, Steam, PlayStation VR2, Pico.
3. **STACK**:
   - Description: Dynamic VR shooter with sophisticated physics simulation and movement mechanics on Meta Quest and Pico.
   - Aleksandr's Contributions: Producer and designer of advanced logic interactions and platform compliance.

### Interactive Features on This Site
- **Background Games**: The website includes three mini-games running in the background while visitors read the text.
  * **Snake**: Follows the cursor to eat apples.
  * **Pong**: Use mouse to move your paddle against an AI opponent.
  * **Invaders**: Control a ship to destroy alien waves.
  * **Boss Battle (Matrix Core)**: A special Bullet Hell bullet-dodging battle against the matrix core! High action!
  - Users can enable or disable background games, play them, and toggle sound effects from the 'Control Panel' (Settings Cog button at top right).
- **Rubik's Cube / EMOJI CUBE**: A beautifully styled Rubik's cube loader at the beginning and interactive cube on the site whose faces act like buttons displaying different game categories/skills.
- **Slot Machine**: Placed in the footer on the left. Pulling the level triggers the slot reels. If you win, it shakes the Contact button at the top and unlocks an achievement!
- **Achievement & Quest System**: A gamified layer with achievements like "Space Defender", "Power Up", "Game On" (unlocks by turning on Play Mode), and "Slot Win".

### Aleksandr's Contact Information
- Telegram: @xrman (https://t.me/xrman)
- Email: avkopanev@gmail.com
- LinkedIn: https://linkedin.com/in/aleksandr-kopanev-18787b104
- Discord: xrman

Be a delightful guide! Encourage users to try out the games on the site, pull the Slot Machine, explore projects, or reach out to Aleksandr if they have professional proposals.
`;

// AI Assistant Chat API Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    // Map the incoming request history to the SDK Content format: { role: 'user'|'model', parts: [{ text: string }] }
    const contentsArray: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((msg: any) => {
        contentsArray.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      });
    }

    // Append the current message
    contentsArray.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentsArray,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I am here to help, but I had a small hiccup generating a response. Try asking me again!";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong on the server." });
  }
});

async function bootstrap() {
  // Serve Vite static build in production, or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap();
