// Simulated user data - in real app, this would come from your backend/database
export interface User {
  id: string;
  name: string;
  grade: string;
  standard?: string; // Added for compatibility with signup form
  xp: number;
  level: number;
  streak: number;
  coins: number;
  joinDate: Date;
  lastActive: Date;
  learningStyle: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
}

export interface Subject {
  id: string;
  name: string;
  progress: number;
  color: string;
  icon: string;
  chapters: Chapter[];
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
}

export interface Chapter {
  id: string;
  name: string;
  progress: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  name: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  category: 'academic' | 'streak' | 'exploration' | 'mastery';
}

export interface Activity {
  id: string;
  type: 'quiz' | 'flashcard' | 'lesson' | 'achievement';
  subject: string;
  topic?: string;
  score?: number;
  time: Date;
  duration?: number;
}

// Generate random user data
export function generateUserData(): User {
  const names = [
    'Aarav Patel', 'Zara Khan', 'Riya Sharma', 'Arjun Singh', 'Ananya Gupta',
    'Vihaan Reddy', 'Ishaan Mehta', 'Aisha Kapoor', 'Dhruv Verma', 'Kavya Joshi',
    'Aditya Malhotra', 'Myra Chopra', 'Rudra Saxena', 'Avni Desai', 'Krishna Iyer'
  ];
  
  const grades = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
                  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomGrade = grades[Math.floor(Math.random() * grades.length)];
  const randomXP = Math.floor(Math.random() * 5000) + 500;
  const randomLevel = Math.floor(randomXP / 250) + 1;
  const randomStreak = Math.floor(Math.random() * 30) + 1;
  const randomCoins = Math.floor(Math.random() * 1000) + 100;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: randomName,
    grade: randomGrade,
    standard: randomGrade, // Set standard same as grade for consistency
    xp: randomXP,
    level: randomLevel,
    streak: randomStreak,
    coins: randomCoins,
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    lastActive: new Date(),
    learningStyle: {
      visual: Math.floor(Math.random() * 40) + 40, // 40-80%
      auditory: Math.floor(Math.random() * 40) + 30, // 30-70%
      kinesthetic: Math.floor(Math.random() * 40) + 20 // 20-60%
    }
  };
}

// Generate dynamic subject data
export function generateSubjectData(): Subject[] {
  const subjects = [
    { name: 'Mathematics', color: 'bg-blue-500', icon: '📐' },
    { name: 'Science', color: 'bg-green-500', icon: '🔬' },
    { name: 'English', color: 'bg-purple-500', icon: '📚' },
    { name: 'Social Studies', color: 'bg-orange-500', icon: '🌍' },
    { name: 'Hindi', color: 'bg-red-500', icon: '🇮🇳' },
    { name: 'Computer Science', color: 'bg-indigo-500', icon: '💻' }
  ];

  return subjects.map(subject => {
    const progress = Math.floor(Math.random() * 60) + 20; // 20-80%
    const totalLessons = Math.floor(Math.random() * 50) + 30;
    const completedLessons = Math.floor((progress / 100) * totalLessons);
    const averageScore = Math.floor(Math.random() * 30) + 70; // 70-100%

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: subject.name,
      progress,
      color: subject.color,
      icon: subject.icon,
      totalLessons,
      completedLessons,
      averageScore,
      chapters: generateChapters(subject.name)
    };
  });
}

