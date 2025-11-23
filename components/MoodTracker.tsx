'use client';
import { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Laugh, Heart, Calendar, BarChart3, Brain, TrendingUp } from 'lucide-react';

const moodOptions = [
  { icon: Frown, value: 1, label: 'Terrible', color: 'text-red-400', bgColor: 'bg-red-100', description: 'Feeling very low' },
  { icon: Meh, value: 2, label: 'Okay', color: 'text-yellow-400', bgColor: 'bg-yellow-100', description: 'Could be better' },
  { icon: Smile, value: 3, label: 'Good', color: 'text-green-400', bgColor: 'bg-green-100', description: 'Feeling decent' },
  { icon: Laugh, value: 4, label: 'Great', color: 'text-blue-400', bgColor: 'bg-blue-100', description: 'Very positive' },
  { icon: Heart, value: 5, label: 'Excellent', color: 'text-pink-400', bgColor: 'bg-pink-100', description: 'Amazing mood' },
];

interface MoodEntry {
  mood: number;
  notes: string;
  date: string;
  day: string;
}

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    const savedMoods = localStorage.getItem('moodHistory');
    if (savedMoods) {
      try {
        setMoodHistory(JSON.parse(savedMoods));
      } catch (error) {
        console.error('Error loading mood history:', error);
        setMoodHistory([]);
      }
    }
  }, []);

  const handleMoodSubmit = () => {
    if (selectedMood) {
      const today = new Date();
      const moodEntry: MoodEntry = {
        mood: selectedMood,
        notes,
        date: today.toISOString().split('T')[0],
        day: today.toLocaleDateString('en-US', { weekday: 'short' })
      };
      
      const newHistory = [moodEntry, ...moodHistory.slice(0, 29)];
      setMoodHistory(newHistory);
      localStorage.setItem('moodHistory', JSON.stringify(newHistory));
      
      setSelectedMood(null);
      setNotes('');
      alert('Mood recorded! 📝 Your mental health is important.');
    }
  };

  // Calculate comprehensive statistics
  const averageMood = moodHistory.length > 0 
    ? (moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length).toFixed(1)
    : '0';

  const getMentalHealthInsight = () => {
    const avg = parseFloat(averageMood);
    const totalDays = moodHistory.length;
    const goodDays = moodHistory.filter(entry => entry.mood >= 4).length;
    const badDays = moodHistory.filter(entry => entry.mood <= 2).length;
    
    if (avg >= 4.0 && goodDays >= totalDays * 0.7) {
      return {
        level: "Excellent",
        message: "Your mental health is thriving! You maintain consistently positive moods.",
        color: "text-green-600",
        bgColor: "bg-green-50",
        emoji: "🌟",
        recommendation: "Keep up your positive routines and consider sharing what works for you!"
      };
    } else if (avg >= 3.5 && goodDays >= totalDays * 0.5) {
      return {
        level: "Good",
        message: "You're maintaining good mental health with mostly positive days.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        emoji: "😊",
        recommendation: "Continue your self-care practices and monitor for any changes."
      };
    } else if (avg >= 2.5) {
      return {
        level: "Stable",
        message: "Your mood is generally stable with some fluctuations.",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        emoji: "💪",
        recommendation: "Practice mindfulness and consider talking about your feelings."
      };
    } else if (badDays >= totalDays * 0.4) {
      return {
        level: "Concerning",
        message: "You're experiencing frequent low moods. Your mental health needs attention.",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        emoji: "🤗",
        recommendation: "Consider speaking with a mental health professional for support."
      };
    } else {
      return {
        level: "Needs Support",
        message: "You seem to be struggling. It's important to seek help.",
        color: "text-red-600",
        bgColor: "bg-red-50",
        emoji: "❤️",
        recommendation: "Please reach out to a mental health professional or support line."
      };
    }
  };

  const getMoodDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    moodHistory.forEach(entry => {
      distribution[entry.mood as keyof typeof distribution]++;
    });
    return distribution;
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return "Not enough data";
    
    const recentAvg = moodHistory.slice(0, 7).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(7, moodHistory.length);
    const olderAvg = moodHistory.slice(7, 14).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(7, moodHistory.length - 7);
    
    if (recentAvg > olderAvg + 0.5) return { trend: "Improving", emoji: "📈", color: "text-green-600" };
    if (recentAvg < olderAvg - 0.5) return { trend: "Declining", emoji: "📉", color: "text-red-600" };
    return { trend: "Stable", emoji: "➡️", color: "text-blue-600" };
  };

  const last7Days = moodHistory.slice(0, 7);
  const mentalHealthInsight = getMentalHealthInsight();
  const moodDistribution = getMoodDistribution();
  const moodTrend = getMoodTrend();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mental Health Tracker</h2>
            <p className="text-gray-600">Track your mood and mental wellness journey</p>
          </div>
        </div>
        
        {moodHistory.length > 0 && (
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
          </button>
        )}
      </div>

      {!showAnalysis ? (
        <>
          {/* Mood Selection */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {moodOptions.map(({ icon: Icon, value, label, color, bgColor, description }) => (
              <button
                key={value}
                onClick={() => setSelectedMood(value)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all border-2 ${
                  selectedMood === value 
                    ? 'bg-white shadow-lg scale-105 border-blue-300' 
                    : `${bgColor} hover:bg-white hover:shadow-md border-transparent`
                }`}
              >
                <Icon className={`w-8 h-8 ${color} mb-2`} />
                <span className="text-sm font-medium text-gray-700 mb-1">{label}</span>
                <span className="text-xs text-gray-500 text-center">{description}</span>
              </button>
            ))}
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💭 What's influencing your mood today?
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your feelings, thoughts, or anything affecting your mood... (e.g., 'Good sleep, productive day' or 'Feeling stressed about work')"
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50/50"
              rows={3}
            />
          </div>

          <button
            onClick={handleMoodSubmit}
            disabled={!selectedMood}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            💾 Save Today's Mood
          </button>

          {/* Recent Moods */}
          {last7Days.length > 0 && (
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Moods (Last 7 Days)
              </h3>
              <div className="space-y-2">
                {last7Days.map((entry, index) => {
                  const moodOption = moodOptions.find(m => m.value === entry.mood);
                  const MoodIcon = moodOption?.icon || Smile;
                  
                  return (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${moodOption?.bgColor}`}>
                          <MoodIcon className={`w-4 h-4 ${moodOption?.color}`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700">
                            {entry.day} • {moodOption?.label}
                          </div>
                          {entry.notes && (
                            <div className="text-xs text-gray-500 mt-1">{entry.notes}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{entry.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Mental Health Analysis Section */
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Mental Health Analysis</h3>
            <p className="text-gray-600">Comprehensive insights into your emotional wellbeing</p>
          </div>

          {/* Mental Health Assessment */}
          <div className={`${mentalHealthInsight.bgColor} p-6 rounded-2xl border-2 border-gray-200`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{mentalHealthInsight.emoji}</div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Mental Health Status</h4>
                <p className={`text-lg font-semibold ${mentalHealthInsight.color}`}>
                  {mentalHealthInsight.level}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{mentalHealthInsight.message}</p>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Recommendation:</strong> {mentalHealthInsight.recommendation}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{averageMood}</div>
              <div className="text-sm text-blue-800">Average Mood</div>
              <div className="text-xs text-gray-500 mt-1">Out of 5</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
              <div className="text-2xl font-bold text-green-600">{moodHistory.length}</div>
              <div className="text-sm text-green-800">Days Tracked</div>
              <div className="text-xs text-gray-500 mt-1">Consistency</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {moodHistory.filter(entry => entry.mood >= 4).length}
              </div>
              <div className="text-sm text-purple-800">Good Days</div>
              <div className="text-xs text-gray-500 mt-1">Mood ≥ 4</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {typeof moodTrend === 'object' ? moodTrend.trend : moodTrend}
              </div>
              <div className="text-sm text-orange-800">Trend</div>
              <div className="text-xs text-gray-500 mt-1">
                {typeof moodTrend === 'object' && moodTrend.emoji}
              </div>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Mood Distribution (Last 30 Days)
            </h4>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(value => {
                const mood = moodOptions.find(m => m.value === value);
                const count = moodDistribution[value as keyof typeof moodDistribution];
                const percentage = moodHistory.length > 0 ? (count / moodHistory.length) * 100 : 0;
                
                return (
                  <div key={value} className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${mood?.bgColor} w-10 h-10 flex items-center justify-center`}>
                      {mood && <mood.icon className={`w-5 h-5 ${mood.color}`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{mood?.label}</span>
                        <span className="text-gray-600">{count} days ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${mood?.bgColor}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full History */}
          <div>
            <h4 className="font-semibold mb-3">30-Day Mood History</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {moodHistory.map((entry, index) => {
                const moodOption = moodOptions.find(m => m.value === entry.mood);
                const MoodIcon = moodOption?.icon || Smile;
                
                return (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${moodOption?.bgColor}`}>
                        <MoodIcon className={`w-4 h-4 ${moodOption?.color}`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          {entry.day} • {moodOption?.label}
                        </div>
                        {entry.notes && (
                          <div className="text-xs text-gray-500">{entry.notes}</div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{entry.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}