'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, Clock, Brain, Star } from 'lucide-react';
import { useSound } from '@/lib/soundEffects';

interface MemoryMatchProps {
  onClose: () => void;
  onComplete: (score: number, totalPairs: number) => void;
  subject?: string;
}

interface Card {
  id: number;
  content: string;
  type: 'term' | 'definition';
  isFlipped: boolean;
  isMatched: boolean;
}

const academicPairs = {
  Mathematics: [
    { term: 'ALGEBRA', definition: 'A branch of mathematics dealing with symbols and equations' },
    { term: 'CALCULUS', definition: 'The study of continuous change and rates of change' },
    { term: 'GEOMETRY', definition: 'The study of shapes, sizes, and properties of space' },
    { term: 'FRACTION', definition: 'A part of a whole expressed as a ratio' },
    { term: 'EQUATION', definition: 'A mathematical statement showing equality' },
    { term: 'FUNCTION', definition: 'A relationship between inputs and outputs' },
    { term: 'VARIABLE', definition: 'A symbol representing an unknown value' },
    { term: 'INTEGER', definition: 'A whole number, positive or negative' }
  ],
  Science: [
    { term: 'PHYSICS', definition: 'The study of matter, energy, and their interactions' },
    { term: 'CHEMISTRY', definition: 'The study of substances and their properties' },
    { term: 'BIOLOGY', definition: 'The study of living organisms and life processes' },
    { term: 'ATOM', definition: 'The smallest unit of an element' },
    { term: 'CELL', definition: 'The basic unit of life' },
    { term: 'GRAVITY', definition: 'The force that attracts objects toward each other' },
    { term: 'ENERGY', definition: 'The ability to do work or cause change' },
    { term: 'MATTER', definition: 'Anything that has mass and takes up space' }
  ],
  English: [
    { term: 'GRAMMAR', definition: 'The system of rules governing language structure' },
    { term: 'LITERATURE', definition: 'Written works with artistic value' },
    { term: 'POETRY', definition: 'Literary work in metrical form' },
    { term: 'METAPHOR', definition: 'A figure of speech comparing unlike things' },
    { term: 'SYNONYM', definition: 'A word with the same meaning as another' },
    { term: 'ANTONYM', definition: 'A word with the opposite meaning' },
    { term: 'VOCABULARY', definition: 'All the words known by a person' },
    { term: 'ANALYSIS', definition: 'Detailed examination of something' }
  ],
  Geography: [
    { term: 'CONTINENT', definition: 'One of the large landmasses of Earth' },
    { term: 'OCEAN', definition: 'A large body of saltwater' },
    { term: 'MOUNTAIN', definition: 'A large natural elevation of land' },
    { term: 'RIVER', definition: 'A large natural stream of water' },
    { term: 'DESERT', definition: 'A barren area with little precipitation' },
    { term: 'FOREST', definition: 'A large area covered with trees' },
    { term: 'ISLAND', definition: 'A piece of land surrounded by water' },
    { term: 'CLIMATE', definition: 'Long-term weather patterns of a region' }
  ],
  History: [
    { term: 'ANCIENT', definition: 'Belonging to the very distant past' },
    { term: 'MEDIEVAL', definition: 'Relating to the Middle Ages' },
    { term: 'REVOLUTION', definition: 'A forcible overthrow of a government' },
    { term: 'EMPIRE', definition: 'A group of nations ruled by one authority' },
    { term: 'DEMOCRACY', definition: 'Government by the people' },
    { term: 'CIVILIZATION', definition: 'An advanced stage of human society' },
    { term: 'ARTIFACT', definition: 'An object made by humans in the past' },
    { term: 'HERITAGE', definition: 'Something inherited from the past' }
  ]
};

export default function MemoryMatch({ onClose, onComplete, subject = 'Mathematics' }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const sound = useSound();
  
  const pairs = academicPairs[subject as keyof typeof academicPairs] || academicPairs.Mathematics;
  const totalPairs = pairs.length;

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted]);

  const createCards = () => {
    const newCards: Card[] = [];
    pairs.forEach((pair, index) => {
      newCards.push(
        { id: index * 2, content: pair.term, type: 'term', isFlipped: false, isMatched: false },
        { id: index * 2 + 1, content: pair.definition, type: 'definition', isFlipped: false, isMatched: false }
      );
    });
    return newCards.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    sound.playGameStart();
    setGameStarted(true);
    setCards(createCards());
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeLeft(120);
    setScore(0);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards.find(c => c.id === cardId)?.isMatched) return;
    
    sound.playButtonClick();
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flippedIds: number[]) => {
    const [firstId, secondId] = flippedIds;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);
    
    if (!firstCard || !secondCard) return;
    
    const isMatch = firstCard.type !== secondCard.type && 
                   ((firstCard.type === 'term' && secondCard.content.includes(firstCard.content)) ||
                    (secondCard.type === 'term' && firstCard.content.includes(secondCard.content)));
    
    setTimeout(() => {
      if (isMatch) {
        sound.playCorrectAnswer();
        setCards(prev => prev.map(card => 
          flippedIds.includes(card.id) ? { ...card, isMatched: true } : card
        ));
        setMatchedPairs(prev => prev + 1);
        setScore(prev => prev + 10);
      } else {
        sound.playWrongAnswer();
      }
      setFlippedCards([]);
    }, 1000);
  };

  const handleTimeUp = () => {
    sound.playWrongAnswer();
    onComplete(score, totalPairs);
  };

  const resetGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeLeft(120);
    setScore(0);
    sound.playButtonClick();
  };

  const isCardFlipped = (cardId: number) => {
    return flippedCards.includes(cardId) || cards.find(c => c.id === cardId)?.isMatched;
  };

  const getCardContent = (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    return card?.content || '';
  };

  const getCardType = (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    return card?.type || 'term';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Memory Match</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {!gameStarted ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Test Your Memory?</h3>
            <p className="text-gray-600 mb-6">Match academic terms with their definitions!</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Game Info */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600">Pairs: {matchedPairs}/{totalPairs}</span>
                <span className="text-sm font-medium text-gray-600">Moves: {moves}</span>
                <span className="text-sm font-medium text-gray-600">Score: {score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className={`text-lg font-bold ${timeLeft <= 20 ? 'text-red-500' : 'text-green-500'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex justify-center">
              <button
                onClick={resetGame}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Game</span>
              </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-4 gap-4">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-[3/4] cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                    isCardFlipped(card.id)
                      ? card.isMatched
                        ? 'bg-green-100 border-green-500'
                        : 'bg-blue-100 border-blue-500'
                      : 'bg-gray-200 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="h-full flex items-center justify-center p-4 text-center">
                    {isCardFlipped(card.id) ? (
                      <div className="space-y-2">
                        <div className={`text-xs font-medium px-2 py-1 rounded ${
                          getCardType(card.id) === 'term' 
                            ? 'bg-blue-200 text-blue-800' 
                            : 'bg-purple-200 text-purple-800'
                        }`}>
                          {getCardType(card.id).toUpperCase()}
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                          {getCardContent(card.id)}
                        </p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Star className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs">Click to reveal</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">How to play:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click cards to flip them and reveal terms or definitions</li>
                <li>• Match each term with its correct definition</li>
                <li>• Complete all pairs before time runs out</li>
                <li>• You have 2 minutes to complete the game</li>
                <li>• Each correct match earns you 10 points</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 