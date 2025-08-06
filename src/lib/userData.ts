export interface UserData {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  standard: string;
  grade: string;
  joinDate: Date;
  lastActive: Date;
  isLoggedIn: boolean;
  profile: {
    avatar?: string;
    bio?: string;
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
      sound: boolean;
    };
  };
  stats: {
    xp: number;
    level: number;
    streak: number;
    coins: {
      current: number;
      totalEarned: number;
      totalSpent: number;
      history: Array<{
        id: string;
        type: 'earned' | 'spent';
        amount: number;
        reason: string;
        timestamp: Date;
        source?: string;
      }>;
    };
    totalQuizzes: number;
    totalFlashcards: number;
    averageScore: number;
    lastLoginDate: Date;
    dailyGoalProgress: {
      quizzesCompleted: number;
      flashcardsCompleted: number;
      gamesPlayed: number;
      targetDaily: number;
    };
    subjects: {
      [subject: string]: {
        progress: number;
        completedLessons: number;
        totalLessons: number;
        averageScore: number;
        lastStudied: Date;
        weeklyProgress: number;
        monthlyProgress: number;
        totalXP: number;
        timeSpent: number; // in minutes
      };
    };
    // New tracking fields
    dailyCheckins: {
      [date: string]: {
        date: Date;
        xpEarned: number;
        activitiesCompleted: number;
        goalsAchieved: number;
        coinsEarned: number;
        streakBonus: number;
        checkinTime: Date;
      };
    };
    weeklyActivity: {
      [weekKey: string]: {
        weekStart: Date;
        weekEnd: Date;
        totalXP: number;
        totalCoins: number;
        activitiesCompleted: number;
        subjectsStudied: string[];
        averageDailyTime: number;
        goalsAchieved: number;
        streakDays: number;
      };
    };
    monthlyProgress: {
      [monthKey: string]: {
        month: string;
        totalXP: number;
        totalCoins: number;
        activitiesCompleted: number;
        subjectsStudied: string[];
        averageDailyTime: number;
        goalsAchieved: number;
        streakDays: number;
        levelUps: number;
      };
    };
    recentActivities: Array<{
      id: string;
      type: 'quiz' | 'flashcards' | 'game' | 'checkin' | 'goal_achieved' | 'level_up' | 'streak_bonus';
      subject?: string;
      description: string;
      xpEarned: number;
      coinsEarned: number;
      timestamp: Date;
      details?: any;
    }>;
    learningStreak: {
      currentStreak: number;
      longestStreak: number;
      lastStudyDate: Date;
      consecutiveDays: number;
      streakBonus: number;
      streakHistory: Array<{
        date: Date;
        activitiesCompleted: number;
        xpEarned: number;
        coinsEarned: number;
      }>;
    };
    dailyGoals: {
      current: {
        quizzes: number;
        flashcards: number;
        games: number;
        studyTime: number; // in minutes
        xpTarget: number;
      };
      completed: {
        quizzes: number;
        flashcards: number;
        games: number;
        studyTime: number;
        xpTarget: number;
      };
      history: Array<{
        date: Date;
        goals: {
          quizzes: number;
          flashcards: number;
          games: number;
          studyTime: number;
          xpTarget: number;
        };
        completed: {
          quizzes: number;
          flashcards: number;
          games: number;
          studyTime: number;
          xpTarget: number;
        };
        achieved: boolean;
        bonusCoins: number;
      }>;
    };

    timeTracking: {
      totalStudyTime: number; // in minutes
      dailyAverage: number;
      weeklyTotal: number;
      monthlyTotal: number;
      sessionHistory: Array<{
        id: string;
        startTime: Date;
        endTime: Date;
        duration: number; // in minutes
        subject: string;
        activity: string;
        xpEarned: number;
      }>;
    };
  };
  achievements: string[];
  gameHistory: {
    quiz: Array<{
      id: string;
      score: number;
      totalQuestions: number;
      subject: string;
      date: Date;
      timeSpent: number;
      xpEarned: number;
      coinsEarned: number;
    }>;
    flashcards: Array<{
      id: string;
      cardsStudied: number;
      knownCards: number;
      subject: string;
      date: Date;
      timeSpent: number;
      xpEarned: number;
      coinsEarned: number;
    }>;
    games: Array<{
      id: string;
      gameType: string;
      score: number;
      subject: string;
      date: Date;
      timeSpent: number;
      xpEarned: number;
      coinsEarned: number;
    }>;
  };
}

