import Link from 'next/link';
import { MessageCircle, Stethoscope, FileText, Bell, Utensils, Heart, Home } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">HealthGuard AI</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex space-x-6">
            {/* 🆕 HOME TAB */}
            <Link 
              href="/" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/ai-chat" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>AI Chat</span>
            </Link>
            
            <Link 
              href="/symptom-checker" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Symptom Checker</span>
            </Link>
            
            <Link 
              href="/health-records" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Health Records</span>
            </Link>
            
            <Link 
              href="/diet-plan" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Utensils className="w-4 h-4" />
              <span>Diet Plan</span>
            </Link>
            
            <Link 
              href="/reminders" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Reminders</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}