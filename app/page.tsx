"use client";

import { useState, useEffect } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import DoodleBackground from "@/components/DoodleBackground";
import DailyHealthInput from "@/components/DailyHealthInput";
import MoodTracker from "@/components/MoodTracker";
import HealthCharts from "@/components/HealthCharts";
import { Activity, Heart, TrendingUp, MessageCircle, Rocket, Utensils, Scale, Bell, Stethoscope, FileText } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [healthData, setHealthData] = useState<any[]>([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('healthData') || '[]');
    setHealthData(savedData.slice(0, 7));
  }, []);

  const averages = healthData.length > 0 ? {
    steps: Math.round(healthData.reduce((sum, day) => sum + day.steps, 0) / healthData.length),
    bpm: Math.round(healthData.reduce((sum, day) => sum + day.bpm, 0) / healthData.length),
    sleep: (healthData.reduce((sum, day) => sum + day.sleep, 0) / healthData.length).toFixed(1)
  } : { steps: 0, bpm: 0, sleep: "0" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <DoodleBackground />
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-blue-200 mb-6">
            <Rocket className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-700">Powered by Groq AI • Ultra-Fast Responses</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            HealthGuard AI
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Your intelligent health companion with natural conversations and detailed insights
          </p>
        </div>

        {/* Quick Stats - Only show if data exists */}
        {healthData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 border border-blue-200 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Average Steps</h3>
                  <p className="text-3xl font-bold text-gray-900">{averages.steps}</p>
                  <p className="text-sm text-green-600 font-medium">Daily Average</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-xl p-6 border border-red-200 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Average BPM</h3>
                  <p className="text-3xl font-bold text-gray-900">{averages.bpm}</p>
                  <p className="text-sm text-red-600 font-medium">Resting Heart Rate</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl shadow-xl p-6 border border-purple-200 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Avg Sleep</h3>
                  <p className="text-3xl font-bold text-gray-900">{averages.sleep}h</p>
                  <p className="text-sm text-purple-600 font-medium">Per Night</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid - Clean and focused */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column */}
          <div className="space-y-8">
            <DailyHealthInput />
            <MoodTracker />
            
            {/* Diet Plan Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Personalized Diet Plan</h3>
                <Utensils className="w-6 h-6 text-blue-600" />
              </div>
              
              <p className="text-gray-600 mb-4">
                Get a customized nutrition plan based on your health profile, goals, and dietary preferences.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">BMI Calculator</span>
                  <Scale className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-700">Calorie Tracking</span>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <span className="text-sm text-gray-700">Meal Planning</span>
                  <Utensils className="w-4 h-4 text-indigo-500" />
                </div>
              </div>
              
              <Link 
                href="/diet-plan"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <Utensils className="w-5 h-5" />
                Create Diet Plan
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <HealthCharts />
          </div>
        </div>

        {/* Recent Activity Section */}
        {healthData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Health Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Health Tracking</p>
                  <p className="text-gray-600">{healthData.length} days recorded</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-800">AI Chat</p>
                  <p className="text-gray-600">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">All Features</p>
                  <p className="text-gray-600">Ready to use</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Features Quick Access */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">All Health Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* AI Chat Card */}
            <Link href="/ai-chat" className="bg-white rounded-2xl shadow-lg p-4 border border-blue-200 hover:shadow-xl transition-all transform hover:scale-105 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">AI Chat</h3>
              <p className="text-xs text-gray-600">Health advice</p>
            </Link>

            {/* Symptom Checker Card */}
            <Link href="/symptom-checker" className="bg-white rounded-2xl shadow-lg p-4 border border-purple-200 hover:shadow-xl transition-all transform hover:scale-105 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Symptom Check</h3>
              <p className="text-xs text-gray-600">Analysis</p>
            </Link>

            {/* Health Records Card */}
            <Link href="/health-records" className="bg-white rounded-2xl shadow-lg p-4 border border-green-200 hover:shadow-xl transition-all transform hover:scale-105 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Records</h3>
              <p className="text-xs text-gray-600">Medical history</p>
            </Link>

            {/* Diet Plan Card */}
            <Link href="/diet-plan" className="bg-white rounded-2xl shadow-lg p-4 border border-orange-200 hover:shadow-xl transition-all transform hover:scale-105 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Diet Plan</h3>
              <p className="text-xs text-gray-600">Nutrition</p>
            </Link>

            {/* Reminders Card */}
            <Link href="/reminders" className="bg-white rounded-2xl shadow-lg p-4 border border-indigo-200 hover:shadow-xl transition-all transform hover:scale-105 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Reminders</h3>
              <p className="text-xs text-gray-600">Medications</p>
            </Link>
          </div>
        </div>

        {/* Call to Action - Single prominent button */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Chat with Our AI Health Assistant?</h2>
            <p className="text-gray-600 mb-6">
              Get personalized health advice, symptom guidance, and wellness tips through natural conversations.
            </p>
            <Link 
              href="/ai-chat"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Start Health Chat
              <Rocket className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-500 mt-3">Powered by Groq AI • Responses in milliseconds</p>
          </div>
        </div>

        {/* Empty State when no data */}
        {healthData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏥</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Your Health Journey</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Begin by entering your daily health data or explore our AI-powered health features.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 max-w-md mx-auto">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Quick Start Options</h3>
              <p className="text-blue-700 text-sm">
                • Track daily health metrics above<br/>
                • Chat with AI Health Assistant<br/>
                • Check symptoms<br/>
                • Create diet plans<br/>
                • Set health reminders
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}