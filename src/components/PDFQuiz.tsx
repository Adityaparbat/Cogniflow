'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  X, 
  Lightbulb, 
  Trophy, 
  CheckCircle, 
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Star as StarIcon,
  Smile,
  PartyPopper,
  BookOpen,
  FileText
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  hint: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface PDFQuizProps {
  onClose: () => void;
  onComplete: (score: number, totalQuestions: number) => void;
  subject: string;
  chapter: string;
  questionCount?: number;
}

export default function PDFQuiz({ onClose, onComplete, subject, chapter, questionCount = 10 }: PDFQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPDFQuestions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to load PDF-generated content
        const module = await import(`@/lib/scripts/${subject}_${chapter}_content.ts`);
        
        if (module.generatedQuizzes && module.generatedQuizzes.length > 0) {
          let quizQuestions = module.generatedQuizzes;
          
          // Shuffle and limit
          quizQuestions = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, questionCount);
          
          setQuestions(quizQuestions);
          setAnsweredCorrectly(new Array(quizQuestions.length).fill(false));
          setCurrentQuestionIndex(0);
          setScore(0);
          setQuizCompleted(false);
          setShowResult(false);
        } else {
          setError('No quiz questions found in the PDF-generated content');
        }
      } catch (error) {
        console.error('Error loading PDF quiz questions:', error);
        setError(`No PDF content found for ${subject} - ${chapter}. Please upload a PDF first.`);
      } finally {
        setIsLoading(false);
      }
    };

    if (subject && chapter) {
      loadPDFQuestions();
    }
  }, [subject, chapter, questionCount]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (optionIndex: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);

    if (optionIndex === currentQuestion.answer) {
      // Correct answer
      if (!answeredCorrectly[currentQuestionIndex]) {
        const points = attempts === 0 ? currentQuestion.points : Math.floor(currentQuestion.points / 2);
        setScore(prev => prev + points);
        const newAnsweredCorrectly = [...answeredCorrectly];
        newAnsweredCorrectly[currentQuestionIndex] = true;
        setAnsweredCorrectly(newAnsweredCorrectly);
      }

      // Move to next question after delay
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setShowHint(false);
          setAttempts(0);
        } else {
          // Quiz completed
          setQuizCompleted(true);
          setShowResult(true);
          if (onComplete) {
            onComplete(score + currentQuestion.points, questions.length);
          }
        }
      }, 1500);
    } else {
      // Wrong answer
      setAttempts(prev => prev + 1);
      if (attempts >= 1) {
        // Show correct answer after 2 attempts
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowHint(false);
            setAttempts(0);
          } else {
            setQuizCompleted(true);
            setShowResult(true);
            if (onComplete) {
              onComplete(score, questions.length);
            }
          }
        }, 2000);
      }
    }
  };

  const handleHint = () => {
    setShowHint(true);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowHint(false);
      setAttempts(0);
    }
  };

  const handleQuit = () => {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
      onClose();
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowHint(false);
    setAttempts(0);
    setAnsweredCorrectly(new Array(questions.length).fill(false));
    setQuizCompleted(false);
    setShowResult(false);
  };

  const getOptionStyle = (optionIndex: number) => {
    if (selectedOption === null) {
      return 'bg-white hover:bg-gray-50 border-gray-300 hover:border-blue-400';
    }

    if (optionIndex === currentQuestion.answer) {
      return 'bg-green-100 border-green-500 text-green-800';
    }

    if (selectedOption === optionIndex && optionIndex !== currentQuestion.answer) {
      return 'bg-red-100 border-red-500 text-red-800';
    }

    return 'bg-gray-100 border-gray-300 text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No PDF Content Found</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quiz Available</h3>
          <p className="text-gray-600 mb-6">
            No quiz questions were generated from the PDF content for {subject} - {chapter}.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = percentage === 100;
    const isGood = percentage >= 80;
    const isPassing = percentage >= 60;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="mb-6">
            {isPerfect && (
              <div className="text-6xl mb-4">🎉</div>
            )}
            {isGood && !isPerfect && (
              <div className="text-6xl mb-4">🌟</div>
            )}
            {isPassing && !isGood && (
              <div className="text-6xl mb-4">👍</div>
            )}
            {!isPassing && (
              <div className="text-6xl mb-4">📚</div>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PDF Quiz Complete!</h2>
            <p className="text-gray-600 mb-4">
              {isPerfect && "Perfect score! Amazing job!"}
              {isGood && !isPerfect && "Great job! You're doing well!"}
              {isPassing && !isGood && "Good effort! Keep practicing!"}
              {!isPassing && "Keep studying! You'll get better!"}
            </p>
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <span className="text-sm text-blue-600">📄 PDF Generated Content</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-blue-700">Points Earned</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{percentage}%</div>
              <div className="text-sm text-green-700">Score</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleRestart}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">PDF Quiz</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="bg-white bg-opacity-25 px-2 py-1 rounded-full text-xs">
                    📄 PDF Generated
                  </span>
                  <span className="bg-white bg-opacity-25 px-2 py-1 rounded-full text-xs">
                    {subject} - {chapter}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <span className="font-medium">{score} pts</span>
              </div>
              <button
                onClick={handleQuit}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {currentQuestion.subject}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {currentQuestion.difficulty}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {currentQuestion.points} pts
                  </span>
                </div>
                <button
                  onClick={handleHint}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm">Hint</span>
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                {currentQuestion.question}
              </h3>

              {showHint && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Hint</span>
                  </div>
                  <p className="text-yellow-700">{currentQuestion.hint}</p>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={selectedOption !== null}
                  className={`p-4 text-left border-2 rounded-lg transition-all duration-200 font-medium ${
                    getOptionStyle(index)
                  } ${selectedOption === null ? 'hover:scale-[1.02] cursor-pointer' : 'cursor-not-allowed'}`}
                  whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                  whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      selectedOption === null ? 'bg-gray-200 text-gray-700' :
                      index === currentQuestion.answer ? 'bg-green-500 text-white' :
                      selectedOption === index ? 'bg-red-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {selectedOption !== null && index === currentQuestion.answer && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {selectedOption === index && index !== currentQuestion.answer && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Attempts: {attempts + 1}/2
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRestart}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 