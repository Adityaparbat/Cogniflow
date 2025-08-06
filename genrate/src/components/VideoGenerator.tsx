import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Chapter {
  id: number;
  name: string;
  filename: string;
  path: string;
}

type Step = 'extracting' | 'generating' | 'creating' | 'complete';

const VideoGenerator: React.FC = () => {
  const { subject, chapterId } = useParams<{ subject: string; chapterId: string }>();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<Step>('extracting');
  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoPath, setVideoPath] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        const response = await fetch(`/api/chapters/${subject}`);
        if (response.ok) {
          const data = await response.json();
          const chapterData = data.chapters.find((c: Chapter) => c.id === parseInt(chapterId!));
          if (chapterData) {
            setChapter(chapterData);
            startVideoGeneration(chapterData);
          }
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
      
      const extractResponse = await fetch('/api/extract-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfPath: chapterData.path })
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
      
      const videoResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
      <div className="container">
        <div className="error">
          <h3>Error during video generation</h3>
          <p>{error}</p>
          <button onClick={() => navigate(`/subject/${subject}`)} className="btn">
            Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete' && videoPath) {
    return (
      <div className="container">
        <div className="generator-container">
          <div className="generator-header">
            <h1>🎉 Video Generated Successfully!</h1>
            <p>Your educational video is ready to watch</p>
          </div>

          <div className="card">
            <div className="video-container">
              <video controls autoPlay>
                <source src={`/api/video/${videoPath.split('/').pop()}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="video-controls">
              <button 
                onClick={() => navigate(`/video/${videoPath.split('/').pop()}`)} 
                className="btn"
              >
                Full Screen View
              </button>
              <button 
                onClick={() => navigate(`/subject/${subject}`)} 
                className="btn"
              >
                Generate Another Video
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="generator-container">
        <div className="generator-header">
          <h1>🎬 Generating Educational Video</h1>
          <p>Creating an engaging video from Chapter {chapterId}</p>
        </div>

        <div className="step-indicator">
          <div className="step">
            <div className={`step-number ${currentStep === 'extracting' ? 'active' : 'completed'}`}>
              {currentStep === 'extracting' ? '1' : '✓'}
            </div>
            <span className={`step-label ${currentStep === 'extracting' ? 'active' : 'completed'}`}>
              Extract Text
            </span>
          </div>
          
          <div className="step">
            <div className={`step-number ${currentStep === 'generating' ? 'active' : currentStep === 'creating' || currentStep === 'complete' ? 'completed' : 'pending'}`}>
              {currentStep === 'generating' ? '2' : currentStep === 'creating' || currentStep === 'complete' ? '✓' : '2'}
            </div>
            <span className={`step-label ${currentStep === 'generating' ? 'active' : currentStep === 'creating' || currentStep === 'complete' ? 'completed' : 'pending'}`}>
              Generate Script
            </span>
          </div>
          
          <div className="step">
            <div className={`step-number ${currentStep === 'creating' ? 'active' : currentStep === 'complete' ? 'completed' : 'pending'}`}>
              {currentStep === 'creating' ? '3' : currentStep === 'complete' ? '✓' : '3'}
            </div>
            <span className={`step-label ${currentStep === 'creating' ? 'active' : currentStep === 'complete' ? 'completed' : 'pending'}`}>
              Create Video
            </span>
          </div>
        </div>

        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <div>
              <h3>{getStepLabel(currentStep)}</h3>
              <p>Please wait while we process your request...</p>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="text-center">
            <span>{progress}% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator; 