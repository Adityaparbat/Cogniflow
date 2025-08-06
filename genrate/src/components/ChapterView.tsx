import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Chapter {
  id: number;
  name: string;
  filename: string;
  path: string;
}

const ChapterView: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chapters/${subject}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch chapters');
        }
        
        const data = await response.json();
        setChapters(data.chapters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (subject) {
      fetchChapters();
    }
  }, [subject]);

  const getSubjectName = (subjectId: string) => {
    const subjectNames: { [key: string]: string } = {
      english: 'English',
      hindi: 'Hindi',
      math: 'Mathematics'
    };
    return subjectNames[subjectId] || subjectId;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading chapters...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Error loading chapters</h3>
          <p>{error}</p>
          <Link to="/" className="btn">Go back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="chapters-header">
        <h1>{getSubjectName(subject!)} Chapters</h1>
        <p>Select a chapter to generate an educational video</p>
      </div>

      <div className="chapters-grid">
        {chapters.map((chapter) => (
          <Link 
            key={chapter.id} 
            to={`/chapter/${subject}/${chapter.id}`}
            className="chapter-card"
          >
            <div className="chapter-number">{chapter.id}</div>
            <div className="chapter-title">{chapter.name}</div>
            <div className="chapter-status">Ready to generate video</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChapterView; 