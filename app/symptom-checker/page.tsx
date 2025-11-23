"use client";

import { useState } from "react";
import { Stethoscope, AlertCircle, Heart, Brain, Activity, User, Calendar, TrendingUp, ArrowRight } from "lucide-react";

interface AnalysisResult {
  title: string;
  severityLevel: string;
  icon: string;
  color: string;
  overview: string;
  possibleConditions: string[];
  recommendations: string[];
  warningSigns: string[];
  whenToSeeDoctor: string;
  riskFactors: string[];
  monitoringTips: string[];
}

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!symptoms.trim()) {
      setResult({
        title: "Error",
        severityLevel: "Low",
        icon: "❌",
        color: "blue",
        overview: "Please describe your symptoms to get analysis.",
        possibleConditions: [],
        recommendations: ["Please enter your symptoms to receive analysis"],
        warningSigns: [],
        whenToSeeDoctor: "",
        riskFactors: [],
        monitoringTips: []
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay for better UX
    setTimeout(() => {
      const analysis = generateAnalysis(symptoms, duration, severity, age, gender);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateAnalysis = (symptoms: string, duration: string, severity: string, age: string, gender: string): AnalysisResult => {
    const symptomLower = symptoms.toLowerCase();
    const ageNum = parseInt(age) || 0;
    const isChild = ageNum < 18;
    const isAdult = ageNum >= 18 && ageNum < 65;
    const isSenior = ageNum >= 65;

    let analysis: AnalysisResult = {
      title: "General Symptom Analysis",
      severityLevel: "Moderate",
      icon: "📊",
      color: "blue",
      overview: "Based on your described symptoms, here's our assessment.",
      possibleConditions: ["Various possible conditions based on symptoms"],
      recommendations: [
        "Rest and hydrate adequately",
        "Monitor symptoms for changes",
        "Avoid self-medication without professional advice"
      ],
      warningSigns: [],
      whenToSeeDoctor: "Consult a healthcare provider if symptoms persist or worsen",
      riskFactors: [],
      monitoringTips: ["Keep track of symptom patterns", "Note any triggers or relieving factors"]
    };

    // Symptom pattern matching
    if (symptomLower.includes("headache")) {
      analysis = {
        ...analysis,
        title: "Headache Analysis",
        severityLevel: severity === "Severe" ? "High" : "Moderate",
        icon: "🧠",
        color: "purple",
        overview: "Headaches can range from mild tension headaches to more serious conditions.",
        possibleConditions: ["Tension Headache", "Migraine", "Sinus Headache", "Cluster Headache"],
        recommendations: [
          "Rest in a quiet, dark room",
          "Stay hydrated",
          "Consider over-the-counter pain relief if appropriate",
          "Apply cold or warm compress to forehead"
        ]
      };
      
      if (symptomLower.includes("fever") || symptomLower.includes("stiff neck")) {
        analysis.warningSigns.push("Sudden severe headache with fever/stiff neck (possible meningitis)");
        analysis.severityLevel = "High";
        analysis.whenToSeeDoctor = "Seek immediate medical attention for sudden severe headache with fever or neck stiffness";
      }
    } 
    else if (symptomLower.includes("fever") && symptomLower.includes("cough")) {
      analysis = {
        ...analysis,
        title: "Respiratory Symptoms Analysis",
        severityLevel: duration === "Over 1 week" ? "Moderate" : "Low",
        icon: "🌡️",
        color: "orange",
        overview: "Respiratory symptoms with fever could indicate various conditions.",
        possibleConditions: ["Common Cold", "Influenza (Flu)", "COVID-19", "Bronchitis"],
        recommendations: [
          "Get plenty of rest",
          "Stay hydrated with warm fluids",
          "Use a humidifier",
          "Consider over-the-counter fever reducers if needed"
        ]
      };
    }
    else if (symptomLower.includes("chest pain")) {
      analysis = {
        ...analysis,
        title: "Chest Pain Evaluation",
        severityLevel: "High",
        icon: "💓",
        color: "red",
        overview: "Chest pain requires immediate medical attention to rule out serious conditions.",
        possibleConditions: ["Heart-related issues", "Muscle strain", "Acid reflux", "Anxiety"],
        recommendations: [
          "Seek immediate medical attention",
          "Do not ignore chest pain",
          "Avoid physical exertion"
        ],
        whenToSeeDoctor: "EMERGENCY - Seek immediate medical care for chest pain"
      };
    }

    // Age-specific recommendations
    if (isChild) {
      analysis.recommendations.push("Monitor temperature regularly");
      analysis.recommendations.push("Ensure proper hydration with water or electrolyte solutions");
      analysis.recommendations.push("Consult pediatrician for persistent symptoms");
    } else if (isSenior) {
      analysis.recommendations.push("Monitor vital signs closely");
      analysis.recommendations.push("Be aware of medication interactions");
      analysis.recommendations.push("Consider lower immune response in older adults");
    }

    // Gender-specific considerations
    if (gender === "Female" && ageNum > 12 && ageNum < 50) {
      analysis.recommendations.push("Consider hormonal influences on symptoms");
    }

    // Duration-based insights
    if (duration === "Over 2 weeks") {
      analysis.whenToSeeDoctor = "Immediate consultation recommended for persistent symptoms";
      analysis.severityLevel = "Moderate-High";
    } else if (duration === "Less than 24 hours") {
      analysis.whenToSeeDoctor = "Monitor for 24-48 hours, seek care if symptoms worsen";
    }

    // Risk factors based on age and symptoms
    if (isSenior && symptomLower.includes("fever")) {
      analysis.riskFactors.push("Higher risk of complications in older adults");
    }

    return analysis;
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Moderate-High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "red": return "from-red-500 to-pink-600";
      case "orange": return "from-orange-500 to-red-500";
      case "purple": return "from-purple-500 to-indigo-600";
      case "blue": 
      default: return "from-blue-500 to-purple-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-blue-200 mb-6">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">AI-Powered Symptom Assessment</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Symptom Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized symptom analysis based on your age, gender, and symptom details. Remember to consult healthcare professionals for medical advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Describe Your Symptoms</h2>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What symptoms are you experiencing? *
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms in detail (e.g., headache, fever, cough, location of pain, timing, triggers, etc.)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Duration & Severity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Activity className="w-4 h-4 inline mr-1" />
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select duration</option>
                    <option value="Less than 24 hours">Less than 24 hours</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value="4-7 days">4-7 days</option>
                    <option value="Over 1 week">Over 1 week</option>
                    <option value="Over 2 weeks">Over 2 weeks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select severity</option>
                    <option value="Mild">Mild - Doesn't interfere with daily activities</option>
                    <option value="Moderate">Moderate - Some interference with activities</option>
                    <option value="Severe">Severe - Unable to perform daily activities</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!symptoms.trim() || isAnalyzing}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                  isAnalyzing ? 'animate-pulse' : ''
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-5 h-5" />
                    Analyze Symptoms
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>
            
            {result ? (
              <div className="space-y-6">
                {/* Analysis Header */}
                <div className={`bg-gradient-to-r ${getColorClasses(result.color)} text-white rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{result.icon}</span>
                    <h3 className="text-xl font-bold">{result.title}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-50">{result.overview}</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm ${getSeverityColor(result.severityLevel)}`}>
                      {result.severityLevel} Severity
                    </span>
                  </div>
                </div>

                {/* Possible Conditions */}
                {result.possibleConditions.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Possible Conditions to Consider
                    </h4>
                    <div className="grid gap-2">
                      {result.possibleConditions.map((condition: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <ArrowRight className="w-3 h-3 text-blue-500" />
                          {condition}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Recommended Actions
                    </h4>
                    <div className="grid gap-2">
                      {result.recommendations.map((recommendation: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {recommendation}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warning Signs */}
                {result.warningSigns.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Warning Signs to Watch For
                    </h4>
                    <div className="grid gap-2">
                      {result.warningSigns.map((warning: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          {warning}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* When to See Doctor */}
                {result.whenToSeeDoctor && (
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2">🩺 When to See a Doctor</h4>
                    <p className="text-yellow-700">{result.whenToSeeDoctor}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">Provide your symptoms for analysis</p>
                <p className="text-sm">Include age and gender for personalized insights</p>
              </div>
            )}

            {/* Emergency Warning */}
            <div className="mt-6 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                <strong>Emergency Warning</strong>
              </div>
              <p className="text-red-50 text-sm">
                If you're experiencing chest pain, difficulty breathing, severe bleeding, sudden weakness, or thoughts of harming yourself, call emergency services immediately.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                💡 This tool provides general guidance only and is not a substitute for professional medical advice. Always consult healthcare providers for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}