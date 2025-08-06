'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  CheckCircle,
  BookOpen,
  Star,
  Award,
  Activity,
  Zap,
  Brain,
  Eye,
  Bookmark,
  Users
} from 'lucide-react';

interface StudyAnalyticsProps {
  onClose: () => void;
  user: any;
}

interface StudySession {
  id: string;
  date: string;
  duration: number;
  subject: string;
  activity: string;
  score?: number;
  efficiency: number;
}

interface AnalyticsData {
  totalStudyTime: number;
  averageSessionLength: number;
  mostStudiedSubject: string;
  bestPerformingSubject: string;
  studyStreak: number;
  weeklyProgress: number;
  monthlyProgress: number;
  efficiencyScore: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  totalSessions: number;
  averageScore: number;
  improvementRate: number;
}

export default function StudyAnalytics({ onClose, user }: StudyAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalStudyTime: 0,
    averageSessionLength: 0,
    mostStudiedSubject: '',
    bestPerformingSubject: '',
    studyStreak: 0,
    weeklyProgress: 0,
    monthlyProgress: 0,
    efficiencyScore: 0,
    sessionsThisWeek: 0,
    sessionsThisMonth: 0,
    totalSessions: 0,
    averageScore: 0,
    improvementRate: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  const subjects = ['Mathematics', 'Science', 'English', 'Geography', 'History', 'Computer Science'];

  useEffect(() => {
    generateAnalyticsData();
  }, [selectedPeriod, selectedSubject]);

  const generateAnalyticsData = () => {
    // Generate sample study sessions
    const sessions: StudySession[] = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const session: StudySession = {
        id: `session-${i}`,
        date: date.toISOString().split('T')[0],
        duration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        activity: ['Quiz', 'Flashcards', 'Reading', 'Practice', 'Game'][Math.floor(Math.random() * 5)],
        score: Math.floor(Math.random() * 40) + 60, // 60-100%
        efficiency: Math.floor(Math.random() * 30) + 70 // 70-100%
      };
      sessions.push(session);
    }

    setStudySessions(sessions);

    // Calculate analytics
    const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration, 0);
    const averageSessionLength = Math.round(totalStudyTime / sessions.length);
    
    // Most studied subject
    const subjectCounts = subjects.map(subject => ({
      subject,
      count: sessions.filter(s => s.subject === subject).length,
      totalTime: sessions.filter(s => s.subject === subject).reduce((sum, s) => sum + s.duration, 0)
    }));
    const mostStudiedSubject = subjectCounts.reduce((max, current) => 
      current.totalTime > max.totalTime ? current : max
    ).subject;

    // Best performing subject
    const subjectScores = subjects.map(subject => ({
      subject,
      averageScore: sessions
        .filter(s => s.subject === subject && s.score)
        .reduce((sum, s) => sum + (s.score || 0), 0) / 
        Math.max(sessions.filter(s => s.subject === subject && s.score).length, 1)
    }));
    const bestPerformingSubject = subjectScores.reduce((max, current) => 
      current.averageScore > max.averageScore ? current : max
    ).subject;

    // Calculate other metrics
    const studyStreak = user?.stats?.streak || 0;
    const weeklyProgress = Math.floor(Math.random() * 40) + 60; // 60-100%
    const monthlyProgress = Math.floor(Math.random() * 30) + 70; // 70-100%
    const efficiencyScore = Math.floor(Math.random() * 20) + 80; // 80-100%
    const sessionsThisWeek = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    }).length;
    const sessionsThisMonth = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return sessionDate >= monthAgo;
    }).length;
    const totalSessions = sessions.length;
    const averageScore = Math.round(sessions
      .filter(s => s.score)
      .reduce((sum, s) => sum + (s.score || 0), 0) / 
      Math.max(sessions.filter(s => s.score).length, 1)
    );
    const improvementRate = Math.floor(Math.random() * 15) + 5; // 5-20%

    setAnalyticsData({
      totalStudyTime,
      averageSessionLength,
      mostStudiedSubject,
      bestPerformingSubject,
      studyStreak,
      weeklyProgress,
      monthlyProgress,
      efficiencyScore,
      sessionsThisWeek,
      sessionsThisMonth,
      totalSessions,
      averageScore,
      improvementRate
    });
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Mathematics': 'bg-blue-500',
      'Science': 'bg-green-500',
      'English': 'bg-purple-500',
      'Geography': 'bg-yellow-500',
      'History': 'bg-red-500',
      'Computer Science': 'bg-indigo-500'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-500';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Study Analytics</h2>
                <p className="text-blue-100">Detailed insights into your learning patterns</p>
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
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Study Time</p>
                  <p className="text-2xl font-bold text-blue-900">{formatTime(analyticsData.totalStudyTime)}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Average Session</p>
                  <p className="text-2xl font-bold text-green-900">{formatTime(analyticsData.averageSessionLength)}</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Efficiency Score</p>
                  <p className={`text-2xl font-bold ${getEfficiencyColor(analyticsData.efficiencyScore)}`}>
                    {analyticsData.efficiencyScore}%
                  </p>
                </div>
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Study Streak</p>
                  <p className="text-2xl font-bold text-orange-900">{analyticsData.studyStreak} 🔥</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Most Studied</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getSubjectColor(analyticsData.mostStudiedSubject)}`}></div>
                    <span className="font-medium">{analyticsData.mostStudiedSubject}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Best Performing</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getSubjectColor(analyticsData.bestPerformingSubject)}`}></div>
                    <span className="font-medium">{analyticsData.bestPerformingSubject}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span className="font-medium">{analyticsData.averageScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Improvement Rate</span>
                  <span className="font-medium text-green-600">+{analyticsData.improvementRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Weekly Progress</span>
                    <span>{analyticsData.weeklyProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(analyticsData.weeklyProgress)}`}
                      style={{ width: `${analyticsData.weeklyProgress}%`, backgroundColor: analyticsData.weeklyProgress >= 80 ? '#10b981' : analyticsData.weeklyProgress >= 60 ? '#3b82f6' : analyticsData.weeklyProgress >= 40 ? '#f59e0b' : '#ef4444' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Monthly Progress</span>
                    <span>{analyticsData.monthlyProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(analyticsData.monthlyProgress)}`}
                      style={{ width: `${analyticsData.monthlyProgress}%`, backgroundColor: analyticsData.monthlyProgress >= 80 ? '#10b981' : analyticsData.monthlyProgress >= 60 ? '#3b82f6' : analyticsData.monthlyProgress >= 40 ? '#f59e0b' : '#ef4444' }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.sessionsThisWeek}</p>
                    <p className="text-sm text-gray-600">Sessions This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{analyticsData.sessionsThisMonth}</p>
                    <p className="text-sm text-gray-600">Sessions This Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Study Sessions Timeline */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Study Sessions</h3>
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studySessions.slice(0, 10).map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(session.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getSubjectColor(session.subject)}`}></div>
                            <span className="text-sm text-gray-900">{session.subject}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.activity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTime(session.duration)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.score ? `${session.score}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getEfficiencyColor(session.efficiency)}`}>
                            {session.efficiency}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Insights & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📈 Performance Insights</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Your {analyticsData.mostStudiedSubject} sessions show strong dedication</li>
                  <li>• {analyticsData.bestPerformingSubject} is your strongest subject</li>
                  <li>• {analyticsData.efficiencyScore}% efficiency indicates good focus</li>
                  <li>• {analyticsData.improvementRate}% improvement rate is excellent</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🎯 Recommendations</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Try longer study sessions to improve efficiency</li>
                  <li>• Focus on weaker subjects to balance performance</li>
                  <li>• Maintain your {analyticsData.studyStreak}-day streak</li>
                  <li>• Mix different activities for better retention</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 