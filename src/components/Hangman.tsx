'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Heart, Skull, Lightbulb } from 'lucide-react';
import { useSound } from '@/lib/soundEffects';

interface HangmanProps {
  onClose: () => void;
  onComplete: (score: number, totalWords: number) => void;
  subject?: string;
}

const academicWords = {
  Mathematics: [
    { word: 'ALGEBRA', hint: 'A branch of mathematics dealing with symbols and equations' },
    { word: 'CALCULUS', hint: 'The study of continuous change and rates of change' },
    { word: 'GEOMETRY', hint: 'The study of shapes, sizes, and properties of space' },
    { word: 'TRIGONOMETRY', hint: 'The study of relationships between angles and sides of triangles' },
    { word: 'STATISTICS', hint: 'The science of collecting and analyzing data' },
    { word: 'PROBABILITY', hint: 'The likelihood of an event occurring' },
    { word: 'FRACTION', hint: 'A part of a whole expressed as a ratio' },
    { word: 'EQUATION', hint: 'A mathematical statement showing equality' },
    { word: 'FUNCTION', hint: 'A relationship between inputs and outputs' },
    { word: 'VARIABLE', hint: 'A symbol that represents an unknown value' },
    { word: 'INTEGER', hint: 'A whole number, positive or negative' },
    { word: 'DECIMAL', hint: 'A number with a fractional part' },
    { word: 'PERCENTAGE', hint: 'A fraction expressed as parts per hundred' },
    { word: 'RATIO', hint: 'A comparison of two quantities' },
    { word: 'PROPORTION', hint: 'An equation stating two ratios are equal' },
    { word: 'SEQUENCE', hint: 'An ordered list of numbers or objects' }
  ],
  Science: [
    { word: 'PHYSICS', hint: 'The study of matter, energy, and their interactions' },
    { word: 'CHEMISTRY', hint: 'The study of substances and their properties' },
    { word: 'BIOLOGY', hint: 'The study of living organisms and life processes' },
    { word: 'ASTRONOMY', hint: 'The study of celestial objects and space' },
    { word: 'GEOLOGY', hint: 'The study of Earth\'s structure and composition' },
    { word: 'METEOROLOGY', hint: 'The study of weather and atmospheric conditions' },
    { word: 'ECOLOGY', hint: 'The study of interactions between organisms and environment' },
    { word: 'GENETICS', hint: 'The study of heredity and variation' },
    { word: 'MOLECULE', hint: 'The smallest unit of a chemical compound' },
    { word: 'ATOM', hint: 'The smallest unit of an element' },
    { word: 'CELL', hint: 'The basic unit of life' },
    { word: 'ORGANISM', hint: 'A living being' },
    { word: 'EVOLUTION', hint: 'The process of change over time' },
    { word: 'GRAVITY', hint: 'The force that attracts objects toward each other' },
    { word: 'ENERGY', hint: 'The ability to do work or cause change' },
    { word: 'MATTER', hint: 'Anything that has mass and takes up space' }
  ],
  English: [
    { word: 'GRAMMAR', hint: 'The system of rules governing language structure' },
    { word: 'LITERATURE', hint: 'Written works with artistic value' },
    { word: 'POETRY', hint: 'Literary work in metrical form' },
    { word: 'FICTION', hint: 'Imaginative or invented stories' },
    { word: 'NONFICTION', hint: 'Writing based on facts and reality' },
    { word: 'METAPHOR', hint: 'A figure of speech comparing unlike things' },
    { word: 'SIMILE', hint: 'A comparison using like or as' },
    { word: 'ALLITERATION', hint: 'Repetition of initial consonant sounds' },
    { word: 'SYNONYM', hint: 'A word with the same meaning as another' },
    { word: 'ANTONYM', hint: 'A word with the opposite meaning' },
    { word: 'HOMOPHONE', hint: 'Words that sound the same but have different meanings' },
    { word: 'PREFIX', hint: 'A word part added to the beginning of a word' },
    { word: 'SUFFIX', hint: 'A word part added to the end of a word' },
    { word: 'VOCABULARY', hint: 'All the words known by a person' },
    { word: 'COMPREHENSION', hint: 'Understanding what is read' },
    { word: 'ANALYSIS', hint: 'Detailed examination of something' }
  ],
  Geography: [
    { word: 'CONTINENT', hint: 'One of the large landmasses of Earth' },
    { word: 'OCEAN', hint: 'A large body of saltwater' },
    { word: 'MOUNTAIN', hint: 'A large natural elevation of land' },
    { word: 'RIVER', hint: 'A large natural stream of water' },
    { word: 'DESERT', hint: 'A barren area with little precipitation' },
    { word: 'FOREST', hint: 'A large area covered with trees' },
    { word: 'ISLAND', hint: 'A piece of land surrounded by water' },
    { word: 'PENINSULA', hint: 'A piece of land almost surrounded by water' },
    { word: 'LATITUDE', hint: 'Distance north or south of the equator' },
    { word: 'LONGITUDE', hint: 'Distance east or west of the prime meridian' },
    { word: 'CLIMATE', hint: 'Long-term weather patterns of a region' },
    { word: 'WEATHER', hint: 'Short-term atmospheric conditions' },
    { word: 'POPULATION', hint: 'The number of people in an area' },
    { word: 'CULTURE', hint: 'The customs and beliefs of a group' },
    { word: 'ECONOMY', hint: 'The system of production and consumption' },
    { word: 'RESOURCES', hint: 'Natural materials that can be used' }
  ],
  History: [
    { word: 'ANCIENT', hint: 'Belonging to the very distant past' },
    { word: 'MEDIEVAL', hint: 'Relating to the Middle Ages' },
    { word: 'RENAISSANCE', hint: 'A period of renewed interest in art and learning' },
    { word: 'REVOLUTION', hint: 'A forcible overthrow of a government' },
    { word: 'EMPIRE', hint: 'A group of nations ruled by one authority' },
    { word: 'KINGDOM', hint: 'A country ruled by a king or queen' },
    { word: 'DEMOCRACY', hint: 'Government by the people' },
    { word: 'MONARCHY', hint: 'Government with a monarch at the head' },
    { word: 'CIVILIZATION', hint: 'An advanced stage of human society' },
    { word: 'ARCHAEOLOGY', hint: 'The study of ancient human remains' },
    { word: 'ARTIFACT', hint: 'An object made by humans in the past' },
    { word: 'DOCUMENT', hint: 'A written or printed record' },
    { word: 'TIMELINE', hint: 'A chronological sequence of events' },
    { word: 'CHRONOLOGY', hint: 'The arrangement of events in time order' },
    { word: 'HERITAGE', hint: 'Something inherited from the past' },
    { word: 'LEGACY', hint: 'Something left behind by a predecessor' }
  ]
};

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Hangman({ onClose, onComplete, subject = 'Mathematics' }: HangmanProps) {
  const [currentWordObj, setCurrentWordObj] = useState<{ word: string; hint: string } | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const sound = useSound();
  
  const words = academicWords[subject as keyof typeof academicWords] || academicWords.Mathematics;
  const totalRounds = 5;
  const maxWrongGuesses = 6;

  useEffect(() => {
    if (gameStarted && !gameWon && !gameLost && currentWordObj) {
      checkGameStatus();
    }
  }, [guessedLetters, currentWordObj]);

  const startGame = () => {
    sound.playGameStart();
    setGameStarted(true);
    setCurrentWordObj(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameWon(false);
    setGameLost(false);
    setShowHint(false);
    setHintUsed(false);
  };

  const handleLetterGuess = (letter: string) => {
    if (guessedLetters.has(letter) || gameWon || gameLost || !currentWordObj) return;
    
    sound.playButtonClick();
    
    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);
    
    if (!currentWordObj.word.includes(letter)) {
      sound.playWrongAnswer();
      setWrongGuesses(prev => prev + 1);
    } else {
      sound.playCorrectAnswer();
    }
  };

  const checkGameStatus = () => {
    if (!currentWordObj) return;
    
    const isWordGuessed = currentWordObj.word.split('').every(letter => guessedLetters.has(letter));
    
    if (isWordGuessed) {
      sound.playCorrectAnswer();
      setGameWon(true);
      setScore(prev => prev + (hintUsed ? 1 : 2));
    } else if (wrongGuesses >= maxWrongGuesses) {
      sound.playWrongAnswer();
      setGameLost(true);
    }
  };

  const handleNextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setCurrentWordObj(words[Math.floor(Math.random() * words.length)]);
      setGuessedLetters(new Set());
      setWrongGuesses(0);
      setGameWon(false);
      setGameLost(false);
      setShowHint(false);
      setHintUsed(false);
    } else {
      onComplete(score, totalRounds);
    }
  };

  const useHint = () => {
    setShowHint(true);
    setHintUsed(true);
    sound.playButtonClick();
  };

  const displayWord = currentWordObj?.word
    .split('')
    .map(letter => guessedLetters.has(letter) ? letter : '_')
    .join(' ') || '';

  const renderHangman = () => {
    const parts = [
      wrongGuesses >= 1 && <circle key="head" cx="50" cy="30" r="10" fill="none" stroke="black" strokeWidth="2" />,
      wrongGuesses >= 2 && <line key="body" x1="50" y1="40" x2="50" y2="80" stroke="black" strokeWidth="2" />,
      wrongGuesses >= 3 && <line key="leftArm" x1="50" y1="50" x2="30" y2="70" stroke="black" strokeWidth="2" />,
      wrongGuesses >= 4 && <line key="rightArm" x1="50" y1="50" x2="70" y2="70" stroke="black" strokeWidth="2" />,
      wrongGuesses >= 5 && <line key="leftLeg" x1="50" y1="80" x2="30" y2="100" stroke="black" strokeWidth="2" />,
      wrongGuesses >= 6 && <line key="rightLeg" x1="50" y1="80" x2="70" y2="100" stroke="black" strokeWidth="2" />
    ];

    return (
      <svg width="100" height="120" className="mx-auto">
        {/* Gallows */}
        <line x1="20" y1="100" x2="80" y2="100" stroke="black" strokeWidth="3" />
        <line x1="50" y1="20" x2="50" y2="100" stroke="black" strokeWidth="3" />
        <line x1="50" y1="20" x2="20" y2="20" stroke="black" strokeWidth="3" />
        <line x1="20" y1="20" x2="20" y2="30" stroke="black" strokeWidth="3" />
        
        {/* Hangman parts */}
        {parts.filter(Boolean)}
      </svg>
    );
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
          <h2 className="text-2xl font-bold text-gray-900">Hangman</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!gameStarted ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Skull className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Play Hangman?</h3>
            <p className="text-gray-600 mb-6">Guess the academic word before the hangman is complete!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all"
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
                <span className="text-sm font-medium text-gray-600">Lives:</span>
                <div className="flex space-x-1">
                  {Array.from({ length: maxWrongGuesses - wrongGuesses }, (_, i) => (
                    <Heart key={i} className="w-5 h-5 text-red-500 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Hangman Drawing */}
            <div className="bg-gray-50 p-6 rounded-lg">
              {renderHangman()}
            </div>

            {/* Word Display */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Guess the word:</h3>
              <div className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                {displayWord}
              </div>
              
              {/* Hint Section */}
              <div className="mt-4">
                <button
                  onClick={useHint}
                  disabled={showHint || hintUsed}
                  className="flex items-center space-x-2 mx-auto px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
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
            </div>

            {/* Game Status */}
            <AnimatePresence>
              {gameWon && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-center"
                >
                  <p className="font-semibold">Congratulations! You guessed it correctly!</p>
                  <p className="text-sm mt-1">The word was: {currentWordObj?.word}</p>
                </motion.div>
              )}
              
              {gameLost && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-center"
                >
                  <p className="font-semibold">Game Over! The word was: {currentWordObj?.word}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Letter Grid */}
            {!gameWon && !gameLost && (
              <div className="grid grid-cols-7 gap-2">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterGuess(letter)}
                    disabled={guessedLetters.has(letter)}
                    className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                      guessedLetters.has(letter)
                        ? currentWordObj?.word.includes(letter)
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {(gameWon || gameLost) && (
              <div className="flex justify-center">
                <button
                  onClick={handleNextRound}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  {currentRound < totalRounds ? 'Next Round' : 'Finish Game'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
} 