export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  hint: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  subject: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Quiz data converted from Flutter app
export const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Paris", "Rome", "Madrid"],
    answer: 1,
    hint: "It's called the City of Light.",
    subject: "Geography",
    difficulty: "easy",
    points: 10
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    answer: 2,
    hint: "Named after the Roman god of war.",
    subject: "Science",
    difficulty: "easy",
    points: 10
  },
  {
    id: 3,
    question: "What is H2O commonly known as?",
    options: ["Oxygen", "Water", "Hydrogen", "Salt"],
    answer: 1,
    hint: "Covers about 70% of Earth.",
    subject: "Science",
    difficulty: "easy",
    points: 10
  },
  {
    id: 4,
    question: "Who was the first President of India?",
    options: [
      "Dr. Rajendra Prasad",
      "Jawaharlal Nehru",
      "Mahatma Gandhi",
      "Indira Gandhi"
    ],
    answer: 0,
    hint: "He served from 1950 to 1962.",
    subject: "History",
    difficulty: "medium",
    points: 15
  },
  {
    id: 5,
    question: "Which animal is called the King of the Jungle?",
    options: ["Tiger", "Elephant", "Lion", "Deer"],
    answer: 2,
    hint: "Famous for its majestic mane.",
    subject: "Science",
    difficulty: "easy",
    points: 10
  },
  {
    id: 6,
    question: "2 + 2 equals?",
    options: ["3", "5", "4", "2"],
    answer: 2,
    hint: "Even number, greater than 3.",
    subject: "Mathematics",
    difficulty: "easy",
    points: 10
  },
  {
    id: 7,
    question: "Which is the largest ocean?",
    options: ["Indian", "Atlantic", "Pacific", "Arctic"],
    answer: 2,
    hint: "Covers more than 30% of Earth's surface.",
    subject: "Geography",
    difficulty: "easy",
    points: 10
  },
  {
    id: 8,
    question: "Which continent is Egypt located in?",
    options: ["Asia", "Africa", "Europe", "Australia"],
    answer: 1,
    hint: "The Nile river runs through it.",
    subject: "Geography",
    difficulty: "easy",
    points: 10
  },
  {
    id: 9,
    question: "Which instrument measures temperature?",
    options: ["Thermometer", "Barometer", "Speedometer", "Altimeter"],
    answer: 0,
    hint: "Used to check fever.",
    subject: "Science",
    difficulty: "easy",
    points: 10
  },
  {
    id: 10,
    question: "How many days are there in a leap year?",
    options: ["366", "364", "365", "360"],
    answer: 0,
    hint: "One more than a regular year.",
    subject: "Mathematics",
    difficulty: "medium",
    points: 15
  },
  {
    id: 11,
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Au", "Fe", "Cu"],
    answer: 1,
    hint: "Starts with 'A' and ends with 'u'.",
    subject: "Science",
    difficulty: "medium",
    points: 15
  },
  {
    id: 12,
    question: "Which is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    answer: 1,
    hint: "Lives in the ocean.",
    subject: "Science",
    difficulty: "medium",
    points: 15
  },
  {
    id: 13,
    question: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
    answer: 1,
    hint: "12 × 12 = 144",
    subject: "Mathematics",
    difficulty: "medium",
    points: 15
  },
  {
    id: 14,
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "Australia", "South Africa", "India"],
    answer: 1,
    hint: "Also known as the Land Down Under.",
    subject: "Geography",
    difficulty: "easy",
    points: 10
  },
  {
    id: 15,
    question: "What is the main component of the sun?",
    options: ["Liquid Lava", "Molten Iron", "Hot Gases", "Solid Rock"],
    answer: 2,
    hint: "Mostly hydrogen and helium.",
    subject: "Science",
    difficulty: "medium",
    points: 15
  },
  {
    id: 16,
    question: "What is the value of π (pi) rounded to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    answer: 1,
    hint: "It's approximately 22/7.",
    subject: "Mathematics",
    difficulty: "medium",
    points: 15
  },
  {
    id: 17,
    question: "Who discovered gravity when an apple fell on his head?",
    options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
    answer: 1,
    hint: "He formulated the laws of motion.",
    subject: "Science",
    difficulty: "medium",
    points: 15
  },
  {
    id: 18,
    question: "Which river is the longest in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    answer: 1,
    hint: "It flows through Egypt.",
    subject: "Geography",
    difficulty: "medium",
    points: 15
  },
  {
    id: 19,
    question: "Who wrote the play 'Hamlet'?",
    options: ["William Wordsworth", "William Shakespeare", "Jane Austen", "Charles Dickens"],
    answer: 1,
    hint: "He is known as the Bard of Avon.",
    subject: "English",
    difficulty: "medium",
    points: 15
  },
  {
    id: 20,
    question: "Who was known as the Iron Man of India?",
    options: ["Sardar Vallabhbhai Patel", "Subhas Chandra Bose", "Bhagat Singh", "Lal Bahadur Shastri"],
    answer: 0,
    hint: "He played a key role in India's integration.",
    subject: "History",
    difficulty: "medium",
    points: 15
  },
  {
    id: 21,
    question: "What is the synonym of 'Happy'?",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    answer: 1,
    hint: "It means the same as cheerful.",
    subject: "English",
    difficulty: "easy",
    points: 10
  },
  {
    id: 22,
    question: "What is 15% of 200?",
    options: ["20", "25", "30", "35"],
    answer: 2,
    hint: "10% is 20, 5% is 10.",
    subject: "Mathematics",
    difficulty: "medium",
    points: 15
  },
  {
    id: 23,
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    answer: 2,
    hint: "It's used in photosynthesis.",
    subject: "Science",
    difficulty: "easy",
    points: 10
  },
  {
    id: 24,
    question: "Which city is known as the Big Apple?",
    options: ["Los Angeles", "London", "New York", "Paris"],
    answer: 2,
    hint: "It's the largest city in the USA.",
    subject: "Geography",
    difficulty: "easy",
    points: 10
  },
  {
    id: 25,
    question: "Who was the first woman Prime Minister of India?",
    options: ["Indira Gandhi", "Sarojini Naidu", "Pratibha Patil", "Sonia Gandhi"],
    answer: 0,
    hint: "She served from 1966 to 1977 and 1980 to 1984.",
    subject: "History",
    difficulty: "medium",
    points: 15
  },
  {
    id: 26,
    question: "What is the antonym of 'Brave'?",
    options: ["Cowardly", "Strong", "Smart", "Quick"],
    answer: 0,
    hint: "It means the opposite of courageous.",
    subject: "English",
    difficulty: "easy",
    points: 10
  },
  {
    id: 27,
    question: "What is 9 × 7?",
    options: ["56", "63", "72", "81"],
    answer: 1,
    hint: "It's less than 70.",
    subject: "Mathematics",
    difficulty: "easy",
    points: 10
  },
  {
    id: 28,
    question: "What is the boiling point of water at sea level?",
    options: ["90°C", "100°C", "110°C", "120°C"],
    answer: 1,
    hint: "It's a round number in Celsius.",
    subject: "Science",
    difficulty: "easy",
    points: 10
  },
  {
    id: 29,
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Japan", "Thailand", "South Korea"],
    answer: 1,
    hint: "It's an island nation in East Asia.",
    subject: "Geography",
    difficulty: "easy",
    points: 10
  },
  {
    id: 30,
    question: "Who led the Salt March in 1930?",
    options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Bhagat Singh"],
    answer: 1,
    hint: "He is known as the Father of the Nation.",
    subject: "History",
    difficulty: "medium",
    points: 15
  },
  // Additional questions for more variety
  {
    id: 31,
    question: "What is the largest organ in the human body?",
    options: ["Heart", "Brain", "Liver", "Skin"],
    answer: 3,
    hint: "It covers your entire body.",
    subject: "Science",
    difficulty: "easy",
    points: 10
  },
  {
    id: 32,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Oxygen", "Osmium", "Oganesson", "Osmium"],
    answer: 0,
    hint: "Essential for breathing.",
    subject: "Science",
    difficulty: "easy",
    points: 10
  },
  {
    id: 33,
    question: "What is the capital of Japan?",
    options: ["Kyoto", "Tokyo", "Osaka", "Yokohama"],
    answer: 1,
    hint: "The most populous city in Japan.",
    subject: "Geography",
    difficulty: "easy",
    points: 10
  },
  {
    id: 34,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    answer: 1,
    hint: "He was also a scientist and inventor.",
    subject: "Art",
    difficulty: "medium",
    points: 15
  },
  {
    id: 35,
    question: "What is the largest desert in the world?",
    options: ["Sahara", "Antarctic", "Arabian", "Gobi"],
    answer: 1,
    hint: "It's covered in ice and snow.",
    subject: "Geography",
    difficulty: "medium",
    points: 15
  },
  {
    id: 36,
    question: "What is the speed of light?",
    options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
    answer: 0,
    hint: "Approximately 300,000 km/s.",
    subject: "Science",
    difficulty: "hard",
    points: 20
  },
  {
    id: 37,
    question: "Who wrote 'Pride and Prejudice'?",
    options: ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "Mary Shelley"],
    answer: 0,
    hint: "Published in 1813.",
    subject: "English",
    difficulty: "medium",
    points: 15
  },
  {
    id: 38,
    question: "What is the square of 15?",
    options: ["200", "225", "250", "275"],
    answer: 1,
    hint: "15 × 15 = ?",
    subject: "Mathematics",
    difficulty: "medium",
    points: 15
  },
  {
    id: 39,
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    answer: 1,
    hint: "Known for its beautiful rings.",
    subject: "Science",
    difficulty: "medium",
    points: 15
  },
  {
    id: 40,
    question: "What is the largest country by area?",
    options: ["China", "Canada", "Russia", "United States"],
    answer: 2,
    hint: "Spans across Europe and Asia.",
    subject: "Geography",
    difficulty: "medium",
    points: 15
  }
];

