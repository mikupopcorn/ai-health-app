import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY || ""
);

// Try different model names - free tier models may vary
// Newer models: gemini-2.5-flash, gemini-2.5-pro
// Older models: gemini-1.5-pro, gemini-1.5-flash, gemini-pro
// If one doesn't work, visit /api/list-models to see available models
const MODEL_NAME = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";
const model = genAI.getGenerativeModel({ 
  model: MODEL_NAME
});

export async function POST(request: NextRequest) {
  try {
    const { symptoms, age, gender, duration } = await request.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Google Gemini API key is not configured. Please set GOOGLE_GEMINI_API_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    if (!symptoms || !symptoms.trim()) {
      return NextResponse.json(
        { error: "Symptoms are required" },
        { status: 400 }
      );
    }

    const prompt = `You are a medical information assistant. Analyze the following symptoms and provide helpful information. 

IMPORTANT: You are NOT providing a diagnosis. You are providing general information that might help the user understand their symptoms better. Always emphasize that professional medical consultation is necessary.

Symptoms: ${symptoms}
${age ? `Age: ${age}` : ""}
${gender ? `Gender: ${gender}` : ""}
${duration ? `Duration: ${duration}` : ""}

Please provide a structured response in the following format:

1. Possible Causes: List 3-5 potential causes (but emphasize these are possibilities, not diagnoses)
2. Recommended Actions: Suggest general self-care measures and when to monitor symptoms
3. When to Seek Help: Clearly state when professional medical attention should be sought

Format your response as JSON with these keys: possibleCauses, recommendations, whenToSeekHelp

Be empathetic, clear, and always remind the user that this is informational only and not a replacement for professional medical advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let parsedResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      parsedResponse = JSON.parse(jsonText);
    } catch {
      // If JSON parsing fails, structure the response manually
      parsedResponse = {
        possibleCauses: text.split("\n\n")[0] || text,
        recommendations: text.split("\n\n")[1] || "Please consult with a healthcare professional.",
        whenToSeekHelp: text.split("\n\n")[2] || "If symptoms persist or worsen, seek immediate medical attention.",
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error: any) {
    console.error("Error in symptom checker API:", error);
    
    // Handle model not found errors - suggest trying different models
    if (error.message?.includes("404") || error.message?.includes("not found") || error.message?.includes("not supported")) {
      return NextResponse.json(
        {
          error: `Model "${MODEL_NAME}" not found or not supported. Try visiting /api/list-models to see available models, or set GEMINI_MODEL_NAME in your .env file to a different model (e.g., gemini-1.5-pro, gemini-1.5-flash, gemini-pro).`,
          modelUsed: MODEL_NAME,
          suggestion: "Visit /api/list-models endpoint to see available models for your API key.",
        },
        { status: 404 }
      );
    }
    
    // Handle rate limit errors for free tier
    if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("rate limit")) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. The free tier has daily limits. Please try again later or upgrade your API plan.",
        },
        { status: 429 }
      );
    }
    
    // Handle API key errors
    if (error.message?.includes("API key") || error.message?.includes("401")) {
      return NextResponse.json(
        {
          error: "Invalid API key. Please check your GOOGLE_GEMINI_API_KEY in environment variables.",
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        error: "Failed to analyze symptoms. Please check your API key and try again.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