// Sample user dataset
export const userDataset: UserData[] = [
  {
    id: '1',
    name: 'Aarav Patel',
    email: 'aarav@student.com',
    password: 'password123',
    standard: 'Class 8',
    grade: 'Class 8',
    joinDate: new Date('2024-01-15'),
    lastActive: new Date(),
    isLoggedIn: false,
    profile: {
      avatar: '/avatars/aarav.jpg',
      bio: 'Passionate about mathematics and science',
      preferences: {
        theme: 'light',
        notifications: true,
        sound: true
      }
    },
    stats: {
      xp: 2450,
      level: 8,
      streak: 12,

      totalQuizzes: 25,
      totalFlashcards: 18,
      averageScore: 85,
      lastLoginDate: new Date(),
      dailyGoalProgress: {
        quizzesCompleted: 2,
        flashcardsCompleted: 1,
        gamesPlayed: 3,
        targetDaily: 5
      },
      subjects: {
        'Mathematics': { progress: 75, completedLessons: 15, totalLessons: 20, averageScore: 88, lastStudied: new Date() },
        'Science': { progress: 60, completedLessons: 12, totalLessons: 20, averageScore: 82, lastStudied: new Date() },
        'English': { progress: 45, completedLessons: 9, totalLessons: 20, averageScore: 78, lastStudied: new Date() },
        'Social Studies': { progress: 30, completedLessons: 6, totalLessons: 20, averageScore: 75, lastStudied: new Date() }
      },
      dailyCheckins: {},
      weeklyActivity: {},
      monthlyProgress: {},
      recentActivities: [],
      learningStreak: {
        currentStreak: 12,
        longestStreak: 15,
        lastStudyDate: new Date('2024-01-20'),
        consecutiveDays: 12,
        streakBonus: 150,
        streakHistory: []
      },
      dailyGoals: {
        current: {
          quizzes: 5,
          flashcards: 3,
          games: 4,
          studyTime: 60,
          xpTarget: 100
        },
        completed: {
          quizzes: 2,
          flashcards: 1,
          games: 2,
          studyTime: 30,
          xpTarget: 50
        },
        history: []
      },
      coins: {
        current: 450,
        totalEarned: 450,
        totalSpent: 0,
        history: []
      },
      timeTracking: {
        totalStudyTime: 120,
        dailyAverage: 60,
        weeklyTotal: 120,
        monthlyTotal: 120,
        sessionHistory: []
      }
    },
    achievements: ['Math Master', 'Streak Champion', 'Science Explorer'],
    gameHistory: {
      quiz: [
        { id: '1', score: 85, totalQuestions: 10, subject: 'Mathematics', date: new Date('2024-01-20') },
        { id: '2', score: 90, totalQuestions: 10, subject: 'Science', date: new Date('2024-01-19') }
      ],
      flashcards: [
        { id: '1', cardsStudied: 20, knownCards: 18, subject: 'Mathematics', date: new Date('2024-01-20') },
        { id: '2', cardsStudied: 15, knownCards: 12, subject: 'Science', date: new Date('2024-01-19') }
      ]
    }
  },
  {
    id: '2',
    name: 'Zara Khan',
    email: 'zara@student.com',
    password: 'password123',
    standard: 'Class 6',
    grade: 'Class 6',
    joinDate: new Date('2024-02-01'),
    lastActive: new Date(),
    isLoggedIn: false,
    profile: {
      avatar: '/avatars/zara.jpg',
      bio: 'Love reading and learning new things',
      preferences: {
        theme: 'light',
        notifications: true,
        sound: false
      }
    },
    stats: {
      xp: 1800,
      level: 6,
      streak: 8,
      coins: {
        current: 320,
        totalEarned: 320,
        totalSpent: 0,
        history: []
      },
      totalQuizzes: 18,
      totalFlashcards: 12,
      averageScore: 78,
      lastLoginDate: new Date(),
      dailyGoalProgress: {
        quizzesCompleted: 1,
        flashcardsCompleted: 2,
        gamesPlayed: 2,
        targetDaily: 4
      },
      subjects: {
        'Mathematics': { progress: 50, completedLessons: 10, totalLessons: 20, averageScore: 75, lastStudied: new Date() },
        'Science': { progress: 65, completedLessons: 13, totalLessons: 20, averageScore: 80, lastStudied: new Date() },
        'English': { progress: 70, completedLessons: 14, totalLessons: 20, averageScore: 85, lastStudied: new Date() },
        'Social Studies': { progress: 40, completedLessons: 8, totalLessons: 20, averageScore: 72, lastStudied: new Date() }
      },
      dailyCheckins: {},
      weeklyActivity: {},
      monthlyProgress: {},
      recentActivities: [],
      learningStreak: {
        currentStreak: 8,
        longestStreak: 10,
        lastStudyDate: new Date('2024-01-20'),
        consecutiveDays: 8,
        streakBonus: 80,
        streakHistory: []
      },
      dailyGoals: {
        current: {
          quizzes: 4,
          flashcards: 2,
          games: 2,
          studyTime: 40,
          xpTarget: 80
        },
        completed: {
          quizzes: 1,
          flashcards: 2,
          games: 2,
          studyTime: 20,
          xpTarget: 40
        },
        history: []
      },
      coins: {
        current: 320,
        totalEarned: 320,
        totalSpent: 0,
        history: []
      },
      timeTracking: {
        totalStudyTime: 80,
        dailyAverage: 40,
        weeklyTotal: 80,
        monthlyTotal: 80,
        sessionHistory: []
      }
    },
    achievements: ['Bookworm', 'English Guru'],
    gameHistory: {
      quiz: [
        { id: '1', score: 78, totalQuestions: 10, subject: 'English', date: new Date('2024-01-20') },
        { id: '2', score: 82, totalQuestions: 10, subject: 'Science', date: new Date('2024-01-19') }
      ],
      flashcards: [
        { id: '1', cardsStudied: 15, knownCards: 13, subject: 'English', date: new Date('2024-01-20') },
        { id: '2', cardsStudied: 12, knownCards: 10, subject: 'Science', date: new Date('2024-01-19') }
      ]
    }
  },
  {
    id: '3',
    name: 'Riya Sharma',
    email: 'riya@student.com',
    password: 'password123',
    standard: 'Class 10',
    grade: 'Class 10',
    joinDate: new Date('2023-12-10'),
    lastActive: new Date(),
    isLoggedIn: false,
    profile: {
      avatar: '/avatars/riya.jpg',
      bio: 'Future scientist in the making',
      preferences: {
        theme: 'dark',
        notifications: true,
        sound: true
      }
    },
    stats: {
      xp: 3800,
      level: 12,
      streak: 25,

      totalQuizzes: 35,
      totalFlashcards: 28,
      averageScore: 92,
      lastLoginDate: new Date(),
      dailyGoalProgress: {
        quizzesCompleted: 3,
        flashcardsCompleted: 2,
        gamesPlayed: 4,
        targetDaily: 6
      },
      subjects: {
        'Mathematics': { progress: 90, completedLessons: 18, totalLessons: 20, averageScore: 95, lastStudied: new Date() },
        'Science': { progress: 85, completedLessons: 17, totalLessons: 20, averageScore: 90, lastStudied: new Date() },
        'English': { progress: 80, completedLessons: 16, totalLessons: 20, averageScore: 88, lastStudied: new Date() },
        'Social Studies': { progress: 75, completedLessons: 15, totalLessons: 20, averageScore: 85, lastStudied: new Date() }
      },
      dailyCheckins: {},
      weeklyActivity: {},
      monthlyProgress: {},
      recentActivities: [],
      learningStreak: {
        currentStreak: 25,
        longestStreak: 30,
        lastStudyDate: new Date('2024-01-20'),
        consecutiveDays: 25,
        streakBonus: 250,
        streakHistory: []
      },
      dailyGoals: {
        current: {
          quizzes: 6,
          flashcards: 3,
          games: 4,
          studyTime: 60,
          xpTarget: 120
        },
        completed: {
          quizzes: 3,
          flashcards: 2,
          games: 4,
          studyTime: 40,
          xpTarget: 80
        },
        history: []
      },
      coins: {
        current: 680,
        totalEarned: 680,
        totalSpent: 0,
        history: []
      },
      timeTracking: {
        totalStudyTime: 120,
        dailyAverage: 60,
        weeklyTotal: 120,
        monthlyTotal: 120,
        sessionHistory: []
      }
    },
    achievements: ['Math Master', 'Science Explorer', 'Streak Champion', 'Speed Learner', 'Grammar Guru'],
    gameHistory: {
      quiz: [
        { id: '1', score: 95, totalQuestions: 10, subject: 'Mathematics', date: new Date('2024-01-20') },
        { id: '2', score: 90, totalQuestions: 10, subject: 'Science', date: new Date('2024-01-19') }
      ],
      flashcards: [
        { id: '1', cardsStudied: 25, knownCards: 24, subject: 'Mathematics', date: new Date('2024-01-20') },
        { id: '2', cardsStudied: 20, knownCards: 19, subject: 'Science', date: new Date('2024-01-19') }
      ]
    }
  },
  {
    id: '4',
    name: 'Arjun Singh',
    email: 'arjun@student.com',
    password: 'password123',
    standard: 'Class 4',
    grade: 'Class 4',
    joinDate: new Date('2024-01-05'),
    lastActive: new Date(),
    isLoggedIn: false,
    profile: {
      avatar: '/avatars/arjun.jpg',
      bio: 'Young explorer with big dreams',
      preferences: {
        theme: 'light',
        notifications: false,
        sound: true
      }
    },
    stats: {
      xp: 1200,
      level: 4,
      streak: 5,

      totalQuizzes: 12,
      totalFlashcards: 8,
      averageScore: 70,
      lastLoginDate: new Date(),
      dailyGoalProgress: {
        quizzesCompleted: 0,
        flashcardsCompleted: 1,
        gamesPlayed: 1,
        targetDaily: 3
      },
      subjects: {
        'Mathematics': { progress: 40, completedLessons: 8, totalLessons: 20, averageScore: 72, lastStudied: new Date() },
        'Science': { progress: 35, completedLessons: 7, totalLessons: 20, averageScore: 68, lastStudied: new Date() },
        'English': { progress: 50, completedLessons: 10, totalLessons: 20, averageScore: 75, lastStudied: new Date() },
        'Social Studies': { progress: 25, completedLessons: 5, totalLessons: 20, averageScore: 65, lastStudied: new Date() }
      },
      dailyCheckins: {},
      weeklyActivity: {},
      monthlyProgress: {},
      recentActivities: [],
      learningStreak: {
        currentStreak: 5,
        longestStreak: 7,
        lastStudyDate: new Date('2024-01-20'),
        consecutiveDays: 5,
        streakBonus: 50,
        streakHistory: []
      },
      dailyGoals: {
        current: {
          quizzes: 3,
          flashcards: 1,
          games: 1,
          studyTime: 30,
          xpTarget: 60
        },
        completed: {
          quizzes: 0,
          flashcards: 1,
          games: 1,
          studyTime: 15,
          xpTarget: 30
        },
        history: []
      },
      coins: {
        current: 180,
        totalEarned: 180,
        totalSpent: 0,
        history: []
      },
      timeTracking: {
        totalStudyTime: 30,
        dailyAverage: 30,
        weeklyTotal: 30,
        monthlyTotal: 30,
        sessionHistory: []
      }
    },
    achievements: ['First Steps'],
    gameHistory: {
      quiz: [
        { id: '1', score: 70, totalQuestions: 10, subject: 'Mathematics', date: new Date('2024-01-20') },
        { id: '2', score: 75, totalQuestions: 10, subject: 'English', date: new Date('2024-01-19') }
      ],
      flashcards: [
        { id: '1', cardsStudied: 10, knownCards: 8, subject: 'Mathematics', date: new Date('2024-01-20') },
        { id: '2', cardsStudied: 8, knownCards: 6, subject: 'English', date: new Date('2024-01-19') }
      ]
    }
  },
  {
    id: '5',
    name: 'Ananya Gupta',
    email: 'ananya@student.com',
    password: 'password123',
    standard: 'Class 7',
    grade: 'Class 7',
    joinDate: new Date('2024-01-20'),
    lastActive: new Date(),
    isLoggedIn: false,
    profile: {
      avatar: '/avatars/ananya.jpg',
      bio: 'Creative mind with a love for arts and science',
      preferences: {
        theme: 'light',
        notifications: true,
        sound: true
      }
    },
    stats: {
      xp: 2100,
      level: 7,
      streak: 15,

      totalQuizzes: 22,
      totalFlashcards: 16,
      averageScore: 82,
      lastLoginDate: new Date(),
      dailyGoalProgress: {
        quizzesCompleted: 2,
        flashcardsCompleted: 1,
        gamesPlayed: 2,
        targetDaily: 5
      },
      subjects: {
        'Mathematics': { progress: 65, completedLessons: 13, totalLessons: 20, averageScore: 80, lastStudied: new Date() },
        'Science': { progress: 70, completedLessons: 14, totalLessons: 20, averageScore: 85, lastStudied: new Date() },
        'English': { progress: 75, completedLessons: 15, totalLessons: 20, averageScore: 88, lastStudied: new Date() },
        'Social Studies': { progress: 60, completedLessons: 12, totalLessons: 20, averageScore: 78, lastStudied: new Date() }
      },
      dailyCheckins: {},
      weeklyActivity: {},
      monthlyProgress: {},
      recentActivities: [],
      learningStreak: {
        currentStreak: 15,
        longestStreak: 18,
        lastStudyDate: new Date('2024-01-20'),
        consecutiveDays: 15,
        streakBonus: 150,
        streakHistory: []
      },
      dailyGoals: {
        current: {
          quizzes: 5,
          flashcards: 3,
          games: 2,
          studyTime: 40,
          xpTarget: 100
        },
        completed: {
          quizzes: 2,
          flashcards: 1,
          games: 2,
          studyTime: 20,
          xpTarget: 50
        },
        history: []
      },
      coins: {
        current: 380,
        totalEarned: 380,
        totalSpent: 0,
        history: []
      },
      timeTracking: {
        totalStudyTime: 40,
        dailyAverage: 40,
        weeklyTotal: 40,
        monthlyTotal: 40,
        sessionHistory: []
      }
    },
    achievements: ['Science Explorer', 'English Guru', 'Streak Champion'],
    gameHistory: {
      quiz: [
        { id: '1', score: 82, totalQuestions: 10, subject: 'Science', date: new Date('2024-01-20') },
        { id: '2', score: 88, totalQuestions: 10, subject: 'English', date: new Date('2024-01-19') }
      ],
      flashcards: [
        { id: '1', cardsStudied: 18, knownCards: 16, subject: 'Science', date: new Date('2024-01-20') },
        { id: '2', cardsStudied: 14, knownCards: 13, subject: 'English', date: new Date('2024-01-19') }
      ]
    }
  }
];

