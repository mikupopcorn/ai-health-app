"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Stethoscope, Heart, Clock, Trash2, MessageCircle, Home, LogIn, LogOut } from "lucide-react";
import Link from "next/link";

// Define interfaces locally
interface UserType {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  category?: string;
}

export default function ChatPage() {
  // State variables
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your **AI Health Assistant** 🩺\n\nI can help you with:\n• 🤒 **Symptom analysis**\n• 💊 **Medication information**\n• 🥗 **Diet & nutrition advice**\n• 💪 **Fitness guidance**\n• 📊 **Health analytics**\n\n*Remember: I provide health information but always consult healthcare professionals for medical advice.*",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user and sessions from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('healthChatUser');
    const savedSessions = localStorage.getItem("healthChatSessions");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedSessions) {
      const parsedSessions: ChatSession[] = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        lastUpdated: new Date(session.lastUpdated),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setSessions(parsedSessions);
      
      if (parsedSessions.length > 0 && !currentSession) {
        const latestSession = parsedSessions.reduce((latest, session) => 
          new Date(session.lastUpdated) > new Date(latest.lastUpdated) ? session : latest
        );
        setCurrentSession(latestSession);
        setMessages(latestSession.messages);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("healthChatSessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auth functions
  const handleLogin = (userData: UserType) => {
    setUser(userData);
    localStorage.setItem('healthChatUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('healthChatUser');
  };

  // AI response function - COMPLETE IMPLEMENTATION
  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();
    
    if (input.includes('headache')) {
      return `I understand you're experiencing a headache. 🤕

**Common Headache Types:**
• Tension headaches (pressure around forehead)
• Migraines (throbbing pain, often with nausea)
• Sinus headaches (pain around eyes/cheeks)

**Immediate Relief Suggestions:**
• Rest in a quiet, dark room
• Stay hydrated with water
• Apply cool compress to forehead
• Gentle neck and shoulder stretches

**When to Seek Medical Attention:**
• Sudden, severe headache
• Headache after head injury
• Accompanied by fever, confusion, or vision changes
• Headache that persists for several days

Have you noticed any specific triggers or patterns with your headaches?`;
    }

    if (input.includes('fever') || input.includes('temperature')) {
      return `I see you're concerned about fever. 🌡️

**Fever Management:**
• Rest and stay hydrated
• Use over-the-counter fever reducers as directed
• Wear lightweight clothing
• Take lukewarm baths if uncomfortable

**Monitor These Symptoms:**
• Temperature above 103°F (39.4°C)
• Fever lasting more than 3 days
• Difficulty breathing
• Severe headache or stiff neck
• Rash that doesn't fade under pressure

**Seek Immediate Care If:**
• Infant under 3 months with fever
• Confusion or difficulty waking
• Severe pain anywhere
• Signs of dehydration

What is your current temperature and how long have you had the fever?`;
    }

    if (input.includes('cough') || input.includes('cold')) {
      return `I understand you're dealing with cough/cold symptoms. 🤧

**Symptom Relief:**
• Drink warm fluids (tea, broth)
• Use honey for cough (adults & children over 1)
• Try steam inhalation
• Use saline nasal spray
• Get plenty of rest

**Home Care Tips:**
• Use a humidifier in your room
• Elevate your head while sleeping
• Gargle with warm salt water
• Avoid irritants like smoke

**When to See a Doctor:**
• Difficulty breathing or chest pain
• Cough lasting more than 3 weeks
• High fever that doesn't improve
• Thick green or yellow mucus

Are you experiencing any other symptoms along with the cough?`;
    }

    if (input.includes('stomach') || input.includes('nausea') || input.includes('vomit')) {
      return `I see you're having stomach issues. 🤢

**Immediate Care:**
• Sip clear fluids (water, broth)
• Avoid solid foods for a few hours
• Rest in a comfortable position
• Try ginger tea or crackers

**What to Avoid:**
• Dairy products
• Fatty or spicy foods
• Caffeine and alcohol
• Large meals

**Seek Medical Care If:**
• Vomiting for more than 24 hours
• Severe abdominal pain
• Signs of dehydration
• Blood in vomit or stool
• Fever above 101°F (38.3°C)

How long have you been experiencing these symptoms?`;
    }

    if (input.includes('anxiety') || input.includes('stress') || input.includes('panic')) {
      return `I understand you're feeling anxious or stressed. 🧘

**Immediate Calming Techniques:**
• Deep breathing exercises
• Progressive muscle relaxation
• Grounding techniques (name 5 things you can see)
• Take a short walk
• Listen to calming music

**Long-term Management:**
• Regular exercise
• Balanced diet and hydration
• Consistent sleep schedule
• Mindfulness or meditation practice
• Limit caffeine and alcohol

**When to Seek Professional Help:**
• Symptoms interfere with daily life
• Panic attacks are frequent
• Avoiding normal activities
• Thoughts of self-harm

**Crisis Resources:**
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741

Would you like to talk more about what's causing these feelings?`;
    }

    if (input.includes('skin') || input.includes('rash') || input.includes('red') || input.includes('bump')) {
      return `I understand you're concerned about a skin condition. 🩺

**Common Skin Conditions:**
• Contact dermatitis (reaction to irritants)
• Eczema or atopic dermatitis  
• Allergic reaction
• Fungal or bacterial infection
• Insect bites or stings

**Skin Comfort Measures:**
• Keep the area clean and dry
• Avoid scratching or rubbing
• Use cool compresses for itching
• Wear loose, breathable clothing

**When to Seek Medical Care:**
• Symptoms worsening rapidly
• Signs of infection (pus, fever)
• Rash covering large body areas
• Associated breathing difficulties
• No improvement in 2-3 days

Could you tell me more about when this started and if you've noticed any specific triggers?`;
    }

    if (input.includes('injury') || input.includes('hurt') || input.includes('swell') || input.includes('bruise')) {
      return `I can see you're dealing with an injury. 🏥

**Immediate First Aid (if recent injury):**
• Rest the injured area
• Apply ice packs (20 minutes on, 20 minutes off)
• Use compression if appropriate
• Elevate the injured limb

**Injury Monitoring:**
• Watch for increased swelling
• Note color changes in the skin
• Monitor pain levels
• Check for mobility limitations

**Red Flags Requiring Immediate Care:**
• Inability to move the affected area
• Severe deformity or misalignment
• Numbness or tingling sensations
• Cold or pale skin in the injured area
• Uncontrolled bleeding

Would you like to share more details about how this injury occurred and your current pain level?`;
    }

    // Default response for unrecognized queries
    return `Thank you for sharing your health concern. 🩺

I understand you're asking about: "${userInput}"

**How I Can Help:**
• Provide general health information
• Suggest possible next steps
• Offer self-care recommendations
• Help you understand when to seek professional care

**For Best Assistance:**
• Describe your symptoms in detail
• Mention how long you've had them
• Note any patterns or triggers
• Share relevant medical history

**Important Reminder:** 
I'm an AI assistant providing general health information. For specific medical advice, diagnoses, or treatment, please consult with a healthcare professional.

Could you tell me more about your specific symptoms and how long you've been experiencing them?`;
  };

  const generateChatTitle = (userInput: string, category: string): string => {
    const input = userInput.toLowerCase();
    
    if (category === "Mental Health") {
      if (input.includes('panic') || input.includes('attack')) return "Panic Attack Support";
      if (input.includes('stress') && input.includes('work')) return "Work Stress Management";
      return "Anxiety & Mental Wellness";
    }
    
    if (category === "Skin Conditions") return "Skin Condition Analysis";
    if (category === "Injuries") return "Injury Assessment";
    if (category === "General Health" && input.includes('headache')) return "Headache Consultation";
    if (category === "General Health" && input.includes('fever')) return "Fever Assessment";
    if (category === "General Health" && input.includes('cough')) return "Respiratory Symptoms";
    if (category === "General Health" && input.includes('stomach')) return "Digestive Issues";
    
    return "Health Consultation";
  };

  const detectChatCategory = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('skin') || input.includes('rash') || input.includes('red') || input.includes('bump')) {
      return "Skin Conditions";
    }
    
    if (input.includes('injury') || input.includes('hurt') || input.includes('swell') || input.includes('bruise')) {
      return "Injuries";
    }
    
    if (input.includes('anxiety') || input.includes('stress') || input.includes('panic') || input.includes('depress')) {
      return "Mental Health";
    }
    
    return "General Health";
  };

  const createNewSession = (firstMessage?: string) => {
    const category = firstMessage ? detectChatCategory(firstMessage) : "General Health";
    const title = firstMessage ? generateChatTitle(firstMessage, category) : "New Health Chat";

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title,
      messages: [
        {
          role: "assistant",
          content: "Hello! I'm your **AI Health Assistant** 🩺\n\nI can help you with:\n• 🤒 **Symptom analysis**\n• 💊 **Medication information**\n• 🥗 **Diet & nutrition advice**\n• 💪 **Fitness guidance**\n• 📊 **Health analytics**\n\n*Remember: I provide health information but always consult healthcare professionals for medical advice.*",
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
      category,
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    setMessages(newSession.messages);
    return newSession;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let currentSessionToUpdate = currentSession;
    if (!currentSessionToUpdate) {
      currentSessionToUpdate = createNewSession(input);
    }

    setTimeout(() => {
      const response = generateAIResponse(input);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      if (currentSessionToUpdate.messages.length === 1) {
        const category = detectChatCategory(input);
        const newTitle = generateChatTitle(input, category);
        
        const updatedSession = {
          ...currentSessionToUpdate,
          title: newTitle,
          category,
          messages: finalMessages,
          lastUpdated: new Date(),
        };
        
        setSessions(prev => prev.map(session => 
          session.id === currentSessionToUpdate!.id ? updatedSession : session
        ));
        setCurrentSession(updatedSession);
      } else {
        const updatedSession = {
          ...currentSessionToUpdate,
          messages: finalMessages,
          lastUpdated: new Date(),
        };
        
        setSessions(prev => prev.map(session => 
          session.id === currentSessionToUpdate!.id ? updatedSession : session
        ));
        setCurrentSession(updatedSession);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const formatMessage = (content: string) => {
    return (
      <div className="whitespace-pre-wrap space-y-2 leading-relaxed">
        {content.split('\n').map((line, index) => {
          if (line.startsWith('• ') || line.startsWith('- ')) {
            return <div key={index} className="flex items-start gap-2"><span className="text-lg">•</span><span>{line.substring(2)}</span></div>;
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return <strong key={index} className="text-blue-600 font-bold">{line.slice(2, -2)}</strong>;
          }
          if (line.startsWith('*') && line.endsWith('*')) {
            return <em key={index} className="text-gray-600 italic">{line.slice(1, -1)}</em>;
          }
          if (line.startsWith('## ')) {
            return <h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.substring(3)}</h3>;
          }
          if (line.startsWith('💡 ') || line.startsWith('🚨 ') || line.startsWith('🎯 ')) {
            return <div key={index} className="font-semibold text-gray-800 mt-3">{line}</div>;
          }
          if (line.trim() === '') {
            return <br key={index} />;
          }
          return <div key={index}>{line}</div>;
        })}
      </div>
    );
  };

  // User profile component
  const UserProfile = () => (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HealthGuard AI
                </h1>
                <p className="text-sm text-gray-600">Your personal healthcare companion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <UserProfile />
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>History</span>
                {sessions.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-6">
                    {sessions.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => createNewSession()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                New Chat
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex gap-6">
          {/* Chat History Sidebar */}
          {showHistory && (
            <div className="w-80 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 h-[calc(100vh-12rem)] flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Chat History</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-xl cursor-pointer transition-colors ${
                      currentSession?.id === session.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setCurrentSession(session);
                      setMessages(session.messages);
                    }}
                  >
                    <div className="font-medium text-gray-900 truncate">
                      {session.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {session.lastUpdated.toLocaleDateString()} • {session.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Chat Container */}
          <div className={`flex-1 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 h-[calc(100vh-12rem)] flex flex-col transition-all duration-300 ${
            showHistory ? 'ml-0' : 'ml-0'
          }`}>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentSession?.title || "Health Consultation"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {currentSession?.category || "General Health"} • {messages.length} messages
                  </p>
                </div>
                {currentSession && (
                  <button
                    onClick={() => {
                      setSessions(prev => prev.filter(s => s.id !== currentSession.id));
                      setCurrentSession(null);
                      setMessages([
                        {
                          role: "assistant",
                          content: "Hello! I'm your **AI Health Assistant** 🩺\n\nI can help you with:\n• 🤒 **Symptom analysis**\n• 💊 **Medication information**\n• 🥗 **Diet & nutrition advice**\n• 💪 **Fitness guidance**\n• 📊 **Health analytics**\n\n*Remember: I provide health information but always consult healthcare professionals for medical advice.*",
                          timestamp: new Date(),
                        },
                      ]);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Chat</span>
                  </button>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-blue-50/30">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-900 border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    {formatMessage(message.content)}
                    <div
                      className={`text-xs mt-3 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200 bg-white rounded-b-3xl">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Describe your symptoms or ask a health question..."
                    className="w-full px-4 py-3 pr-24 resize-none border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                  <div className="absolute right-3 top-3 text-gray-400 text-sm">
                    ⏎ Enter to send
                  </div>
                </div>
                
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                  <span className="font-semibold">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}