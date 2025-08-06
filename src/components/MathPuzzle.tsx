'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  X, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Sparkles,
  Calculator,
  Trophy
} from 'lucide-react';

interface MathPuzzleProps {
  onClose: () => void;
  onComplete: (score: number, totalQuestions: number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface Puzzle {
  question: string;
  answer: number;
  options: number[];
  points: number;
}

export default function MathPuzzle({ onClose, onComplete, difficulty = 'easy' }: MathPuzzleProps) {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    generatePuzzles();
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      setIsTimeUp(true);
      setTimeout(() => {
        onComplete(score, puzzles.length);
        onClose();
      }, 2000);
    }
  }, [timeLeft, showResult, score, puzzles.length, onComplete, onClose]);

  const generatePuzzles = () => {
    const newPuzzles: Puzzle[] = [];
    
    for (let i = 0; i < 10; i++) {
      let puzzle: Puzzle;
      
      if (difficulty === 'easy') {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const operation = Math.random() > 0.5 ? '+' : '-';
        const answer = operation === '+' ? a + b : a - b;
        
        puzzle = {
          question: `${a} ${operation} ${b} = ?`,
          answer,
          options: generateOptions(answer, 4),
          points: 10
        };
      } else if (difficulty === 'medium') {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const operation = Math.random() > 0.5 ? '*' : '/';
        const answer = operation === '*' ? a * b : Math.floor(a / b);
        
        puzzle = {
          question: `${a} ${operation === '*' ? '×' : '÷'} ${b} = ?`,
          answer,
          options: generateOptions(answer, 4),
          points: 15
        };
      } else {
        const a = Math.floor(Math.random() * 50) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const c = Math.floor(Math.random() * 10) + 1;
        const answer = a + b * c;
        
        puzzle = {
          question: `${a} + ${b} × ${c} = ?`,
          answer,
          options: generateOptions(answer, 4),
          points: 20
        };
      }
      
      newPuzzles.push(puzzle);
    }
    
    setPuzzles(newPuzzles);
  };

  const generateOptions = (correctAnswer: number, count: number): number[] => {
    const options = [correctAnswer];
    
    while (options.length < count) {
      const wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
      if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    return options.sort(() => 0.5 - Math.random());
  };

  const currentPuzzle = puzzles[currentPuzzleIndex];

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    
    setTimeout(() => {
      if (answer === currentPuzzle.answer) {
        setScore(prev => prev + currentPuzzle.points);
      }
      
      if (currentPuzzleIndex < puzzles.length - 1) {
        setCurrentPuzzleIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        setTimeout(() => {
          onComplete(score + (answer === currentPuzzle.answer ? currentPuzzle.points : 0), puzzles.length);
          onClose();
        }, 2000);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setCurrentPuzzleIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    setIsTimeUp(false);
    generatePuzzles();
  };

  if (puzzles.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading math puzzle...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / (puzzles.length * 10)) * 100);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Puzzle Completed!</h2>
          <p className="text-gray-600 mb-6">Great job solving the math puzzles!</p>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-6">
            <div className="text-3xl font-bold mb-2">{score} points</div>
            <div className="text-lg">{percentage}% accuracy</div>
            <div className="text-sm opacity-90">
              {puzzles.length} puzzles • {timeLeft}s remaining
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isTimeUp) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Time's Up!</h2>
          <p className="text-gray-600 mb-6">You ran out of time!</p>
          
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl p-6 mb-6">
            <div className="text-3xl font-bold mb-2">{score} points</div>
            <div className="text-lg">Final Score</div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] h-[95vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Math Puzzle</h1>
                <p className="text-blue-100 text-sm">Puzzle {currentPuzzleIndex + 1} of {puzzles.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4" />
                <span className="font-bold">{score}</span>
              </div>
              <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
                <span className="font-bold">{timeLeft}s</span>
              </div>
              <button
                onClick={handleRestart}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPuzzleIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              {/* Question Display */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-200 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {currentPuzzleIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-3xl font-bold text-gray-900 text-center">
                        {currentPuzzle.question}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Calculator className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-sm justify-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{currentPuzzle.points} pts</span>
                  </span>
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentPuzzle.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ 
                      scale: selectedAnswer === null ? 1.02 : 1,
                      y: selectedAnswer === null ? -2 : 0
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-6 rounded-2xl border-4 text-2xl font-bold transition-all duration-300 shadow-lg relative overflow-hidden
                      ${selectedAnswer === null 
                        ? 'bg-green-50 border-green-200 hover:bg-green-100 text-gray-900 cursor-pointer hover:shadow-xl' 
                        : selectedAnswer === option
                          ? option === currentPuzzle.answer
                            ? 'bg-green-200 border-green-500 text-green-800'
                            : 'bg-red-200 border-red-500 text-red-800'
                          : option === currentPuzzle.answer
                            ? 'bg-green-100 border-green-400 text-green-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 opacity-80'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold">{option}</span>
                    </div>
                    
                    {/* Success/Error animation overlay */}
                    {selectedAnswer === option && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90"
                      >
                        {option === currentPuzzle.answer ? (
                          <CheckCircle className="w-16 h-16 text-green-600" />
                        ) : (
                          <XCircle className="w-16 h-16 text-red-600" />
                        )}
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 bg-gray-100 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPuzzleIndex + 1) / puzzles.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
} 