// User management functions
export const findUserByEmail = (email: string): UserData | undefined => {
  // First check localStorage for a user
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('userDataset');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const found = users.find((u: any) => u.email === email);
      if (found) return found;
    }
  }
  // Fallback to in-memory dataset
  return userDataset.find(user => user.email === email);
};

export const findUserById = (id: string): UserData | undefined => {
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('userDataset');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const found = users.find((u: any) => u.id === id);
      if (found) return found;
    }
  }
  return userDataset.find(user => user.id === id);
};

export const authenticateUser = (email: string, password: string): UserData | null => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    const authenticatedUser = { ...user, isLoggedIn: true, lastActive: new Date() };
    // Save to localStorage for session persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
    }
    return authenticatedUser;
  }
  return null;
};

export const createUser = (userData: Omit<UserData, 'id' | 'joinDate' | 'lastActive' | 'isLoggedIn' | 'stats' | 'achievements' | 'gameHistory'>): UserData => {
  const newUser: UserData = {
    ...userData,
    id: (userDataset.length + 1).toString(),
    joinDate: new Date(),
    lastActive: new Date(),
    isLoggedIn: true,
    stats: {
      xp: 0,
      level: 1,
      streak: 0,

      totalQuizzes: 0,
      totalFlashcards: 0,
      averageScore: 0,
      lastLoginDate: new Date(),
      dailyGoalProgress: {
        quizzesCompleted: 0,
        flashcardsCompleted: 0,
        gamesPlayed: 0,
        targetDaily: 3
      },
      subjects: {
        'Mathematics': { progress: 0, completedLessons: 0, totalLessons: 20, averageScore: 0, lastStudied: new Date() },
        'Science': { progress: 0, completedLessons: 0, totalLessons: 20, averageScore: 0, lastStudied: new Date() },
        'English': { progress: 0, completedLessons: 0, totalLessons: 20, averageScore: 0, lastStudied: new Date() },
        'Social Studies': { progress: 0, completedLessons: 0, totalLessons: 20, averageScore: 0, lastStudied: new Date() }
      },
      dailyCheckins: {},
      weeklyActivity: {},
      monthlyProgress: {},
      recentActivities: [],
      learningStreak: {
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: new Date(),
        consecutiveDays: 0,
        streakBonus: 0,
        streakHistory: []
      },
      dailyGoals: {
        current: {
          quizzes: 0,
          flashcards: 0,
          games: 0,
          studyTime: 0,
          xpTarget: 0
        },
        completed: {
          quizzes: 0,
          flashcards: 0,
          games: 0,
          studyTime: 0,
          xpTarget: 0
        },
        history: []
      },
      coins: {
        current: 0,
        totalEarned: 0,
        totalSpent: 0,
        history: []
      },
      timeTracking: {
        totalStudyTime: 0,
        dailyAverage: 0,
        weeklyTotal: 0,
        monthlyTotal: 0,
        sessionHistory: []
      }
    },
    achievements: [],
    gameHistory: {
      quiz: [],
      flashcards: [],
      games: []
    }
  };
  userDataset.push(newUser);
  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('userDataset');
    let users = userDataset;
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      users.push(newUser);
    }
    localStorage.setItem('userDataset', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
  }
  return newUser;
};

