'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Coffee,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface StudyTimerProps {
  onClose: () => void;
  user: any;
}

interface TimerSession {
  id: string;
  type: 'study' | 'break';
  duration: number;
  title: string;
  completed: boolean;
}

export default function StudyTimer({ onClose, user }: StudyTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [currentSession, setCurrentSession] = useState<'study' | 'break'>('study');
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [customStudyTime, setCustomStudyTime] = useState(25);
  const [customBreakTime, setCustomBreakTime] = useState(5);
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [autoStartSessions, setAutoStartSessions] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/notification.mp3'); // You can add a notification sound file
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {}); // Ignore audio errors
    }

    const newSession: TimerSession = {
      id: Date.now().toString(),
      type: currentSession,
      duration: currentSession === 'study' ? customStudyTime * 60 : customBreakTime * 60,
      title: currentSession === 'study' ? 'Study Session' : 'Break Time',
      completed: true
    };

    setSessions(prev => [...prev, newSession]);
    setCompletedSessions(prev => prev + 1);

    if (currentSession === 'study') {
      setTotalStudyTime(prev => prev + customStudyTime * 60);
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        currentSession === 'study' ? 'Study Session Complete!' : 'Break Time!',
        {
          body: currentSession === 'study' 
            ? 'Great job! Time for a break.' 
            : 'Break is over. Ready to study again?',
          icon: '/logo.png'
        }
      );
    }

    // Switch to next session
    if (currentSession === 'study') {
      setCurrentSession('break');
      setTimeLeft(customBreakTime * 60);
      if (autoStartBreaks) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    } else {
      setCurrentSession('study');
      setTimeLeft(customStudyTime * 60);
      if (autoStartSessions) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentSession === 'study' ? customStudyTime * 60 : customBreakTime * 60);
  };

  const skipSession = () => {
    handleSessionComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const saveSettings = () => {
    setTimeLeft(currentSession === 'study' ? customStudyTime * 60 : customBreakTime * 60);
    setShowSettings(false);
  };

  const getProgressPercentage = () => {
    const totalTime = currentSession === 'study' ? customStudyTime * 60 : customBreakTime * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className={`p-6 text-white ${currentSession === 'study' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-teal-600'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentSession === 'study' ? <BookOpen className="w-8 h-8" /> : <Coffee className="w-8 h-8" />}
              <div>
                <h2 className="text-2xl font-bold">Study Timer</h2>
                <p className="text-blue-100">
                  {currentSession === 'study' ? 'Focus Time' : 'Break Time'}
                </p>
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
          {/* Timer Display */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold text-gray-900 mb-2 font-mono">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-gray-600">
                  {currentSession === 'study' ? 'Study Session' : 'Break Time'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    currentSession === 'study' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gradient-to-r from-green-500 to-teal-500'
                  }`}
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center space-x-4">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="flex items-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </button>
                )}
                
                <button
                  onClick={resetTimer}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={skipSession}
                  className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Target className="w-5 h-5" />
                  <span>Skip</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Sessions Completed</p>
                  <p className="text-2xl font-bold text-blue-900">{completedSessions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Study Time</p>
                  <p className="text-2xl font-bold text-green-900">{Math.floor(totalStudyTime / 60)}m</p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Current Streak</p>
                  <p className="text-2xl font-bold text-purple-900">{user?.stats?.streak || 0} 🔥</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Timer Settings</h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {showSettings ? 'Hide' : 'Customize'}
              </button>
            </div>

            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 p-4 rounded-xl border"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Study Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={customStudyTime}
                      onChange={(e) => setCustomStudyTime(parseInt(e.target.value) || 25)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Break Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={customBreakTime}
                      onChange={(e) => setCustomBreakTime(parseInt(e.target.value) || 5)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="30"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={autoStartBreaks}
                      onChange={(e) => setAutoStartBreaks(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Auto-start breaks</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={autoStartSessions}
                      onChange={(e) => setAutoStartSessions(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Auto-start study sessions</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Enable sound notifications</span>
                  </label>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={saveSettings}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Settings
                  </button>
                  <button
                    onClick={requestNotificationPermission}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Enable Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Session History */}
          {sessions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {sessions.slice(-5).reverse().map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      session.type === 'study' 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {session.type === 'study' ? (
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Coffee className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{session.title}</p>
                        <p className="text-sm text-gray-600">
                          {Math.floor(session.duration / 60)} minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border">
            <h3 className="font-semibold text-gray-900 mb-2">Study Tips</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Take regular breaks to maintain focus and productivity</p>
              <p>• Use the timer to build consistent study habits</p>
              <p>• Track your progress to stay motivated</p>
              <p>• Combine with other learning tools for best results</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 