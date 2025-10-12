'use client';

import React from 'react';

interface VideoLessonHomeProps {
  onSubjectSelect: (subject: string) => void;
}

const VideoLessonHome: React.FC<VideoLessonHomeProps> = ({ onSubjectSelect }) => {
  const subjects = [
    {
      id: 'english',
      name: 'English',
      icon: '📖',
      description: 'Learn English with interactive video lessons generated from your textbooks.',
      chapters: 9
    },
    {
      id: 'hindi',
      name: 'Hindi',
      icon: '📝',
      description: 'Master Hindi through engaging video content created from your study materials.',
      chapters: 19
    },
    {
      id: 'math',
      name: 'Mathematics',
      icon: '🔢',
      description: 'Explore mathematical concepts with visual learning videos from your books.',
      chapters: 13
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center text-white py-16">
        <h1 className="text-5xl font-bold mb-6 text-shadow-lg">
          Welcome to Video Lessons
        </h1>
        <p className="text-xl mb-12 opacity-90">
          Transform your textbooks into engaging educational videos with AI-powered content generation
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSubjectSelect(subject.id)}
              className="bg-white rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-gray-800"
            >
              <div className="text-6xl mb-4">{subject.icon}</div>
              <div className="text-2xl font-bold mb-3 text-gray-900">{subject.name}</div>
              <div className="text-gray-600 mb-4 leading-relaxed">{subject.description}</div>
              <div className="text-sm text-gray-500">
                <small>{subject.chapters} chapters available</small>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoLessonHome;