// New comprehensive tracking functions
export const recordDailyCheckin = (userId: string): void => {
  const user = findUserById(userId);
  if (!user) return;

  const today = new Date();
  const dateKey = today.toISOString().split('T')[0];
  
  // Check if already checked in today
  if (user.stats.dailyCheckins[dateKey]) {
    return; // Already checked in today
  }

  const streakBonus = Math.floor(user.stats.learningStreak.currentStreak / 7) * 10; // Bonus every 7 days
  const checkinXP = 50 + streakBonus;
  const checkinCoins = 10 + Math.floor(streakBonus / 10);

  user.stats.dailyCheckins[dateKey] = {
    date: today,
    xpEarned: checkinXP,
    activitiesCompleted: 0,
    goalsAchieved: 0,
    coinsEarned: checkinCoins,
    streakBonus: streakBonus,
    checkinTime: today
  };

  // Update user stats
  user.stats.xp += checkinXP;
  user.stats.coins.current += checkinCoins;
  user.stats.coins.totalEarned += checkinCoins;

  // Add to recent activities
  addRecentActivity(user, {
    type: 'checkin',
    description: `Daily check-in (${user.stats.learningStreak.currentStreak} day streak)`,
    xpEarned: checkinXP,
    coinsEarned: checkinCoins
  });

  // Update coins history
  addCoinsHistory(user, 'earned', checkinCoins, 'Daily check-in bonus');

  saveUserToLocalStorage(user);
};