function generateChapters(subjectName: string): Chapter[] {
  const chapterNames = {
    'Mathematics': ['Numbers', 'Algebra', 'Geometry', 'Statistics', 'Trigonometry'],
    'Science': ['Physics', 'Chemistry', 'Biology', 'Earth Science', 'Astronomy'],
    'English': ['Grammar', 'Literature', 'Comprehension', 'Writing', 'Vocabulary'],
    'Social Studies': ['History', 'Geography', 'Civics', 'Economics', 'Culture'],
    'Hindi': ['व्याकरण', 'साहित्य', 'कहानियाँ', 'कविता', 'निबंध'],
    'Computer Science': ['Programming', 'Web Development', 'Data Structures', 'Algorithms', 'Database']
  };

  const names = chapterNames[subjectName as keyof typeof chapterNames] || ['Chapter 1', 'Chapter 2', 'Chapter 3'];
  
  return names.map(name => ({
    id: Math.random().toString(36).substr(2, 9),
    name,
    progress: Math.floor(Math.random() * 80) + 10,
    lessons: generateLessons()
  }));
}

function generateLessons(): Lesson[] {
  const lessonCount = Math.floor(Math.random() * 8) + 5;
  const lessons: Lesson[] = [];
  
  for (let i = 1; i <= lessonCount; i++) {
    const completed = Math.random() > 0.3; // 70% chance of completion
    lessons.push({
      id: Math.random().toString(36).substr(2, 9),
      name: `Lesson ${i}`,
      completed,
      score: completed ? Math.floor(Math.random() * 30) + 70 : undefined,
      timeSpent: Math.floor(Math.random() * 45) + 15 // 15-60 minutes
    });
  }
  
  return lessons;
}

// Generate achievements
export function generateAchievements(): Achievement[] {
  const achievements = [
    { title: 'Math Master', description: 'Completed Algebra chapter', icon: '🏆', category: 'academic' as const },
    { title: 'Science Explorer', description: 'Perfect score in Physics quiz', icon: '🔬', category: 'academic' as const },
    { title: 'Streak Champion', description: '7 days learning streak', icon: '🔥', category: 'streak' as const },
    { title: 'Bookworm', description: 'Read 50 lessons', icon: '📚', category: 'exploration' as const },
    { title: 'Global Citizen', description: 'Completed Social Studies module', icon: '🌍', category: 'mastery' as const },
    { title: 'Speed Learner', description: 'Completed 5 lessons in one day', icon: '⚡', category: 'mastery' as const },
    { title: 'Grammar Guru', description: 'Perfect English grammar score', icon: '✍️', category: 'academic' as const },
    { title: 'Tech Whiz', description: 'Completed programming basics', icon: '💻', category: 'mastery' as const }
  ];

  return achievements.map(achievement => ({
    id: Math.random().toString(36).substr(2, 9),
    ...achievement,
    earned: Math.random() > 0.4, // 60% chance of being earned
    earnedDate: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined
  }));
}

// Generate recent activities
export function generateActivities(): Activity[] {
  const activities: Activity[] = [];
  const types: Activity['type'][] = ['quiz', 'flashcard', 'lesson', 'achievement'];
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science'];
  
  for (let i = 0; i < 10; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const time = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
    
    activities.push({
      id: Math.random().toString(36).substr(2, 9),
      type,
      subject,
      topic: type === 'quiz' ? `${subject} Quiz` : type === 'flashcard' ? `${subject} Review` : `${subject} Lesson`,
      score: type === 'quiz' ? Math.floor(Math.random() * 30) + 70 : undefined,
      time,
      duration: Math.floor(Math.random() * 45) + 15
    });
  }
  
  return activities.sort((a, b) => b.time.getTime() - a.time.getTime());
}

// Calculate XP gained today
export function calculateTodayXP(user: User): number {
  const baseXP = Math.floor(Math.random() * 200) + 50;
  const streakBonus = user.streak * 5;
  return baseXP + streakBonus;
}

// Calculate level from XP
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 250) + 1;
}

// Calculate XP needed for next level
export function calculateXPForNextLevel(currentLevel: number): number {
  return currentLevel * 250;
}

// Calculate progress to next level
export function calculateLevelProgress(currentXP: number, currentLevel: number): number {
  const xpForCurrentLevel = (currentLevel - 1) * 250;
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNextLevel = 250;
  return (xpInCurrentLevel / xpNeededForNextLevel) * 100;
} 