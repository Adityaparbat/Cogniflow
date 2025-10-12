'use client';

import React, { useState } from 'react';
import VideoGenerator from './VideoGenerator';

interface Chapter {
  id: number;
  name: string;
  filename: string;
  path: string;
}

const VideoLessonDemo: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjects = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'math', label: 'Mathematics' }
  ];

  const fetchChapters = async (subject: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/video_lesson?action=chapters&subject=${subject}`);
      if (response.ok) {
        const data = await response.json();
        setChapters(data.chapters);
      } else {
        setError('Failed to load chapters');
      }
    } catch (err) {
      setError('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedChapter('');
    setChapters([]);
    if (subject) {
      fetchChapters(subject);
    }
  };

  const handleGenerateVideo = () => {
    if (selectedSubject && selectedChapter) {
      setShowGenerator(true);
    }
  };

  const handleVideoComplete = (videoPath: string) => {
    console.log('Video generated:', videoPath);
    // You can add additional logic here, like saving to a playlist or showing a success message
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🎬 Video Lesson Generator</h2>
        
        <div className="space-y-4">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a subject...</option>
              {subjects.map(subject => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter Selection */}
          {selectedSubject && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Chapter
              </label>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading chapters...</p>
                </div>
              ) : error ? (
                <div className="text-red-600 text-sm">{error}</div>
              ) : (
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose a chapter...</option>
                  {chapters.map(chapter => (
                    <option key={chapter.id} value={chapter.id.toString()}>
                      {chapter.name} - {chapter.filename}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Generate Button */}
          {selectedSubject && selectedChapter && (
            <div className="pt-4">
              <button
                onClick={handleGenerateVideo}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                🎬 Generate Educational Video
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Select a subject (English, Hindi, or Mathematics)</li>
              <li>2. Choose a chapter from the available PDFs</li>
              <li>3. Click "Generate Educational Video"</li>
              <li>4. Wait for the AI to extract text, generate a script, and create the video</li>
              <li>5. Watch your personalized educational video!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Video Generator Modal */}
      {showGenerator && (
        <VideoGenerator
          subject={selectedSubject}
          chapterId={selectedChapter}
          onClose={() => setShowGenerator(false)}
          onComplete={handleVideoComplete}
        />
      )}
    </div>
  );
};

export default VideoLessonDemo;
