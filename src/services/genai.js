// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize the API with your key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Corrected model name
// const model = genAI.getGenerativeModel({
//     model:"gemini-1.5-pro-latest" ,   // Updated here
//     generationConfig: {
//         temperature: 0.9,
//         topP: 0.95,
//         topK: 40,
//         maxOutputTokens: 2048,
//     }
// });

// export async function generateAIResponse(prompt) {
//     try {
//         const chat = await model.startChat({  // Added 'await' here (important)
//             history: []
//         });

//         const result = await chat.sendMessage(prompt);
//         const response = await result.response;
//         const text = response.text();

//         return {
//             success: true,
//             content: text,
//             role: 'assistant',
//             timestamp: Date.now()
//         };
//     } catch (error) {
//         console.error('Gemini AI Error:', error);
//         return {
//             success: false,
//             error: error.message || 'Failed to generate response'
//         };
//     }
// }

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Correct model initialization
const model = genAI.getGenerativeModel({
    model: "gemini-1.0-pro",
    generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
    },
});

export async function generateAIResponse(prompt) {
    try {
        const chat = await model.startChat({ history: [] });
        const result = await chat.sendMessage(prompt);

        // `result.response` is already awaited; no need for `await result.response`
        const text = result.response.text(); 

        return {
            success: true,
            content: text,
            role: 'assistant',
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return {
            success: false,
            error: error?.message || 'Failed to generate response'
        };
    }
}
