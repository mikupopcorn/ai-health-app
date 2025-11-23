"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Clock, Trash2, Home } from "lucide-react";
import Link from "next/link";

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
  // State variables
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Health Assistant. I can help you with health-related questions, symptom analysis, medication information, diet advice, and fitness guidance. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage
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

  const generateChatTitle = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('headache')) return "Headache Analysis & Management";
    if (input.includes('fever')) return "Fever Assessment & Care";
    if (input.includes('cough') || input.includes('cold')) return "Respiratory Symptoms Consultation";
    if (input.includes('stomach') || input.includes('nausea')) return "Digestive Health Assessment";
    if (input.includes('pain')) return "Pain Management Consultation";
    if (input.includes('anxiety') || input.includes('stress')) return "Mental Wellness Support";
    
    return "Health Consultation";
  };

  const createNewSession = (firstMessage?: string) => {
    const title = firstMessage ? generateChatTitle(firstMessage) : "New Health Chat";

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title,
      messages: [
        {
          role: "assistant",
          content: "Hello! I'm your AI Health Assistant. I can help you with health-related questions, symptom analysis, medication information, diet advice, and fitness guidance. How can I assist you today?",
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

    try {
      // Call your Groq API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          history: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Update session with AI response
      if (currentSessionToUpdate.messages.length === 1) {
        const newTitle = generateChatTitle(input);
        
        const updatedSession = {
          ...currentSessionToUpdate,
          title: newTitle,
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
      
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      
      // Update session with error message
      const updatedSession = {
        ...currentSessionToUpdate!,
        messages: finalMessages,
        lastUpdated: new Date(),
      };
      
      setSessions(prev => prev.map(session => 
        session.id === currentSessionToUpdate!.id ? updatedSession : session
      ));
      setCurrentSession(updatedSession);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
                <Bot className="w-6 h-6 text-white" />
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
                      {session.lastUpdated.toLocaleDateString()}
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
                    {messages.length} messages
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
                          content: "Hello! I'm your AI Health Assistant. I can help you with health-related questions, symptom analysis, medication information, diet advice, and fitness guidance. How can I assist you today?",
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your health question here..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}