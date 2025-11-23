"use client";

import { useState } from "react";
import { 
  Utensils, 
  Scale, 
  Ruler, 
  Heart, 
  Activity, 
  Calendar,
  TrendingUp,
  Apple,
  Carrot,
  Fish,
  Egg,
  Milk,
  ChevronRight,
  Download,
  Share2
} from "lucide-react";

interface Symptom {
  description: string;
  duration: string;
  severity: string;
  chronic: boolean;
}

interface DietPlanData {
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
  goals: string[];
  healthConditions: string[];
  dietaryRestrictions: string[];
  foodPreferences: string[];
  symptoms: Symptom[];
}

interface MealPlan {
  time: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  icon: JSX.Element;
  foods: string[];
}

interface DailyPlan {
  day: string;
  totalCalories: number;
  meals: MealPlan[];
}

export default function DietPlanPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DietPlanData>({
    weight: "",
    height: "",
    age: "",
    gender: "",
    activityLevel: "",
    goals: [],
    healthConditions: [],
    dietaryRestrictions: [],
    foodPreferences: [],
    symptoms: []
  });
  const [dietPlan, setDietPlan] = useState<DailyPlan[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const goalsOptions = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Building",
    "Maintenance",
    "Improved Energy",
    "Better Digestion",
    "Heart Health",
    "Diabetes Management"
  ];

  const healthConditionsOptions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "PCOS",
    "Thyroid Issues",
    "IBS",
    "Food Allergies",
    "High Cholesterol",
    "Arthritis",
    "Osteoporosis"
  ];

  const dietaryRestrictionsOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Low-Carb",
    "Low-Sodium",
    "Keto",
    "Paleo",
    "Mediterranean"
  ];

  const foodPreferencesOptions = [
    "High Protein",
    "Low Fat",
    "High Fiber",
    "Low Sugar",
    "Organic",
    "Local Produce",
    "Seasonal Foods",
    "Comfort Foods"
  ];

  const activityLevels = [
    { value: "sedentary", label: "Sedentary (little to no exercise)" },
    { value: "light", label: "Light (light exercise 1-3 days/week)" },
    { value: "moderate", label: "Moderate (moderate exercise 3-5 days/week)" },
    { value: "active", label: "Active (hard exercise 6-7 days/week)" },
    { value: "very-active", label: "Very Active (physical job + exercise)" }
  ];

  const handleInputChange = (field: keyof DietPlanData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'goals' | 'healthConditions' | 'dietaryRestrictions' | 'foodPreferences', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const addSymptom = () => {
    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, { description: "", duration: "", severity: "Mild", chronic: false }]
    }));
  };

  const updateSymptom = (index: number, field: keyof Symptom, value: any) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.map((symptom, i) => 
        i === index ? { ...symptom, [field]: value } : symptom
      )
    }));
  };

  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100; // convert cm to meters
    if (weight && height) {
      return (weight / (height * height)).toFixed(1);
    }
    return null;
  };

  const calculateDailyCalories = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);
    
    if (!weight || !height || !age) return null;

    // Mifflin-St Jeor Equation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (formData.gender === "Male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      "very-active": 1.9
    };

    const multiplier = activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers] || 1.2;
    return Math.round(bmr * multiplier);
  };

  const generateDietPlan = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const bmi = calculateBMI();
      const dailyCalories = calculateDailyCalories();
      const adjustedCalories = adjustCaloriesBasedOnGoals(dailyCalories);
      
      const plan = generateWeeklyPlan(adjustedCalories);
      setDietPlan(plan);
      setIsGenerating(false);
      setCurrentStep(4);
    }, 3000);
  };

  const adjustCaloriesBasedOnGoals = (baseCalories: number | null) => {
    if (!baseCalories) return 2000;
    
    let adjustment = 0;
    if (formData.goals.includes("Weight Loss")) adjustment = -500;
    if (formData.goals.includes("Weight Gain")) adjustment = 500;
    if (formData.goals.includes("Muscle Building")) adjustment = 300;
    
    return Math.max(1200, baseCalories + adjustment);
  };

  const generateWeeklyPlan = (dailyCalories: number): DailyPlan[] => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    return days.map(day => ({
      day,
      totalCalories: dailyCalories,
      meals: generateDailyMeals(dailyCalories)
    }));
  };

  const generateDailyMeals = (dailyCalories: number): MealPlan[] => {
    const mealDistribution = [
      { time: "7:00 AM", name: "Breakfast", percentage: 0.25, icon: <Egg className="w-5 h-5 text-blue-500" /> },
      { time: "10:30 AM", name: "Morning Snack", percentage: 0.1, icon: <Apple className="w-5 h-5 text-green-500" /> },
      { time: "1:00 PM", name: "Lunch", percentage: 0.35, icon: <Carrot className="w-5 h-5 text-orange-500" /> },
      { time: "4:00 PM", name: "Afternoon Snack", percentage: 0.1, icon: <Milk className="w-5 h-5 text-purple-500" /> },
      { time: "7:00 PM", name: "Dinner", percentage: 0.2, icon: <Fish className="w-5 h-5 text-blue-600" /> }
    ];

    return mealDistribution.map(meal => {
      const mealCalories = Math.round(dailyCalories * meal.percentage);
      return {
        time: meal.time,
        name: meal.name,
        description: getMealDescription(meal.name),
        calories: mealCalories,
        protein: Math.round(mealCalories * 0.3 / 4), // 30% protein
        carbs: Math.round(mealCalories * 0.4 / 4),  // 40% carbs
        fat: Math.round(mealCalories * 0.3 / 9),    // 30% fat
        icon: meal.icon,
        foods: generateFoods(meal.name, mealCalories)
      };
    });
  };

  const getMealDescription = (mealName: string): string => {
    const descriptions = {
      "Breakfast": "Energizing start with balanced macros",
      "Morning Snack": "Light refreshment to maintain energy",
      "Lunch": "Nutrient-dense midday meal",
      "Afternoon Snack": "Protein-rich snack for sustained energy",
      "Dinner": "Light, easily digestible evening meal"
    };
    return descriptions[mealName as keyof typeof descriptions] || "Balanced meal";
  };

  const generateFoods = (mealName: string, calories: number): string[] => {
    const foodOptions: { [key: string]: string[][] } = {
      "Breakfast": [
        ["Oatmeal with berries", "Greek yogurt", "Whole grain toast"],
        ["Scrambled eggs", "Avocado", "Whole wheat bread"],
        ["Smoothie bowl", "Chia seeds", "Mixed nuts"]
      ],
      "Lunch": [
        ["Grilled chicken salad", "Quinoa", "Steamed vegetables"],
        ["Salmon fillet", "Brown rice", "Roasted broccoli"],
        ["Lentil soup", "Whole grain roll", "Mixed greens"]
      ],
      "Dinner": [
        ["Baked fish", "Sweet potato", "Green beans"],
        ["Turkey meatballs", "Zucchini noodles", "Marinara sauce"],
        ["Stir-fried tofu", "Brown rice", "Mixed vegetables"]
      ]
    };

    const options = foodOptions[mealName] || [["Mixed nuts", "Fruit", "Yogurt"]];
    return options[Math.floor(Math.random() * options.length)];
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Scale className="w-4 h-4 inline mr-2 text-blue-500" />
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your weight"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Ruler className="w-4 h-4 inline mr-2 text-blue-500" />
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your height"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2 text-blue-500" />
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your age"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Heart className="w-4 h-4 inline mr-2 text-blue-500" />
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Activity className="w-4 h-4 inline mr-2 text-blue-500" />
              Activity Level
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => handleInputChange("activityLevel", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select activity level</option>
              {activityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {formData.weight && formData.height && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Your BMI</h4>
              <p className="text-2xl font-bold text-blue-600">{calculateBMI()}</p>
              <p className="text-sm text-blue-600 mt-1">Healthy range: 18.5 - 24.9</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Goals & Conditions</h2>
        <p className="text-gray-600">Tell us about your health objectives and conditions</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Health Goals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalsOptions.map(goal => (
              <button
                key={goal}
                onClick={() => handleArrayToggle("goals", goal)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  formData.goals.includes(goal)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Health Conditions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {healthConditionsOptions.map(condition => (
              <button
                key={condition}
                onClick={() => handleArrayToggle("healthConditions", condition)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  formData.healthConditions.includes(condition)
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Dietary Restrictions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dietaryRestrictionsOptions.map(restriction => (
              <button
                key={restriction}
                onClick={() => handleArrayToggle("dietaryRestrictions", restriction)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  formData.dietaryRestrictions.includes(restriction)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                }`}
              >
                {restriction}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Food Preferences</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {foodPreferencesOptions.map(preference => (
              <button
                key={preference}
                onClick={() => handleArrayToggle("foodPreferences", preference)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  formData.foodPreferences.includes(preference)
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                }`}
              >
                {preference}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Symptoms & Concerns</h2>
        <p className="text-gray-600">Describe any symptoms or health concerns</p>
      </div>

      <div className="space-y-4">
        {formData.symptoms.map((symptom, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-800">Symptom #{index + 1}</h4>
              <button
                onClick={() => removeSymptom(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={symptom.description}
                  onChange={(e) => updateSymptom(index, "description", e.target.value)}
                  placeholder="Describe your symptom"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select
                  value={symptom.duration}
                  onChange={(e) => updateSymptom(index, "duration", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select duration</option>
                  <option value="Less than 1 week">Less than 1 week</option>
                  <option value="1-4 weeks">1-4 weeks</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="Over 6 months">Over 6 months</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select
                  value={symptom.severity}
                  onChange={(e) => updateSymptom(index, "severity", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={symptom.chronic}
                  onChange={(e) => updateSymptom(index, "chronic", e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Chronic condition</label>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addSymptom}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-all"
        >
          + Add Another Symptom
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Personalized Diet Plan</h2>
        <p className="text-gray-600">Customized based on your health profile and goals</p>
      </div>

      {dietPlan && (
        <div className="space-y-6">
          {/* Weekly Overview */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-2">Weekly Nutrition Summary</h3>
                <p className="text-blue-100">Daily Target: {dietPlan[0].totalCalories} calories</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{calculateBMI() || "N/A"} BMI</p>
                <p className="text-blue-100">Healthy Range: 18.5 - 24.9</p>
              </div>
            </div>
          </div>

          {/* Daily Plans */}
          <div className="space-y-4">
            {dietPlan.map((dayPlan, dayIndex) => (
              <div key={dayIndex} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">{dayPlan.day}</h3>
                  <p className="text-gray-600">Total: {dayPlan.totalCalories} calories</p>
                </div>
                
                <div className="p-4 space-y-4">
                  {dayPlan.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
                        {meal.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{meal.time} - {meal.name}</h4>
                            <p className="text-sm text-gray-600">{meal.description}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                            {meal.calories} cal
                          </span>
                        </div>
                        
                        {/* Nutrition Breakdown */}
                        <div className="flex gap-4 mb-3">
                          <span className="text-sm text-blue-600">Protein: {meal.protein}g</span>
                          <span className="text-sm text-purple-600">Carbs: {meal.carbs}g</span>
                          <span className="text-sm text-green-600">Fat: {meal.fat}g</span>
                        </div>
                        
                        {/* Food Items */}
                        <div className="flex flex-wrap gap-2">
                          {meal.foods.map((food, foodIndex) => (
                            <span
                              key={foodIndex}
                              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                            >
                              {food}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
              <Download className="w-4 h-4" />
              Download Plan
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
              <Share2 className="w-4 h-4" />
              Share Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.weight && formData.height && formData.age && formData.gender && formData.activityLevel;
      case 2:
        return formData.goals.length > 0;
      case 3:
        return true; // Symptoms are optional
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-blue-200 mb-6">
            <Utensils className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Personalized Nutrition</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Diet Plan Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get a customized diet plan based on your health profile, goals, and dietary preferences
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-20 h-1 mx-2 ${
                    currentStep > step ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-4 text-sm text-center">
            <div className={`font-medium ${currentStep >= 1 ? "text-blue-600" : "text-gray-500"}`}>
              Basic Info
            </div>
            <div className={`font-medium ${currentStep >= 2 ? "text-blue-600" : "text-gray-500"}`}>
              Health Profile
            </div>
            <div className={`font-medium ${currentStep >= 3 ? "text-blue-600" : "text-gray-500"}`}>
              Symptoms
            </div>
            <div className={`font-medium ${currentStep >= 4 ? "text-blue-600" : "text-gray-500"}`}>
              Diet Plan
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all"
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!isStepValid()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={generateDietPlan}
                disabled={!isStepValid() || isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Generate Diet Plan
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}