export const updateLearningProgress = (userId: string, subject: string, activityType: string, timeSpent: number, xpEarned: number, coinsEarned: number): void => {
  const user = findUserById(userId);
  if (!user) return;

  const now = new Date();
  
  // Update subject progress
  if (user.stats.subjects[subject]) {
    const subjectStats = user.stats.subjects[subject];
    subjectStats.timeSpent += timeSpent;
    subjectStats.totalXP += xpEarned;
    subjectStats.lastStudied = now;
    
    // Update weekly and monthly progress
    const weekKey = getWeekKey(now);
    const monthKey = getMonthKey(now);
    
    if (!user.stats.weeklyActivity[weekKey]) {
      user.stats.weeklyActivity[weekKey] = {
        weekStart: getWeekStart(now),
        weekEnd: getWeekEnd(now),
        totalXP: 0,
        totalCoins: 0,
        activitiesCompleted: 0,
        subjectsStudied: [],
        averageDailyTime: 0,
        goalsAchieved: 0,
        streakDays: 0
      };
    }
    
    if (!user.stats.monthlyProgress[monthKey]) {
      user.stats.monthlyProgress[monthKey] = {
        month: monthKey,
        totalXP: 0,
        totalCoins: 0,
        activitiesCompleted: 0,
        subjectsStudied: [],
        averageDailyTime: 0,
        goalsAchieved: 0,
        streakDays: 0,
        levelUps: 0
      };
    }

    // Update weekly activity
    const weekly = user.stats.weeklyActivity[weekKey];
    weekly.totalXP += xpEarned;
    weekly.totalCoins += coinsEarned;
    weekly.activitiesCompleted += 1;
    if (!weekly.subjectsStudied.includes(subject)) {
      weekly.subjectsStudied.push(subject);
    }

    // Update monthly progress
    const monthly = user.stats.monthlyProgress[monthKey];
    monthly.totalXP += xpEarned;
    monthly.totalCoins += coinsEarned;
    monthly.activitiesCompleted += 1;
    if (!monthly.subjectsStudied.includes(subject)) {
      monthly.subjectsStudied.push(subject);
    }
  }

  // Update time tracking
  user.stats.timeTracking.totalStudyTime += timeSpent;
  user.stats.timeTracking.dailyAverage = Math.round(user.stats.timeTracking.totalStudyTime / Math.max(1, user.stats.learningStreak.consecutiveDays));
  user.stats.timeTracking.weeklyTotal += timeSpent;
  user.stats.timeTracking.monthlyTotal += timeSpent;

  // Add session to history
  const sessionId = Date.now().toString();
  user.stats.timeTracking.sessionHistory.push({
    id: sessionId,
    startTime: new Date(now.getTime() - timeSpent * 60000), // Approximate start time
    endTime: now,
    duration: timeSpent,
    subject: subject,
    activity: activityType,
    xpEarned: xpEarned
  });

  // Update daily checkin if exists
  const todayKey = now.toISOString().split('T')[0];
  if (user.stats.dailyCheckins[todayKey]) {
    user.stats.dailyCheckins[todayKey].activitiesCompleted += 1;
  }

  saveUserToLocalStorage(user);
};

