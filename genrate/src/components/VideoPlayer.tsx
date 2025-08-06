import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [videoInfo, setVideoInfo] = useState<{
    title: string;
    subject: string;
    chapter: string;
    duration: string;
  } | null>(null);

  useEffect(() => {
    // Extract video information from filename
    if (videoId) {
      const parts = videoId.replace('.mp4', '').split('_');
      if (parts.length >= 2) {
        setVideoInfo({
          title: `Chapter ${parts[1].replace('chapter', '')}`,
          subject: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
          chapter: parts[1].replace('chapter', ''),
          duration: '5-10 minutes'
        });
      }
    }
  }, [videoId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/api/video/${videoId}`;
    link.download = videoId || 'educational-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="video-player-container">
      <div className="card">
        <div className="video-container">
          <video 
            controls 
            autoPlay 
            style={{ width: '100%', maxHeight: '70vh' }}
          >
            <source src={`/api/video/${videoId}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {videoInfo && (
          <div className="video-info">
            <h2 className="video-title">{videoInfo.title}</h2>
            <div className="video-meta">
              <p><strong>Subject:</strong> {videoInfo.subject}</p>
              <p><strong>Chapter:</strong> {videoInfo.chapter}</p>
              <p><strong>Duration:</strong> {videoInfo.duration}</p>
              <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <div className="video-controls">
          <button onClick={handleBack} className="btn">
            ← Back
          </button>
          <button onClick={handleDownload} className="btn">
            📥 Download Video
          </button>
          <button onClick={() => navigate('/')} className="btn">
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 