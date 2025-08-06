'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle,
  Star,
  Award,
  Flame,
  Zap
} from 'lucide-react';

interface StreakTrackerProps {
  onClose: () => void;
  user: any;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastCheckin: string;
  streakHistory: number[];
  milestones: number[];
}

export default function StreakTracker({ onClose, user }: StreakTrackerProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    lastCheckin: '',
    streakHistory: [],
    milestones: []
  });

  useEffect(() => {
    loadStreakData();
  }, [user]);

  const loadStreakData = () => {
    const currentStreak = user?.stats?.streak || user?.streak || 0;
    const lastCheckin = localStorage.getItem(`streak_${user.id}`) || '';
    const longestStreak = parseInt(localStorage.getItem(`longest_streak_${user.id}`) || '0');
    const totalDays = parseInt(localStorage.getItem(`total_days_${user.id}`) || '0');
    
    // Generate streak history (last 30 days)
    const streakHistory = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const wasActive = localStorage.getItem(`streak_${user.id}_${dateStr}`) !== null;
      streakHistory.push(wasActive ? 1 : 0);
    }

    // Calculate milestones
    const milestones = [1, 3, 7, 14, 30, 50, 100, 365];
    const achievedMilestones = milestones.filter(milestone => currentStreak >= milestone);

    setStreakData({
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalDays,
      lastCheckin,
      streakHistory,
      milestones: achievedMilestones
    });
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your learning journey today!";
    if (streak === 1) return "Great start! Keep the momentum going!";
    if (streak < 7) return "You're building a great habit!";
    if (streak < 14) return "One week strong! You're on fire! 🔥";
    if (streak < 30) return "Two weeks! You're unstoppable! 💪";
    if (streak < 50) return "One month! You're a learning machine! 🚀";
    if (streak < 100) return "Incredible dedication! Keep going! 🌟";
    return "Legendary! You're an inspiration! 👑";
  };

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-500';
    if (streak < 7) return 'text-blue-600';
    if (streak < 14) return 'text-green-600';
    if (streak < 30) return 'text-purple-600';
    if (streak < 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getNextMilestone = (currentStreak: number) => {
    const milestones = [1, 3, 7, 14, 30, 50, 100, 365];
    const nextMilestone = milestones.find(milestone => milestone > currentStreak);
    return nextMilestone || null;
  };

  const nextMilestone = getNextMilestone(streakData.currentStreak);
  const progressToNext = nextMilestone ? (streakData.currentStreak / nextMilestone) * 100 : 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Flame className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Learning Streak Tracker</h2>
                <p className="text-orange-100">Track your daily learning consistency</p>
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
          {/* Current Streak Display */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Flame className={`w-12 h-12 ${getStreakColor(streakData.currentStreak)}`} />
                  <span className="text-4xl font-bold text-gray-900">{streakData.currentStreak}</span>
                  <span className="text-2xl">🔥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Current Streak</h3>
                <p className="text-gray-600 mb-4">{getStreakMessage(streakData.currentStreak)}</p>
                
                {nextMilestone && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Next Milestone: {nextMilestone} days</span>
                      <span>{Math.round(progressToNext)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressToNext}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {nextMilestone - streakData.currentStreak} more days to reach {nextMilestone} days!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Longest Streak</p>
                  <p className="text-2xl font-bold text-blue-900">{streakData.longestStreak} days</p>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Learning Days</p>
                  <p className="text-2xl font-bold text-green-900">{streakData.totalDays} days</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Milestones Achieved</p>
                  <p className="text-2xl font-bold text-purple-900">{streakData.milestones.length}</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Streak Calendar */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Last 30 Days</h3>
            <div className="bg-white rounded-xl border p-4">
              <div className="grid grid-cols-30 gap-1">
                {streakData.streakHistory.map((day, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-sm border ${
                      day === 1 
                        ? 'bg-gradient-to-r from-orange-400 to-red-500 border-orange-300' 
                        : 'bg-gray-100 border-gray-200'
                    }`}
                    title={`Day ${index + 1}: ${day === 1 ? 'Active' : 'Inactive'}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 3, 7, 14, 30, 50, 100, 365].map((milestone) => {
                const achieved = streakData.milestones.includes(milestone);
                return (
                  <div
                    key={milestone}
                    className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                      achieved
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`text-2xl mb-1 ${achieved ? 'text-orange-600' : 'text-gray-400'}`}>
                      {achieved ? '🏆' : '🎯'}
                    </div>
                    <p className={`font-semibold ${achieved ? 'text-orange-800' : 'text-gray-600'}`}>
                      {milestone} days
                    </p>
                    <p className={`text-xs ${achieved ? 'text-orange-600' : 'text-gray-500'}`}>
                      {achieved ? 'Achieved!' : 'Not yet'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips for Maintaining Streak */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips to Maintain Your Streak</h3>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Set Daily Goals</p>
                    <p className="text-sm text-gray-600">Even 10 minutes of learning counts towards your streak!</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Use Reminders</p>
                    <p className="text-sm text-gray-600">Set a daily reminder to check in and maintain your streak.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Mix It Up</p>
                    <p className="text-sm text-gray-600">Try different activities: quizzes, flashcards, games, or PDF content.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Celebrate Progress</p>
                    <p className="text-sm text-gray-600">Every milestone is worth celebrating - you're building a great habit!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                // Share streak achievement
                const shareText = `🔥 I'm on a ${streakData.currentStreak}-day learning streak with CogniFlow! Join me in this amazing learning journey!`;
                if (navigator.share) {
                  navigator.share({
                    title: 'My Learning Streak',
                    text: shareText
                  });
                } else {
                  navigator.clipboard.writeText(shareText);
                  alert('Streak achievement copied to clipboard!');
                }
              }}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Share Achievement</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 