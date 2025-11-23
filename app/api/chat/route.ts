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
  console.log("🚀 HealthGuard AI - Enhanced Conversation");
  
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
    
    console.log("🔑 Groq API Status:", apiKey ? "✅ Configured" : "❌ Missing");

    if (!apiKey || apiKey === "your_groq_api_key_here") {
      return NextResponse.json(
        { 
          response: "🏆 **HealthGuard AI - Setup Required**\n\nTo enable our advanced AI health assistant:\n\n**Quick Setup (2 minutes):**\n1. Visit: https://console.groq.com\n2. Sign up (free)\n3. Create API key\n4. Add to .env file:\n   ```env\n   GROQ_API_KEY=your_actual_key_here\n   ```\n5. Restart server\n\n**Why Groq?**\n• ⚡ 200+ tokens/second responses\n• 🆓 Generous free tier\n• 🎯 Perfect for competitions\n• 🔧 Simple setup\n\nGet started now! 🚀"
        }
      );
    }

    // Build conversation context
    const messages = [
      {
        role: "system",
        content: `You are HealthGuard AI, a warm, empathetic, and highly knowledgeable health assistant. Your role is to provide compassionate, detailed health guidance while making users feel supported and understood.

**CRITICAL RESPONSE GUIDELINES:**
1. **Be Warm & Empathetic** - Show genuine care and understanding. Use phrases like "I understand how concerning this must be" or "That sounds really challenging"
2. **Vary Your Structure** - Don't use the same pattern every time. Mix paragraphs, bullet points, and conversational flow naturally
3. **Use Expressive Formatting** - Include relevant emojis to make responses feel warmer and more engaging
4. **Be Detailed but Conversational** - Provide thorough information while keeping it easy to read and understand
5. **Ask Engaging Questions** - End with open-ended questions to continue the conversation naturally
6. **Show Personality** - Be professional but warm, like a caring healthcare professional
7. **Use Natural Language** - Avoid robotic, repetitive patterns. Sound human and compassionate

**FORMATTING:**
- Use **bold** for important terms
- Use *italic* for emphasis
- Use bullet points • for clear lists
- Include relevant emojis like 🤔 💭 🩺 ❤️ 😊 🌟 📝
- Vary between paragraphs and lists naturally

**CONVERSATION FLOW:**
- Acknowledge their concern first
- Provide detailed, helpful information
- Include practical advice
- End with an engaging question or next step suggestion

Remember: You're talking to someone who might be worried or seeking comfort. Be their supportive health companion.`
      }
    ];

    // Add conversation history
    if (history && history.length > 0) {
      history.slice(-6).forEach((msg: any) => {
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

    console.log(`🤖 Calling Groq with enhanced conversation model`);
    
    const startTime = Date.now();
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        model: model,
        temperature: 0.8, // Higher temperature for more creative responses
        max_tokens: 1200, // More tokens for detailed responses
        top_p: 0.9,
        frequency_penalty: 0.3, // Reduce repetition
        presence_penalty: 0.3, // Encourage new topics
        stream: false
      }),
    });

    const responseTime = Date.now() - startTime;
    console.log("📊 Groq Response:", response.status, `(${responseTime}ms)`);

    if (response.status === 401) {
      return NextResponse.json(
        { 
          response: "🔐 **Invalid API Key**\n\nPlease check your Groq API key at: https://console.groq.com"
        },
        { status: 401 }
      );
    }

    if (response.status === 429) {
      return NextResponse.json(
        { 
          response: "⏳ **Quick Cooldown**\n\nFree tier limit reached. Please wait 30-60 seconds and try again."
        },
        { status: 429 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          response: "🔧 **Temporary Issue**\n\nPlease try again in a moment."
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format");
    }

    const aiResponse = data.choices[0].message.content;
    console.log("✅ ENHANCED RESPONSE!", `Length: ${aiResponse.length} chars`);

    return NextResponse.json({ 
      response: aiResponse,
      provider: "groq",
      model: model,
      response_time: `${responseTime}ms`,
      style: "warm_detailed_conversational"
    });

  } catch (error: any) {
    console.error("💥 API Error:", error);
    
    return NextResponse.json(
      { 
        response: "🌐 **Connection Issue**\n\nPlease check your connection and try again."
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const isConfigured = groqKey && groqKey !== "your_groq_api_key_here";
  
  return NextResponse.json({
    project: "HealthGuard AI",
    status: isConfigured ? "🚀 Ready" : "🔧 Setup Required",
    ai_provider: "Groq",
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
    response_style: "Warm, Detailed & Conversational",
    features: [
      "⚡ Ultra-fast responses",
      "🤗 Empathetic conversations",
      "🩺 Health-focused guidance",
      "💬 Engaging dialogue flow"
    ],
    setup_url: "https://console.groq.com"
  });
}