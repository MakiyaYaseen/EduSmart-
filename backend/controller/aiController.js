import { GoogleGenerativeAI } from "@google/generative-ai";
import Course from "../model/courseModel.js";
import dotenv from 'dotenv';
dotenv.config();

// Models to try in order (most generous free tier first)
const GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3-flash-preview",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
];

// Smart generate: tries multiple models, retries on 429, skips on 404
async function smartGenerate(apiKey, prompt) {
    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError;

    for (const modelName of GEMINI_MODELS) {
        try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 1024,
                }
            });

            // Retry once per model on 429
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    const result = await model.generateContent(prompt);
                    const text = result.response.text();
                    console.log(`✅ Success with model: ${modelName}`);
                    return text;
                } catch (err) {
                    if (err.message?.includes('429') && attempt < 2) {
                        console.warn(`Rate limit on ${modelName}, retrying in 3s...`);
                        await new Promise(r => setTimeout(r, 3000));
                    } else {
                        throw err;
                    }
                }
            }
        } catch (error) {
            lastError = error;
            const status = error.message?.includes('429') ? '429 Rate Limited' :
                error.message?.includes('404') ? '404 Not Found' :
                    error.message?.substring(0, 60);
            console.warn(`❌ Model ${modelName} failed: ${status}`);
            // Continue to next model
        }
    }

    throw lastError || new Error("All AI models exhausted");
}

export const chatWithAi = async (req, res) => {
    try {
        const { message, courseId } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) {
            return res.status(500).json({ message: "AI service is not configured. Please contact admin." });
        }

        let systemInstruction = `You are "LearnAI-Bot", an elite and friendly AI Tutor for the LearnAI LMS platform. 
        Your goal is to provide accurate, encouraging, and highly professional educational guidance.
        
        RULES:
        1. If course context is provided, prioritize answering based on that course.
        2. If no course context is provided, or the user asks a general question (e.g. "What is React?", "Tell me a joke"), act as a brilliant tech consultant and mentor.
        3. Always maintain a premium, high-end persona.
        4. Keep responses concise but comprehensive. Use markdown for better readability.
        5. If a student asks about something harmful or inappropriate, politely decline and steer back to learning.`;

        if (courseId) {
            try {
                const course = await Course.findById(courseId).populate("lectures");
                if (course) {
                    systemInstruction += `\n\nCOURSE CONTEXT:
                    - Title: ${course.title}
                    - Category: ${course.category}
                    - Description: ${course.description}
                    - Lectures: ${course.lectures.map(l => l.lectureTitle).join(", ")}`;
                }
            } catch (courseError) {
                console.warn("Course Context Error (Ignoring):", courseError.message);
            }
        }

        const prompt = `${systemInstruction}\n\nStudent Query: ${message}\nLearnAI-Bot Answer:`;
        const text = await smartGenerate(apiKey, prompt);

        if (!text) throw new Error("AI returned an empty response.");
        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("AI Assistant Failure:", error.message);
        if (error.status) console.error("Error Status:", error.status);

        let userFriendlyMessage = "AI Assistant is currently busy. Please try again in a moment.";
        let statusCode = 503;

        if (error.message?.includes('429')) {
            userFriendlyMessage = "AI service is temporarily at capacity. Please wait a moment and try again.";
            statusCode = 429;
        } else if (error.message?.includes('400') || error.message?.includes('API key')) {
            userFriendlyMessage = "AI service configuration error. Please contact admin.";
            statusCode = 500;
        }

        res.status(statusCode).json({ message: userFriendlyMessage });
    }
};