// Flashcard data
export const flashcardData: Flashcard[] = [
  {
    id: 1,
    front: "What is photosynthesis?",
    back: "The process by which plants make their own food using sunlight, water, and carbon dioxide.",
    subject: "Science",
    category: "Biology",
    difficulty: "medium"
  },
  {
    id: 2,
    front: "Capital of India",
    back: "New Delhi",
    subject: "Geography",
    category: "Countries",
    difficulty: "easy"
  },
  {
    id: 3,
    front: "What is 7 × 8?",
    back: "56",
    subject: "Mathematics",
    category: "Multiplication",
    difficulty: "easy"
  },
  {
    id: 4,
    front: "Who wrote 'Romeo and Juliet'?",
    back: "William Shakespeare",
    subject: "English",
    category: "Literature",
    difficulty: "medium"
  },
  {
    id: 5,
    front: "What is the largest planet in our solar system?",
    back: "Jupiter",
    subject: "Science",
    category: "Astronomy",
    difficulty: "easy"
  },
  {
    id: 6,
    front: "What is the chemical formula for water?",
    back: "H₂O",
    subject: "Science",
    category: "Chemistry",
    difficulty: "easy"
  },
  {
    id: 7,
    front: "What is the capital of Japan?",
    back: "Tokyo",
    subject: "Geography",
    category: "Countries",
    difficulty: "easy"
  },
  {
    id: 8,
    front: "What is the square of 9?",
    back: "81",
    subject: "Mathematics",
    category: "Squares",
    difficulty: "medium"
  },
  {
    id: 9,
    front: "What is the main function of the heart?",
    back: "To pump blood throughout the body",
    subject: "Science",
    category: "Biology",
    difficulty: "easy"
  },
  {
    id: 10,
    front: "Who was the first woman to win a Nobel Prize?",
    back: "Marie Curie",
    subject: "History",
    category: "Scientists",
    difficulty: "hard"
  }
];

