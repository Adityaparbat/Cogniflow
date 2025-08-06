'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  ExternalLink, 
  Search, 
  Filter,
  Star,
  Bookmark,
  Download,
  Play,
  FileText,
  Video,
  Globe,
  Target,
  Clock,
  Users
} from 'lucide-react';

interface LearningResourcesProps {
  onClose: () => void;
  user: any;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'pdf' | 'website' | 'game' | 'quiz';
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  url: string;
  tags: string[];
  featured: boolean;
}

export default function LearningResources({ onClose, user }: LearningResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const subjects = ['Mathematics', 'Science', 'English', 'Geography', 'History', 'Computer Science'];
  const types = ['video', 'article', 'pdf', 'website', 'game', 'quiz'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    loadResources();
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedSubject, selectedType, selectedDifficulty, showBookmarks]);

  const loadResources = () => {
    // Sample educational resources
    const sampleResources: Resource[] = [
      {
        id: '1',
        title: 'Khan Academy - Mathematics',
        description: 'Comprehensive math tutorials from basic arithmetic to calculus',
        type: 'video',
        subject: 'Mathematics',
        difficulty: 'beginner',
        duration: 'Self-paced',
        rating: 4.8,
        url: 'https://www.khanacademy.org/math',
        tags: ['tutorials', 'practice', 'free'],
        featured: true
      },
      {
        id: '2',
        title: 'BBC Bitesize - Science',
        description: 'Interactive science lessons and experiments',
        type: 'website',
        subject: 'Science',
        difficulty: 'intermediate',
        duration: '30-60 min',
        rating: 4.6,
        url: 'https://www.bbc.co.uk/bitesize/subjects',
        tags: ['interactive', 'experiments', 'curriculum'],
        featured: true
      },
      {
        id: '3',
        title: 'Duolingo - English Learning',
        description: 'Gamified English language learning platform',
        type: 'game',
        subject: 'English',
        difficulty: 'beginner',
        duration: '10-20 min',
        rating: 4.7,
        url: 'https://www.duolingo.com',
        tags: ['language', 'gamification', 'daily practice'],
        featured: false
      },
      {
        id: '4',
        title: 'National Geographic Kids',
        description: 'Educational content about geography and world cultures',
        type: 'website',
        subject: 'Geography',
        difficulty: 'beginner',
        duration: '15-45 min',
        rating: 4.5,
        url: 'https://kids.nationalgeographic.com',
        tags: ['geography', 'culture', 'nature'],
        featured: false
      },
      {
        id: '5',
        title: 'Crash Course - History',
        description: 'Fast-paced history lessons with engaging animations',
        type: 'video',
        subject: 'History',
        difficulty: 'intermediate',
        duration: '10-15 min',
        rating: 4.9,
        url: 'https://www.youtube.com/c/crashcourse',
        tags: ['history', 'animation', 'entertaining'],
        featured: true
      },
      {
        id: '6',
        title: 'Code.org - Computer Science',
        description: 'Learn coding through fun games and puzzles',
        type: 'game',
        subject: 'Computer Science',
        difficulty: 'beginner',
        duration: '20-40 min',
        rating: 4.8,
        url: 'https://code.org',
        tags: ['coding', 'programming', 'puzzles'],
        featured: true
      },
      {
        id: '7',
        title: 'TED-Ed - Educational Videos',
        description: 'Curated educational videos on various subjects',
        type: 'video',
        subject: 'Science',
        difficulty: 'intermediate',
        duration: '5-10 min',
        rating: 4.7,
        url: 'https://ed.ted.com',
        tags: ['videos', 'curated', 'inspirational'],
        featured: false
      },
      {
        id: '8',
        title: 'Quizlet - Study Tools',
        description: 'Create flashcards and study sets for any subject',
        type: 'quiz',
        subject: 'English',
        difficulty: 'beginner',
        duration: '5-30 min',
        rating: 4.6,
        url: 'https://quizlet.com',
        tags: ['flashcards', 'study tools', 'memorization'],
        featured: false
      }
    ];

    setResources(sampleResources);
  };

  const loadBookmarks = () => {
    const saved = localStorage.getItem(`bookmarks_${user.id}`);
    if (saved) {
      setBookmarkedResources(JSON.parse(saved));
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Filter by bookmarks if showing bookmarks only
    if (showBookmarks) {
      filtered = filtered.filter(resource => bookmarkedResources.includes(resource.id));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty);
    }

    setFilteredResources(filtered);
  };

  const toggleBookmark = (resourceId: string) => {
    const newBookmarks = bookmarkedResources.includes(resourceId)
      ? bookmarkedResources.filter(id => id !== resourceId)
      : [...bookmarkedResources, resourceId];
    
    setBookmarkedResources(newBookmarks);
    localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(newBookmarks));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-5 h-5" />;
      case 'article': return <FileText className="w-5 h-5" />;
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      case 'game': return <Target className="w-5 h-5" />;
      case 'quiz': return <BookOpen className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'article': return 'bg-purple-100 text-purple-800';
      case 'pdf': return 'bg-orange-100 text-orange-800';
      case 'website': return 'bg-green-100 text-green-800';
      case 'game': return 'bg-pink-100 text-pink-800';
      case 'quiz': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Learning Resources</h2>
                <p className="text-indigo-100">Curated educational content and study materials</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowBookmarks(!showBookmarks)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    showBookmarks 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmarks ({bookmarkedResources.length})</span>
                </button>
                <span className="text-sm text-gray-600">
                  {filteredResources.length} resources found
                </span>
              </div>
            </div>
          </div>

          {/* Featured Resources */}
          {!showBookmarks && !searchTerm && selectedSubject === 'all' && selectedType === 'all' && selectedDifficulty === 'all' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.filter(r => r.featured).map((resource) => (
                  <div key={resource.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(resource.type)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                          {resource.type}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className={`p-1 rounded-full transition-colors ${
                          bookmarkedResources.includes(resource.id)
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{resource.rating}</span>
                        </div>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Resources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {showBookmarks ? 'Bookmarked Resources' : 'All Resources'}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white p-4 rounded-xl border hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(resource.type)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                      <span className="text-xs text-gray-500">{resource.subject}</span>
                    </div>
                    <button
                      onClick={() => toggleBookmark(resource.id)}
                      className={`p-1 rounded-full transition-colors ${
                        bookmarkedResources.includes(resource.id)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {resource.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{resource.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">{resource.rating}</span>
                      </div>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredResources.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No resources found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSubject('all');
                    setSelectedType('all');
                    setSelectedDifficulty('all');
                    setShowBookmarks(false);
                  }}
                  className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border">
            <h3 className="font-semibold text-gray-900 mb-2">How to Use Learning Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-medium mb-1">📚 Bookmark Favorites</p>
                <p>Save resources you find useful for quick access later</p>
              </div>
              <div>
                <p className="font-medium mb-1">🎯 Match Your Level</p>
                <p>Choose resources that match your current skill level</p>
              </div>
              <div>
                <p className="font-medium mb-1">⏰ Set Time Goals</p>
                <p>Use the duration info to plan your study sessions</p>
              </div>
              <div>
                <p className="font-medium mb-1">🔄 Mix Different Types</p>
                <p>Combine videos, articles, and interactive content for better learning</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 