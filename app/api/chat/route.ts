import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json() as ChatRequest;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        error: "Groq API key is not configured. Please set GROQ_API_KEY in your environment variables."
      }, {
        status: 500
      });
    }

    // Build conversation history
    const chatHistory = history?.slice(-10).map((msg: ChatMessage) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    })) || [];

    // Enhanced system prompt for detailed, comprehensive responses
    const systemPrompt = `You are Dr. HealthAssist, a comprehensive AI Health Assistant. Your role is to provide extremely detailed, thorough, and comprehensive responses to health-related questions.

RESPONSE GUIDELINES:
- Provide EXTREMELY DETAILED and COMPREHENSIVE explanations
- Use 500-1000+ words for substantial questions
- Break down complex medical concepts into easy-to-understand sections
- Include multiple perspectives when relevant
- Provide practical examples and analogies
- Use bullet points or numbered lists for better organization
- Cover related topics that might be helpful to the user
- Include preventive measures and lifestyle recommendations
- Discuss when to seek professional medical help

CONTENT STRUCTURE FOR COMPREHENSIVE RESPONSES:
1. Main Explanation: Detailed breakdown of the topic
2. Causes & Risk Factors: Comprehensive list of potential causes
3. Symptoms & Signs: Detailed description of what to look for
4. Prevention & Management: Extensive lifestyle and prevention strategies
5. When to Seek Help: Clear guidance on professional medical consultation
6. Additional Resources: Suggestions for further learning

SAFETY PROTOCOLS:
- Always emphasize you are not a replacement for professional medical advice
- For serious symptoms, immediately recommend emergency care
- Never provide definitive diagnoses
- Always encourage consultation with healthcare providers

Remember: Your responses should be educational, comprehensive, and extremely detailed while maintaining clarity and empathy.`;

    // Build messages array for Groq API
    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...chatHistory,
      {
        role: "user",
        content: `Please provide an extremely detailed and comprehensive response to: ${message}`
      }
    ];

    // Enhanced API configuration for longer, more detailed responses
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        temperature: 0.8, // Slightly higher for more creative, detailed responses
        max_tokens: 4000, // Increased for longer responses
        top_p: 0.95,
        stream: false,
        presence_penalty: 0.1, // Encourages new topics and details
        frequency_penalty: 0.1  // Reduces repetition
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      
      // Handle rate limit errors
      if (response.status === 429) {
        return NextResponse.json({
          error: "Rate limit exceeded. Please try again later or upgrade your API plan."
        }, {
          status: 429
        });
      }
      
      // Handle API key errors
      if (response.status === 401) {
        return NextResponse.json({
          error: "Invalid API key. Please check your GROQ_API_KEY in environment variables."
        }, {
          status: 401
        });
      }

      return NextResponse.json({
        error: "Failed to get response from AI. Please check your API key and try again.",
        details: errorText
      }, {
        status: 500
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No response received";

    return NextResponse.json({
      response: text
    });

  } catch (error: any) {
    console.error("Error in chat API:", error);
    
    return NextResponse.json({
      error: "Failed to get response from AI. Please check your API key and try again.",
      details: error.message
    }, {
      status: 500
    });
  }
}

// Optional: Keep the GET endpoint for testing
export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const isConfigured = groqKey && groqKey !== "your_groq_api_key_here";

  return NextResponse.json({
    status: isConfigured ? "Ready" : "Setup Required",
    ai_provider: "Groq",
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
    features: "Enhanced detailed responses (4000 tokens max)",
    message: isConfigured ? "API is configured and ready for detailed responses" : "Please set GROQ_API_KEY in your environment variables"
  });
}