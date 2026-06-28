// frontend/src/components/voting/VoteActions.jsx
import React, { useState } from 'react';

const VoteActions = ({
  isConnected,
  connectWallet,
  disconnectWallet, // ✅ Add this prop
  loading,
  faceVerified,
  emotionBlocked,
  multiPersonDetected,
  selectedCandidate,
  handleVote,
  address
}) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    await disconnectWallet();
    setIsDisconnecting(false);
  };

  return (
    <div className="space-y-4">
      {/* Wallet Status - Show when connected with Disconnect option */}
      {isConnected && address && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="flex items-center gap-2 text-green-600 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            ✅ Connected: {formatAddress(address)}
          </span>
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="text-xs text-red-500 hover:text-red-700 hover:underline transition"
          >
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* ✅ Connect Wallet Button - Shows when NOT connected */}
        {!isConnected && (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition disabled:opacity-50 flex-1"
          >
            {loading ? 'Connecting...' : '🔗 Connect Wallet'}
          </button>
        )}

        {/* ✅ Cast Vote Button - Shows when connected AND verified */}
        {isConnected && faceVerified && !emotionBlocked && !multiPersonDetected && (
          <button
            onClick={handleVote}
            disabled={!selectedCandidate || loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition disabled:opacity-50 flex-1"
          >
            {loading ? 'Casting vote...' : '🗳️ Cast Vote'}
          </button>
        )}

        {/* Status Messages */}
        {isConnected && !faceVerified && (
          <button
            disabled
            className="px-6 py-3 bg-gray-400 text-white rounded-xl font-semibold text-lg opacity-50 flex-1 cursor-not-allowed"
          >
            ⚠️ Verify Face First
          </button>
        )}
        {isConnected && faceVerified && emotionBlocked && (
          <button
            disabled
            className="px-6 py-3 bg-red-400 text-white rounded-xl font-semibold text-lg opacity-50 flex-1 cursor-not-allowed"
          >
            🚫 Emotion Blocked
          </button>
        )}
        {isConnected && faceVerified && !emotionBlocked && multiPersonDetected && (
          <button
            disabled
            className="px-6 py-3 bg-red-400 text-white rounded-xl font-semibold text-lg opacity-50 flex-1 cursor-not-allowed"
          >
            👥 Multiple People Detected
          </button>
        )}
        {isConnected && faceVerified && !emotionBlocked && !multiPersonDetected && !selectedCandidate && (
          <button
            disabled
            className="px-6 py-3 bg-yellow-400 text-white rounded-xl font-semibold text-lg opacity-50 flex-1 cursor-not-allowed"
          >
            ⚠️ Select a Candidate
          </button>
        )}
      </div>

      {!isConnected && !loading && (
        <p className="text-sm text-gray-500 text-center">
          Connect your wallet to cast your vote securely on the blockchain
        </p>
      )}

      {/* Wallet connection tip */}
      {!isConnected && (
        <p className="text-xs text-gray-400 text-center">
          Make sure MetaMask is installed and unlocked
        </p>
      )}
    </div>
  );
};

export default VoteActions;