"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Calendar, X, Download, TrendingUp, Activity, Heart } from "lucide-react";
import { format, parseISO, subMonths } from "date-fns";

interface HealthRecord {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  doctor?: string;
  notes?: string;
}

interface HealthMetrics {
  bloodPressure?: string;
  heartRate?: number;
  weight?: number;
  bloodSugar?: number;
  cholesterol?: number;
}

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"records" | "analytics">("records");
  const [formData, setFormData] = useState({
    type: "appointment",
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    doctor: "",
    notes: "",
  });

  useEffect(() => {
    const savedRecords = localStorage.getItem("healthRecords");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const saveRecords = (newRecords: HealthRecord[]) => {
    localStorage.setItem("healthRecords", JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      ...formData,
    };
    const updatedRecords = [newRecord, ...records];
    saveRecords(updatedRecords);
    setFormData({
      type: "appointment",
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      doctor: "",
      notes: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      const updatedRecords = records.filter((r) => r.id !== id);
      saveRecords(updatedRecords);
    }
  };

  // Analytics functions
  const getRecordsByType = () => {
    const typeCount: Record<string, number> = {};
    records.forEach(record => {
      typeCount[record.type] = (typeCount[record.type] || 0) + 1;
    });
    return typeCount;
  };

  const getRecordsByMonth = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return format(date, "yyyy-MM");
    });

    const monthlyCount: Record<string, number> = {};
    last6Months.forEach(month => {
      monthlyCount[month] = 0;
    });

    records.forEach(record => {
      const recordMonth = format(parseISO(record.date), "yyyy-MM");
      if (last6Months.includes(recordMonth)) {
        monthlyCount[recordMonth] = (monthlyCount[recordMonth] || 0) + 1;
      }
    });

    return monthlyCount;
  };

  const extractHealthMetrics = () => {
    const metrics: Array<{ date: string; metrics: HealthMetrics }> = [];
    
    records.forEach(record => {
      const text = `${record.title} ${record.description} ${record.notes}`.toLowerCase();
      const metricsForRecord: HealthMetrics = {};

      // Extract blood pressure (e.g., "120/80")
      const bpMatch = text.match(/(\d{2,3})\/(\d{2,3})/);
      if (bpMatch) {
        metricsForRecord.bloodPressure = bpMatch[0];
      }

      // Extract heart rate (e.g., "72 bpm")
      const hrMatch = text.match(/(\d{2,3})\s*(bpm|heart rate)/);
      if (hrMatch) {
        metricsForRecord.heartRate = parseInt(hrMatch[1]);
      }

      // Extract weight (e.g., "70 kg" or "154 lbs")
      const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*(kg|lbs|pounds?)/);
      if (weightMatch) {
        metricsForRecord.weight = parseFloat(weightMatch[1]);
      }

      // Extract blood sugar
      const sugarMatch = text.match(/(blood sugar|glucose)\D*(\d+(?:\.\d+)?)/);
      if (sugarMatch) {
        metricsForRecord.bloodSugar = parseFloat(sugarMatch[2]);
      }

      // Extract cholesterol
      const cholMatch = text.match(/(cholesterol)\D*(\d+(?:\.\d+)?)/);
      if (cholMatch) {
        metricsForRecord.cholesterol = parseFloat(cholMatch[2]);
      }

      if (Object.keys(metricsForRecord).length > 0) {
        metrics.push({
          date: record.date,
          metrics: metricsForRecord
        });
      }
    });

    return metrics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const recordTypes = {
    appointment: "Appointment",
    medication: "Medication",
    lab_result: "Lab Result",
    diagnosis: "Diagnosis",
    vaccination: "Vaccination",
    other: "Other",
  };

  const typeCount = getRecordsByType();
  const monthlyCount = getRecordsByMonth();
  const healthMetrics = extractHealthMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Health Records
            </h1>
            <p className="text-gray-600">
              Securely store and manage your health records and medical history
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Record</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("records")}
              className={`flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all ${
                activeTab === "records"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Health Records
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Health Analytics
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Add New Health Record
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Record Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {Object.entries(recordTypes).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Annual Checkup, Blood Test Results"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the health record... Include measurements like blood pressure (120/80), heart rate (72 bpm), etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Healthcare Provider (optional)
                </label>
                <input
                  type="text"
                  value={formData.doctor}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor: e.target.value })
                  }
                  placeholder="e.g., Dr. Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any additional information... Include health metrics for better tracking."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Save Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "records" ? (
          records.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Health Records Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start tracking your health by adding your first record.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 inline-flex items-center space-x-2 transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Record</span>
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-200 transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-2">
                        {recordTypes[record.type as keyof typeof recordTypes]}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {record.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{format(new Date(record.date), "MMMM dd, yyyy")}</span>
                  </div>

                  <p className="text-gray-700 mb-3">{record.description}</p>

                  {record.doctor && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Provider:</strong> {record.doctor}
                    </p>
                  )}

                  {record.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-8">
            {/* Health Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{records.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Record Types</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{Object.keys(typeCount).length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Health Metrics</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{healthMetrics.length}</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Record Type Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Record Type Distribution</h3>
              <div className="space-y-4">
                {Object.entries(typeCount).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {recordTypes[type as keyof typeof recordTypes]}
                    </span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                          style={{
                            width: `${(count / records.length) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Activity</h3>
              <div className="flex items-end justify-between h-32 space-x-2">
                {Object.entries(monthlyCount).map(([month, count]) => (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg transition-all hover:opacity-80"
                      style={{
                        height: `${(count / Math.max(...Object.values(monthlyCount))) * 80}%`
                      }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">
                      {format(parseISO(month + "-01"), "MMM")}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Metrics Timeline */}
            {healthMetrics.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Health Metrics Timeline</h3>
                <div className="space-y-4">
                  {healthMetrics.map((entry, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-900">
                          {format(parseISO(entry.date), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                        {entry.metrics.bloodPressure && (
                          <div className="text-sm">
                            <span className="text-gray-600">Blood Pressure:</span>
                            <span className="ml-2 font-bold text-gray-900">
                              {entry.metrics.bloodPressure}
                            </span>
                          </div>
                        )}
                        {entry.metrics.heartRate && (
                          <div className="text-sm">
                            <span className="text-gray-600">Heart Rate:</span>
                            <span className="ml-2 font-bold text-gray-900">
                              {entry.metrics.heartRate} bpm
                            </span>
                          </div>
                        )}
                        {entry.metrics.weight && (
                          <div className="text-sm">
                            <span className="text-gray-600">Weight:</span>
                            <span className="ml-2 font-bold text-gray-900">
                              {entry.metrics.weight} kg
                            </span>
                          </div>
                        )}
                        {entry.metrics.bloodSugar && (
                          <div className="text-sm">
                            <span className="text-gray-600">Blood Sugar:</span>
                            <span className="ml-2 font-bold text-gray-900">
                              {entry.metrics.bloodSugar} mg/dL
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips for Better Tracking */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Tips for Better Health Tracking</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Include specific measurements in your records (e.g., "Blood pressure: 120/80")</li>
                <li>• Add lab results with numbers for better tracking</li>
                <li>• Record vital signs regularly for trend analysis</li>
                <li>• Use consistent formats for measurements</li>
                <li>• Add notes about how you felt during measurements</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}