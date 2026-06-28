// frontend/src/components/voting/VoteStatus.jsx
import React from 'react';

const VoteStatus = ({ 
  error, 
  success, 
  multiPersonDetected, 
  faceCount, 
  emotionBlocked,
  faceMatchPercentage,
  faceVerified
}) => {
  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      {faceMatchPercentage !== null && faceVerified && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">
          ✅ Face match: {faceMatchPercentage.toFixed(1)}%
        </div>
      )}

      {multiPersonDetected && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-3">
          <span className="text-2xl">🚫</span>
          <div>
            <p className="font-semibold">Multiple People Detected</p>
            <p className="text-sm">{faceCount} faces detected. Please vote alone.</p>
          </div>
        </div>
      )}

      {emotionBlocked && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-3">
          <span className="text-2xl">🚫</span>
          <div>
            <p className="font-semibold">Voting Blocked</p>
            <p className="text-sm">Negative emotion detected. Please calm down and try again.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default VoteStatus;