'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Filter, 
  Search, 
  Star, 
  Trophy, 
  Target,
  BarChart3,
  Play,
  Settings,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { 
  QuizQuestion, 
  getAvailableSubjects, 
  getAvailableDifficulties,
  getQuestionsBySubject,
  getQuestionsByDifficulty,
  getMixedDifficultyQuestions,
  getQuestionStats
} from '@/lib/quizData';

interface QuizManagerProps {
  onStartQuiz: (questions: QuizQuestion[]) => void;
  onClose: () => void;
}

export default function QuizManager({ onStartQuiz, onClose }: QuizManagerProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [questionCount, setQuestionCount] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const subjects = ['All', ...getAvailableSubjects()];
  const difficulties = ['All', ...getAvailableDifficulties()];
  const stats = getQuestionStats();

  const getFilteredQuestions = (): QuizQuestion[] => {
    let questions = [...stats.bySubject.flatMap(subject => 
      getQuestionsBySubject(subject.subject)
    )];

    if (selectedSubject !== 'All') {
      questions = questions.filter(q => q.subject === selectedSubject);
    }

    if (selectedDifficulty !== 'All') {
      questions = questions.filter(q => q.difficulty === selectedDifficulty);
    }

    if (searchTerm) {
      questions = questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return questions.sort(() => 0.5 - Math.random()).slice(0, questionCount);
  };

  const handleStartQuiz = () => {
    const questions = getFilteredQuestions();
    if (questions.length > 0) {
      onStartQuiz(questions);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    return colors[subjects.indexOf(subject) % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Quiz Manager</h1>
                <p className="text-blue-100">Customize your quiz experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Total Questions</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">{stats.total}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">Subjects</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">{stats.bySubject.length}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200"
            >
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Avg Points</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2">{stats.averagePoints}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200"
            >
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-orange-600" />
                <span className="font-bold text-orange-800">Difficulty Levels</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-2">{stats.byDifficulty.length}</p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-800">Quiz Filters</h3>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              >
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{showFilters ? 'Hide' : 'Show'} Filters</span>
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search questions or subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Subject Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {difficulties.map(difficulty => (
                          <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                      </select>
                    </div>

                    {/* Question Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Count</label>
                      <select
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={5}>5 Questions</option>
                        <option value={10}>10 Questions</option>
                        <option value={15}>15 Questions</option>
                        <option value={20}>20 Questions</option>
                        <option value={30}>30 Questions</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subject Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Available Subjects</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stats.bySubject.map((subject, index) => (
                <motion.button
                  key={subject.subject}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSubject(subject.subject)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedSubject === subject.subject 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getSubjectColor(subject.subject)}`}>
                      {subject.subject}
                    </div>
                    <p className="text-sm font-bold text-gray-700">{subject.count} questions</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Difficulty Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.byDifficulty.map((difficulty) => (
                <motion.button
                  key={difficulty.difficulty}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDifficulty(difficulty.difficulty)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedDifficulty === difficulty.difficulty 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getDifficultyColor(difficulty.difficulty)}`}>
                        {difficulty.difficulty}
                      </div>
                      <p className="text-lg font-bold text-gray-700">{difficulty.count} questions</p>
                    </div>
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Start Quiz Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartQuiz}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              <span>Start Quiz with {getFilteredQuestions().length} Questions</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 