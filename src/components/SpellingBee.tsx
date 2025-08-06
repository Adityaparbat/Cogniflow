'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Check, X as XIcon, RotateCcw } from 'lucide-react';
import { useSound } from '@/lib/soundEffects';

interface SpellingBeeProps {
  onClose: () => void;
  onComplete: (score: number, totalWords: number) => void;
  subject?: string;
}

const academicWords = {
  Mathematics: [
    { word: 'ALGEBRA', definition: 'A branch of mathematics dealing with symbols and the rules for manipulating them' },
    { word: 'CALCULUS', definition: 'A branch of mathematics concerned with rates of change and accumulation' },
    { word: 'GEOMETRY', definition: 'The branch of mathematics concerned with shapes, sizes, and properties of space' },
    { word: 'TRIGONOMETRY', definition: 'The branch of mathematics dealing with the relations of the sides and angles of triangles' },
    { word: 'STATISTICS', definition: 'The science of collecting, analyzing, and interpreting data' },
    { word: 'PROBABILITY', definition: 'The likelihood of an event occurring' },
    { word: 'FRACTION', definition: 'A part of a whole expressed as a ratio of two numbers' },
    { word: 'EQUATION', definition: 'A mathematical statement that two expressions are equal' }
  ],
  Science: [
    { word: 'PHYSICS', definition: 'The science of matter, energy, and their interactions' },
    { word: 'CHEMISTRY', definition: 'The science of the composition, structure, and properties of matter' },
    { word: 'BIOLOGY', definition: 'The science of life and living organisms' },
    { word: 'ASTRONOMY', definition: 'The study of celestial objects and phenomena' },
    { word: 'GEOLOGY', definition: 'The science of the Earth\'s structure and composition' },
    { word: 'METEOROLOGY', definition: 'The study of weather and atmospheric conditions' },
    { word: 'ECOLOGY', definition: 'The study of interactions between organisms and their environment' },
    { word: 'GENETICS', definition: 'The study of heredity and variation in organisms' }
  ],
  English: [
    { word: 'GRAMMAR', definition: 'The system of rules governing the structure of language' },
    { word: 'LITERATURE', definition: 'Written works, especially those considered to have artistic value' },
    { word: 'POETRY', definition: 'Literary work in metrical form' },
    { word: 'FICTION', definition: 'Imaginative or invented stories' },
    { word: 'NONFICTION', definition: 'Prose writing that is based on facts and reality' },
    { word: 'METAPHOR', definition: 'A figure of speech comparing two unlike things' },
    { word: 'SIMILE', definition: 'A figure of speech using like or as to compare' },
    { word: 'ALLITERATION', definition: 'The repetition of initial consonant sounds' }
  ],
  Geography: [
    { word: 'CONTINENT', definition: 'One of the large landmasses of the Earth' },
    { word: 'OCEAN', definition: 'A large body of saltwater covering most of the Earth' },
    { word: 'MOUNTAIN', definition: 'A large natural elevation of the Earth\'s surface' },
    { word: 'RIVER', definition: 'A large natural stream of water flowing in a channel' },
    { word: 'DESERT', definition: 'A barren area of landscape with little precipitation' },
    { word: 'FOREST', definition: 'A large area covered chiefly with trees' },
    { word: 'ISLAND', definition: 'A piece of land surrounded by water' },
    { word: 'PENINSULA', definition: 'A piece of land almost surrounded by water' }
  ],
  History: [
    { word: 'ANCIENT', definition: 'Belonging to the very distant past' },
    { word: 'MEDIEVAL', definition: 'Relating to the Middle Ages' },
    { word: 'RENAISSANCE', definition: 'A period of renewed interest in art and learning' },
    { word: 'REVOLUTION', definition: 'A forcible overthrow of a government or social order' },
    { word: 'EMPIRE', definition: 'A group of nations or peoples ruled by a single authority' },
    { word: 'KINGDOM', definition: 'A country ruled by a king or queen' },
    { word: 'DEMOCRACY', definition: 'A system of government by the whole population' },
    { word: 'MONARCHY', definition: 'A form of government with a monarch at the head' }
  ]
};

export default function SpellingBee({ onClose, onComplete, subject = 'Mathematics' }: SpellingBeeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userSpelling, setUserSpelling] = useState('');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const sound = useSound();
  
  const words = academicWords[subject as keyof typeof academicWords] || academicWords.Mathematics;
  const totalRounds = 8;

  const currentWord = words[currentWordIndex];

  const speakWord = (word: string) => {
    if (!isMuted && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startGame = () => {
    sound.playGameStart();
    setGameStarted(true);
    setCurrentWordIndex(0);
    setScore(0);
    setCurrentRound(1);
    setUserSpelling('');
    setShowDefinition(false);
    setIsCorrect(null);
    setHintUsed(false);
    speakWord(currentWord.word);
  };

  const handleSpellingSubmit = () => {
    const correct = userSpelling.toUpperCase() === currentWord.word;
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

  const nextWord = () => {
    if (currentRound < totalRounds) {
      setCurrentWordIndex(prev => (prev + 1) % words.length);
      setCurrentRound(prev => prev + 1);
      setUserSpelling('');
      setShowDefinition(false);
      setIsCorrect(null);
      setHintUsed(false);
      speakWord(words[(currentWordIndex + 1) % words.length].word);
    } else {
      onComplete(score, totalRounds);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSpellingSubmit();
    }
  };

  const useHint = () => {
    setShowDefinition(true);
    setHintUsed(true);
  };

  const repeatWord = () => {
    speakWord(currentWord.word);
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
          <h2 className="text-2xl font-bold text-gray-900">Spelling Bee</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {!gameStarted ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Volume2 className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for the Spelling Bee?</h3>
            <p className="text-gray-600 mb-6">Listen carefully and spell the academic words correctly!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
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
                <span className="text-sm font-medium text-gray-600">Points per word:</span>
                <span className="text-sm font-bold text-blue-600">{hintUsed ? '1' : '2'}</span>
              </div>
            </div>

            {/* Word Section */}
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Listen and Spell:</h3>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={repeatWord}
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                  <span className="text-xl font-medium text-gray-800">Click to hear the word</span>
                </div>
              </div>

              {/* Definition Hint */}
              {showDefinition && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-200 p-4 rounded-lg"
                >
                  <p className="text-sm text-blue-800">
                    <strong>Hint:</strong> {currentWord.definition}
                  </p>
                </motion.div>
              )}

              {/* Spelling Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Your spelling:</label>
                <input
                  type="text"
                  value={userSpelling}
                  onChange={(e) => setUserSpelling(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type the word here..."
                  className="w-full p-4 text-xl font-mono text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                      {isCorrect ? <Check className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
                      <span className="font-semibold">
                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <p className="text-sm mt-1">Correct spelling: {currentWord.word}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={useHint}
                disabled={showDefinition}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Use Hint
              </button>
              <button
                onClick={handleSpellingSubmit}
                disabled={!userSpelling.trim()}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">How to play:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click the speaker icon to hear the word</li>
                <li>• Type the spelling in the input field</li>
                <li>• Use hints for fewer points (1 point instead of 2)</li>
                <li>• Press Enter or click Submit to check your answer</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 