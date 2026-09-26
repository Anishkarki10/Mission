import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mission Brief API is running 🚀");
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

async function generateWithRetry(options, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(options);
    } catch (error) {
      if (error.status !== 503) {
        throw error;
      }

      if (attempt === maxRetries) {
        throw error;
      }

      const delay = 1000 * 2 ** attempt;

      console.log(
        `Gemini busy. Retrying in ${delay / 1000} second(s)...`
      );

      await sleep(delay);
    }
  }
}

app.post("/api/analyze", async (req, res) => {
  try {
    const { mission } = req.body;

    if (!mission || !mission.trim()) {
      return res.status(400).json({
        error: "Mission is required.",
      });
    }

    const response = await generateWithRetry({
      model: "gemini-3.8-flash",

      contents: `
You are a mission analysis assistant.

Analyze the following business idea, project, or request and turn it
into a clear Mission Brief.

USER MISSION:
${mission}

Rules:
- Do not invent facts.
- Known Facts must come directly from the user's input.
- Unconfirmed ideas belong in Assumptions.
- Identify important missing information.
- Identify budget, time, location, legal, or technical constraints.
- Recommended Next Actions should contain 3-7 practical steps.
- Approval Required should include actions such as spending money,
  contacting external parties, publishing information, signing
  agreements, deleting data, or making major commitments.
- Confidence must be Low, Medium, or High.
`,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            mission: {
              type: "string",
            },

            desiredOutcome: {
              type: "string",
            },

            knownFacts: {
              type: "array",
              items: {
                type: "string",
              },
            },

            assumptions: {
              type: "array",
              items: {
                type: "string",
              },
            },

            missingInformation: {
              type: "array",
              items: {
                type: "string",
              },
            },

            constraints: {
              type: "array",
              items: {
                type: "string",
              },
            },

            risks: {
              type: "array",
              items: {
                type: "string",
              },
            },

            recommendedNextActions: {
              type: "array",
              items: {
                type: "string",
              },
            },

            approvalRequired: {
              type: "array",
              items: {
                type: "string",
              },
            },

            confidence: {
              type: "object",

              properties: {
                level: {
                  type: "string",
                  enum: ["Low", "Medium", "High"],
                },

                reason: {
                  type: "string",
                },
              },

              required: ["level", "reason"],
            },
          },

          required: [
            "mission",
            "desiredOutcome",
            "knownFacts",
            "assumptions",
            "missingInformation",
            "constraints",
            "risks",
            "recommendedNextActions",
            "approvalRequired",
            "confidence",
          ],
        },
      },
    });

    const result = JSON.parse(response.text);

    return res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);

    if (error.status === 503) {
      return res.status(503).json({
        error:
          "AI service is temporarily busy. Please try again in a moment.",
      });
    }

    return res.status(500).json({
      error: "Failed to analyse mission.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});