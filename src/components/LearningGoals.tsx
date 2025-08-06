'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Target, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle,
  Calendar,
  TrendingUp,
  Star,
  Save,
  Award
} from 'lucide-react';

interface LearningGoalsProps {
  onClose: () => void;
  user: any;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  subject: string;
  targetDate: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'daily' | 'weekly' | 'monthly' | 'custom';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
}

export default function LearningGoals({ onClose, user }: LearningGoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    subject: '',
    targetDate: '',
    targetValue: 1,
    unit: '',
    category: 'daily' as const,
    priority: 'medium' as const
  });

  const subjects = [
    { name: 'Mathematics', icon: '📐', color: 'bg-blue-500' },
    { name: 'Science', icon: '🔬', color: 'bg-green-500' },
    { name: 'English', icon: '📚', color: 'bg-purple-500' },
    { name: 'Geography', icon: '🌍', color: 'bg-yellow-500' },
    { name: 'History', icon: '🏛️', color: 'bg-red-500' },
    { name: 'General', icon: '🌟', color: 'bg-indigo-500' }
  ];

  const units = [
    { value: 'questions', label: 'Questions' },
    { value: 'minutes', label: 'Minutes' },
    { value: 'chapters', label: 'Chapters' },
    { value: 'topics', label: 'Topics' },
    { value: 'quizzes', label: 'Quizzes' },
    { value: 'flashcards', label: 'Flashcards' },
    { value: 'games', label: 'Games' },
    { value: 'xp', label: 'XP Points' }
  ];

  useEffect(() => {
    // Load saved goals from localStorage
    const savedGoals = localStorage.getItem('learningGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    localStorage.setItem('learningGoals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.subject || !newGoal.targetDate) {
      alert('Please fill in all required fields');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      currentValue: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);
    
    // Reset form
    setNewGoal({
      title: '',
      description: '',
      subject: '',
      targetDate: '',
      targetValue: 1,
      unit: '',
      category: 'daily',
      priority: 'medium'
    });
    setShowAddGoal(false);
  };

  const updateGoal = () => {
    if (!editingGoal) return;

    const updatedGoals = goals.map(goal => 
      goal.id === editingGoal.id ? editingGoal : goal
    );
    saveGoals(updatedGoals);
    setEditingGoal(null);
  };

  const deleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(goal => goal.id !== id);
      saveGoals(updatedGoals);
    }
  };

  const updateProgress = (id: string, newValue: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        const updatedGoal = { ...goal, currentValue: newValue };
        updatedGoal.completed = newValue >= goal.targetValue;
        return updatedGoal;
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'text-blue-600 bg-blue-100';
      case 'weekly': return 'text-purple-600 bg-purple-100';
      case 'monthly': return 'text-green-600 bg-green-100';
      case 'custom': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Learning Goals</h2>
                <p className="text-green-100">Set and track your learning objectives</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Overview Stats */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Goals</p>
                  <p className="text-2xl font-bold text-blue-900">{totalGoals}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{completedGoals}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{Math.round(completionRate)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Add Goal Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddGoal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Goal</span>
            </button>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
                <p className="text-gray-600">Create your first learning goal to get started!</p>
              </div>
            ) : (
              goals.map(goal => (
                <div
                  key={goal.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    goal.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`text-lg font-semibold ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {goal.title}
                        </h3>
                        {goal.completed && <Award className="w-5 h-5 text-green-600" />}
                      </div>
                      
                      {goal.description && (
                        <p className="text-gray-600 mb-3">{goal.description}</p>
                      )}

                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm text-gray-600">Subject: {goal.subject}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                          {goal.priority} priority
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                          {goal.category}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress: {goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                          <span>{Math.round(getProgressPercentage(goal))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              goal.completed ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${getProgressPercentage(goal)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Progress Controls */}
                      {!goal.completed && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateProgress(goal.id, Math.max(0, goal.currentValue - 1))}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm text-gray-600">{goal.currentValue}</span>
                          <button
                            onClick={() => updateProgress(goal.id, goal.currentValue + 1)}
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Goal Modal */}
        <AnimatePresence>
          {showAddGoal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Goal</h3>
                  <button
                    onClick={() => setShowAddGoal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Complete 50 math questions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optional description..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select
                      value={newGoal.subject}
                      onChange={(e) => setNewGoal({ ...newGoal, subject: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject.name} value={subject.name}>{subject.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Value *</label>
                      <input
                        type="number"
                        value={newGoal.targetValue}
                        onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) || 1 })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                      <select
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Unit</option>
                        {units.map(unit => (
                          <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={newGoal.priority}
                        onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Date *</label>
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowAddGoal(false)}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addGoal}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add Goal
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Goal Modal */}
        <AnimatePresence>
          {editingGoal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Goal</h3>
                  <button
                    onClick={() => setEditingGoal(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                    <input
                      type="text"
                      value={editingGoal.title}
                      onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingGoal.description}
                      onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                    <input
                      type="number"
                      value={editingGoal.targetValue}
                      onChange={(e) => setEditingGoal({ ...editingGoal, targetValue: parseInt(e.target.value) || 1 })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setEditingGoal(null)}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateGoal}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Update Goal
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 