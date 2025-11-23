'use client';
import { useState, useEffect } from 'react';
import { Activity, Heart, Moon, TrendingUp, Target, Award } from 'lucide-react';

interface HealthEntry {
  date: string;
  steps: number;
  bpm: number;
  sleep: number;
  day: string;
}

export default function DailyHealthInput() {
  const [steps, setSteps] = useState('');
  const [bpm, setBpm] = useState('');
  const [sleep, setSleep] = useState('');
  const [todayRecorded, setTodayRecorded] = useState(false);
  const [healthHistory, setHealthHistory] = useState<HealthEntry[]>([]);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const healthData = JSON.parse(localStorage.getItem('healthData') || '[]');
    setHealthHistory(healthData);
    
    const todayEntry = healthData.find((entry: HealthEntry) => entry.date === today);
    setTodayRecorded(!!todayEntry);
    
    if (todayEntry) {
      setSteps(todayEntry.steps.toString());
      setBpm(todayEntry.bpm.toString());
      setSleep(todayEntry.sleep.toString());
    }
  }, []);

  const getHealthScore = (steps: number, bpm: number, sleep: number) => {
    let score = 0;
    
    // Steps scoring (0-40 points)
    if (steps >= 10000) score += 40;
    else if (steps >= 8000) score += 30;
    else if (steps >= 6000) score += 20;
    else if (steps >= 4000) score += 10;
    
    // BPM scoring (0-30 points)
    if (bpm >= 60 && bpm <= 100) score += 30;
    else if ((bpm >= 50 && bpm < 60) || (bpm > 100 && bpm <= 110)) score += 15;
    
    // Sleep scoring (0-30 points)
    if (sleep >= 7 && sleep <= 9) score += 30;
    else if (sleep >= 6 && sleep < 7) score += 20;
    else if (sleep >= 5 && sleep < 6) score += 10;
    
    return score;
  };

  const getHealthMessage = (score: number) => {
    if (score >= 80) return { message: "Excellent health! 🎉", color: "text-green-600" };
    if (score >= 60) return { message: "Good health! 👍", color: "text-blue-600" };
    if (score >= 40) return { message: "Average health 💪", color: "text-yellow-600" };
    return { message: "Needs improvement 📈", color: "text-red-600" };
  };

  const handleSubmit = () => {
    if (steps && bpm && sleep) {
      const today = new Date();
      const healthData = JSON.parse(localStorage.getItem('healthData') || '[]');
      
      // Remove today's entry if exists
      const filteredData = healthData.filter((entry: HealthEntry) => entry.date !== today.toISOString().split('T')[0]);
      
      // Add new entry
      const newEntry: HealthEntry = {
        date: today.toISOString().split('T')[0],
        steps: parseInt(steps),
        bpm: parseInt(bpm),
        sleep: parseFloat(sleep),
        day: today.toLocaleDateString('en-US', { weekday: 'short' })
      };
      
      const updatedData = [newEntry, ...filteredData];
      localStorage.setItem('healthData', JSON.stringify(updatedData));
      setHealthHistory(updatedData);
      setTodayRecorded(true);
      
      const score = getHealthScore(newEntry.steps, newEntry.bpm, newEntry.sleep);
      const healthMsg = getHealthMessage(score);
      
      alert(`Health data saved! Your health score: ${score}/100 - ${healthMsg.message}`);
    }
  };

  // Calculate averages and trends
  const averages = healthHistory.length > 0 ? {
    steps: Math.round(healthHistory.reduce((sum, day) => sum + day.steps, 0) / healthHistory.length),
    bpm: Math.round(healthHistory.reduce((sum, day) => sum + day.bpm, 0) / healthHistory.length),
    sleep: (healthHistory.reduce((sum, day) => sum + day.sleep, 0) / healthHistory.length).toFixed(1)
  } : { steps: 0, bpm: 0, sleep: "0" };

  const last7Days = healthHistory.slice(0, 7);
  const monthlyAvg = healthHistory.slice(0, 30);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Daily Health Tracker</h2>
            <p className="text-gray-600">Track your daily health metrics and progress</p>
          </div>
        </div>
        
        {healthHistory.length > 0 && (
          <button
            onClick={() => setShowProgress(!showProgress)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            {showProgress ? 'Hide Progress' : 'Show Progress'}
          </button>
        )}
      </div>

      {!showProgress ? (
        <>
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <label className="font-semibold text-blue-800">Daily Steps</label>
              </div>
              <input
                type="number"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="e.g., 8432"
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <div className="text-xs text-blue-600 mt-2">
                🎯 Target: 8,000-10,000 steps
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-600" />
                <label className="font-semibold text-red-800">Heart Rate (BPM)</label>
              </div>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                placeholder="e.g., 72"
                className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
              />
              <div className="text-xs text-red-600 mt-2">
                💓 Normal: 60-100 BPM
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-5 h-5 text-purple-600" />
                <label className="font-semibold text-purple-800">Sleep (hours)</label>
              </div>
              <input
                type="number"
                step="0.1"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                placeholder="e.g., 7.5"
                className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
              />
              <div className="text-xs text-purple-600 mt-2">
                😴 Ideal: 7-9 hours
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!steps || !bpm || !sleep}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {todayRecorded ? '📝 Update Today\'s Data' : '💾 Save Today\'s Health Data'}
          </button>

          {todayRecorded && (
            <div className="mt-4 text-center text-green-600 font-semibold">
              ✅ Today's data recorded!
            </div>
          )}
        </>
      ) : (
        /* Progress Analysis Section */
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Health Progress Analysis</h3>
            <p className="text-gray-600">Your health journey over time</p>
          </div>

          {/* Monthly Overview */}
          {monthlyAvg.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                30-Day Health Overview
              </h4>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg shadow">
                  <div className="text-2xl font-bold text-blue-600">{averages.steps}</div>
                  <div className="text-sm text-blue-800">Avg Steps</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {averages.steps >= 8000 ? '🎉 Excellent' : averages.steps >= 6000 ? '👍 Good' : '💪 Keep going'}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow">
                  <div className="text-2xl font-bold text-red-600">{averages.bpm}</div>
                  <div className="text-sm text-red-800">Avg BPM</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {averages.bpm >= 60 && averages.bpm <= 100 ? '❤️ Normal' : '⚠️ Check with doctor'}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow">
                  <div className="text-2xl font-bold text-purple-600">{averages.sleep}h</div>
                  <div className="text-sm text-purple-800">Avg Sleep</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {parseFloat(averages.sleep) >= 7 ? '😴 Good rest' : '🌙 Need more sleep'}
                  </div>
                </div>
              </div>

              {/* Health Score */}
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <h5 className="font-semibold text-gray-800 mb-2">Overall Health Score</h5>
                {(() => {
                  const score = getHealthScore(averages.steps, averages.bpm, parseFloat(averages.sleep));
                  const healthMsg = getHealthMessage(score);
                  return (
                    <>
                      <div className="text-3xl font-bold mb-2" style={{ color: healthMsg.color.replace('text-', '#') }}>
                        {score}/100
                      </div>
                      <div className={`font-semibold ${healthMsg.color}`}>
                        {healthMsg.message}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Recent Week Data */}
          {last7Days.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold mb-3">Last 7 Days</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {last7Days.map((entry, index) => {
                  const score = getHealthScore(entry.steps, entry.bpm, entry.sleep);
                  const healthMsg = getHealthMessage(score);
                  
                  return (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-700">
                          {entry.day} • {entry.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-blue-600">{entry.steps} steps</span>
                        <span className="text-red-600">{entry.bpm} BPM</span>
                        <span className="text-purple-600">{entry.sleep}h sleep</span>
                        <span className={`font-semibold ${healthMsg.color}`}>
                          {score} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {healthHistory.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📊</div>
              <p>Start recording your daily health data to see progress analytics!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}