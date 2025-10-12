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
  onClose?: () => void;
  onComplete?: (videoPath: string) => void;
}

type Step = 'extracting' | 'generating' | 'creating' | 'complete';

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ 
  subject, 
  chapterId, 
  onClose, 
  onComplete 
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

      // Step 2: Generate script
      setCurrentStep('generating');
      setProgress(50);
      
      // Simulate script generation time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Create video
      setCurrentStep('creating');
      setProgress(75);
      
      // Get the correct script path based on the PDF filename
      const pdfFilename = chapterData.filename.replace('.pdf', '');
      const scriptPath = `scripts/${pdfFilename}_script.txt`;
      
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
      generating: 'Generating educational script',
      creating: 'Creating video with TTS',
      complete: 'Video generation complete!'
    };
    return labels[step];
  };

  const getStepIcon = (step: Step) => {
    const icons = {
      extracting: '📄',
      generating: '✍️',
      creating: '🎬',
      complete: '✅'
    };
    return icons[step];
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error during video generation</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              {onClose && (
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete' && videoPath) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="text-green-500 text-4xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Generated Successfully!</h1>
            <p className="text-gray-600">Your educational video is ready to watch</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video controls className="w-full h-full">
                <source src={`/api/video_lesson?action=video&filename=${videoPath.split('/').pop()}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            {onClose && (
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Close
              </button>
            )}
            <button 
              onClick={() => window.open(`/api/video_lesson?action=video&filename=${videoPath.split('/').pop()}`, '_blank')}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">🎬 Generating Educational Video</h1>
          <p className="text-gray-600">Creating an engaging video from Chapter {chapterId}</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep === 'extracting' ? 'bg-purple-500 text-white' : 
              currentStep === 'generating' || currentStep === 'creating' || currentStep === 'complete' ? 
              'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {currentStep === 'extracting' ? '1' : '✓'}
            </div>
            <span className="text-xs text-gray-600 mt-1">Extract Text</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep === 'generating' ? 'bg-purple-500 text-white' : 
              currentStep === 'creating' || currentStep === 'complete' ? 
              'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {currentStep === 'generating' ? '2' : currentStep === 'creating' || currentStep === 'complete' ? '✓' : '2'}
            </div>
            <span className="text-xs text-gray-600 mt-1">Generate Script</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep === 'creating' ? 'bg-purple-500 text-white' : 
              currentStep === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {currentStep === 'creating' ? '3' : currentStep === 'complete' ? '✓' : '3'}
            </div>
            <span className="text-xs text-gray-600 mt-1">Create Video</span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h3 className="font-semibold text-gray-900 mb-1">{getStepLabel(currentStep)}</h3>
            <p className="text-sm text-gray-600 mb-4">Please wait while we process your request...</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{progress}% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
