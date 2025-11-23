'use client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Heart, Activity, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HealthEntry {
  date: string;
  steps: number;
  bpm: number;
  sleep: number;
  day: string;
}

interface MoodEntry {
  mood: number;
  notes: string;
  date: string;
  day: string;
}

export default function HealthCharts() {
  const [healthData, setHealthData] = useState<HealthEntry[]>([]);
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);

  useEffect(() => {
    // Load health data from localStorage
    const savedHealthData = JSON.parse(localStorage.getItem('healthData') || '[]');
    const formattedHealthData = savedHealthData.slice(0, 7).map((entry: HealthEntry) => ({
      ...entry,
      day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })
    }));
    setHealthData(formattedHealthData.reverse()); // Show oldest first for better chart reading

    // Load mood data from localStorage
    const savedMoodData = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodData(savedMoodData.slice(0, 7).reverse());
  }, []);

  // Calculate averages
  const averages = healthData.length > 0 ? {
    steps: Math.round(healthData.reduce((sum, day) => sum + day.steps, 0) / healthData.length),
    bpm: Math.round(healthData.reduce((sum, day) => sum + day.bpm, 0) / healthData.length),
    sleep: (healthData.reduce((sum, day) => sum + day.sleep, 0) / healthData.length).toFixed(1)
  } : { steps: 0, bpm: 0, sleep: 0 };

  // Prepare mood data for pie chart
  const moodDistribution = [
    { name: 'Excellent (5)', value: moodData.filter((m) => m.mood === 5).length, color: '#10B981' },
    { name: 'Great (4)', value: moodData.filter((m) => m.mood === 4).length, color: '#3B82F6' },
    { name: 'Good (3)', value: moodData.filter((m) => m.mood === 3).length, color: '#F59E0B' },
    { name: 'Okay (2)', value: moodData.filter((m) => m.mood === 2).length, color: '#EF4444' },
    { name: 'Terrible (1)', value: moodData.filter((m) => m.mood === 1).length, color: '#DC2626' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Health Analytics</h2>
          <p className="text-gray-600">Comprehensive view of your wellness journey</p>
        </div>
      </div>

      {/* Averages - Only show if data exists */}
      {healthData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{averages.steps}</div>
            <div className="text-sm text-green-800">Avg Steps</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{averages.bpm}</div>
            <div className="text-sm text-blue-800">Avg BPM</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{averages.sleep}h</div>
            <div className="text-sm text-purple-800">Avg Sleep</div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Steps Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Daily Steps Trend
          </h3>
          {healthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="steps" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🚶‍♂️</div>
                <p>No steps data yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Heart Rate Chart */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Heart Rate Trend
          </h3>
          {healthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bpm" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">❤️</div>
                <p>No heart rate data yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Sleep Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Moon className="w-4 h-4" />
            Sleep Hours
          </h3>
          {healthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sleep" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">😴</div>
                <p>No sleep data yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Mood Distribution Pie Chart */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <h3 className="font-semibold mb-4">Mood Distribution</h3>
          {moodData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                {moodDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="truncate">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">😊</div>
                <p>No mood data yet</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {healthData.length === 0 && moodData.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">📊</div>
          <p>Start recording your daily health data to see analytics!</p>
        </div>
      )}
    </div>
  );
}