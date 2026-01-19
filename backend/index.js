const express = require("express");
const app = express();
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const cors = require("cors");

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://192.168.31.247:3000", "http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

// Initialize Gemini AI
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Root route
app.get("/", (req, res) => {
    res.send("Laptop Recommendation Server is running");
});

// Laptop recommendation endpoint
app.post("/recommend", async (req, res) => {
    try {
        const { query } = req.body;

        // JSON schema for laptop recommendation
        const jsonSchema = {
            type: "object",
            properties: {
                laptops: {
                    type: "array",
                    description: "List of recommended laptops based on user query",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            price: { type: "string" },
                            specs: { type: "string" },
                            link: { type: "string" }
                        },
                        required: ["name", "price", "specs", "link"]
                    }
                }
            },
            required: ["laptops"]
        };

        // Prompt for Gemini
        const prompt = `User query: "${query}"
Please provide 3-5 laptops that best match the user's request.
Ensure all prices are in Indian Rupees (₹).
Return the response in JSON format following this schema:
{
  laptops: [
    { name: "", price: "", specs: "", link: "" }
  ]
}`;

        // Call Gemini API
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jsonSchema
            }
        });

        const jsonResponse = JSON.parse(response.text);

        res.status(200).json({
            success: true,
            data: jsonResponse
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