// Get quizzes by subject
export const getQuizzesBySubject = (subject: string): QuizQuestion[] => {
  return quizData.filter(quiz => quiz.subject === subject);
};

// Get flashcards by subject
export const getFlashcardsBySubject = (subject: string): Flashcard[] => {
  return flashcardData.filter(card => card.subject === subject);
};

// Get random quiz questions
export const getRandomQuizQuestions = (count: number): QuizQuestion[] => {
  const shuffled = [...quizData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get random flashcards
export const getRandomFlashcards = (count: number): Flashcard[] => {
  const shuffled = [...flashcardData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Enhanced utility functions for better question management
export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
  return quizData.filter(question => question.difficulty === difficulty);
};

export const getQuestionsBySubject = (subject: string): QuizQuestion[] => {
  return quizData.filter(question => question.subject === subject);
};

export const getQuestionsByDifficultyAndSubject = (difficulty: 'easy' | 'medium' | 'hard', subject: string): QuizQuestion[] => {
  return quizData.filter(question => question.difficulty === difficulty && question.subject === subject);
};

export const getQuestionsByPointRange = (minPoints: number, maxPoints: number): QuizQuestion[] => {
  return quizData.filter(question => question.points >= minPoints && question.points <= maxPoints);
};

export const getRandomQuestionsBySubject = (subject: string, count: number): QuizQuestion[] => {
  const subjectQuestions = getQuestionsBySubject(subject);
  const shuffled = [...subjectQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRandomQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard', count: number): QuizQuestion[] => {
  const difficultyQuestions = getQuestionsByDifficulty(difficulty);
  const shuffled = [...difficultyQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getMixedDifficultyQuestions = (count: number): QuizQuestion[] => {
  const easyQuestions = getQuestionsByDifficulty('easy');
  const mediumQuestions = getQuestionsByDifficulty('medium');
  const hardQuestions = getQuestionsByDifficulty('hard');
  
  const easyCount = Math.floor(count * 0.4);
  const mediumCount = Math.floor(count * 0.4);
  const hardCount = count - easyCount - mediumCount;
  
  const easyRandom = [...easyQuestions].sort(() => 0.5 - Math.random()).slice(0, easyCount);
  const mediumRandom = [...mediumQuestions].sort(() => 0.5 - Math.random()).slice(0, mediumCount);
  const hardRandom = [...hardQuestions].sort(() => 0.5 - Math.random()).slice(0, hardCount);
  
  return [...easyRandom, ...mediumRandom, ...hardRandom].sort(() => 0.5 - Math.random());
};

export const getAvailableSubjects = (): string[] => {
  const subjects = new Set(quizData.map(question => question.subject));
  return Array.from(subjects).sort();
};

export const getAvailableDifficulties = (): ('easy' | 'medium' | 'hard')[] => {
  return ['easy', 'medium', 'hard'];
};

export const getQuestionStats = () => {
  const totalQuestions = quizData.length;
  const subjects = getAvailableSubjects();
  const difficulties = getAvailableDifficulties();
  
  const stats = {
    total: totalQuestions,
    bySubject: subjects.map(subject => ({
      subject,
      count: getQuestionsBySubject(subject).length
    })),
    byDifficulty: difficulties.map(difficulty => ({
      difficulty,
      count: getQuestionsByDifficulty(difficulty).length
    })),
    averagePoints: Math.round(quizData.reduce((sum, q) => sum + q.points, 0) / totalQuestions)
  };
  
  return stats;
}; 