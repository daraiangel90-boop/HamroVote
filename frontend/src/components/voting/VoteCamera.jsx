// frontend/src/components/voting/VoteCamera.jsx
import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const VoteCamera = ({
  isCameraOn,
  startWebcam,
  stopWebcam,
  verifyFace,
  loading,
  faceVerified,
  modelsLoaded,
  faceCount,
  emotions,
  dominantEmotion,
  stressDetected,
  emotionBlocked,
  videoRef,
  canvasRef
}) => {
  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😡',
      fearful: '😨',
      disgusted: '🤢',
      surprised: '😲',
      neutral: '😐'
    };
    return emojis[emotion] || '😐';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold mb-3">📷 Live Verification</h3>

      <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4" style={{ minHeight: '400px' }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ minHeight: '400px', maxHeight: '500px' }}
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          width="800"
          height="600"
        />
        {!isCameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white text-lg">Click "Start Camera" to begin</p>
          </div>
        )}
        {isCameraOn && faceCount > 0 && (
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
            👤 {faceCount} face{faceCount > 1 ? 's' : ''} detected
          </div>
        )}
      </div>

      {/* Emotion Display */}
      {emotions && (
        <div className={`rounded-lg p-4 mb-4 ${
          emotionBlocked ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{getEmotionEmoji(dominantEmotion)}</span>
            <span className="font-semibold text-gray-900">
              Dominant: {dominantEmotion.toUpperCase()}
            </span>
            {stressDetected && (
              <span className="text-yellow-600 font-medium">⚠️ Stress detected</span>
            )}
            {emotionBlocked && (
              <span className="text-red-600 font-medium">🚫 Blocked</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {emotions && Object.entries(emotions).map(([emotion, value]) => (
              <div key={emotion} className="flex items-center gap-1">
                <span>{getEmotionEmoji(emotion)}</span>
                <span className="text-gray-600">{emotion}:</span>
                <span className={`font-medium ${
                  ['sad', 'fearful', 'angry', 'disgusted'].includes(emotion) && value > 0.3
                    ? 'text-red-600'
                    : ''
                }`}>
                  {(value * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Blocked emotions: Sad, Fearful, Angry, Disgusted
          </p>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {!isCameraOn ? (
          <button
            onClick={startWebcam}
            disabled={!modelsLoaded}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            📷 Start Camera
          </button>
        ) : (
          <button
            onClick={stopWebcam}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
          >
            🛑 Stop Camera
          </button>
        )}
        <button
          onClick={verifyFace}
          disabled={!isCameraOn || loading || faceVerified}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? 'Verifying...' : '🔍 Verify Face'}
        </button>
      </div>
    </div>
  );
};

export default VoteCamera;