export const updateStreak = (userId: string): void => {
  const user = findUserById(userId);
  if (!user) return;

  const today = new Date();
  const lastStudyDate = new Date(user.stats.learningStreak.lastStudyDate);
  
  // Check if it's a new day
  const isNewDay = today.getDate() !== lastStudyDate.getDate() || 
                   today.getMonth() !== lastStudyDate.getMonth() || 
                   today.getFullYear() !== lastStudyDate.getFullYear();
  
  if (isNewDay) {
    // Check if it's consecutive (yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isConsecutive = yesterday.getDate() === lastStudyDate.getDate() && 
                         yesterday.getMonth() === lastStudyDate.getMonth() && 
                         yesterday.getFullYear() === lastStudyDate.getFullYear();
    
    if (isConsecutive) {
      user.stats.learningStreak.currentStreak += 1;
      user.stats.learningStreak.consecutiveDays += 1;
      
      if (user.stats.learningStreak.currentStreak > user.stats.learningStreak.longestStreak) {
        user.stats.learningStreak.longestStreak = user.stats.learningStreak.currentStreak;
      }
      
      // Streak bonus
      const streakBonus = Math.floor(user.stats.learningStreak.currentStreak / 7) * 25;
      user.stats.learningStreak.streakBonus = streakBonus;
      
      // Add streak bonus to recent activities
      if (streakBonus > 0) {
        addRecentActivity(user, {
          type: 'streak_bonus',
          description: `${user.stats.learningStreak.currentStreak} day streak bonus!`,
          xpEarned: streakBonus,
          coinsEarned: Math.floor(streakBonus / 10)
        });
      }
    } else {
      // Reset streak if missed a day
      user.stats.learningStreak.currentStreak = 1;
      user.stats.learningStreak.consecutiveDays = 1;
      user.stats.learningStreak.streakBonus = 0;
    }
    
    user.stats.learningStreak.lastStudyDate = today;
    
    // Add to streak history
    user.stats.learningStreak.streakHistory.push({
      date: today,
      activitiesCompleted: user.stats.dailyCheckins[today.toISOString().split('T')[0]]?.activitiesCompleted || 0,
      xpEarned: user.stats.dailyCheckins[today.toISOString().split('T')[0]]?.xpEarned || 0,
      coinsEarned: user.stats.dailyCheckins[today.toISOString().split('T')[0]]?.coinsEarned || 0
    });
  }
  
  saveUserToLocalStorage(user);
};

export const updateDailyGoals = (userId: string, activityType: 'quizzes' | 'flashcards' | 'games' | 'studyTime' | 'xpTarget', amount: number): void => {
  const user = findUserById(userId);
  if (!user) return;

  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  // Update completed goals
  user.stats.dailyGoals.completed[activityType] += amount;

  // Check if daily goals are achieved
  const goals = user.stats.dailyGoals.current;
  const completed = user.stats.dailyGoals.completed;
  
  const allGoalsAchieved = 
    completed.quizzes >= goals.quizzes &&
    completed.flashcards >= goals.flashcards &&
    completed.games >= goals.games &&
    completed.studyTime >= goals.studyTime &&
    completed.xpTarget >= goals.xpTarget;

  if (allGoalsAchieved && !user.stats.dailyGoals.history.find(h => h.date.toISOString().split('T')[0] === todayKey)) {
    // Daily goals achieved for the first time today
    const bonusCoins = 50;
    user.stats.coins.current += bonusCoins;
    user.stats.coins.totalEarned += bonusCoins;

    // Add to history
    user.stats.dailyGoals.history.push({
      date: today,
      goals: { ...goals },
      completed: { ...completed },
      achieved: true,
      bonusCoins: bonusCoins
    });

    // Add to recent activities
    addRecentActivity(user, {
      type: 'goal_achieved',
      description: 'Daily goals completed!',
      xpEarned: 100,
      coinsEarned: bonusCoins
    });

    // Update daily checkin
    if (user.stats.dailyCheckins[todayKey]) {
      user.stats.dailyCheckins[todayKey].goalsAchieved += 1;
    }
  }

  saveUserToLocalStorage(user);
};

