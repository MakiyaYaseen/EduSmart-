import Course from "../model/courseModel.js"
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config()

// Retry helper for rate limit
async function tryGenerate(model, prompt) {
    for (let i = 1; i <= 3; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text().trim().replace(/[*.#]/g, '');
        } catch (err) {
            if (err.message?.includes('429') && i < 3) {
                await new Promise(r => setTimeout(r, i * 2000));
            } else {
                throw err;
            }
        }
    }
}

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body
        if (!input) {
            return res.status(400).json({ message: "Search query is required" })
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite"
        });

        const prompt = `You are a Search Intent Optimizer. A user is looking for courses on an LMS.
        Your task is to extract the core learning topic or category from their query.
        
        CATEGORIES: App Development, AI/ML, AI Tools, Data Science, Data Analytics, Ethical Hacking, UI UX Designing, Web Development.
        LEVELS: Beginner, Intermediate, Advanced.

        QUERY: "${input}"

        REPLY ONLY with the most relevant single keyword or category from the list above. If it doesn't fit any, reply with the most descriptive 1-word tech topic from the query. No punctuation, no extra words.`;

        let keyword = input;
        try {
            keyword = await tryGenerate(model, prompt);
            console.log("Optimized Search Keyword:", keyword);
        } catch (aiError) {
            console.error("Gemini Search Error:", aiError.message);
        }

        const courses = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: input, $options: 'i' } },
                { subTitle: { $regex: input, $options: 'i' } },
                { description: { $regex: input, $options: 'i' } },
                { category: { $regex: input, $options: 'i' } },
                { level: { $regex: input, $options: 'i' } }
            ]
        });

        if (courses.length > 0) {
            return res.status(200).json(courses)
        } else {
            const coursesByKeyword = await Course.find({
                isPublished: true,
                $or: [
                    { title: { $regex: keyword, $options: 'i' } },
                    { subTitle: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                    { category: { $regex: keyword, $options: 'i' } },
                    { level: { $regex: keyword, $options: 'i' } }
                ]
            });
            return res.status(200).json(coursesByKeyword)
        }

    } catch (error) {
        console.error("Full Error:", error);
        return res.status(500).json({ message: `failed to search` })
    }
}