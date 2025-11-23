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
  console.log("🚀 HealthGuard AI - Enhanced Groq");
  
  try {
    const { message, history }: ChatRequest = await request.json();
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter a message" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      return NextResponse.json(
        { 
          response: "🔧 **Setup Required**\n\nPlease add your Groq API key to the .env file to enable AI chat features."
        }
      );
    }

    // Build conversation context
    const messages = [
      {
        role: "system",
        content: `You are HealthGuard AI, a warm, empathetic health assistant. Your responses should be:

**STYLE GUIDELINES:**
- Be conversational and natural, like talking to a caring friend
- Use varied response patterns - sometimes use bullet points, sometimes paragraphs, sometimes numbered lists
- Include appropriate emojis to convey warmth and understanding 🩺❤️🌟
- Use **bold** for important terms and *italic* for emphasis
- Ask follow-up questions to continue the conversation naturally
- Show genuine empathy and support
- Vary your opening and closing phrases
- Use different structures: sometimes start with empathy, sometimes with direct advice, sometimes with questions

**HEALTH GUIDELINES:**
- Provide accurate, evidence-based health information
- Always recommend consulting healthcare professionals for medical issues
- Be supportive and non-judgmental
- Focus on practical, actionable advice
- Consider the emotional aspect of health concerns

**RESPONSE VARIETY:**
- Mix short and long responses
- Use different formatting styles
- Vary your tone based on the seriousness of the topic
- Include encouraging phrases
- End with open-ended questions when appropriate

Make the patient feel heard, supported, and cared for. Your responses should feel warm and human-like.`
      }
    ];

    // Add conversation history
    if (history && history.length > 0) {
      history.slice(-4).forEach((msg: any) => {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content
        });
      });
    }

    // Add current message
    messages.push({
      role: "user",
      content: message
    });

    console.log(`🤖 Calling Groq for enhanced response...`);
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        model: model,
        temperature: 0.8, // Higher temperature for more varied responses
        max_tokens: 1200,
        top_p: 0.9,
        frequency_penalty: 0.3, // Encourage varied word choice
        presence_penalty: 0.3, // Encourage new topics
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          response: "I apologize, but I'm having some technical difficulties right now. Please try again in a moment. 🌟"
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format");
    }

    const aiResponse = data.choices[0].message.content;
    console.log("✅ Enhanced response generated");

    return NextResponse.json({ 
      response: aiResponse,
      provider: "groq"
    });

  } catch (error: any) {
    console.error("💥 API Error:", error);
    
    return NextResponse.json(
      { 
        response: "I'm experiencing some connection issues right now. Please bear with me and try again shortly. Your health questions are important! 💫"
      },
      { status: 500 }
    );
  }
}