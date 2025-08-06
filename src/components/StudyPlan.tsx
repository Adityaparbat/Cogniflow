'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lightbulb, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle,
  BookOpen,
  TrendingUp,
  Star,
  Zap,
  Save,
  Download
} from 'lucide-react';

interface StudyPlanProps {
  onClose: () => void;
  user: any;
}

interface StudyPlanItem {
  id: string;
  subject: string;
  topic: string;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  day: string;
}

export default function StudyPlan({ onClose, user }: StudyPlanProps) {
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const subjects = [
    { name: 'Mathematics', icon: '📐', color: 'bg-blue-500' },
    { name: 'Science', icon: '🔬', color: 'bg-green-500' },
    { name: 'English', icon: '📚', color: 'bg-purple-500' },
    { name: 'Geography', icon: '🌍', color: 'bg-yellow-500' },
    { name: 'History', icon: '🏛️', color: 'bg-red-500' }
  ];

  const generateStudyPlan = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const plan: StudyPlanItem[] = [];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      selectedSubjects.forEach((subject, subjectIndex) => {
        const daysPerSubject = Math.ceil(selectedDays / selectedSubjects.length);
        const startDay = subjectIndex * daysPerSubject;
        
        for (let i = 0; i < daysPerSubject && startDay + i < selectedDays; i++) {
          const day = days[startDay + i];
          const topics = getTopicsForSubject(subject);
          
          topics.forEach((topic, topicIndex) => {
            plan.push({
              id: `${subject}-${day}-${topicIndex}`,
              subject,
              topic,
              duration: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
              difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
              priority: topicIndex === 0 ? 'high' : ['medium', 'low'][Math.floor(Math.random() * 2)] as any,
              completed: false,
              day
            });
          });
        }
      });
      
      setStudyPlan(plan);
      setIsGenerating(false);
    }, 2000);
  };

  const getTopicsForSubject = (subject: string): string[] => {
    const topicsMap: { [key: string]: string[] } = {
      'Mathematics': ['Algebra', 'Geometry', 'Arithmetic', 'Problem Solving', 'Number Theory'],
      'Science': ['Physics', 'Chemistry', 'Biology', 'Earth Science', 'Scientific Method'],
      'English': ['Grammar', 'Literature', 'Writing', 'Vocabulary', 'Reading Comprehension'],
      'Geography': ['World Geography', 'Physical Geography', 'Human Geography', 'Maps', 'Climate'],
      'History': ['Ancient History', 'Modern History', 'World Wars', 'Civilizations', 'Historical Figures']
    };
    
    return topicsMap[subject] || ['General Topics'];
  };

  const toggleItemComplete = (id: string) => {
    setStudyPlan(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalDuration = studyPlan.reduce((sum, item) => sum + item.duration, 0);
  const completedItems = studyPlan.filter(item => item.completed).length;
  const progressPercentage = studyPlan.length > 0 ? (completedItems / studyPlan.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Personalized Study Plan</h2>
                <p className="text-indigo-100">AI-generated study schedule tailored for you</p>
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
          {/* Configuration Section */}
          {studyPlan.length === 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configure Your Study Plan</h3>
              
              {/* Days Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Study Duration</label>
                <div className="flex space-x-4">
                  {[3, 5, 7, 10, 14].map(days => (
                    <button
                      key={days}
                      onClick={() => setSelectedDays(days)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedDays === days
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {days} days
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Subjects</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {subjects.map((subject) => (
                    <button
                      key={subject.name}
                      onClick={() => {
                        if (selectedSubjects.includes(subject.name)) {
                          setSelectedSubjects(prev => prev.filter(s => s !== subject.name));
                        } else {
                          setSelectedSubjects(prev => [...prev, subject.name]);
                        }
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedSubjects.includes(subject.name)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 ${subject.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <span className="text-lg">{subject.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateStudyPlan}
                disabled={selectedSubjects.length === 0 || isGenerating}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Study Plan...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    <span>Generate Study Plan</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Study Plan Display */}
          {studyPlan.length > 0 && (
            <div>
              {/* Progress Overview */}
              <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
                  <span className="text-sm text-gray-600">{completedItems}/{studyPlan.length} completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Study Time: {Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
              </div>

              {/* Study Plan by Day */}
              <div className="space-y-6">
                {Array.from(new Set(studyPlan.map(item => item.day))).map(day => (
                  <div key={day} className="bg-white rounded-xl border p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <h4 className="text-lg font-semibold text-gray-900">{day}</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {studyPlan
                        .filter(item => item.day === day)
                        .map(item => (
                          <div
                            key={item.id}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              item.completed
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => toggleItemComplete(item.id)}
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    item.completed
                                      ? 'bg-green-500 border-green-500'
                                      : 'border-gray-300 hover:border-green-400'
                                  }`}
                                >
                                  {item.completed && <CheckCircle className="w-3 h-3 text-white" />}
                                </button>
                                
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                      {item.subject} - {item.topic}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                                      {item.difficulty}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                      {item.priority} priority
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                    <span className="flex items-center space-x-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{item.duration} min</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setStudyPlan([])}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Generate New Plan
                </button>
                <button
                  onClick={() => {
                    // Save to localStorage
                    localStorage.setItem('studyPlan', JSON.stringify(studyPlan));
                    alert('Study plan saved!');
                  }}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Plan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 