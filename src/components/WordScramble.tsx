'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, ArrowRight, Shuffle, Clock, Star } from 'lucide-react';
import { useSound } from '@/lib/soundEffects';

interface WordScrambleProps {
  onClose: () => void;
  onComplete: (score: number, totalWords: number) => void;
  subject?: string;
}

const academicWords = {
  Mathematics: [
    { word: 'ALGEBRA', hint: 'A branch of mathematics dealing with symbols' },
    { word: 'CALCULUS', hint: 'The study of continuous change' },
    { word: 'GEOMETRY', hint: 'The study of shapes and space' },
    { word: 'FRACTION', hint: 'A part of a whole' },
    { word: 'EQUATION', hint: 'A mathematical statement of equality' },
    { word: 'FUNCTION', hint: 'A relationship between inputs and outputs' },
    { word: 'VARIABLE', hint: 'A symbol representing an unknown value' },
    { word: 'INTEGER', hint: 'A whole number' }
  ],
  Science: [
    { word: 'PHYSICS', hint: 'The study of matter and energy' },
    { word: 'CHEMISTRY', hint: 'The study of substances' },
    { word: 'BIOLOGY', hint: 'The study of living organisms' },
    { word: 'ATOM', hint: 'The smallest unit of an element' },
    { word: 'CELL', hint: 'The basic unit of life' },
    { word: 'GRAVITY', hint: 'The force that attracts objects' },
    { word: 'ENERGY', hint: 'The ability to do work' },
    { word: 'MATTER', hint: 'Anything that has mass' }
  ],
  English: [
    { word: 'GRAMMAR', hint: 'The system of language rules' },
    { word: 'LITERATURE', hint: 'Written works with artistic value' },
    { word: 'POETRY', hint: 'Literary work in metrical form' },
    { word: 'METAPHOR', hint: 'A figure of speech comparing unlike things' },
    { word: 'SYNONYM', hint: 'A word with the same meaning' },
    { word: 'ANTONYM', hint: 'A word with the opposite meaning' },
    { word: 'VOCABULARY', hint: 'All the words known by a person' },
    { word: 'ANALYSIS', hint: 'Detailed examination' }
  ],
  Geography: [
    { word: 'CONTINENT', hint: 'A large landmass' },
    { word: 'OCEAN', hint: 'A large body of saltwater' },
    { word: 'MOUNTAIN', hint: 'A large natural elevation' },
    { word: 'RIVER', hint: 'A large natural stream' },
    { word: 'DESERT', hint: 'A barren area' },
    { word: 'FOREST', hint: 'A large area with trees' },
    { word: 'ISLAND', hint: 'Land surrounded by water' },
    { word: 'CLIMATE', hint: 'Long-term weather patterns' }
  ],
  History: [
    { word: 'ANCIENT', hint: 'Belonging to the distant past' },
    { word: 'MEDIEVAL', hint: 'Relating to the Middle Ages' },
    { word: 'REVOLUTION', hint: 'A forcible overthrow' },
    { word: 'EMPIRE', hint: 'A group of nations ruled by one authority' },
    { word: 'DEMOCRACY', hint: 'Government by the people' },
    { word: 'CIVILIZATION', hint: 'An advanced stage of society' },
    { word: 'ARTIFACT', hint: 'An object from the past' },
    { word: 'HERITAGE', hint: 'Something inherited from the past' }
  ]
};

const shuffleWord = (word: string): string => {
  const shuffled = word.split('').sort(() => Math.random() - 0.5);
  // Make sure it's not the same as original
  if (shuffled.join('') === word) {
    return shuffleWord(word);
  }
  return shuffled.join('');
};

export default function WordScramble({ onClose, onComplete, subject = 'Mathematics' }: WordScrambleProps) {
  const [currentWordObj, setCurrentWordObj] = useState<{ word: string; hint: string } | null>(null);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const sound = useSound();
  
  const words = academicWords[subject as keyof typeof academicWords] || academicWords.Mathematics;
  const totalRounds = 8;

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted]);

  const startGame = () => {
    sound.playGameStart();
    setGameStarted(true);
    const wordObj = words[Math.floor(Math.random() * words.length)];
    setCurrentWordObj(wordObj);
    setScrambledWord(shuffleWord(wordObj.word));
    setUserGuess('');
    setTimeLeft(60);
    setShowHint(false);
    setHintUsed(false);
    setIsCorrect(null);
  };

  const handleSubmit = () => {
    if (!currentWordObj) return;
    
    const correct = userGuess.toUpperCase() === currentWordObj.word;
    setIsCorrect(correct);
    
    if (correct) {
      sound.playCorrectAnswer();
      setScore(prev => prev + (hintUsed ? 1 : 2));
    } else {
      sound.playWrongAnswer();
    }
    
    setTimeout(() => {
      nextWord();
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const nextWord = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      const wordObj = words[Math.floor(Math.random() * words.length)];
      setCurrentWordObj(wordObj);
      setScrambledWord(shuffleWord(wordObj.word));
      setUserGuess('');
      setTimeLeft(60);
      setShowHint(false);
      setHintUsed(false);
      setIsCorrect(null);
    } else {
      onComplete(score, totalRounds);
    }
  };

  const handleTimeUp = () => {
    sound.playWrongAnswer();
    setIsCorrect(false);
    setTimeout(() => {
      nextWord();
    }, 2000);
  };

  const reshuffle = () => {
    if (currentWordObj) {
      setScrambledWord(shuffleWord(currentWordObj.word));
      sound.playButtonClick();
    }
  };

  const useHint = () => {
    setShowHint(true);
    setHintUsed(true);
    sound.playButtonClick();
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
          <h2 className="text-2xl font-bold text-gray-900">Word Scramble</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {!gameStarted ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shuffle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Unscramble?</h3>
            <p className="text-gray-600 mb-6">Unscramble the academic words before time runs out!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
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
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Scrambled Word */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Unscramble this word:</h3>
              <div className="text-4xl font-mono font-bold text-purple-800 tracking-wider mb-4">
                {scrambledWord}
              </div>
              <button
                onClick={reshuffle}
                className="flex items-center space-x-2 mx-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                <span>Reshuffle</span>
              </button>
            </div>

            {/* Hint Section */}
            <div className="text-center">
              <button
                onClick={useHint}
                disabled={showHint || hintUsed}
                className="flex items-center space-x-2 mx-auto px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Star className="w-4 h-4" />
                <span>Use Hint</span>
              </button>
              
              {showHint && currentWordObj && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-sm text-blue-800">
                    <strong>Hint:</strong> {currentWordObj.hint}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Your answer:</label>
              <input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type the unscrambled word..."
                className="w-full p-4 text-xl font-mono text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                autoFocus
              />
            </div>

            {/* Result Display */}
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg ${
                    isCorrect 
                      ? 'bg-green-100 border border-green-300 text-green-800' 
                      : 'bg-red-100 border border-red-300 text-red-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    <span className="font-semibold">
                      {isCorrect ? 'Correct!' : 'Incorrect!'}
                    </span>
                  </div>
                  {!isCorrect && currentWordObj && (
                    <p className="text-sm mt-1">Correct answer: {currentWordObj.word}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSubmit}
                disabled={!userGuess.trim()}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">How to play:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Unscramble the letters to form the correct word</li>
                <li>• Use hints for fewer points (1 point instead of 2)</li>
                <li>• Click reshuffle if you need a different arrangement</li>
                <li>• Press Enter or click Submit to check your answer</li>
                <li>• You have 60 seconds per word</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 