export const checkLevelUp = (userId: string): boolean => {
  const user = findUserById(userId);
  if (!user) return false;

  const newLevel = Math.floor(user.stats.xp / 250) + 1;
  
  if (newLevel > user.stats.level) {
    const oldLevel = user.stats.level;
    user.stats.level = newLevel;
    
    const levelUpBonus = newLevel * 25;
    user.stats.coins.current += levelUpBonus;
    user.stats.coins.totalEarned += levelUpBonus;

    // Add to recent activities
    addRecentActivity(user, {
      type: 'level_up',
      description: `Level up! ${oldLevel} → ${newLevel}`,
      xpEarned: 0,
      coinsEarned: levelUpBonus
    });

    // Update monthly progress
    const monthKey = getMonthKey(new Date());
    if (user.stats.monthlyProgress[monthKey]) {
      user.stats.monthlyProgress[monthKey].levelUps += 1;
    }

    saveUserToLocalStorage(user);
    return true;
  }
  
  return false;
};

// Helper functions
const addRecentActivity = (user: UserData, activity: {
  type: 'quiz' | 'flashcards' | 'game' | 'checkin' | 'goal_achieved' | 'level_up' | 'streak_bonus';
  subject?: string;
  description: string;
  xpEarned: number;
  coinsEarned: number;
  details?: any;
}): void => {
  const newActivity = {
    id: Date.now().toString(),
    ...activity,
    timestamp: new Date()
  };

  user.stats.recentActivities.unshift(newActivity);
  
  // Keep only last 50 activities
  if (user.stats.recentActivities.length > 50) {
    user.stats.recentActivities = user.stats.recentActivities.slice(0, 50);
  }
};

const addCoinsHistory = (user: UserData, type: 'earned' | 'spent', amount: number, reason: string, source?: string): void => {
  user.stats.coins.history.push({
    id: Date.now().toString(),
    type,
    amount,
    reason,
    timestamp: new Date(),
    source
  });
};

const getWeekKey = (date: Date): string => {
  const year = date.getFullYear();
  const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const getWeekEnd = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  return new Date(d.setDate(diff));
};

