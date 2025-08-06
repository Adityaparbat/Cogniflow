'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Smile, PartyPopper, ArrowLeft, ArrowRight, RotateCcw, Shuffle, BookOpen, CheckCircle, XCircle, Eye } from 'lucide-react';
// Correct import for your flashcard data/offline utilities
import { Flashcard, getRandomFlashcards } from '@/lib/quizData';

interface FlashcardsProps {
  onClose: () => void;
  onComplete?: (cardsStudied: number, knownCards: number) => void;
  subject?: string;
  cardCount?: number;
  chapter?: string;
  usePDFContent?: boolean;
}

export default function Flashcards({
  onClose,
  onComplete,
  subject,
  cardCount = 10,
  chapter,
  usePDFContent = false,
}: FlashcardsProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'review' | 'quiz'>('review');
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [contentSource, setContentSource] = useState<'regular' | 'pdf'>('regular');

  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      let flashcardSet: Flashcard[] = [];
      
      if (usePDFContent && subject && chapter) {
        try {
          // Try to load PDF-generated content
          const module = await import(`@/lib/scripts/${subject}_${chapter}_content.ts`);
          if (module.generatedFlashcards && module.generatedFlashcards.length > 0) {
            flashcardSet = module.generatedFlashcards;
            setContentSource('pdf');
          }
        } catch (error) {
          console.log('No PDF content found, using regular flashcards');
        }
      }
      
      if (flashcardSet.length === 0) {
        // Use regular flashcard data
        flashcardSet = getRandomFlashcards(1000);
        if (subject) {
          flashcardSet = flashcardSet.filter((card) => card.subject === subject);
        }
        setContentSource('regular');
      }
      
      // Limit to cardCount
      flashcardSet = flashcardSet.slice(0, cardCount);

      setCards(flashcardSet);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setKnownCards(new Set());
      setUnknownCards(new Set());
      setIsLoading(false);
    };

    loadCards();
  }, [subject, cardCount, chapter, usePDFContent]);

  const currentCard = cards[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      // Completed all cards
      if (onComplete) {
        onComplete(cards.length, knownCards.size);
      }
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
  };

  const handleKnown = () => {
    setKnownCards((prev) => new Set([...prev, currentCard.id]));
    handleNext();
  };

  const handleUnknown = () => {
    setUnknownCards((prev) => new Set([...prev, currentCard.id]));
    handleNext();
  };

  const toggleStudyMode = () => {
    setStudyMode((prev) => (prev === 'review' ? 'quiz' : 'review'));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Flashcards Available</h3>
          <p className="text-gray-600 mb-6">
            {usePDFContent && subject && chapter 
              ? `No flashcards found for ${subject} - ${chapter}. Try uploading a PDF first.`
              : 'No flashcards available for the selected subject.'
            }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PartyPopper className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Flashcards</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span>{cards.length} cards</span>
                  {contentSource === 'pdf' && (
                    <span className="bg-white bg-opacity-25 px-2 py-1 rounded-full text-xs">
                      📄 PDF Generated
                    </span>
                  )}
                  {subject && (
                    <span className="bg-white bg-opacity-25 px-2 py-1 rounded-full text-xs">
                      {subject}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Card {currentCardIndex + 1} of {cards.length}</span>
              <span>{Math.round(((currentCardIndex + 1) / cards.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Flashcard */}
          <div className="mb-6">
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="relative"
            >
              <div 
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg border-2 border-blue-200 cursor-pointer transition-all duration-500"
                onClick={handleFlip}
                style={{ minHeight: '300px' }}
              >
                <div className="text-center">
                  {!isFlipped ? (
                    <div>
                      <div className="text-4xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Question</h3>
                      <p className="text-lg text-gray-700 leading-relaxed">{currentCard.front}</p>
                      <div className="mt-6 text-sm text-gray-500">
                        <Eye className="w-4 h-4 inline mr-1" />
                        Click to reveal answer
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-4">💡</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Answer</h3>
                      <p className="text-lg text-gray-700 leading-relaxed">{currentCard.back}</p>
                      <div className="mt-6 text-sm text-gray-500">
                        <Eye className="w-4 h-4 inline mr-1" />
                        Click to see question
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShuffle}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                title="Shuffle cards"
              >
                <Shuffle className="w-4 h-4" />
              </button>
              
              {studyMode === 'review' && (
                <>
                  <button
                    onClick={handleUnknown}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Don't Know</span>
                  </button>
                  <button
                    onClick={handleKnown}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Know It</span>
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={currentCardIndex === cards.length - 1}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Study Mode Toggle */}
          <div className="mt-4 text-center">
            <button
              onClick={toggleStudyMode}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {studyMode === 'review' ? 'Switch to Quiz Mode' : 'Switch to Review Mode'}
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{knownCards.size}</div>
              <div className="text-sm text-green-700">Known</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{unknownCards.size}</div>
              <div className="text-sm text-red-700">Unknown</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{cards.length - knownCards.size - unknownCards.size}</div>
              <div className="text-sm text-blue-700">Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
