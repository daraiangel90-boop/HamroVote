// frontend/src/components/voting/VoteCandidates.jsx
import React from 'react';

const VoteCandidates = ({ 
  candidates, 
  selectedCandidate, 
  setSelectedCandidate, 
  voterInfo,
  faceVerified,
  emotionBlocked,
  multiPersonDetected
}) => {
  if (!faceVerified || emotionBlocked || multiPersonDetected) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Select Your Candidate
        {voterInfo && <span className="text-sm text-gray-500 ml-2">({voterInfo.constituency})</span>}
      </h3>
      
      {candidates.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No candidates found for your constituency</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id || candidate._id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`cursor-pointer p-4 rounded-xl border-2 text-center transition ${
                selectedCandidate?.id === candidate.id || selectedCandidate?._id === candidate._id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <div className="text-3xl mb-2">{candidate.symbol || '🏛️'}</div>
              <p className="font-semibold text-sm">{candidate.name}</p>
              <p className="text-xs text-gray-500">{candidate.party}</p>
            </div>
          ))}
        </div>
      )}
      {selectedCandidate && (
        <p className="text-center text-sm text-blue-600 mt-3">
          Selected: {selectedCandidate.name} ({selectedCandidate.party})
        </p>
      )}
    </div>
  );
};

export default VoteCandidates;