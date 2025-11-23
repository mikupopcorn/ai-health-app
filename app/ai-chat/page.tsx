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

interface ConversationContext {
  symptoms: string[];
  duration: string;
  triggers: string[];
  severity: string;
  previousConditions: string[];
}

export default function ChatPage() {
  // State variables
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 **Hello! I'm your AI Health Assistant** 🩺\n\nI'm here to provide you with comprehensive health guidance and support. Here's how I can help you:\n\n🎯 **What I Offer:**\n• 🤒 **Detailed symptom analysis** with personalized insights\n• 💊 **Medication information** and potential interactions\n• 🥗 **Personalized diet & nutrition advice** based on your needs\n• 💪 **Fitness guidance** tailored to your health status\n• 📊 **Health analytics** and progress tracking\n• 🧠 **Mental wellness support** and stress management\n\n💡 **Important Notice:** While I provide detailed health information, I'm not a substitute for professional medical care. Always consult healthcare providers for diagnoses and treatment plans.\n\n**To get the most accurate help, please describe:**\n• Your specific symptoms in detail\n• How long you've experienced them\n• Any patterns or triggers you've noticed\n• Your relevant medical history\n\nWhat health concern can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    symptoms: [],
    duration: "",
    triggers: [],
    severity: "",
    previousConditions: []
  });
  
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

  // Enhanced context tracking
  const updateConversationContext = (userInput: string, response: string) => {
    const input = userInput.toLowerCase();
    
    // Extract symptoms
    const symptomKeywords = ['headache', 'nausea', 'pain', 'fever', 'cough', 'dizziness', 'fatigue', 'chest tightness', 'sore', 'ache'];
    const mentionedSymptoms = symptomKeywords.filter(symptom => input.includes(symptom));
    
    // Extract duration
    const durationPatterns = [
      /\b(\d+)\s*(?:days?|weeks?|months?|years?)\b/,
      /\bfor\s+(\d+)\s*(?:days?|weeks?|months?)\b/,
      /\bsince\s+(?:yesterday|last\s+week|this\s+morning)/
    ];
    
    let duration = "";
    for (const pattern of durationPatterns) {
      const match = input.match(pattern);
      if (match) {
        duration = match[0];
        break;
      }
    }

    // Extract triggers
    const triggerKeywords = ['after eating', 'when using', 'during work', 'when stressed', 'in the morning', 'at night'];
    const mentionedTriggers = triggerKeywords.filter(trigger => input.includes(trigger));

    setConversationContext(prev => ({
      symptoms: [...new Set([...prev.symptoms, ...mentionedSymptoms])],
      duration: duration || prev.duration,
      triggers: [...new Set([...prev.triggers, ...mentionedTriggers])],
      severity: prev.severity,
      previousConditions: prev.previousConditions
    }));
  };

  // Enhanced AI response function with context awareness
  const generateAIResponse = (userInput: string, context: ConversationContext): string => {
    const input = userInput.toLowerCase().trim();
    
    // Headache with context awareness
    if (input.includes('headache')) {
      const hasMorning = input.includes('morning') || context.triggers.some(t => t.includes('morning'));
      const hasScreenTime = input.includes('laptop') || input.includes('phone') || input.includes('screen');
      const hasNausea = input.includes('nausea') || context.symptoms.includes('nausea');
      const hasChestTightness = input.includes('chest') || context.symptoms.includes('chest tightness');
      
      let response = `I understand you're experiencing headaches. Let me provide you with a comprehensive analysis based on your description. 🩺\n\n`;

      // Detailed analysis based on context
      if (hasMorning && hasNausea) {
        response += `**🔍 Based on your symptoms (morning headaches with nausea), this could be related to:**\n\n`;
        response += `• **Sleep-related issues**: Poor sleep quality, sleep apnea, or bruxism (teeth grinding)\n`;
        response += `• **Blood pressure fluctuations**: Morning can be when blood pressure is highest\n`;
        response += `• **Migraine patterns**: Many migraines occur upon waking\n`;
        response += `• **Dehydration**: Overnight fluid loss can contribute to morning symptoms\n\n`;
      } else if (hasScreenTime) {
        response += `**👁️ Digital Eye Strain & Postural Issues:**\n\n`;
        response += `Your mention of laptop/phone use suggests several possible factors:\n`;
        response += `• **Digital eye strain**: Blue light exposure and prolonged focusing\n`;
        response += `• **Poor posture**: Neck and shoulder tension from computer use\n`;
        response += `• **Reduced blinking**: Leading to dry eyes and referred pain\n`;
        response += `• **Stress accumulation**: Mental fatigue from prolonged work\n\n`;
      }

      response += `**📋 Comprehensive Symptom Assessment:**\n\n`;
      
      if (hasChestTightness) {
        response += `🚨 **Important Note**: The combination of headache with chest tightness warrants attention. While it could be stress-related, these symptoms together should be evaluated by a healthcare provider to rule out cardiovascular concerns.\n\n`;
      }

      response += `**🎯 Potential Headache Types:**\n\n`;
      response += `• **Tension Headaches**: Often described as a tight band around the head, worsened by stress and poor posture\n`;
      response += `• **Migraines**: Can include nausea, sensitivity to light/sound, and throbbing pain\n`;
      response += `• **Cervicogenic Headaches**: Originating from neck issues, common with desk work\n`;
      response += `• **Cluster Headaches**: Severe, one-sided pain, but less common\n\n`;

      response += `**💡 Evidence-Based Management Strategies:**\n\n`;
      response += `**Immediate Relief:**\n`;
      response += `• Practice the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds\n`;
      response += `• Gentle neck stretches: Chin tucks and slow head rotations\n`;
      response += `• Hydration: Drink a large glass of water immediately\n`;
      response += `• Cold compress: Apply to forehead or back of neck for 15 minutes\n\n`;

      response += `**Lifestyle Adjustments:**\n`;
      response += `• **Ergonomics**: Ensure your screen is at eye level and you have proper back support\n`;
      response += `• **Blue light glasses**: Can reduce digital eye strain\n`;
      response += `• **Regular breaks**: Stand up and move every 45-60 minutes\n`;
      response += `• **Sleep hygiene**: Consistent sleep schedule and dark, quiet environment\n\n`;

      response += `**🚨 When to Seek Immediate Medical Attention:**\n`;
      response += `• Headache described as "the worst of your life"\n`;
      response += `• Sudden onset without previous history\n`;
      response += `• Accompanied by fever, confusion, or vision changes\n`;
      response += `• Follows a head injury\n`;
      response += `• Weakness or numbness on one side of the body\n\n`;

      // Contextual follow-up questions
      response += `**🔎 To help me understand better:**\n`;
      
      if (!context.duration) {
        response += `• How long have these headaches been occurring?\n`;
      }
      if (context.symptoms.length === 0) {
        response += `• Are you experiencing any other symptoms like vision changes or sensitivity to light?\n`;
      }
      if (!context.triggers.length && !hasScreenTime) {
        response += `• Have you noticed any specific patterns or triggers?\n`;
      }

      response += `\nI'm here to support you with more specific advice as you share additional details.`;

      return response;
    }

    // Enhanced fever response
    if (input.includes('fever') || input.includes('temperature')) {
      return `I understand you're concerned about fever. Let me provide comprehensive guidance. 🌡️\n\n**📊 Fever Severity Assessment:**\n\n• **Low-grade fever** (100.4°F-101.3°F / 38°C-38.5°C): Usually manageable at home\n• **Moderate fever** (101.4°F-103°F / 38.6°C-39.4°C): Requires monitoring and possible medical consultation\n• **High fever** (above 103°F / 39.4°C): Should be evaluated by a healthcare provider\n\n**🎯 Evidence-Based Management:**\n\n**Comfort Measures:**\n• Stay hydrated with water, electrolyte solutions, or clear broths\n• Dress in lightweight, breathable clothing\n• Maintain a comfortable room temperature\n• Use lukewarm sponge baths if fever causes discomfort\n\n**Medication Considerations:**\n• Acetaminophen or ibuprofen as directed\n• Never give aspirin to children or teenagers\n• Follow proper dosing intervals and maximum daily limits\n\n**🚨 Red Flags Requiring Immediate Medical Attention:**\n\n• Fever in infants under 3 months\n• Temperature above 104°F (40°C)\n• Fever lasting more than 3 days\n• Accompanying stiff neck, severe headache, or confusion\n• Difficulty breathing or chest pain\n• Signs of dehydration (dry mouth, no tears, decreased urination)\n• Rash that doesn't blanch when pressed\n\n**🔍 Additional Questions to Consider:**\n• What is your exact temperature reading?\n• How long has the fever persisted?\n• Are there any other symptoms present?\n• Have you recently traveled or been exposed to illnesses?\n\nWould you like to share your temperature reading and any other symptoms you're experiencing?`;
    }

    // Enhanced cough/cold response
    if (input.includes('cough') || input.includes('cold') || input.includes('congestion')) {
      return `I understand you're dealing with respiratory symptoms. Let me provide detailed guidance. 🤧\n\n**🔍 Symptom Analysis:**\n\n**Common Causes:**\n• **Viral infections** (most common): Typically last 7-14 days\n• **Allergies**: Often accompanied by itchy eyes and seasonal patterns\n• **Environmental irritants**: Smoke, pollution, or dry air\n• **Post-nasal drip**: Can cause persistent cough, especially at night\n\n**🎯 Comprehensive Relief Strategies:**\n\n**Immediate Comfort Measures:**\n• **Hydration**: Warm tea with honey, clear broths, electrolyte solutions\n• **Humidity**: Use a cool-mist humidifier, especially while sleeping\n• **Steam therapy**: Hot showers or facial steam to loosen congestion\n• **Elevated sleeping**: Extra pillows to reduce post-nasal drip\n\n**Symptom-Specific Approaches:**\n\n**For Dry Cough:**\n• Honey (1-2 teaspoons as needed)\n• Warm fluids throughout the day\n• Throat lozenges or hard candy\n\n**For Chest Congestion:**\n• Warm compresses on the chest\n• Gentle percussion (cupped hand tapping on back)\n• Expectorants to thin mucus\n\n**For Nasal Symptoms:**\n• Saline nasal sprays or rinses\n• Steam inhalation with eucalyptus oil\n• Proper nose blowing technique (one nostril at a time)\n\n**🚨 When to Seek Medical Care:**\n\n• Difficulty breathing or shortness of breath\n• Cough lasting more than 3 weeks\n• Fever above 101°F (38.3°C) for more than 3 days\n• Chest pain or wheezing\n• Thick green or yellow mucus for several days\n• Symptoms worsening instead of improving\n\n**💡 Prevention & Recovery Tips:**\n\n• Practice good hand hygiene\n• Get adequate rest to support immune function\n• Maintain balanced nutrition with vitamin-rich foods\n• Avoid smoking and secondhand smoke\n• Consider zinc supplements at symptom onset (consult your doctor)\n\nCould you tell me more about what type of cough you're experiencing and any other symptoms?`;
    }

    // Enhanced stomach issues response
    if (input.includes('stomach') || input.includes('nausea') || input.includes('vomit') || input.includes('digest')) {
      return `I understand you're experiencing digestive discomfort. Let me provide comprehensive guidance. 🩺\n\n**🔍 Common Digestive Issue Patterns:**\n\n**Based on Your Symptoms:**\n• **Nausea with headache**: Could indicate migraine, tension, or systemic issue\n• **Post-meal symptoms**: May suggest food intolerance, reflux, or gallbladder function\n• **Morning nausea**: Can relate to empty stomach, acid reflux, or pregnancy\n• **Stress-related symptoms**: Gut-brain connection is well-established\n\n**🎯 Immediate Comfort Measures:**\n\n**For Nausea:**\n• Sip clear, cold fluids slowly (water, ginger ale, electrolyte drinks)\n• Try ginger in forms of tea, candy, or supplements\n• Eat small, bland meals (crackers, toast, bananas)\n• Avoid strong odors and stuffy environments\n\n**For General Discomfort:**\n• Apply warm compress to abdomen\n• Practice deep breathing exercises\n• Maintain upright position after eating\n• Wear loose-fitting clothing\n\n**📋 Dietary Management:**\n\n**BRAT Diet (for acute symptoms):**\n• Bananas, Rice, Applesauce, Toast\n• Gradually add other bland foods as tolerated\n\n**Foods to Avoid Initially:**\n• Dairy products\n• Fatty, greasy, or fried foods\n• Spicy seasonings\n• Caffeine and alcohol\n• Carbonated beverages\n\n**🚨 Red Flags Requiring Medical Evaluation:**\n\n• Severe, constant abdominal pain\n• Vomiting blood or coffee-ground material\n• Inability to keep liquids down for 24 hours\n• Signs of dehydration (dizziness, dark urine, dry mouth)\n• Fever above 101°F (38.3°C)\n• Blood in stool\n• Symptoms lasting more than 48 hours without improvement\n\n**🔎 Important Considerations:**\n\n• **Timing**: When do symptoms typically occur?\n• **Triggers**: Any specific foods or situations that worsen symptoms?\n• **Relief factors**: What makes you feel better?\n• **Pattern**: How long has this been happening?\n\nCould you share more details about when your symptoms began and what seems to trigger or relieve them?`;
    }

    // Default enhanced response for unrecognized queries
    return `Thank you for sharing your health concern with me. I want to make sure I understand your situation completely to provide the most helpful guidance. 🩺\n\n**🔍 How I Can Assist You:**\n\nI'll provide you with:\n• **Detailed symptom analysis** based on current medical understanding\n• **Evidence-based self-care strategies** you can implement safely\n• **Guidance on when to seek professional medical care**\n• **Lifestyle recommendations** to support your wellbeing\n• **Questions to consider** that can help your healthcare provider\n\n**📝 To Give You the Best Assistance:**\n\nPlease share:\n• **Specific symptoms** you're experiencing\n• **Duration and frequency** of these symptoms\n• **Any patterns or triggers** you've noticed\n• **What makes symptoms better or worse**\n• **Your relevant medical history** (if comfortable sharing)\n\n**💡 My Role as Your AI Health Assistant:**\n\nWhile I provide comprehensive health information based on established medical knowledge, I'm not a substitute for:\n• Professional medical diagnosis\n• Emergency medical care\n• Prescription medication management\n• Treatment of serious or life-threatening conditions\n\n**🎯 Let's Work Together:**\n\nCould you tell me more about what you're experiencing? The more details you provide, the better I can help guide you toward appropriate next steps and self-care strategies.\n\n*Remember: Your health and safety are the top priority. When in doubt, always consult with healthcare professionals.*`;
  };

  const generateChatTitle = (userInput: string, category: string): string => {
    const input = userInput.toLowerCase();
    
    if (category === "Mental Health") {
      if (input.includes('panic') || input.includes('attack')) return "Panic Attack Support & Management";
      if (input.includes('stress') && input.includes('work')) return "Work-Related Stress Consultation";
      return "Mental Wellness & Anxiety Support";
    }
    
    if (category === "Skin Conditions") return "Skin Condition Analysis & Care";
    if (category === "Injuries") return "Injury Assessment & Recovery";
    if (category === "General Health" && input.includes('headache')) return "Headache Analysis & Management Plan";
    if (category === "General Health" && input.includes('fever')) return "Fever Assessment & Care Guidance";
    if (category === "General Health" && input.includes('cough')) return "Respiratory Symptoms Consultation";
    if (category === "General Health" && input.includes('stomach')) return "Digestive Health Assessment";
    
    return "Comprehensive Health Consultation";
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
          content: "👋 **Hello! I'm your AI Health Assistant** 🩺\n\nI'm here to provide you with comprehensive health guidance and support. Here's how I can help you:\n\n🎯 **What I Offer:**\n• 🤒 **Detailed symptom analysis** with personalized insights\n• 💊 **Medication information** and potential interactions\n• 🥗 **Personalized diet & nutrition advice** based on your needs\n• 💪 **Fitness guidance** tailored to your health status\n• 📊 **Health analytics** and progress tracking\n• 🧠 **Mental wellness support** and stress management\n\n💡 **Important Notice:** While I provide detailed health information, I'm not a substitute for professional medical care. Always consult healthcare providers for diagnoses and treatment plans.\n\n**To get the most accurate help, please describe:**\n• Your specific symptoms in detail\n• How long you've experienced them\n• Any patterns or triggers you've noticed\n• Your relevant medical history\n\nWhat health concern can I help you with today?",
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
      category,
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    setMessages(newSession.messages);
    setConversationContext({
      symptoms: [],
      duration: "",
      triggers: [],
      severity: "",
      previousConditions: []
    });
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
      const response = generateAIResponse(input, conversationContext);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      updateConversationContext(input, response);

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
    }, 1000);
  };

  const formatMessage = (content: string) => {
    return (
      <div className="whitespace-pre-wrap space-y-3 leading-relaxed text-[15px]">
        {content.split('\n\n').map((paragraph, pIndex) => {
          if (paragraph.trim() === '') return <br key={pIndex} />;
          
          return (
            <div key={pIndex} className="space-y-2">
              {paragraph.split('\n').map((line, index) => {
                const lineKey = `${pIndex}-${index}`;
                
                if (line.startsWith('• ') || line.startsWith('- ')) {
                  return (
                    <div key={lineKey} className="flex items-start gap-3">
                      <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                      <span className="flex-1">{line.substring(2)}</span>
                    </div>
                  );
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <strong key={lineKey} className="text-blue-700 font-bold text-[16px] block mt-2">{line.slice(2, -2)}</strong>;
                }
                if (line.startsWith('🎯 ') || line.startsWith('🔍 ') || line.startsWith('🚨 ') || line.startsWith('💡 ') || line.startsWith('📋 ') || line.startsWith('📊 ') || line.startsWith('👁️ ') || line.startsWith('👋 ')) {
                  return <div key={lineKey} className="font-bold text-gray-800 text-[16px] mt-3 flex items-center gap-2">{line}</div>;
                }
                if (line.trim() === '') {
                  return <br key={lineKey} />;
                }
                return <div key={lineKey} className="text-gray-700">{line}</div>;
              })}
            </div>
          );
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
                          content: "👋 **Hello! I'm your AI Health Assistant** 🩺\n\nI'm here to provide you with comprehensive health guidance and support. Here's how I can help you:\n\n🎯 **What I Offer:**\n• 🤒 **Detailed symptom analysis** with personalized insights\n• 💊 **Medication information** and potential interactions\n• 🥗 **Personalized diet & nutrition advice** based on your needs\n• 💪 **Fitness guidance** tailored to your health status\n• 📊 **Health analytics** and progress tracking\n• 🧠 **Mental wellness support** and stress management\n\n💡 **Important Notice:** While I provide detailed health information, I'm not a substitute for professional medical care. Always consult healthcare providers for diagnoses and treatment plans.\n\n**To get the most accurate help, please describe:**\n• Your specific symptoms in detail\n• How long you've experienced them\n• Any patterns or triggers you've noticed\n• Your relevant medical history\n\nWhat health concern can I help you with today?",
                          timestamp: new Date(),
                        },
                      ]);
                      setConversationContext({
                        symptoms: [],
                        duration: "",
                        triggers: [],
                        severity: "",
                        previousConditions: []
                      });
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
                    className={`max-w-[85%] rounded-2xl p-5 shadow-lg ${
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
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-5 shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">Analyzing your symptoms...</div>
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
                    placeholder="Describe your symptoms in detail, including duration, triggers, and any other relevant information..."
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