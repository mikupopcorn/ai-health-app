"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Stethoscope, Heart, Clock, Trash2, MessageCircle } from "lucide-react";

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
}

export default function ChatPage() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("healthChatSessions");
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
      
      // Load the most recent session if no current session
      if (parsedSessions.length > 0 && !currentSession) {
        const latestSession = parsedSessions.reduce((latest, session) => 
          new Date(session.lastUpdated) > new Date(latest.lastUpdated) ? session : latest
        );
        setCurrentSession(latestSession);
        setMessages(latestSession.messages);
      }
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
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

  const createNewSession = (firstMessage?: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: firstMessage ? firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "") : "New Health Chat",
      messages: [
        {
          role: "assistant",
          content: "Hello! I'm your **AI Health Assistant** 🩺\n\nI can help you with:\n• 🤒 **Symptom analysis**\n• 💊 **Medication information**\n• 🥗 **Diet & nutrition advice**\n• 💪 **Fitness guidance**\n• 📊 **Health analytics**\n\n*Remember: I provide health information but always consult healthcare professionals for medical advice.*",
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    setMessages(newSession.messages);
    return newSession;
  };

  const switchSession = (session: ChatSession) => {
    setCurrentSession(session);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    
    if (currentSession?.id === sessionId) {
      if (updatedSessions.length > 0) {
        switchSession(updatedSessions[0]);
      } else {
        createNewSession();
      }
    }
  };

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return <div key={index} className="flex items-start gap-2"><span className="text-lg">•</span><span>{line.substring(2)}</span></div>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={index} className="text-blue-600 font-bold">{line.slice(2, -2)}</strong>;
        }
        if (line.startsWith('*') && line.endsWith('*')) {
          return <em key={index} className="text-gray-600 italic">{line.slice(1, -1)}</em>;
        }
        return <div key={index}>{line}</div>;
      });
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

    // Update or create session
    let currentSessionToUpdate = currentSession;
    if (!currentSessionToUpdate) {
      currentSessionToUpdate = createNewSession(input);
    }

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: `I understand you're asking about: "${input}"\n\nAs an AI health assistant, I can provide general information but remember to consult healthcare professionals for medical advice.\n\nFor "${input}", here are some general considerations:\n• Monitor your symptoms\n• Stay hydrated\n• Rest if needed\n• Contact a doctor if symptoms persist or worsen`,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Update session
      const updatedSession = {
        ...currentSessionToUpdate!,
        messages: finalMessages,
        lastUpdated: new Date(),
        title: input.slice(0, 50) + (input.length > 50 ? "..." : "")
      };
      
      setSessions(prev => prev.map(session => 
        session.id === currentSessionToUpdate!.id ? updatedSession : session
      ));
      setCurrentSession(updatedSession);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat History
                </h3>
                <p className="text-sm text-gray-600 mt-1">{sessions.length} conversations</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {sessions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No chat history yet</p>
                    <p className="text-sm">Start a new conversation to see it here</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => switchSession(session)}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                          currentSession?.id === session.id
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {session.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {session.messages.length} messages • {formatDate(session.lastUpdated)}
                            </p>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {session.messages[session.messages.length - 1]?.content.slice(0, 60)}...
                            </p>
                          </div>
                          <button
                            onClick={(e) => deleteSession(session.id, e)}
                            className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Chat Container */}
          <div className={`flex-1 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 h-[calc(100vh-12rem)] flex flex-col transition-all duration-300 ${
            showHistory ? 'ml-0' : 'ml-0'
          }`}>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentSession?.title || "AI Health Chat"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Ask me anything about health, symptoms, or wellness
                  </p>
                </div>
                {currentSession && (
                  <div className="text-sm text-gray-500">
                    Last updated: {formatDate(currentSession.lastUpdated)}
                  </div>
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
                    <div className="whitespace-pre-wrap space-y-2 leading-relaxed">
                      {formatMessage(message.content)}
                    </div>
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
                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
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
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your symptoms or ask a health question..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50/50 backdrop-blur-sm"
                    rows={2}
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
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