// Enhanced updateUserStats function
export const updateUserStats = (userId: string, gameType: 'quiz' | 'flashcards' | 'game', gameData: any): void => {
  const user = findUserById(userId);
  if (!user) return;

  const timeSpent = gameData.timeSpent || 5; // Default 5 minutes if not provided
  let xpEarned = 0;
  let coinsEarned = 0;

  if (gameType === 'quiz') {
    user.stats.totalQuizzes++;
    xpEarned = gameData.score * 2; // 2 XP per point
    coinsEarned = Math.floor(gameData.score / 10); // 1 coin per 10 points
    user.stats.dailyGoalProgress.quizzesCompleted++;
    
    // Update subject progress
    if (user.stats.subjects[gameData.subject]) {
      const subjectStats = user.stats.subjects[gameData.subject];
      subjectStats.completedLessons++;
      subjectStats.averageScore = 
        (subjectStats.averageScore + gameData.score) / 2;
      subjectStats.progress = 
        (subjectStats.completedLessons / subjectStats.totalLessons) * 100;
      subjectStats.lastStudied = new Date();
    }
    
    // Add to game history
    user.gameHistory.quiz.push({
      id: Date.now().toString(),
      score: gameData.score,
      totalQuestions: gameData.totalQuestions,
      subject: gameData.subject,
      date: new Date(),
      timeSpent: timeSpent,
      xpEarned: xpEarned,
      coinsEarned: coinsEarned
    });

    // Update daily goals
    updateDailyGoals(userId, 'quizzes', 1);
    
  } else if (gameType === 'flashcards') {
    user.stats.totalFlashcards++;
    xpEarned = gameData.cardsStudied * 5; // 5 XP per card
    coinsEarned = Math.floor(gameData.knownCards / 5); // 1 coin per 5 known cards
    user.stats.dailyGoalProgress.flashcardsCompleted++;
    
    // Add to game history
    user.gameHistory.flashcards.push({
      id: Date.now().toString(),
      cardsStudied: gameData.cardsStudied,
      knownCards: gameData.knownCards,
      subject: gameData.subject,
      date: new Date(),
      timeSpent: timeSpent,
      xpEarned: xpEarned,
      coinsEarned: coinsEarned
    });

    // Update daily goals
    updateDailyGoals(userId, 'flashcards', 1);
    
  } else if (gameType === 'game') {
    xpEarned = gameData.score * 3; // 3 XP per point for games
    coinsEarned = Math.floor(gameData.score / 15); // 1 coin per 15 points
    user.stats.dailyGoalProgress.gamesPlayed++;
    
    // Add to game history
    user.gameHistory.games.push({
      id: Date.now().toString(),
      gameType: gameData.gameType || 'unknown',
      score: gameData.score,
      subject: gameData.subject || 'General',
      date: new Date(),
      timeSpent: timeSpent,
      xpEarned: xpEarned,
      coinsEarned: coinsEarned
    });

    // Update daily goals
    updateDailyGoals(userId, 'games', 1);
  }
  
  // Update user stats
  user.stats.xp += xpEarned;
  user.stats.coins.current += coinsEarned;
  user.stats.coins.totalEarned += coinsEarned;
  
  // Update level based on XP
  const oldLevel = user.stats.level;
  user.stats.level = Math.floor(user.stats.xp / 250) + 1;
  
  // Check for level up
  if (user.stats.level > oldLevel) {
    const levelUpBonus = user.stats.level * 25;
    user.stats.coins.current += levelUpBonus;
    user.stats.coins.totalEarned += levelUpBonus;
    
    addRecentActivity(user, {
      type: 'level_up',
      description: `Level up! ${oldLevel} → ${user.stats.level}`,
      xpEarned: 0,
      coinsEarned: levelUpBonus
    });
  }
  
  user.lastActive = new Date();
  
  // Update learning progress
  updateLearningProgress(userId, gameData.subject || 'General', gameType, timeSpent, xpEarned, coinsEarned);
  
  // Update streak
  updateStreak(userId);
  
  // Add to recent activities
  addRecentActivity(user, {
    type: gameType,
    subject: gameData.subject,
    description: `${gameType} completed - ${gameData.score || gameData.cardsStudied || 0} points`,
    xpEarned: xpEarned,
    coinsEarned: coinsEarned,
    details: gameData
  });
  
  // Add to coins history
  addCoinsHistory(user, 'earned', coinsEarned, `${gameType} completion`);
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('userDataset');
    let users = userDataset;
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      const idx = users.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) users[idx] = user;
    }
    localStorage.setItem('userDataset', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const updateUserStreak = (userId: string): void => {
  const user = findUserById(userId);
  if (!user) return;

  const today = new Date();
  const lastLogin = new Date(user.stats.lastLoginDate);
  
  // Check if it's a new day
  const isNewDay = today.getDate() !== lastLogin.getDate() || 
                   today.getMonth() !== lastLogin.getMonth() || 
                   today.getFullYear() !== lastLogin.getFullYear();
  
  if (isNewDay) {
    // Check if it's consecutive (yesterday)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isConsecutive = yesterday.getDate() === lastLogin.getDate() && 
                         yesterday.getMonth() === lastLogin.getMonth() && 
                         yesterday.getFullYear() === lastLogin.getFullYear();
    
    if (isConsecutive) {
      user.stats.streak++;
      // Bonus XP for maintaining streak
      user.stats.xp += user.stats.streak * 10;
      const streakBonus = Math.floor(user.stats.streak / 7) * 5; // Bonus coins every 7 days
      user.stats.coins.current += streakBonus;
      user.stats.coins.totalEarned += streakBonus;
    } else {
      // Reset streak if missed a day
      user.stats.streak = 1;
    }
    
    // Reset daily progress
    user.stats.dailyGoalProgress = {
      quizzesCompleted: 0,
      flashcardsCompleted: 0,
      gamesPlayed: 0,
      targetDaily: user.stats.dailyGoalProgress.targetDaily
    };
  }
  
  user.stats.lastLoginDate = today;
  // Save to localStorage
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('userDataset');
    let users = userDataset;
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      const idx = users.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) users[idx] = user;
    }
    localStorage.setItem('userDataset', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const saveUserToLocalStorage = (user: UserData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    const storedUsers = localStorage.getItem('userDataset');
    let users = userDataset;
    if (storedUsers) {
      users = JSON.parse(storedUsers);
      const idx = users.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) users[idx] = user;
    }
    localStorage.setItem('userDataset', JSON.stringify(users));
  }
};

export const loadUserFromLocalStorage = (userId: string): UserData | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    if (userData) {
      const localUser = JSON.parse(userData);
      if (localUser.id === userId) {
        return localUser;
      }
    }
  }
  return null;
};

export const getLeaderboard = (): UserData[] => {
  return [...userDataset]
    .sort((a, b) => b.stats.xp - a.stats.xp)
    .slice(0, 10);
};

export const getUsersByStandard = (standard: string): UserData[] => {
  return userDataset.filter(user => user.standard === standard);
};

export const getTopPerformers = (subject: string): UserData[] => {
  return [...userDataset]
    .filter(user => user.stats.subjects[subject])
    .sort((a, b) => (b.stats.subjects[subject]?.averageScore || 0) - (a.stats.subjects[subject]?.averageScore || 0))
    .slice(0, 5);
}; 