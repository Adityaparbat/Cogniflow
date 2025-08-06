import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
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
    <div className="container">
      <div className="hero">
        <h1>Welcome to Genrate</h1>
        <p>Transform your textbooks into engaging educational videos with AI-powered content generation</p>
        
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <Link 
              key={subject.id} 
              to={`/subject/${subject.id}`} 
              className="subject-card"
            >
              <div className="subject-icon">{subject.icon}</div>
              <div className="subject-title">{subject.name}</div>
              <div className="subject-description">{subject.description}</div>
              <div className="subject-meta">
                <small>{subject.chapters} chapters available</small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 