'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoLessonHome from '@/app/video-lessons/components/VideoLessonHome';
import ChapterView from '@/app/video-lessons/components/ChapterView';
import VideoGenerator from '@/app/video-lessons/components/VideoGenerator';
import VideoPlayer from '@/app/video-lessons/components/VideoPlayer';

interface VideoLessonPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function VideoLessonPage({ searchParams }: VideoLessonPageProps) {
  const router = useRouter();
  const unwrappedSearchParams = React.use(searchParams);
  const [currentView, setCurrentView] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<string>('');

  // Handle routing based on URL parameters
  React.useEffect(() => {
    const view = unwrappedSearchParams.view as string;
    const subject = unwrappedSearchParams.subject as string;
    const chapter = unwrappedSearchParams.chapter as string;
    const video = unwrappedSearchParams.video as string;

    if (view) {
      setCurrentView(view);
      if (subject) setSelectedSubject(subject);
      if (chapter) setSelectedChapter(chapter);
      if (video) setSelectedVideo(video);
    }
  }, [unwrappedSearchParams]);

  const navigateToSubject = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentView('chapters');
    router.push(`/video-lessons?view=chapters&subject=${subject}`);
  };

  const navigateToChapter = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setCurrentView('generator');
    router.push(`/video-lessons?view=generator&subject=${selectedSubject}&chapter=${chapterId}`);
  };

  const navigateToVideo = (videoId: string) => {
    setSelectedVideo(videoId);
    setCurrentView('player');
    router.push(`/video-lessons?view=player&video=${videoId}`);
  };

  const navigateBack = () => {
    if (currentView === 'chapters') {
      setCurrentView('home');
      setSelectedSubject('');
      router.push('/video-lessons');
    } else if (currentView === 'generator') {
      setCurrentView('chapters');
      setSelectedChapter('');
      router.push(`/video-lessons?view=chapters&subject=${selectedSubject}`);
    } else if (currentView === 'player') {
      setCurrentView('home');
      setSelectedVideo('');
      router.push('/video-lessons');
    }
  };

  const handleVideoComplete = (videoPath: string) => {
    const videoId = videoPath.split('/').pop()?.replace('.mp4', '') || '';
    navigateToVideo(videoId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              📚 Cogniflow Video Lessons
            </button>
            
            <nav className="flex items-center gap-6">
              <button
                onClick={() => setCurrentView('home')}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigateToSubject('english')}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                English
              </button>
              <button
                onClick={() => navigateToSubject('hindi')}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Hindi
              </button>
              <button
                onClick={() => navigateToSubject('math')}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Math
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {currentView === 'home' && (
            <VideoLessonHome onSubjectSelect={navigateToSubject} />
          )}
          
          {currentView === 'chapters' && selectedSubject && (
            <ChapterView
              subject={selectedSubject}
              onChapterSelect={navigateToChapter}
              onBack={navigateBack}
            />
          )}
          
          {currentView === 'generator' && selectedSubject && selectedChapter && (
            <VideoGenerator
              subject={selectedSubject}
              chapterId={selectedChapter}
              onComplete={handleVideoComplete}
              onBack={navigateBack}
            />
          )}
          
          {currentView === 'player' && selectedVideo && (
            <VideoPlayer
              videoId={selectedVideo}
              onBack={navigateBack}
            />
          )}
        </div>
      </main>
    </div>
  );
}
