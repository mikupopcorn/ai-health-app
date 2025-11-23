"use client";

import { useState, useEffect } from "react";
import { Plus, Bell, Calendar, Clock, Pill, X, Check, TrendingUp, Activity, AlertCircle } from "lucide-react";
import { format, isToday, isPast, parseISO, startOfDay, endOfDay } from "date-fns";

interface Reminder {
  id: string;
  type: "medication" | "appointment" | "health-tip" | "exercise";
  title: string;
  description: string;
  date: string;
  time: string;
  recurring: boolean;
  frequency?: "daily" | "weekly" | "monthly";
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "today" | "upcoming" | "completed">("today");
  const [formData, setFormData] = useState({
    type: "medication" as Reminder["type"],
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    recurring: false,
    frequency: "daily" as Reminder["frequency"],
    priority: "medium" as Reminder["priority"],
  });

  useEffect(() => {
    const savedReminders = localStorage.getItem("healthReminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  const saveReminders = (newReminders: Reminder[]) => {
    localStorage.setItem("healthReminders", JSON.stringify(newReminders));
    setReminders(newReminders);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: Reminder = {
      id: Date.now().toString(),
      ...formData,
      completed: false,
    };
    const updatedReminders = [newReminder, ...reminders];
    saveReminders(updatedReminders);
    setFormData({
      type: "medication",
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "09:00",
      recurring: false,
      frequency: "daily",
      priority: "medium",
    });
    setShowForm(false);
  };

  const handleToggleComplete = (id: string) => {
    const updatedReminders = reminders.map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    saveReminders(updatedReminders);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this reminder?")) {
      const updatedReminders = reminders.filter((r) => r.id !== id);
      saveReminders(updatedReminders);
    }
  };

  const getReminderIcon = (type: Reminder["type"]) => {
    switch (type) {
      case "medication":
        return <Pill className="w-5 h-5" />;
      case "appointment":
        return <Calendar className="w-5 h-5" />;
      case "health-tip":
        return <Bell className="w-5 h-5" />;
      case "exercise":
        return <Activity className="w-5 h-5" />;
    }
  };

  const getReminderColor = (type: Reminder["type"]) => {
    switch (type) {
      case "medication":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "appointment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "health-tip":
        return "bg-green-100 text-green-800 border-green-200";
      case "exercise":
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  const getPriorityColor = (priority: Reminder["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Filter reminders based on active filter
  const filteredReminders = reminders.filter((reminder) => {
    const reminderDate = parseISO(`${reminder.date}T${reminder.time}`);
    
    switch (activeFilter) {
      case "today":
        return isToday(reminderDate) && !reminder.completed;
      case "upcoming":
        return !isPast(reminderDate) && !reminder.completed && !isToday(reminderDate);
      case "completed":
        return reminder.completed;
      case "all":
      default:
        return !reminder.completed;
    }
  }).sort((a, b) => {
    const dateA = parseISO(`${a.date}T${a.time}`);
    const dateB = parseISO(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingReminders = reminders.filter((r) => !r.completed);
  const completedReminders = reminders.filter((r) => r.completed);
  const todaysReminders = reminders.filter((r) => 
    isToday(parseISO(`${r.date}T${r.time}`)) && !r.completed
  );
  const overdueReminders = reminders.filter((r) => 
    isPast(parseISO(`${r.date}T${r.time}`)) && !isToday(parseISO(`${r.date}T${r.time}`)) && !r.completed
  );

  // Analytics data
  const analytics = {
    total: reminders.length,
    completed: completedReminders.length,
    pending: upcomingReminders.length,
    today: todaysReminders.length,
    overdue: overdueReminders.length,
    completionRate: reminders.length > 0 ? (completedReminders.length / reminders.length) * 100 : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Health Reminders
            </h1>
            <p className="text-gray-600">
              Stay on track with medications, appointments, and wellness activities
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Reminder</span>
          </button>
        </div>

        {/* Analytics Cards */}
        {reminders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.total}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.completed}</p>
                </div>
                <Check className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.today}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.overdue}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-200">
          <div className="flex space-x-2">
            {[
              { key: "today", label: "Today", count: todaysReminders.length },
              { key: "upcoming", label: "Upcoming", count: upcomingReminders.length - todaysReminders.length },
              { key: "all", label: "All Pending", count: upcomingReminders.length },
              { key: "completed", label: "Completed", count: completedReminders.length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key as any)}
                className={`flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all flex items-center justify-center gap-2 ${
                  activeFilter === key
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span>{label}</span>
                {count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeFilter === key ? "bg-white/20" : "bg-gray-200"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Create New Reminder
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as Reminder["type"],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="medication">Medication</option>
                    <option value="appointment">Appointment</option>
                    <option value="exercise">Exercise</option>
                    <option value="health-tip">Health Tip</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as Reminder["priority"],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
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
                  placeholder="e.g., Take Vitamin D, Doctor Appointment, Morning Walk"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Additional details, dosage instructions, location, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) =>
                    setFormData({ ...formData, recurring: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="recurring"
                  className="text-sm font-medium text-gray-700"
                >
                  Recurring reminder
                </label>
              </div>

              {formData.recurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value as Reminder["frequency"],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Create Reminder
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

        {reminders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Reminders Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create reminders to stay on top of your health and medications.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 inline-flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Reminder</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reminders List */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredReminders.map((reminder) => {
                const reminderDate = parseISO(`${reminder.date}T${reminder.time}`);
                const isOverdue = isPast(reminderDate) && !isToday(reminderDate);

                return (
                  <div
                    key={reminder.id}
                    className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                      isOverdue ? "border-red-200" : "border-gray-200"
                    } ${reminder.completed ? "opacity-75" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div
                          className={`p-2 rounded-xl border ${getReminderColor(reminder.type)}`}
                        >
                          {getReminderIcon(reminder.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-lg font-bold text-gray-900 ${reminder.completed ? "line-through" : ""}`}>
                              {reminder.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                              {reminder.priority}
                            </span>
                          </div>
                          {reminder.description && (
                            <p className="text-gray-600 text-sm">
                              {reminder.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(reminderDate, "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{format(reminderDate, "hh:mm a")}</span>
                        </div>
                      </div>
                      {!reminder.completed && (
                        <button
                          onClick={() => handleToggleComplete(reminder.id)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center space-x-2 text-sm font-medium transition-all"
                        >
                          <Check className="w-4 h-4" />
                          <span>Complete</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {reminder.recurring && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Repeats {reminder.frequency}
                        </span>
                      )}
                      {isOverdue && !reminder.completed && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                          Overdue
                        </span>
                      )}
                      {reminder.completed && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state for filtered view */}
            {filteredReminders.length === 0 && activeFilter !== "completed" && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {activeFilter} reminders
                </h3>
                <p className="text-gray-600">
                  {activeFilter === "today" 
                    ? "You're all caught up for today! 🎉" 
                    : "No reminders match your current filter."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}