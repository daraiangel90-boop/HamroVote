// frontend/src/components/voting/VoteTimer.jsx
import React from 'react';

const VoteTimer = ({ timeLeft, isVotingActive }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVotingActive) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-4 flex justify-between items-center">
      <span>⏱️ Voting window: {formatTime(timeLeft)}</span>
      <span className="text-sm">👤 Face verified ✅</span>
    </div>
  );
};

export default VoteTimer;