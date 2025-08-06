'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, ArrowRight, Palette, Eraser, Undo2 } from 'lucide-react';
import { useSound } from '@/lib/soundEffects';

interface PictionaryProps {
  onClose: () => void;
  onComplete: (score: number, totalWords: number) => void;
  subject?: string;
}

const academicWords = {
  Mathematics: [
    'triangle', 'circle', 'square', 'rectangle', 'hexagon', 'octagon', 'diamond', 'star',
    'calculator', 'ruler', 'compass', 'protractor', 'graph', 'chart', 'equation', 'fraction'
  ],
  Science: [
    'microscope', 'telescope', 'beaker', 'test tube', 'atom', 'molecule', 'cell', 'bacteria',
    'volcano', 'earthquake', 'tornado', 'hurricane', 'planet', 'star', 'galaxy', 'universe'
  ],
  English: [
    'book', 'pencil', 'paper', 'dictionary', 'thesaurus', 'grammar', 'sentence', 'paragraph',
    'poem', 'story', 'novel', 'essay', 'letter', 'email', 'magazine', 'newspaper'
  ],
  Geography: [
    'mountain', 'river', 'ocean', 'desert', 'forest', 'island', 'continent', 'country',
    'city', 'village', 'bridge', 'road', 'map', 'globe', 'compass', 'volcano'
  ],
  History: [
    'castle', 'pyramid', 'temple', 'monument', 'statue', 'flag', 'crown', 'sword',
    'ship', 'train', 'car', 'airplane', 'clock', 'calendar', 'book', 'scroll'
  ]
};

const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];

export default function Pictionary({ onClose, onComplete, subject = 'Mathematics' }: PictionaryProps) {
  const [currentWord, setCurrentWord] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const sound = useSound();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const words = academicWords[subject as keyof typeof academicWords] || academicWords.Mathematics;
  const totalRounds = 5;

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleRoundComplete();
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 600;
      canvas.height = 400;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = currentColor;
        context.lineWidth = brushSize;
        contextRef.current = context;
      }
    }
  }, [currentColor, brushSize]);

  const startGame = () => {
    sound.playGameStart();
    setGameStarted(true);
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    setTimeLeft(60);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && contextRef.current) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && contextRef.current) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (contextRef.current && canvasRef.current) {
      const imageData = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setDrawingHistory(prev => [...prev.slice(0, historyIndex + 1), imageData]);
      setHistoryIndex(prev => prev + 1);
    }
  };

  const clearCanvas = () => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setDrawingHistory([]);
      setHistoryIndex(-1);
    }
  };

  const undo = () => {
    if (historyIndex > 0 && contextRef.current && canvasRef.current) {
      setHistoryIndex(prev => prev - 1);
      contextRef.current.putImageData(drawingHistory[historyIndex - 1], 0, 0);
    }
  };

  const handleRoundComplete = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setCurrentWord(words[Math.floor(Math.random() * words.length)]);
      setTimeLeft(60);
      clearCanvas();
    } else {
      onComplete(score, totalRounds);
    }
  };

  const handleCorrectGuess = () => {
    sound.playCorrectAnswer();
    setScore(prev => prev + 1);
    handleRoundComplete();
  };

  const handleSkip = () => {
    sound.playWrongAnswer();
    handleRoundComplete();
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
          <h2 className="text-2xl font-bold text-gray-900">Pictionary - Academic Edition</h2>
          <button
            onClick={() => {
              sound.playButtonClick();
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onMouseEnter={() => sound.playHover()}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {!gameStarted ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Draw?</h3>
            <p className="text-gray-600 mb-6">Draw academic words and test your knowledge!</p>
            <button
              onClick={() => {
                sound.playButtonClick();
                startGame();
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              onMouseEnter={() => sound.playHover()}
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
                <span className="text-sm font-medium text-gray-600">Time:</span>
                <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-green-500'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Word to Draw */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg text-center">
              <h3 className="text-xl font-bold text-purple-700">Draw this word:</h3>
              <p className="text-2xl font-bold text-purple-800 mt-2">{currentWord.toUpperCase()}</p>
            </div>

            {/* Drawing Tools */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setCurrentColor(color);
                        if (contextRef.current) {
                          contextRef.current.strokeStyle = color;
                        }
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        currentColor === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Size:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={brushSize}
                    onChange={(e) => {
                      setBrushSize(Number(e.target.value));
                      if (contextRef.current) {
                        contextRef.current.lineWidth = Number(e.target.value);
                      }
                    }}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <Undo2 className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={clearCanvas}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

                         {/* Canvas */}
             <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
               <canvas
                 ref={canvasRef}
                 onMouseDown={handleMouseDown}
                 onMouseMove={handleMouseMove}
                 onMouseUp={handleMouseUp}
                 onMouseLeave={handleMouseUp}
                 onTouchStart={(e) => {
                   e.preventDefault();
                   const touch = e.touches[0];
                   const mouseEvent = new MouseEvent('mousedown', {
                     clientX: touch.clientX,
                     clientY: touch.clientY
                   });
                   handleMouseDown(mouseEvent as any);
                 }}
                 onTouchMove={(e) => {
                   e.preventDefault();
                   const touch = e.touches[0];
                   const mouseEvent = new MouseEvent('mousemove', {
                     clientX: touch.clientX,
                     clientY: touch.clientY
                   });
                   handleMouseMove(mouseEvent as any);
                 }}
                 onTouchEnd={(e) => {
                   e.preventDefault();
                   handleMouseUp();
                 }}
                 className="cursor-crosshair w-full h-96 bg-white touch-none"
               />
             </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCorrectGuess}
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <Check className="w-5 h-5 text-white" />
                <span>Correct!</span>
              </button>
              <button
                onClick={handleSkip}
                className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-white" />
                <span>Skip</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 