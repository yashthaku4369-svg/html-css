require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const path = require("path");
const app = express();
const PORT = 3000;
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
app.use(express.json());
// Serve your chatbot interface
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "ca.html"));
});
// Chatbot API endpoint
app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body.message;
        if (!message || typeof message !== "string") {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }
        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: message,
        });
        res.json({
            reply: response.output_text
        });
    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        res.status(500).json({
            error: "API request failed. Check your API key and account."
        });
    }
});
app.listen(PORT, () => {
    console.log(`Chatbot running at http://localhost:${PORT}`);
});