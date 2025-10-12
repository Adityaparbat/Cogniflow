'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Trophy, 
  MessageCircle, 
  Target, 
  Star, 
  Zap, 
  Calendar,
  TrendingUp,
  Award,
  Gift,
  Play,
  BookMarked,
  Lightbulb,
  CheckCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
  Smile,
  PartyPopper,
  Users,
  Gamepad2,
  Medal,
  LogOut,
  Clock,
  User as UserIcon,
  Settings,
  HelpCircle,
  Info,
  FileText,
  BarChart3,
  Upload,
  Video,
  FileUp,
  GraduationCap,
  Eye,
  Download,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { 
  findUserById, 
  loadUserFromLocalStorage,
  userDataset,
  type UserData
} from '@/lib/userData';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<UserData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<UserData | null>(null);
  const [showStudentProgress, setShowStudentProgress] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'competition' | 'test' | 'video'>('competition');

  // Close user menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showUserMenu]);

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load students data
      const allStudents = userDataset.filter(user => user.role === 'student');
      setStudents(allStudents);
    } else {
      // Redirect to login if no user data
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getOverallStats = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.isLoggedIn).length;
    const avgProgress = students.length > 0 
      ? Math.round(students.reduce((acc, s) => acc + (s.stats?.xp || 0), 0) / students.length)
      : 0;
    
    return { totalStudents, activeStudents, avgProgress };
  };

  const stats = getOverallStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="CogniFlow Logo" 
                  width={24} 
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">CogniFlow</h1>
                <p className="text-sm text-black">Teacher Dashboard</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-black">{user?.name}</p>
                  <p className="text-xs text-black">Teacher</p>
                </div>
                <ChevronRight className={`w-4 h-4 text-black transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <button className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>Help & Support</span>
                  </button>
                  <hr className="my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-black hover:text-black hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Ready to inspire and guide your students today?
                  </p>
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">Total Students</p>
                    <p className="text-3xl font-bold text-black">{stats.totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">Active Students</p>
                    <p className="text-3xl font-bold text-black">{stats.activeStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">Avg Progress</p>
                    <p className="text-3xl font-bold text-black">{stats.avgProgress} XP</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('students')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-black">View Student Progress</p>
                      <p className="text-sm text-black">Check individual student performance</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-black">Upload Content</p>
                      <p className="text-sm text-black">Add competitions, tests, and videos</p>
                    </div>
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-black mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">5 students completed quiz</p>
                      <p className="text-xs text-black">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">New content uploaded</p>
                      <p className="text-xs text-black">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Student Progress</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowStudentProgress(true);
                  }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{student.name}</h3>
                      <p className="text-sm text-black">{student.standard}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-black">Level</span>
                      <span className="font-medium">{student.stats?.level || 1}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black">XP</span>
                      <span className="font-medium">{student.stats?.xp || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black">Streak</span>
                      <span className="font-medium">{student.stats?.streak || 0} days</span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Content Management</h2>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Content</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Competitions</h3>
                    <p className="text-sm text-black">3 active</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-black">Math Challenge</span>
                    <span className="text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-black">Science Quiz</span>
                    <span className="text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-black">English Contest</span>
                    <span className="text-green-600">Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Tests</h3>
                    <p className="text-sm text-black">5 available</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-black">Algebra Test</span>
                    <span className="text-blue-600">Available</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-black">Biology Quiz</span>
                    <span className="text-blue-600">Available</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-black">Grammar Test</span>
                    <span className="text-blue-600">Available</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Videos</h3>
                    <p className="text-sm text-black">8 uploaded</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-black">Math Tutorial</span>
                    <span className="text-green-600">Published</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-black">Science Demo</span>
                    <span className="text-green-600">Published</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-black">English Lesson</span>
                    <span className="text-green-600">Published</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-4">Class Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-black">Mathematics</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-black">Science</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-black">English</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-4">Student Engagement</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Daily Active Users</span>
                    <span className="font-semibold">24/30</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Avg Session Time</span>
                    <span className="font-semibold">45 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Completion Rate</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Content Views</span>
                    <span className="font-semibold">156</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Student Progress Modal */}
      {showStudentProgress && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-black">{selectedStudent.name} - Progress Report</h3>
                <button
                  onClick={() => setShowStudentProgress(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedStudent.stats?.level || 1}</div>
                  <div className="text-sm text-black">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedStudent.stats?.xp || 0}</div>
                  <div className="text-sm text-black">XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedStudent.stats?.streak || 0}</div>
                  <div className="text-sm text-black">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedStudent.stats?.totalQuizzes || 0}</div>
                  <div className="text-sm text-black">Quizzes</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-black mb-3">Subject Progress</h4>
                <div className="space-y-3">
                  {Object.entries(selectedStudent.stats?.subjects || {}).map(([subject, data]: [string, any]) => (
                    <div key={subject}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{subject}</span>
                        <span>{data.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${data.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-black mb-3">Recent Activities</h4>
                <div className="space-y-2">
                  {selectedStudent.stats?.recentActivities?.slice(0, 5).map((activity: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">{activity.description}</p>
                        <p className="text-xs text-black">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )) || <p className="text-black">No recent activities</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-black">Upload Content</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Content Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setUploadType('competition')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      uploadType === 'competition'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-black hover:border-gray-400'
                    }`}
                  >
                    <Trophy className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Competition</span>
                  </button>
                  <button
                    onClick={() => setUploadType('test')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      uploadType === 'test'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-black hover:border-gray-400'
                    }`}
                  >
                    <FileText className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Test</span>
                  </button>
                  <button
                    onClick={() => setUploadType('video')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      uploadType === 'video'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-black hover:border-gray-400'
                    }`}
                  >
                    <Video className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Video</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${uploadType} title...`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder={`Enter ${uploadType} description...`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">File Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileUp className="w-8 h-8 text-black mx-auto mb-2" />
                  <p className="text-sm text-black">Click to upload or drag and drop</p>
                  <p className="text-xs text-black">PDF, DOC, MP4, AVI files supported</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Upload
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
