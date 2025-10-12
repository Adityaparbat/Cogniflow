'use client';

import React, { useState, useEffect } from 'react';

interface Chapter {
  id: number;
  name: string;
  filename: string;
  path: string;
}

interface VideoGeneratorProps {
  subject: string;
  chapterId: string;
  onComplete: (videoPath: string) => void;
  onBack: () => void;
}

type Step = 'extracting' | 'generating' | 'creating' | 'complete';

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ 
  subject, 
  chapterId, 
  onComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('extracting');
  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoPath, setVideoPath] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        const response = await fetch(`/api/video_lesson?action=chapters&subject=${subject}`);
        if (response.ok) {
          const data = await response.json();
          const chapterData = data.chapters.find((c: Chapter) => c.id === parseInt(chapterId));
          if (chapterData) {
            setChapter(chapterData);
            startVideoGeneration(chapterData);
          } else {
            setError('Chapter not found');
          }
        } else {
          setError('Failed to load chapter details');
        }
      } catch (err) {
        setError('Failed to load chapter details');
      }
    };

    if (subject && chapterId) {
      fetchChapterDetails();
    }
  }, [subject, chapterId]);

  const startVideoGeneration = async (chapterData: Chapter) => {
    try {
      // Step 1: Extract text from PDF
      setCurrentStep('extracting');
      setProgress(25);
      
      const extractResponse = await fetch('/api/video_lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'extract-text',
          pdfPath: chapterData.path 
        })
      });

      if (!extractResponse.ok) {
        throw new Error('Failed to extract text from PDF');
      }

      // Step 2: Generate script using Gemma
      setCurrentStep('generating');
      setProgress(50);
      
      // Get the correct script path based on the PDF filename
      const pdfFilename = chapterData.filename.replace('.pdf', '');
      const scriptPath = `scripts/${pdfFilename}_script.txt`;
      
      const scriptResponse = await fetch('/api/video_lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-script',
          pdfPath: chapterData.path,
          scriptPath: scriptPath
        })
      });

      if (!scriptResponse.ok) {
        throw new Error('Failed to generate script with Gemma');
      }

      // Step 3: Create video
      setCurrentStep('creating');
      setProgress(75);
      
      const videoResponse = await fetch('/api/video_lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-video',
          scriptPath: scriptPath,
          outputPath: `generated_videos/${subject}_chapter${chapterId}.mp4`
        })
      });

      if (!videoResponse.ok) {
        throw new Error('Failed to generate video');
      }

      const videoData = await videoResponse.json();
      setVideoPath(videoData.videoPath);

      // Step 4: Complete
      setCurrentStep('complete');
      setProgress(100);

      // Call completion callback
      if (onComplete) {
        onComplete(videoData.videoPath);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during video generation');
    }
  };

  const getStepLabel = (step: Step) => {
    const labels = {
      extracting: 'Extracting text from PDF',
      generating: 'Generating educational script with Gemma AI',
      creating: 'Creating video with TTS',
      complete: 'Video generation complete!'
    };
    return labels[step];
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error during video generation</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Chapters
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete' && videoPath) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-green-500 text-4xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Generated Successfully!</h1>
            <p className="text-gray-600">Your educational video is ready to watch</p>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video controls className="w-full h-full">
                <source src={`/api/video_lesson?action=video&filename=${videoPath.split('/').pop()}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Back to Chapters
            </button>
            <button
              onClick={() => window.open(`/api/video_lesson?action=video&filename=${videoPath.split('/').pop()}`, '_blank')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center text-white mb-8">
        <button
          onClick={onBack}
          className="mb-4 text-white/80 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Chapters
        </button>
        <h1 className="text-3xl font-bold mb-2">🎬 Generating Educational Video</h1>
        <p className="text-xl opacity-90">Creating an engaging video from Chapter {chapterId}</p>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center items-center mb-8">
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
              currentStep === 'extracting' ? 'bg-green-500 text-white' : 
              currentStep === 'generating' || currentStep === 'creating' || currentStep === 'complete' ? 
              'bg-green-600 text-white' : 'bg-gray-400 text-white'
            }`}>
              {currentStep === 'extracting' ? '1' : '✓'}
            </div>
            <span className="text-white text-sm mt-2">Extract Text</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
              currentStep === 'generating' ? 'bg-green-500 text-white' : 
              currentStep === 'creating' || currentStep === 'complete' ? 
              'bg-green-600 text-white' : 'bg-gray-400 text-white'
            }`}>
              {currentStep === 'generating' ? '2' : currentStep === 'creating' || currentStep === 'complete' ? '✓' : '2'}
            </div>
            <span className="text-white text-sm mt-2">Generate Script</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
              currentStep === 'creating' ? 'bg-green-500 text-white' : 
              currentStep === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'
            }`}>
              {currentStep === 'creating' ? '3' : currentStep === 'complete' ? '✓' : '3'}
            </div>
            <span className="text-white text-sm mt-2">Create Video</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{getStepLabel(currentStep)}</h3>
          <p className="text-gray-600 mb-6">Please wait while we process your request...</p>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-gray-600 font-medium">{progress}% Complete</span>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
