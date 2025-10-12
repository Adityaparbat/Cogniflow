'use client';

import React from 'react';

interface VideoPlayerProps {
  videoId: string;
  onBack: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center text-white mb-8">
        <button
          onClick={onBack}
          className="mb-4 text-white/80 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Home
        </button>
        <h1 className="text-3xl font-bold mb-2">🎬 Educational Video Player</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
          <video controls autoPlay className="w-full h-full">
            <source src={`/api/video_lesson?action=video&filename=${videoId}.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{videoId}</h2>
          <p className="text-gray-600">
            This educational video was generated using AI-powered content creation technology. 
            Enjoy your personalized learning experience!
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.open(`/api/video_lesson?action=video&filename=${videoId}.mp4`, '_blank')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open in New Tab
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
