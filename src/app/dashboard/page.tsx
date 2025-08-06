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
  BarChart3
} from 'lucide-react';
import ProgressCard from '@/components/ProgressCard';
import StatsCard from '@/components/StatsCard';
import ProgressChart from '@/components/ProgressChart';
import ActivityChart from '@/components/ActivityChart';
import OfflineHandler from '@/components/OfflineHandler';
import GemmaChatbot from '@/components/GemmaChatbot';
import Flashcards from '@/components/flashcards';
import Quiz from '@/components/quizes';
import MathPuzzle from '@/components/MathPuzzle';
import Pictionary from '@/components/Pictionary';
import Hangman from '@/components/Hangman';
import SpellingBee from '@/components/SpellingBee';
import WordScramble from '@/components/WordScramble';
import MemoryMatch from '@/components/MemoryMatch';
import WordAssociation from '@/components/WordAssociation';
import PDFBrowser from '@/components/PDFBrowser';
import StudyPlan from '@/components/StudyPlan';
import LearningGoals from '@/components/LearningGoals';
import ProgressReport from '@/components/ProgressReport';
import StreakTracker from '@/components/StreakTracker';
import StudyTimer from '@/components/StudyTimer';
import LearningResources from '@/components/LearningResources';
import StudyAnalytics from '@/components/StudyAnalytics';
import { 
  generateSubjectData, 
  generateAchievements, 
  generateActivities,
  calculateTodayXP,
  calculateLevelProgress,
  type User,
  type Subject,
  type Achievement,
  type Activity
} from '@/lib/data';
import { 
  findUserById, 
  updateUserStats, 
  updateUserStreak, 
  loadUserFromLocalStorage,
  recordDailyCheckin,
  updateLearningProgress,
  updateDailyGoals,
  checkLevelUp
} from '@/lib/userData';
import { useSound } from '@/lib/soundEffects';
import PDFFlashcards from '@/components/PDFFlashcards';
import PDFQuiz from '@/components/PDFQuiz';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close user menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showUserMenu) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showUserMenu]);

  // Menu action handlers
  const handleProfileSettings = () => {
    setShowUserMenu(false);
    const profileInfo = `
📋 PROFILE SETTINGS

👤 Personal Information:
• Name: ${user.name}
• Email: ${user.email}
• Grade: ${user.standard || user.grade}
• User ID: ${user.id}

📊 Current Stats:
• Level: ${user.stats?.level || user.level || 1}
• Total XP: ${user.stats?.xp || user.xp || 0}
• Learning Streak: ${user.stats?.streak || user.streak || 0} days
• Coins: ${typeof user.stats?.coins === 'object' ? user.stats.coins.current : (user.stats?.coins || user.coins || 0)}

🎯 Achievements: ${user.stats?.achievements?.length || 0} unlocked
📚 Subjects: ${user.stats?.subjects?.length || 0} active
    `;
    alert(profileInfo);
  };

  const handleAccountSettings = () => {
    setShowUserMenu(false);
    const accountInfo = `
⚙️ ACCOUNT SETTINGS

🔐 Security:
• Password: ••••••••
• Last Login: ${new Date().toLocaleDateString()}
• Account Status: Active ✅

📱 Preferences:
• Notifications: ${user.profile?.preferences?.notifications ? 'Enabled' : 'Disabled'}
• Sound Effects: ${user.profile?.preferences?.sound ? 'Enabled' : 'Disabled'}
• Theme: ${user.profile?.preferences?.theme || 'Light'}

📊 Data Management:
• Study Data: ${user.stats?.totalStudyTime || 0} minutes
• Quiz Attempts: ${user.stats?.quizAttempts || 0}
• Flashcard Reviews: ${user.stats?.flashcardReviews || 0}

💾 Storage: Local (Offline Mode)
    `;
    alert(accountInfo);
  };

  const handleHelpSupport = () => {
    setShowUserMenu(false);
    const helpInfo = `
❓ HELP & SUPPORT

📞 Contact Information:
• Helpline: +1 (555) 123-4567
• Email: support@cogniflow.edu
• Live Chat: Available 24/7

🆘 Quick Help:
• Forgot Password: Click "Reset Password" on login page
• Technical Issues: Clear browser cache and refresh
• Account Locked: Contact support with your User ID: ${user.id}

📚 Common Solutions:
• App not loading: Check internet connection
• Quiz not working: Refresh the page
• Progress not saving: Check if you're logged in

🌐 Online Resources:
• User Guide: https://cogniflow.edu/guide
• FAQ: https://cogniflow.edu/faq
• Video Tutorials: https://cogniflow.edu/tutorials

📧 Email Support: support@cogniflow.edu
    `;
    alert(helpInfo);
  };

  const handleAboutCogniFlow = () => {
    setShowUserMenu(false);
    const aboutInfo = `
ℹ️ ABOUT COGNIFLOW

🎓 Mission:
CogniFlow is an AI-powered learning platform designed to make education engaging, personalized, and accessible for students of all ages.

✨ Key Features:
• 🤖 AI-Powered Tutoring with Gemma
• 🎮 Gamified Learning Games
• 📚 Interactive Quizzes & Flashcards
• 📊 Progress Tracking & Analytics
• 🏆 Achievement System
• 📱 Offline Mode Support
• 🎯 Personalized Learning Paths

🛠️ Technology:
• Built with Next.js 15.4.4
• React 18 with TypeScript
• Tailwind CSS for styling
• Framer Motion animations
• LocalStorage for offline data

📈 Learning Tools:
• Math Puzzles
• Spelling Bee
• Pictionary
• Hangman
• Interactive Quizzes
• Smart Flashcards

🎨 Design Philosophy:
• Clean, modern interface
• Accessible for all users
• Mobile-responsive design
• Intuitive navigation

📱 Version: 1.0.0
🔧 Last Updated: ${new Date().toLocaleDateString()}
    `;
    alert(aboutInfo);
  };

  const handleTermsPrivacy = () => {
    setShowUserMenu(false);
    const termsInfo = `
📜 TERMS OF SERVICE & PRIVACY POLICY

📋 Terms of Service:
• You agree to use CogniFlow for educational purposes only
• No sharing of account credentials with others
• Respectful behavior in all interactions
• No cheating or exploiting system vulnerabilities
• Regular use encouraged for best learning outcomes

🔒 Privacy Policy:
• Your data is stored locally on your device
• No personal information is shared with third parties
• Learning progress is private and secure
• You can export your data anytime
• Account deletion removes all local data

📊 Data Usage:
• Study progress tracking for personalized learning
• Performance analytics to improve experience
• Offline functionality for privacy
• No tracking or advertising

🛡️ Security:
• Local data storage (no cloud servers)
• No cookies or tracking scripts
• Secure password protection
• Regular security updates

📧 Contact for Privacy Concerns:
• Email: privacy@cogniflow.edu
• Response within 24 hours
    `;
    alert(termsInfo);
  };
  const [isMuted, setIsMuted] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const sound = useSound();
  const [user, setUser] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPDFQuiz, setShowPDFQuiz] = useState(false);
  const [showPDFFlashcards, setShowPDFFlashcards] = useState(false);
  const [showMathPuzzle, setShowMathPuzzle] = useState(false);
  const [showPictionary, setShowPictionary] = useState(false);
  const [showHangman, setShowHangman] = useState(false);
  const [showSpellingBee, setShowSpellingBee] = useState(false);
  const [showWordScramble, setShowWordScramble] = useState(false);
  const [showMemoryMatch, setShowMemoryMatch] = useState(false);
  const [showWordAssociation, setShowWordAssociation] = useState(false);
  const [showPDFBrowser, setShowPDFBrowser] = useState(false);
  const [selectedPDFSubject, setSelectedPDFSubject] = useState('');
  const [selectedPDFChapter, setSelectedPDFChapter] = useState('');
  const [usePDFContent, setUsePDFContent] = useState(false);
  const [availablePDFContent, setAvailablePDFContent] = useState<any[]>([]);
  const [showStudyPlan, setShowStudyPlan] = useState(false);
  const [showLearningGoals, setShowLearningGoals] = useState(false);
  const [showProgressReport, setShowProgressReport] = useState(false);
  const [showStreakTracker, setShowStreakTracker] = useState(false);
  const [showStudyTimer, setShowStudyTimer] = useState(false);
  const [showLearningResources, setShowLearningResources] = useState(false);
  const [showStudyAnalytics, setShowStudyAnalytics] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showCompetitions, setShowCompetitions] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, task: 'Complete Math Quiz', completed: false },
    { id: 2, task: 'Review Science Flashcards', completed: true },
    { id: 3, task: 'Practice English Grammar', completed: false },
    { id: 4, task: 'Play Educational Game', completed: false }
  ]);
  const router = useRouter();

  // Check authentication and get user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      if (!user.isLoggedIn) {
        router.push('/login');
        return;
      }
      
      // Load user with streak tracking
      const loadedUser = loadUserFromLocalStorage(user.id);
      if (loadedUser) {
        // Update streak on login
        updateUserStreak(user.id);
        setUser(loadedUser);
      } else {
        // Fallback to dataset user
        const userFromDataset = findUserById(user.id);
        if (userFromDataset) {
          updateUserStreak(user.id);
          setUser(userFromDataset);
        } else {
          // Fallback to localStorage data
          setUser({
            ...user,
            grade: user.standard || user.grade || 'Class 1',
            xp: user.stats?.xp || 0,
            level: user.stats?.level || 1,
            streak: user.stats?.streak || 0,
            coins: typeof user.stats?.coins === 'object' ? user.stats.coins.current : (user.stats?.coins || 0)
          });
        }
      }
    } catch (error) {
      router.push('/login');
      return;
    }
  }, [router]);

  // Generate fresh data on component mount
  useEffect(() => {
    if (user) {
      generateFreshData();
    }
  }, [user]);

  const generateFreshData = () => {
    const newSubjects = generateSubjectData();
    const newAchievements = generateAchievements();
    const newActivities = generateActivities();
    
    setSubjects(newSubjects);
    setAchievements(newAchievements);
    setActivities(newActivities);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Silent database saving
  useEffect(() => {
    if (!user) return;

    const saveToDatabase = () => {
      try {
        // Update user stats with current progress
        const updatedUser = {
          ...user,
          stats: {
            ...user.stats,
            lastUpdated: new Date().toISOString(),
            totalStudyTime: (user.stats?.totalStudyTime || 0) + Math.floor(studyTimer / 60),
            sessionTime: studyTimer
          }
        };

        // Save to localStorage (acts as database)
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update user state silently
        setUser(updatedUser);
      } catch (error) {
        console.error('Error saving to database:', error);
      }
    };

    // Auto-save every 30 seconds silently
    const autoSaveInterval = setInterval(saveToDatabase, 30000);

    // Weekly backup save silently
    const weeklyBackup = () => {
      try {
        const weeklyData = {
          user: user,
          subjects: subjects,
          achievements: achievements,
          activities: activities,
          timestamp: new Date().toISOString(),
          weekNumber: Math.ceil(new Date().getDate() / 7)
        };

        // Save weekly backup silently
        localStorage.setItem(`weekly_backup_${new Date().getFullYear()}_week_${Math.ceil(new Date().getDate() / 7)}`, JSON.stringify(weeklyData));
      } catch (error) {
        console.error('Error saving weekly backup:', error);
      }
    };

    // Check if it's time for weekly backup (every Sunday)
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const isFirstTimeToday = !localStorage.getItem(`weekly_backup_${now.getFullYear()}_week_${Math.ceil(now.getDate() / 7)}_${now.toDateString()}`);
    
    if (isSunday && isFirstTimeToday) {
      weeklyBackup();
      localStorage.setItem(`weekly_backup_${now.getFullYear()}_week_${Math.ceil(now.getDate() / 7)}_${now.toDateString()}`, 'true');
    }

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [user, studyTimer, subjects, achievements, activities]);

  // Load available PDF content
  useEffect(() => {
    const loadPDFContent = async () => {
      try {
        const response = await fetch('/api/pdf-process?action=content');
        const data = await response.json();
        setAvailablePDFContent(data.content || []);
      } catch (error) {
        console.error('Error loading PDF content:', error);
      }
    };

    loadPDFContent();
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleGoal = (id: number) => {
    sound.playButtonClick();
    setDailyGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const formatTimeAgo = (date: Date | string | any) => {
    try {
      // Convert to Date object if it's not already
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Unknown time';
      }
      
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    } catch (error) {
      console.error('Error formatting time ago:', error);
      return 'Unknown time';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    if (user && user.id) {
      updateUserStats(user.id, 'quiz', {
        score,
        totalQuestions,
        subject: selectedSubject || 'General'
      });
      
      // Update local user state
      setUser((prev: any) => ({
        ...prev,
        stats: {
          ...prev.stats,
          xp: prev.stats.xp + (score * 2),
          coins: typeof prev.stats.coins === 'object' 
            ? { ...prev.stats.coins, current: prev.stats.coins.current + Math.floor(score / 10) }
            : prev.stats.coins + Math.floor(score / 10),
          totalQuizzes: prev.stats.totalQuizzes + 1,
          dailyGoalProgress: {
            ...prev.stats.dailyGoalProgress,
            quizzesCompleted: prev.stats.dailyGoalProgress.quizzesCompleted + 1
          }
        }
      }));
    }
  };

  const handleFlashcardsComplete = (cardsStudied: number, knownCards: number) => {
    if (user && user.id) {
      updateUserStats(user.id, 'flashcards', {
        cardsStudied,
        knownCards,
        subject: selectedSubject || 'General'
      });
      
      // Update local user state
      setUser((prev: any) => ({
        ...prev,
        stats: {
          ...prev.stats,
          xp: prev.stats.xp + (cardsStudied * 5),
          coins: typeof prev.stats.coins === 'object' 
            ? { ...prev.stats.coins, current: prev.stats.coins.current + Math.floor(knownCards / 5) }
            : prev.stats.coins + Math.floor(knownCards / 5),
          totalFlashcards: prev.stats.totalFlashcards + 1,
          dailyGoalProgress: {
            ...prev.stats.dailyGoalProgress,
            flashcardsCompleted: prev.stats.dailyGoalProgress.flashcardsCompleted + 1
          }
        }
      }));
    }
  };

  const handleGameComplete = (score: number, totalQuestions: number, gameType: string = 'game', subject: string = 'General', timeSpent: number = 5) => {
    if (user && user.id) {
      const gameData = { 
        score, 
        totalQuestions, 
        gameType, 
        subject, 
        timeSpent 
      };
      
      updateUserStats(user.id, 'game', gameData);
      
      // Check for level up
      const leveledUp = checkLevelUp(user.id);
      
      // Reload user data to get updated stats
      const updatedUser = loadUserFromLocalStorage(user.id) || user;
      setUser(updatedUser);
      
      // Play appropriate sounds
      if (score > totalQuestions * 0.7) { // If score is more than 70%
        sound.playCorrectAnswer();
      } else {
        sound.playWrongAnswer();
      }
      
      if (leveledUp) {
        sound.playLevelUp();
      }
      
      sound.playGameComplete();
      
      // Show success message
      const xpEarned = score * 3;
      const coinsEarned = Math.floor(score / 15);
      let successMessage = `Great job! You earned ${xpEarned} XP and ${coinsEarned} coins!`;
      
      if (leveledUp) {
        successMessage += `\n🎉 LEVEL UP! You're now level ${updatedUser.stats.level}!`;
      }
      
      alert(successMessage);
    }
  };

  const handleGameSelect = (gameName: string) => {
    setSelectedGame(gameName);
    setShowGames(true);
  };

  // Quick Actions Handlers
  const handleGenerateStudyPlan = () => {
    sound.playButtonClick();
    setShowStudyPlan(true);
  };

  const handleSetLearningGoals = () => {
    sound.playButtonClick();
    setShowLearningGoals(true);
  };

  const handleViewProgressReport = () => {
    sound.playButtonClick();
    setShowProgressReport(true);
  };

  const handleViewStreakTracker = () => {
    sound.playButtonClick();
    setShowStreakTracker(true);
  };

  const handleStartStudyTimer = () => {
    sound.playButtonClick();
    setShowStudyTimer(true);
  };

  const handleOpenLearningResources = () => {
    sound.playButtonClick();
    setShowLearningResources(true);
  };

  const handleViewStudyAnalytics = () => {
    sound.playButtonClick();
    setShowStudyAnalytics(true);
  };

  // Streak tracking functionality
  const updateDailyStreak = () => {
    const today = new Date().toDateString();
    const lastCheckin = localStorage.getItem(`streak_${user.id}`);
    
    if (lastCheckin !== today) {
      const currentStreak = user.stats?.streak || user.streak || 0;
      const newStreak = currentStreak + 1;
      const longestStreak = parseInt(localStorage.getItem(`longest_streak_${user.id}`) || '0');
      const totalDays = parseInt(localStorage.getItem(`total_days_${user.id}`) || '0');
      
      // Update user streak
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          streak: newStreak
        }
      };
      
      // Save to localStorage
      localStorage.setItem(`streak_${user.id}`, today);
      localStorage.setItem(`streak_${user.id}_${today}`, 'true'); // Mark today as active
      localStorage.setItem(`longest_streak_${user.id}`, Math.max(longestStreak, newStreak).toString());
      localStorage.setItem(`total_days_${user.id}`, (totalDays + 1).toString());
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update the user state
      setUser(updatedUser);
      
      // Show streak notification
      if (newStreak > 1) {
        alert(`🔥 Amazing! You've maintained a ${newStreak}-day learning streak! Keep it up!`);
      } else {
        alert(`🎉 Great start! You've begun your learning journey!`);
      }
    }
  };

  // Check streak on component mount
  useEffect(() => {
    if (user) {
      updateDailyStreak();
    }
  }, [user]);

  // Generate chart data
  const chartData = subjects.map(subject => ({
    name: subject.name,
    value: subject.progress,
    color: subject.color,
    icon: subject.icon
  }));

  // Generate weekly activity data
  const weeklyData = [
    { day: 'Mon', activities: Math.floor(Math.random() * 5) + 2, xp: Math.floor(Math.random() * 100) + 50, time: Math.floor(Math.random() * 60) + 30 },
    { day: 'Tue', activities: Math.floor(Math.random() * 5) + 2, xp: Math.floor(Math.random() * 100) + 50, time: Math.floor(Math.random() * 60) + 30 },
    { day: 'Wed', activities: Math.floor(Math.random() * 5) + 2, xp: Math.floor(Math.random() * 100) + 50, time: Math.floor(Math.random() * 60) + 30 },
    { day: 'Thu', activities: Math.floor(Math.random() * 5) + 2, xp: Math.floor(Math.random() * 100) + 50, time: Math.floor(Math.random() * 60) + 30 },
    { day: 'Fri', activities: Math.floor(Math.random() * 5) + 2, xp: Math.floor(Math.random() * 100) + 50, time: Math.floor(Math.random() * 60) + 30 },
    { day: 'Sat', activities: Math.floor(Math.random() * 5) + 2, xp: Math.floor(Math.random() * 100) + 50, time: Math.floor(Math.random() * 60) + 30 },
    { day: 'Sun', activities: Math.floor(Math.random() * 5) + 2, xp: Math.floor(Math.random() * 100) + 50, time: Math.floor(Math.random() * 60) + 30 }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-800">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  const todayXP = calculateTodayXP(user);
  const levelProgress = calculateLevelProgress(user.stats?.xp || user.xp, user.stats?.level || user.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <OfflineHandler />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center overflow-hidden hover:scale-110 transition-transform duration-300 cursor-pointer bg-white shadow-sm">
                <Image 
                  src="/logo.png" 
                  alt="CogniFlow Logo" 
                  width={56} 
                  height={56}
                  className="object-contain w-full h-full p-1"
                />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer drop-shadow-sm">CogniFlow</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Hide stats on mobile, show only on larger screens */}
              <div className="hidden sm:flex items-center space-x-4">
                <StatsCard 
                  title="Coins" 
                  value={typeof user.stats?.coins === 'object' ? user.stats.coins.current : (user.stats?.coins || user.coins)} 
                  icon={Star} 
                  color="text-yellow-600" 
                  bgColor="bg-yellow-100" 
                />
                <StatsCard 
                  title="Level" 
                  value={user.stats?.level || user.level} 
                  icon={Zap} 
                  color="text-blue-600" 
                  bgColor="bg-blue-100" 
                />
                <div 
                  onClick={handleViewStreakTracker}
                  onMouseEnter={() => sound.playHover()}
                  className="cursor-pointer hover:scale-105 transition-all duration-200"
                >
                  <StatsCard 
                    title="Streak" 
                    value={`${user.stats?.streak || user.streak || 0} 🔥`}
                    icon={TrendingUp} 
                    color="text-orange-600" 
                    bgColor="bg-orange-100" 
                  />
                </div>
              </div>
              
              {/* Mobile-friendly stats */}
              <div className="flex sm:hidden items-center space-x-2">
                <div className="bg-yellow-100 px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-yellow-800">💰 {typeof user.stats?.coins === 'object' ? user.stats.coins.current : (user.stats?.coins || user.coins)}</span>
                </div>
                <div className="bg-blue-100 px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-blue-800">⚡ {user.stats?.level || user.level}</span>
                </div>
                <div 
                  onClick={handleViewStreakTracker}
                  onMouseEnter={() => sound.playHover()}
                  className="bg-orange-100 px-2 py-1 rounded-full cursor-pointer hover:bg-orange-200 transition-colors"
                >
                  <span className="text-xs font-medium text-orange-800">🔥 {user.stats?.streak || user.streak || 0}</span>
                </div>
              </div>
              

              <button
                onClick={() => {
                  sound.playButtonClick();
                  sound.setMuted(!isMuted);
                  setIsMuted(!isMuted);
                }}
                className="p-2 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-300"
                onMouseEnter={() => sound.playHover()}
              >
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />}
              </button>

              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-sm font-medium text-gray-900 drop-shadow-sm">{user.name}</span>
                  <span className="text-xs text-gray-700 font-medium">{user.standard || user.grade}</span>
                </div>
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer relative group"
                  >
                    <span className="text-white font-medium text-xs sm:text-sm">{user.name.charAt(0)}</span>
                    {/* Mobile tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap sm:hidden font-medium">
                      {user.name} • {user.standard || user.grade}
                    </div>
                  </button>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                            <p className="text-xs text-blue-600 font-medium">{user.standard || user.grade}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={handleProfileSettings}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span>Profile Settings</span>
                        </button>
                        
                        <button
                          onClick={handleAccountSettings}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-500" />
                          <span>Account Settings</span>
                        </button>

                        <button
                          onClick={handleHelpSupport}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4 text-gray-500" />
                          <span>Help & Support</span>
                        </button>

                        <button
                          onClick={handleAboutCogniFlow}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <Info className="w-4 h-4 text-gray-500" />
                          <span>About CogniFlow</span>
                        </button>

                        <button
                          onClick={handleTermsPrivacy}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span>Terms & Privacy</span>
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 sm:p-6 text-white mb-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-500 cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-lg">Welcome back, {user.name}! 👋</h2>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-white bg-opacity-25 px-3 py-1 rounded-full text-sm font-medium text-white drop-shadow-sm">
                  📚 {user.standard || user.grade}
                </span>
                <span className="text-white text-base sm:text-lg font-medium drop-shadow-sm">• {user.stats?.xp || user.xp} XP</span>
              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="text-sm sm:text-base text-white font-medium drop-shadow-sm">{user.stats?.streak || user.streak} day streak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="text-sm sm:text-base text-white font-medium drop-shadow-sm">+{todayXP} XP today</span>
                  </div>

                </div>
              {/* Level Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-white font-medium drop-shadow-sm">Level {user.stats?.level || user.level}</span>
                <span className="text-white font-medium drop-shadow-sm">Level {(user.stats?.level || user.level) + 1}</span>
                </div>
                <div className="w-full bg-blue-400 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-white font-medium mt-1 drop-shadow-sm">{Math.round(levelProgress)}% to next level</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">🎯</div>
                              <p className="text-white font-medium drop-shadow-sm">Keep up the great work!</p>
            </div>
          </div>
        </motion.div>

                    {/* Quick Actions Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border mb-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={handleGenerateStudyPlan}
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold text-base hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex-1 max-w-[250px] justify-center"
                >
                  <Lightbulb className="w-5 h-5" />
                  Generate Study Plan
                </button>
                <button 
                  onClick={handleSetLearningGoals}
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold text-base hover:from-green-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex-1 max-w-[250px] justify-center"
                >
                  <Target className="w-5 h-5" />
                  Set Learning Goals
                </button>
                <button 
                  onClick={handleViewProgressReport}
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold text-base hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex-1 max-w-[250px] justify-center"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Progress Report
                </button>
                <button 
                  onClick={() => {
                    sound.playButtonClick();
                    if (user && user.id) {
                      try {
                        recordDailyCheckin(user.id);
                        const updatedUser = loadUserFromLocalStorage(user.id) || user;
                        setUser(updatedUser);
                        sound.playDailyCheckin();
                        const today = new Date().toISOString().split('T')[0];
                        const xpEarned = updatedUser?.stats?.dailyCheckins?.[today]?.xpEarned || 50;
                        const coinsEarned = updatedUser?.stats?.dailyCheckins?.[today]?.coinsEarned || 10;
                        alert(`Daily check-in successful! You earned ${xpEarned} XP and ${coinsEarned} coins!`);
                      } catch (error) {
                        console.error('Error during daily check-in:', error);
                        alert('Daily check-in completed! You earned 50 XP and 10 coins!');
                      }
                    }
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold text-base hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex-1 max-w-[250px] justify-center relative group"
                >
                  <Calendar className="w-5 h-5" />
                  Daily Check-in
                  <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  </span>
                </button>
              </div>
            </motion.div>

        {/* Study Timer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border mb-8 hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Study Timer</h3>
              <p className="text-gray-800">Track your focused study time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-blue-600 mb-2">
                {formatTime(studyTimer)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-4 py-2 rounded-lg font-medium hover:scale-105 hover:shadow-md transition-all duration-200 ${
                    isTimerRunning 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setStudyTimer(0);
                    setIsTimerRunning(false);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 hover:scale-105 hover:shadow-md transition-all duration-200"
                >
                  Reset
                </button>
              </div>
              

            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 mb-8 shadow-sm overflow-x-auto hover:shadow-md transition-shadow duration-300">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'personalized', label: 'Personalized Learning', icon: Lightbulb },
            { id: 'learning', label: 'Study Materials', icon: BookOpen },
            { id: 'games', label: 'Games', icon: Gamepad2 },
            { id: 'competitions', label: 'Competitions', icon: Medal },
            { id: 'chatbot', label: 'AI Assistant', icon: MessageCircle },
            { id: 'rewards', label: 'Rewards', icon: Trophy },
            { id: 'progress', label: 'Progress', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playButtonClick();
                setActiveTab(tab.id);
              }}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onMouseEnter={() => sound.playHover()}
            >
              <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {subjects.slice(0, 4).map((subject) => (
                  <ProgressCard
                    key={subject.id}
                    title={subject.name}
                    progress={subject.progress}
                    icon={subject.icon}
                    color={subject.color}
                    onClick={() => console.log(`Clicked ${subject.name}`)}
                  />
                ))}
              </div>
            </div>

            {/* Daily Goals */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Goals</h3>
              <div className="space-y-3">
                {dailyGoals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md hover:border-green-200 transition-all duration-300"
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform duration-200 ${
                        goal.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}>
                        {goal.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <span className={`text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {goal.task}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personalized' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl p-8 shadow-2xl border-0">
              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg mb-4 animate-pulse">
                  <Lightbulb className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-indigo-600 mb-2">Personalized Learning</h3>
                <p className="text-lg text-purple-700 text-center">Your learning journey, tailored just for you!</p>
              </div>

              {/* Learning Path Recommendations */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Recommended Learning Path</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { 
                      title: 'Strengthen Weak Areas', 
                      description: 'Focus on subjects where you need improvement',
                      icon: '🎯',
                      color: 'bg-red-500',
                      progress: 65,
                      action: 'Start Practice'
                    },
                    { 
                      title: 'Advanced Topics', 
                      description: 'Challenge yourself with higher-level concepts',
                      icon: '🚀',
                      color: 'bg-blue-500',
                      progress: 40,
                      action: 'Explore'
                    },
                    { 
                      title: 'Review & Reinforce', 
                      description: 'Solidify your understanding of core concepts',
                      icon: '🔄',
                      color: 'bg-green-500',
                      progress: 80,
                      action: 'Review'
                    }
                  ].map((path, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-white rounded-xl p-6 shadow-lg border cursor-pointer hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`w-12 h-12 ${path.color} rounded-lg flex items-center justify-center mb-4`}>
                        <span className="text-xl">{path.icon}</span>
                      </div>
                      <h5 className="text-lg font-bold text-gray-900 mb-2">{path.title}</h5>
                      <p className="text-gray-600 text-sm mb-4">{path.description}</p>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900 font-medium">{path.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${path.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${path.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200">
                        {path.action}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Adaptive Learning Features */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Adaptive Learning Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="text-lg font-bold text-gray-900">Smart Difficulty Adjustment</h5>
                    </div>
                    <p className="text-gray-600 mb-4">Questions automatically adjust based on your performance to keep you challenged but not overwhelmed.</p>
                    <div className="flex items-center text-sm text-blue-600">
                      <span className="font-medium">Currently Active</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg border">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="text-lg font-bold text-gray-900">Personalized Goals</h5>
                    </div>
                    <p className="text-gray-600 mb-4">Set and track learning goals that match your pace and interests.</p>
                    <button className="text-sm text-green-600 font-medium hover:text-green-700">
                      Customize Goals →
                    </button>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg border">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="text-lg font-bold text-gray-900">Optimal Study Times</h5>
                    </div>
                    <p className="text-gray-600 mb-4">Get recommendations for the best times to study based on your learning patterns.</p>
                    <div className="text-sm text-purple-600">
                      <span className="font-medium">Next session: 2:00 PM</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg border">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="text-lg font-bold text-gray-900">Achievement Tracking</h5>
                    </div>
                    <p className="text-gray-600 mb-4">Earn badges and rewards for consistent learning and improvement.</p>
                    <div className="flex items-center text-sm text-orange-600">
                      <span className="font-medium">5 achievements unlocked</span>
                      <Award className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Learning Platform */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">🎬 AI Video Learning Platform</h4>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex-1 mb-4 md:mb-0 md:mr-6">
                      <h5 className="text-lg font-bold text-gray-900 mb-2">Generate Educational Videos</h5>
                      <p className="text-gray-600 mb-4">Create personalized learning videos from your textbooks using AI-powered video generation technology.</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">📚 PDF to Video</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">🤖 AI Narration</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">🎨 Visual Slides</span>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">📱 Offline Ready</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <button
                        onClick={async () => {
                          sound.playButtonClick();
                          
                          try {
                            // Check if genrate server is running
                            const response = await fetch('http://localhost:3000/api/chapters/english', { 
                              method: 'GET',
                              timeout: 3000
                            });
                            
                            if (response.ok) {
                              // Server is running, open the app
                              window.open('http://localhost:3000', '_blank');
                              alert('🎬 Video Learning Platform opened!\n\nThe AI video generator is now running in a new tab.');
                            } else {
                              throw new Error('Server not responding');
                            }
                          } catch (error) {
                            // Server is not running, show instructions
                            const instructions = `🎬 Video Learning Platform Setup Required

To use the AI video generator:

1. Open a terminal in the genrate folder
2. Run the following command:
   node server.js

3. Wait for "Server running on port 3000" message
4. Click this button again to open the platform

The genrate app will run on http://localhost:3000`;
                            
                            alert(instructions);
                            
                            // Still try to open the URL in case user wants to start it manually
                            if (confirm('Would you like to open the URL anyway? (You can bookmark it for later)')) {
                              window.open('http://localhost:3000', '_blank');
                            }
                          }
                        }}
                        onMouseEnter={() => sound.playHover()}
                        className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-base hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl relative group"
                      >
                        <Play className="w-5 h-5" />
                        Open Video Generator
                        <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                        </span>
                      </button>
                      <p className="text-xs text-gray-500 text-center max-w-xs">
                        Transforms your textbooks into engaging video lessons
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Learning Resources */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">📚 PDF Learning Resources</h4>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex-1 mb-4 md:mb-0 md:mr-6">
                      <h5 className="text-lg font-bold text-gray-900 mb-2">Browse & Generate Study Materials</h5>
                      <p className="text-gray-600 mb-4">Upload PDFs from your textbooks and automatically generate interactive quizzes and flashcards using AI.</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">📄 PDF Upload</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">🤖 AI Generation</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">📝 Auto Quizzes</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">🗂️ Smart Cards</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <button
                        onClick={() => {
                          sound.playButtonClick();
                          setShowPDFBrowser(true);
                        }}
                        onMouseEnter={() => sound.playHover()}
                        className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold text-base hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl relative group"
                      >
                        <FileText className="w-5 h-5" />
                        Browse PDFs
                        <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                        </span>
                      </button>
                      <p className="text-xs text-gray-500 text-center max-w-xs">
                        Create personalized study materials from your books
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Analytics */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Your Learning Analytics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Study Sessions</p>
                        <p className="text-2xl font-bold text-blue-900">24</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">This week</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Accuracy Rate</p>
                        <p className="text-2xl font-bold text-green-900">87%</p>
                      </div>
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-1">+5% this week</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">Topics Mastered</p>
                        <p className="text-2xl font-bold text-purple-900">12</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">+2 this month</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-800">Learning Streak</p>
                        <p className="text-2xl font-bold text-orange-900">7 days</p>
                      </div>
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">Personal best!</p>
                  </div>
                </div>
              </div>


              {/* PDF Browser Modal */}
              {showPDFBrowser && (
                <PDFBrowser
                  onClose={() => setShowPDFBrowser(false)}
                  onContentGenerated={(content) => {
                    setSelectedPDFSubject(content.subject);
                    setSelectedPDFChapter(content.chapter);
                    setUsePDFContent(true);
                    setShowPDFBrowser(false);
                    
                    // Open the appropriate component based on user choice
                    setTimeout(() => {
                      if (content.userChoice === 'flashcards') {
                        setShowPDFFlashcards(true);
                      } else {
                        setShowQuiz(true);
                      }
                    }, 500);
                  }}
                />
              )}

              {/* Quiz and Flashcards for PDF Content */}
              {showQuiz && (
                <Quiz
                  onClose={() => setShowQuiz(false)}
                  onComplete={handleQuizComplete}
                  subject={selectedPDFSubject}
                  chapter={selectedPDFChapter}
                  usePDFContent={usePDFContent}
                />
              )}
              {showFlashcards && (
                <Flashcards
                  onClose={() => setShowFlashcards(false)}
                  onComplete={handleFlashcardsComplete}
                  subject={selectedPDFSubject}
                  chapter={selectedPDFChapter}
                  usePDFContent={usePDFContent}
                />
              )}
              {showPDFQuiz && (
                <PDFQuiz
                  onClose={() => setShowPDFQuiz(false)}
                  onComplete={handleQuizComplete}
                  subject={selectedPDFSubject}
                  chapter={selectedPDFChapter}
                />
              )}
              {showPDFFlashcards && (
                <PDFFlashcards
                  onClose={() => setShowPDFFlashcards(false)}
                  onComplete={handleFlashcardsComplete}
                  subject={selectedPDFSubject}
                  chapter={selectedPDFChapter}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'learning' && !user && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-800">Loading learning tools...</p>
            </div>
          </div>
        )}

        {activeTab === 'learning' && user && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 rounded-2xl p-8 shadow-2xl border-0">
              {/* Mascot/Illustration */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-pink-400 flex items-center justify-center shadow-lg mb-2 animate-bounce">
                  <Smile className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-pink-600 mb-1">Study Materials</h3>
                <p className="text-lg text-blue-700 font-semibold mb-2">Practice with curated quizzes and flashcards!</p>
              </div>

              {/* PDF Content Section */}
              {availablePDFContent.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-900">📄 PDF Generated Content</h4>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {availablePDFContent.length} available
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availablePDFContent.slice(0, 6).map((content, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          setSelectedPDFSubject(content.subject);
                          setSelectedPDFChapter(content.chapter);
                          setUsePDFContent(true);
                          setSelectedSubject(content.subject);
                          
                          // Show choice between quiz and flashcards
                          const choice = window.confirm(
                            `Choose your learning mode for ${content.subject} - ${content.chapter}:\n\n` +
                            `Click OK for Quiz (${content.total_quizzes} questions)\n` +
                            `Click Cancel for Flashcards (${content.total_flashcards} cards)`
                          );
                          
                          setTimeout(() => {
                            if (choice) {
                              setShowPDFQuiz(true);
                            } else {
                              setShowPDFFlashcards(true);
                            }
                          }, 100);
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <h5 className="font-semibold text-gray-900">{content.subject}</h5>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">PDF</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Chapter: {content.chapter}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center space-x-1">
                              <FileText className="w-4 h-4 text-green-600" />
                              <span className="text-green-700">{content.total_flashcards} flashcards</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Play className="w-4 h-4 text-purple-600" />
                              <span className="text-purple-700">{content.total_quizzes} quizzes</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPDFSubject(content.subject);
                              setSelectedPDFChapter(content.chapter);
                              setShowPDFQuiz(true);
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2"
                          >
                            <Play className="w-4 h-4" />
                            <span>Quiz</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPDFSubject(content.subject);
                              setSelectedPDFChapter(content.chapter);
                              setShowPDFFlashcards(true);
                            }}
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Cards</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {availablePDFContent.length > 6 && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setShowPDFBrowser(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View all {availablePDFContent.length} PDF contents →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Subject Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">Choose a subject to study:</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Mathematics', icon: '📐', color: 'bg-blue-500' },
                    { name: 'Science', icon: '🔬', color: 'bg-green-500' },
                    { name: 'English', icon: '📚', color: 'bg-purple-500' },
                    { name: 'Geography', icon: '🌍', color: 'bg-yellow-500' },
                    { name: 'History', icon: '🏛️', color: 'bg-red-500' },
                    { name: 'All Subjects', icon: '🌟', color: 'bg-indigo-500' }
                  ].map((subject) => (
                    <motion.button
                      key={subject.name}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedSubject === subject.name
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedSubject(subject.name === 'All Subjects' ? '' : subject.name)}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <span className="text-2xl">{subject.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Learning Tools */}
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center py-4">
                <button
                  className="flex items-center gap-3 bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 relative group"
                  onClick={() => {
                    try {
                      sound.playButtonClick();
                      setShowQuiz(true);
                    } catch (error) {
                      console.error('Error opening quiz:', error);
                      setShowQuiz(true);
                    }
                  }}
                  onMouseEnter={() => sound.playHover()}
                >
                  <BookOpen className="w-7 h-7" />
                  Start Quiz
                  <span className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" /></span>
                </button>
                <button
                  className="flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 relative group"
                  onClick={() => {
                    try {
                      sound.playButtonClick();
                      setShowFlashcards(true);
                    } catch (error) {
                      console.error('Error opening flashcards:', error);
                      setShowFlashcards(true);
                    }
                  }}
                  onMouseEnter={() => sound.playHover()}
                >
                  <PartyPopper className="w-7 h-7" />
                  Start Flashcards
                  <span className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><Sparkles className="w-6 h-6 text-pink-400 animate-pulse" /></span>
                </button>

                
              </div>

              {/* Selected Subject Display */}
              {selectedSubject && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-blue-600 font-medium">Selected Subject:</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedSubject}
                    </span>
                    {usePDFContent && selectedPDFChapter && (
                      <>
                        <span className="text-blue-600 font-medium">• Chapter:</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedPDFChapter}
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          📄 PDF Content
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Real-time Progress Tracking */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl border border-green-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Learning Streak</p>
                      <p className="text-2xl font-bold text-green-900">{user?.stats?.learningStreak?.currentStreak || 0} days</p>
                    </div>
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl border border-blue-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Daily Goals</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {user?.stats?.dailyGoals?.completed?.quizzes || 0}/{user?.stats?.dailyGoals?.current?.quizzes || 0}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl border border-purple-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Study Time</p>
                      <p className="text-2xl font-bold text-purple-900">{user?.stats?.timeTracking?.dailyAverage || 0} min</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-xl border border-yellow-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Total Coins</p>
                      <p className="text-2xl font-bold text-yellow-900">{user?.stats?.coins?.current || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              {user?.stats?.recentActivities && user.stats.recentActivities.length > 0 && (
                <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {user.stats.recentActivities.slice(0, 10).map((activity: any, index: number) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'quiz' ? 'bg-blue-500' :
                            activity.type === 'flashcards' ? 'bg-green-500' :
                            activity.type === 'game' ? 'bg-purple-500' :
                            activity.type === 'checkin' ? 'bg-yellow-500' :
                            activity.type === 'level_up' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}>
                            {activity.type === 'quiz' ? <BookOpen className="w-4 h-4 text-white" /> :
                             activity.type === 'flashcards' ? <PartyPopper className="w-4 h-4 text-white" /> :
                             activity.type === 'game' ? <Gamepad2 className="w-4 h-4 text-white" /> :
                             activity.type === 'checkin' ? <Calendar className="w-4 h-4 text-white" /> :
                             activity.type === 'level_up' ? <TrendingUp className="w-4 h-4 text-white" /> :
                             <Star className="w-4 h-4 text-white" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">+{activity.xpEarned} XP</p>
                          {activity.coinsEarned > 0 && (
                            <p className="text-xs text-yellow-600">+{activity.coinsEarned} coins</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showQuiz && (
                <Quiz
                  onClose={() => setShowQuiz(false)}
                  onComplete={handleQuizComplete}
                  subject={selectedSubject}
                  chapter={selectedPDFChapter}
                  usePDFContent={usePDFContent}
                />
              )}
              {showFlashcards && (
                <Flashcards
                  onClose={() => setShowFlashcards(false)}
                  onComplete={handleFlashcardsComplete}
                  subject={selectedSubject}
                  chapter={selectedPDFChapter}
                  usePDFContent={usePDFContent}
                />
              )}
              {showPDFQuiz && (
                <PDFQuiz
                  onClose={() => setShowPDFQuiz(false)}
                  onComplete={handleQuizComplete}
                  subject={selectedPDFSubject}
                  chapter={selectedPDFChapter}
                />
              )}
              {showPDFFlashcards && (
                <PDFFlashcards
                  onClose={() => setShowPDFFlashcards(false)}
                  onComplete={handleFlashcardsComplete}
                  subject={selectedPDFSubject}
                  chapter={selectedPDFChapter}
                />
              )}

            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 shadow-2xl border-0">
              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg mb-4 mx-auto">
                  <Gamepad2 className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-purple-600 mb-2">Educational Games</h3>
                <p className="text-lg text-purple-700">Learn through fun and interactive games!</p>
              </div>
              
              {/* Subject Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Geography">Geography</option>
                  <option value="History">History</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Pictionary (Academic)', description: 'Draw academic words and test your knowledge', icon: '🎨', color: 'bg-purple-500', type: 'pictionary' },
                  { name: 'Hangman', description: 'Guess academic words before the hangman is complete', icon: '💀', color: 'bg-red-500', type: 'hangman' },
                  { name: 'Spelling Bee', description: 'Listen and spell academic words correctly', icon: '🐝', color: 'bg-yellow-500', type: 'spelling-bee' },
                  { name: 'Word Scramble', description: 'Unscramble letters to form academic words', icon: '🔀', color: 'bg-purple-600', type: 'word-scramble' },
                  { name: 'Memory Match', description: 'Match terms with their definitions', icon: '🧠', color: 'bg-green-500', type: 'memory-match' },
                  { name: 'Word Association', description: 'Connect related academic concepts', icon: '🔗', color: 'bg-orange-500', type: 'word-association' }
                ].map((game, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white rounded-xl p-6 shadow-lg border cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      sound.playButtonClick();
                      setSelectedGame(game.name);
                      if (game.type === 'pictionary') {
                        setShowPictionary(true);
                      } else if (game.type === 'hangman') {
                        setShowHangman(true);
                      } else if (game.type === 'spelling-bee') {
                        setShowSpellingBee(true);
                      } else if (game.type === 'word-scramble') {
                        setShowWordScramble(true);
                      } else if (game.type === 'memory-match') {
                        setShowMemoryMatch(true);
                      } else if (game.type === 'word-association') {
                        setShowWordAssociation(true);
                      }
                    }}
                    onMouseEnter={() => sound.playHover()}
                  >
                    <div className={`w-16 h-16 ${game.color} rounded-xl flex items-center justify-center mb-4`}>
                      <span className="text-2xl">{game.icon}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h4>
                    <p className="text-gray-800">{game.description}</p>
                    <div className="mt-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        game.type === 'pictionary' ? 'bg-purple-100 text-purple-800' : 
                        game.type === 'hangman' ? 'bg-red-100 text-red-800' :
                        game.type === 'spelling-bee' ? 'bg-yellow-100 text-yellow-800' :
                        game.type === 'word-scramble' ? 'bg-purple-100 text-purple-800' :
                        game.type === 'memory-match' ? 'bg-green-100 text-green-800' :
                        game.type === 'word-association' ? 'bg-orange-100 text-orange-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {game.type === 'pictionary' ? 'Drawing Game' : 
                         game.type === 'hangman' ? 'Word Game' : 
                         game.type === 'spelling-bee' ? 'Spelling Game' :
                         game.type === 'word-scramble' ? 'Word Game' :
                         game.type === 'memory-match' ? 'Memory Game' :
                         game.type === 'word-association' ? 'Association Game' : 'Game'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Game Components */}
              {showPictionary && (
                <Pictionary
                  onClose={() => setShowPictionary(false)}
                  onComplete={(score, totalWords) => handleGameComplete(score, totalWords, 'pictionary', selectedSubject, 8)}
                  subject={selectedSubject}
                />
              )}
              {showHangman && (
                <Hangman
                  onClose={() => setShowHangman(false)}
                  onComplete={(score, totalWords) => handleGameComplete(score, totalWords, 'hangman', selectedSubject, 6)}
                  subject={selectedSubject}
                />
              )}
              {showSpellingBee && (
                <SpellingBee
                  onClose={() => setShowSpellingBee(false)}
                  onComplete={(score, totalWords) => handleGameComplete(score, totalWords, 'spelling-bee', selectedSubject, 10)}
                  subject={selectedSubject}
                />
              )}
              {showWordScramble && (
                <WordScramble
                  onClose={() => setShowWordScramble(false)}
                  onComplete={(score, totalWords) => handleGameComplete(score, totalWords, 'word-scramble', selectedSubject, 8)}
                  subject={selectedSubject}
                />
              )}
              {showMemoryMatch && (
                <MemoryMatch
                  onClose={() => setShowMemoryMatch(false)}
                  onComplete={(score, totalPairs) => handleGameComplete(score, totalPairs, 'memory-match', selectedSubject, 12)}
                  subject={selectedSubject}
                />
              )}
              {showWordAssociation && (
                <WordAssociation
                  onClose={() => setShowWordAssociation(false)}
                  onComplete={(score, totalQuestions) => handleGameComplete(score, totalQuestions, 'word-association', selectedSubject, 6)}
                  subject={selectedSubject}
                />
              )}
              {showMathPuzzle && (
                <MathPuzzle
                  onClose={() => setShowMathPuzzle(false)}
                  onComplete={handleGameComplete}
                  difficulty="easy"
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'competitions' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-8 shadow-2xl border-0">
              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg mb-4 mx-auto">
                  <Medal className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-orange-600 mb-2">Competitions</h3>
                <p className="text-lg text-orange-700">Compete with friends and win prizes!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Weekly Quiz Challenge', description: 'Compete in weekly subject quizzes', participants: 156, prize: '500 Coins', status: 'Active' },
                  { name: 'Math Olympiad', description: 'Advanced mathematics competition', participants: 89, prize: '1000 Coins', status: 'Starting Soon' },
                  { name: 'Science Fair', description: 'Present your scientific discoveries', participants: 234, prize: '750 Coins', status: 'Active' },
                  { name: 'Spelling Bee', description: 'Test your vocabulary skills', participants: 67, prize: '300 Coins', status: 'Ended' }
                ].map((competition, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white rounded-xl p-6 shadow-lg border cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => setShowCompetitions(true)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">{competition.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        competition.status === 'Active' ? 'bg-green-100 text-green-800' :
                        competition.status === 'Starting Soon' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {competition.status}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-4">{competition.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{competition.participants} participants</span>
                      <span className="font-medium text-yellow-600">{competition.prize}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chatbot' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI Learning Assistant</h3>
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-6 text-lg">Your offline AI tutor is ready to help!</p>
              <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto mb-6">
                <p className="text-sm text-blue-800 mb-4">
                  🤖 Powered by Gemma 3n • Works completely offline with Ollama
                </p>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Ask homework questions</li>
                  <li>• Get explanations for concepts</li>
                  <li>• Practice with study topics</li>
                  <li>• General knowledge queries</li>
                </ul>
              </div>
              <button
                onClick={() => setIsChatbotOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Chatting</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rewards & Achievements</h3>
              
              {/* Rewards System Explanation */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🎁 Rewards System</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <p className="font-medium mb-1">Daily Rewards:</p>
                    <ul className="space-y-1">
                      <li>• +10 coins for daily login</li>
                      <li>• +5 coins per completed lesson</li>
                      <li>• +20 coins for perfect quiz scores</li>
                      <li>• +50 coins for 7-day streak bonus</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Achievement Rewards:</p>
                    <ul className="space-y-1">
                      <li>• +100 coins for subject mastery</li>
                      <li>• +200 coins for level up</li>
                      <li>• +500 coins for 30-day streak</li>
                      <li>• Special badges for milestones</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Your Rewards</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Gift className="w-6 h-6 text-yellow-600" />
                        <div>
                          <p className="font-medium text-gray-900">Daily Bonus</p>
                          <p className="text-sm text-gray-500">+50 coins for {user.streak}-day streak</p>
                        </div>
                      </div>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-600 hover:scale-105 hover:shadow-md transition-all duration-200">
                        Claim
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Award className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Level Up Reward</p>
                          <p className="text-sm text-gray-500">Reached Level {user.level}</p>
                        </div>
                      </div>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-600 hover:scale-105 hover:shadow-md transition-all duration-200">
                        Claim
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Available Badges</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {achievements.slice(0, 6).map((badge) => (
                      <div key={badge.id} className={`text-center p-3 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer ${badge.earned ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'}`}>
                        <div className="text-2xl mb-1 hover:scale-110 transition-transform duration-200">{badge.icon}</div>
                        <p className="text-xs font-medium text-gray-900">{badge.title}</p>
                        <p className="text-xs text-gray-500">{badge.earned ? 'Earned' : 'Locked'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-8">
            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Subject Progress Overview</h3>
                <ProgressChart data={chartData} />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Activity</h3>
                <ActivityChart data={weeklyData} />
              </div>
            </div>

            {/* Detailed Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Subject Progress</h4>
                  <div className="space-y-4">
                    {subjects.map((subject) => (
                      <div key={subject.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{subject.icon}</span>
                            <span className="font-medium text-gray-900">{subject.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{subject.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${subject.color}`}
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{subject.completedLessons}/{subject.totalLessons} lessons</span>
                          <span>Avg: {subject.averageScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Recent Activities</h4>
                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'quiz' ? 'bg-green-100' : 
                            activity.type === 'flashcard' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            {activity.type === 'quiz' ? '📝' : 
                             activity.type === 'flashcard' ? '🗂️' : '📖'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.subject}</p>
                            <p className="text-sm text-gray-500">{activity.topic}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.score && <p className="font-medium text-green-600">{activity.score}%</p>}
                          <p className="text-xs text-gray-500">{formatTimeAgo(activity.time)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Gemma 3n Chatbot */}
      <GemmaChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />

      {/* Quick Actions Modals */}
      {showStudyPlan && (
        <StudyPlan 
          onClose={() => setShowStudyPlan(false)} 
          user={user} 
        />
      )}

      {showLearningGoals && (
        <LearningGoals 
          onClose={() => setShowLearningGoals(false)} 
          user={user} 
        />
      )}

      {showProgressReport && (
        <ProgressReport 
          onClose={() => setShowProgressReport(false)} 
          user={user} 
        />
      )}

      {showStreakTracker && (
        <StreakTracker 
          onClose={() => setShowStreakTracker(false)} 
          user={user} 
        />
      )}

      {showStudyTimer && (
        <StudyTimer 
          onClose={() => setShowStudyTimer(false)} 
          user={user} 
        />
      )}

      {showLearningResources && (
        <LearningResources 
          onClose={() => setShowLearningResources(false)} 
          user={user} 
        />
      )}

      {showStudyAnalytics && (
        <StudyAnalytics 
          onClose={() => setShowStudyAnalytics(false)} 
          user={user} 
        />
      )}
    </div>
  );
} 