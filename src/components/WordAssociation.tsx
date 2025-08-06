'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, Clock, Link, Star, Target } from 'lucide-react';
import { useSound } from '@/lib/soundEffects';

interface WordAssociationProps {
  onClose: () => void;
  onComplete: (score: number, totalQuestions: number) => void;
  subject?: string;
}

interface AssociationQuestion {
  word: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const associationQuestions = {
  Mathematics: [
    {
      word: 'ALGEBRA',
      options: ['EQUATION', 'GEOMETRY', 'CALCULUS', 'FRACTION'],
      correctAnswer: 'EQUATION',
      explanation: 'Algebra deals with equations and solving for unknown variables.'
    },
    {
      word: 'CIRCLE',
      options: ['RADIUS', 'SQUARE', 'TRIANGLE', 'RECTANGLE'],
      correctAnswer: 'RADIUS',
      explanation: 'A radius is a line from the center of a circle to any point on its edge.'
    },
    {
      word: 'FUNCTION',
      options: ['VARIABLE', 'GRAPH', 'EQUATION', 'FORMULA'],
      correctAnswer: 'GRAPH',
      explanation: 'Functions are often represented and visualized using graphs.'
    },
    {
      word: 'PROBABILITY',
      options: ['STATISTICS', 'CALCULUS', 'GEOMETRY', 'ALGEBRA'],
      correctAnswer: 'STATISTICS',
      explanation: 'Probability is a fundamental concept in statistics.'
    },
    {
      word: 'DERIVATIVE',
      options: ['CALCULUS', 'ALGEBRA', 'GEOMETRY', 'TRIGONOMETRY'],
      correctAnswer: 'CALCULUS',
      explanation: 'Derivatives are a key concept in calculus.'
    },
    {
      word: 'ANGLE',
      options: ['DEGREE', 'RADIUS', 'DIAMETER', 'CIRCUMFERENCE'],
      correctAnswer: 'DEGREE',
      explanation: 'Angles are measured in degrees.'
    },
    {
      word: 'FRACTION',
      options: ['DECIMAL', 'PERCENTAGE', 'RATIO', 'PROPORTION'],
      correctAnswer: 'DECIMAL',
      explanation: 'Fractions can be converted to decimals.'
    },
    {
      word: 'VARIABLE',
      options: ['ALGEBRA', 'EQUATION', 'FORMULA', 'EXPRESSION'],
      correctAnswer: 'ALGEBRA',
      explanation: 'Variables are fundamental in algebraic expressions and equations.'
    }
  ],
  Science: [
    {
      word: 'ATOM',
      options: ['MOLECULE', 'CELL', 'ORGANISM', 'TISSUE'],
      correctAnswer: 'MOLECULE',
      explanation: 'Atoms combine to form molecules.'
    },
    {
      word: 'GRAVITY',
      options: ['PHYSICS', 'FORCE', 'ENERGY', 'MASS'],
      correctAnswer: 'FORCE',
      explanation: 'Gravity is a fundamental force in physics.'
    },
    {
      word: 'CELL',
      options: ['BIOLOGY', 'ORGANISM', 'TISSUE', 'ORGAN'],
      correctAnswer: 'BIOLOGY',
      explanation: 'Cells are the basic units of life studied in biology.'
    },
    {
      word: 'CHEMICAL',
      options: ['REACTION', 'MOLECULE', 'ATOM', 'ELEMENT'],
      correctAnswer: 'REACTION',
      explanation: 'Chemicals participate in chemical reactions.'
    },
    {
      word: 'EVOLUTION',
      options: ['BIOLOGY', 'GENETICS', 'SPECIES', 'ADAPTATION'],
      correctAnswer: 'BIOLOGY',
      explanation: 'Evolution is a fundamental concept in biology.'
    },
    {
      word: 'ENERGY',
      options: ['PHYSICS', 'FORCE', 'POWER', 'WORK'],
      correctAnswer: 'PHYSICS',
      explanation: 'Energy is a central concept in physics.'
    },
    {
      word: 'DNA',
      options: ['GENETICS', 'CELL', 'CHROMOSOME', 'GENE'],
      correctAnswer: 'GENETICS',
      explanation: 'DNA is the genetic material studied in genetics.'
    },
    {
      word: 'ECOSYSTEM',
      options: ['ECOLOGY', 'ENVIRONMENT', 'HABITAT', 'COMMUNITY'],
      correctAnswer: 'ECOLOGY',
      explanation: 'Ecosystems are studied in the field of ecology.'
    }
  ],
  English: [
    {
      word: 'GRAMMAR',
      options: ['SENTENCE', 'PARAGRAPH', 'ESSAY', 'STORY'],
      correctAnswer: 'SENTENCE',
      explanation: 'Grammar deals with sentence structure and rules.'
    },
    {
      word: 'METAPHOR',
      options: ['FIGURATIVE', 'LITERAL', 'SYMBOLIC', 'ABSTRACT'],
      correctAnswer: 'FIGURATIVE',
      explanation: 'Metaphors are a type of figurative language.'
    },
    {
      word: 'POETRY',
      options: ['RHYME', 'PROSE', 'FICTION', 'NONFICTION'],
      correctAnswer: 'RHYME',
      explanation: 'Poetry often uses rhyme and rhythm.'
    },
    {
      word: 'SYNONYM',
      options: ['MEANING', 'OPPOSITE', 'DEFINITION', 'EXAMPLE'],
      correctAnswer: 'MEANING',
      explanation: 'Synonyms have the same or similar meanings.'
    },
    {
      word: 'LITERATURE',
      options: ['BOOK', 'AUTHOR', 'READER', 'PUBLISHER'],
      correctAnswer: 'BOOK',
      explanation: 'Literature consists of written works, often in book form.'
    },
    {
      word: 'VOCABULARY',
      options: ['WORDS', 'LANGUAGE', 'SPEECH', 'COMMUNICATION'],
      correctAnswer: 'WORDS',
      explanation: 'Vocabulary is a collection of words.'
    },
    {
      word: 'ANALYSIS',
      options: ['EXAMINATION', 'SUMMARY', 'CONCLUSION', 'INTRODUCTION'],
      correctAnswer: 'EXAMINATION',
      explanation: 'Analysis involves detailed examination of something.'
    },
    {
      word: 'COMPREHENSION',
      options: ['UNDERSTANDING', 'READING', 'WRITING', 'SPEAKING'],
      correctAnswer: 'UNDERSTANDING',
      explanation: 'Comprehension is about understanding what is read.'
    }
  ],
  Geography: [
    {
      word: 'CONTINENT',
      options: ['LANDMASS', 'COUNTRY', 'CITY', 'ISLAND'],
      correctAnswer: 'LANDMASS',
      explanation: 'A continent is a large landmass on Earth.'
    },
    {
      word: 'OCEAN',
      options: ['WATER', 'SEA', 'RIVER', 'LAKE'],
      correctAnswer: 'WATER',
      explanation: 'Oceans are large bodies of water.'
    },
    {
      word: 'MOUNTAIN',
      options: ['ELEVATION', 'VALLEY', 'PLAIN', 'HILL'],
      correctAnswer: 'ELEVATION',
      explanation: 'Mountains are high elevations of land.'
    },
    {
      word: 'CLIMATE',
      options: ['WEATHER', 'TEMPERATURE', 'PRECIPITATION', 'HUMIDITY'],
      correctAnswer: 'WEATHER',
      explanation: 'Climate is the long-term pattern of weather.'
    },
    {
      word: 'POPULATION',
      options: ['PEOPLE', 'CITY', 'COUNTRY', 'REGION'],
      correctAnswer: 'PEOPLE',
      explanation: 'Population refers to the number of people in an area.'
    },
    {
      word: 'CULTURE',
      options: ['TRADITION', 'LANGUAGE', 'RELIGION', 'CUSTOMS'],
      correctAnswer: 'TRADITION',
      explanation: 'Culture includes traditions and customs of a group.'
    },
    {
      word: 'ECONOMY',
      options: ['TRADE', 'MONEY', 'BUSINESS', 'INDUSTRY'],
      correctAnswer: 'TRADE',
      explanation: 'Economy involves trade and exchange of goods.'
    },
    {
      word: 'RESOURCES',
      options: ['MATERIALS', 'ENERGY', 'MINERALS', 'FUEL'],
      correctAnswer: 'MATERIALS',
      explanation: 'Resources are materials that can be used.'
    }
  ],
  History: [
    {
      word: 'ANCIENT',
      options: ['PAST', 'PRESENT', 'FUTURE', 'MODERN'],
      correctAnswer: 'PAST',
      explanation: 'Ancient refers to the distant past.'
    },
    {
      word: 'REVOLUTION',
      options: ['CHANGE', 'WAR', 'PEACE', 'AGREEMENT'],
      correctAnswer: 'CHANGE',
      explanation: 'Revolutions bring about significant change.'
    },
    {
      word: 'EMPIRE',
      options: ['POWER', 'KINGDOM', 'REPUBLIC', 'DEMOCRACY'],
      correctAnswer: 'POWER',
      explanation: 'Empires are characterized by power and control.'
    },
    {
      word: 'CIVILIZATION',
      options: ['SOCIETY', 'CULTURE', 'TECHNOLOGY', 'PROGRESS'],
      correctAnswer: 'SOCIETY',
      explanation: 'Civilization refers to an advanced society.'
    },
    {
      word: 'ARTIFACT',
      options: ['OBJECT', 'DOCUMENT', 'RECORD', 'EVIDENCE'],
      correctAnswer: 'OBJECT',
      explanation: 'Artifacts are objects from the past.'
    },
    {
      word: 'HERITAGE',
      options: ['LEGACY', 'INHERITANCE', 'TRADITION', 'CULTURE'],
      correctAnswer: 'LEGACY',
      explanation: 'Heritage is the legacy passed down from the past.'
    },
    {
      word: 'ARCHAEOLOGY',
      options: ['DIGGING', 'EXCAVATION', 'DISCOVERY', 'EXPLORATION'],
      correctAnswer: 'DIGGING',
      explanation: 'Archaeology involves digging to discover ancient remains.'
    },
    {
      word: 'TIMELINE',
      options: ['CHRONOLOGY', 'HISTORY', 'PERIOD', 'ERA'],
      correctAnswer: 'CHRONOLOGY',
      explanation: 'Timelines show chronological order of events.'
    }
  ]
};

export default function WordAssociation({ onClose, onComplete, subject = 'Mathematics' }: WordAssociationProps) {
  const [currentQuestion, setCurrentQuestion] = useState<AssociationQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const sound = useSound();
  
  const questions = associationQuestions[subject as keyof typeof associationQuestions] || associationQuestions.Mathematics;
  const totalRounds = 8;

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, showResult]);

  const startGame = () => {
    sound.playGameStart();
    setGameStarted(true);
    setCurrentRound(1);
    setScore(0);
    setTimeLeft(30);
    setShowResult(false);
    setShowExplanation(false);
    setHintUsed(false);
    setSelectedAnswer(null);
    setCurrentQuestion(questions[0]);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctAnswer;
    setShowResult(true);
    
    if (isCorrect) {
      sound.playCorrectAnswer();
      setScore(prev => prev + (hintUsed ? 1 : 2));
    } else {
      sound.playWrongAnswer();
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setCurrentQuestion(questions[currentRound]);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
      setHintUsed(false);
      setTimeLeft(30);
    } else {
      onComplete(score, totalRounds);
    }
  };

  const handleTimeUp = () => {
    sound.playWrongAnswer();
    setShowResult(true);
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const useHint = () => {
    setShowExplanation(true);
    setHintUsed(true);
    sound.playButtonClick();
  };

  const getOptionClass = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option 
        ? 'bg-blue-500 text-white border-blue-500' 
        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400';
    }
    
    if (option === currentQuestion?.correctAnswer) {
      return 'bg-green-500 text-white border-green-500';
    }
    
    if (selectedAnswer === option && option !== currentQuestion?.correctAnswer) {
      return 'bg-red-500 text-white border-red-500';
    }
    
    return 'bg-gray-100 text-gray-500 border-gray-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Word Association</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {!gameStarted ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Link className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Connect Words?</h3>
            <p className="text-gray-600 mb-6">Find the word that best associates with the given term!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Game Info */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600">Round: {currentRound}/{totalRounds}</span>
                <span className="text-sm font-medium text-gray-600">Score: {score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-green-500'}`}>
                  {timeLeft}
                </span>
              </div>
            </div>

            {/* Question */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Which word best associates with:</h3>
              <div className="text-3xl font-bold text-orange-800 mb-4">
                {currentQuestion?.word}
              </div>
              
              {/* Hint Button */}
              <button
                onClick={useHint}
                disabled={showExplanation || hintUsed}
                className="flex items-center space-x-2 mx-auto px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Star className="w-4 h-4" />
                <span>Use Hint</span>
              </button>
              
              {showExplanation && currentQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-sm text-blue-800">
                    <strong>Hint:</strong> {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion?.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 font-medium ${getOptionClass(option)}`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Result Display */}
            <AnimatePresence>
              {showResult && currentQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? 'bg-green-100 border border-green-300 text-green-800'
                      : 'bg-red-100 border border-red-300 text-red-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                    <span className="font-semibold">
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
                    </span>
                  </div>
                  <p className="text-sm text-center">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">How to play:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Choose the word that best associates with the given term</li>
                <li>• Use hints for fewer points (1 point instead of 2)</li>
                <li>• You have 30 seconds per question</li>
                <li>• Think about the relationships between concepts</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 