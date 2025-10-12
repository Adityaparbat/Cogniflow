'use client';

import React, { useState, useEffect } from 'react';

interface Chapter {
  id: number;
  name: string;
  filename: string;
  path: string;
}

interface ChapterViewProps {
  subject: string;
  onChapterSelect: (chapterId: string) => void;
  onBack: () => void;
}

const ChapterView: React.FC<ChapterViewProps> = ({ subject, onChapterSelect, onBack }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/video_lesson?action=chapters&subject=${subject}`);
        
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <span className="text-white text-lg">Loading chapters...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading chapters</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Go back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center text-white mb-12">
        <button
          onClick={onBack}
          className="mb-4 text-white/80 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Subjects
        </button>
        <h1 className="text-4xl font-bold mb-4">{getSubjectName(subject)} Chapters</h1>
        <p className="text-xl opacity-90">Select a chapter to generate an educational video</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect(chapter.id.toString())}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-left"
          >
            <div className="text-3xl font-bold text-green-600 mb-3">{chapter.id}</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">{chapter.name}</div>
            <div className="text-sm text-gray-600">Ready to generate video</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChapterView;
