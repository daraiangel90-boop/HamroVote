// frontend/src/pages/Vote.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import * as faceapi from 'face-api.js';
import * as web3 from '../utils/web3';

import VoteTimer from '../components/voting/VoteTimer';
import VoteStatus from '../components/voting/VoteStatus';
import VoteCamera from '../components/voting/VoteCamera';
import VoteCandidates from '../components/voting/VoteCandidates';
import VoteActions from '../components/voting/VoteActions';

const Vote = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isConnected, connectWallet, disconnectWallet, address } = useWeb3();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [emotions, setEmotions] = useState(null);
  const [dominantEmotion, setDominantEmotion] = useState('');
  const [stressDetected, setStressDetected] = useState(false);
  const [emotionBlocked, setEmotionBlocked] = useState(false);
  const [multiPersonDetected, setMultiPersonDetected] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [voterInfo, setVoterInfo] = useState(null);
  const [voterId, setVoterId] = useState('');
  const [storedFaceDescriptor, setStoredFaceDescriptor] = useState(null);
  const [faceMatchPercentage, setFaceMatchPercentage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load voter data
  useEffect(() => {
    const voterData = localStorage.getItem('voterData');
    const storedVoterId = localStorage.getItem('voterId');
    
    if (!voterData || !storedVoterId) {
      setError('Please verify your Voter Card first');
      setTimeout(() => navigate('/profile'), 2000);
      return;
    }

    try {
      const data = JSON.parse(voterData);
      if (data.faceDescriptor) {
        setStoredFaceDescriptor(data.faceDescriptor);
      } else {
        setError('⚠️ Face descriptor not found. Please verify your Voter Card again.');
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (e) {
      console.error('Error loading voter data:', e);
      setError('⚠️ Invalid voter data. Please verify your Voter Card again.');
    }
  }, [navigate]);

  // Fetch ballot
  useEffect(() => {
    if (user?.isVerified) {
      fetchBallot();
    }
  }, [user]);

  const fetchBallot = async () => {
    try {
      const storedVoterId = localStorage.getItem('voterId');
      if (!storedVoterId) {
        setError('Please register your Voter ID first');
        return;
      }

      const response = await fetch(`/api/voter/ballot/${storedVoterId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setCandidates(data.data.candidates || []);
        setVoterInfo(data.data.voter);
        setVoterId(storedVoterId);
      } else {
        setError(data.message || 'Failed to fetch ballot');
      }
    } catch (error) {
      console.error('Error fetching ballot:', error);
      setError('Failed to fetch ballot. Please try again.');
    }
  };

  // Load face models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Error loading face models:', err);
        setError('Failed to load face models. Please refresh.');
      }
    };
    loadModels();
  }, []);

  // Timer
  useEffect(() => {
    if (isVotingActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && isVotingActive) {
      setIsVotingActive(false);
      setError('⏰ Voting time expired. Please try again.');
      stopWebcam();
    }
  }, [isVotingActive, timeLeft]);

  // Camera handlers
  const startWebcam = async () => {
    try {
      if (stream) stream.getTracks().forEach(track => track.stop());
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 800, height: 600, facingMode: 'user' }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
        setIsCameraOn(true);
        setError('');
        setSuccess('');
        setMultiPersonDetected(false);
        setFaceCount(0);
        setFaceMatchPercentage(null);
      }
    } catch (err) {
      console.error('Webcam error:', err);
      setError('Please allow camera access');
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOn(false);
      setIsVotingActive(false);
      setTimeLeft(300);
      setFaceVerified(false);
      setEmotions(null);
      setDominantEmotion('');
      setStressDetected(false);
      setEmotionBlocked(false);
      setMultiPersonDetected(false);
      setFaceCount(0);
      setFaceMatchPercentage(null);
      if (videoRef.current) videoRef.current.srcObject = null;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Verify face
  const verifyFace = async () => {
    if (!videoRef.current || !modelsLoaded) {
      setError('Please wait for camera and models to load');
      return;
    }

    if (!storedFaceDescriptor) {
      setError('⚠️ Please verify your Voter Card first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setEmotionBlocked(false);
    setMultiPersonDetected(false);
    setFaceMatchPercentage(null);

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();

      const faceCount = detections.length;
      setFaceCount(faceCount);

      if (faceCount > 1) {
        setMultiPersonDetected(true);
        setError(`🚫 Multiple people detected (${faceCount} faces). Please vote alone.`);
        setFaceVerified(false);
        setLoading(false);
        return;
      }

      if (faceCount === 0) {
        setError('❌ No face detected. Please look at the camera.');
        setFaceVerified(false);
        setLoading(false);
        return;
      }

      const detection = detections[0];
      const liveDescriptor = detection.descriptor;
      
      const distance = faceapi.euclideanDistance(
        new Float32Array(storedFaceDescriptor),
        liveDescriptor
      );
      const matchPercentage = Math.max(0, Math.min(100, (1 - distance) * 100));
      setFaceMatchPercentage(matchPercentage);

      if (matchPercentage < 60) {
        setError(`❌ Face match too low (${matchPercentage.toFixed(1)}%). Please try again.`);
        setFaceVerified(false);
        setLoading(false);
        return;
      }

      const expressions = detection.expressions;
      setEmotions(expressions);

      const dominant = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );
      setDominantEmotion(dominant);

      const blockedEmotions = ['sad', 'fearful', 'angry', 'disgusted'];
      const isBlocked = blockedEmotions.includes(dominant);
      const hasBlockedEmotion = blockedEmotions.some(e => expressions[e] > 0.4);

      if (isBlocked || hasBlockedEmotion) {
        setEmotionBlocked(true);
        setError(`❌ Voting blocked: ${dominant.toUpperCase()} emotion detected. Please calm down.`);
        setFaceVerified(false);
        setLoading(false);
        return;
      }

      const stressEmotions = ['fearful', 'sad', 'angry', 'disgusted'];
      const hasStress = stressEmotions.some(e => expressions[e] > 0.3);
      setStressDetected(hasStress);

      setFaceVerified(true);
      setIsVotingActive(true);

      if (hasStress) {
        setSuccess(`⚠️ Face verified (${matchPercentage.toFixed(1)}%) but stress detected. Vote flagged for review.`);
      } else {
        setSuccess(`✅ Face verified! (${matchPercentage.toFixed(1)}% match) You have 5 minutes to vote.`);
      }

      setTimeLeft(300);
    } catch (err) {
      console.error('Face verification error:', err);
      setError('Face verification failed');
    }
    setLoading(false);
  };

  // ✅ Updated handleVote with Etherscan link
  const handleVote = async () => {
    console.log('🔍 handleVote called');
    console.log('🔍 isConnected:', isConnected);
    console.log('🔍 selectedCandidate:', selectedCandidate);

    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }

    // If wallet not connected, try to connect first
    if (!isConnected) {
      setError('Please connect your wallet');
      const result = await connectWallet();
      if (!result?.success) {
        setError('Wallet connection failed. Please try again.');
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!faceVerified) {
      setError('Please verify your face first');
      return;
    }

    if (emotionBlocked) {
      setError('❌ Voting blocked due to negative emotion.');
      return;
    }

    if (multiPersonDetected) {
      setError('❌ Voting blocked: Multiple people detected.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔍 Getting signer...');
      const signer = await web3.getSigner();
      console.log('🔍 Signer:', signer);
      
      if (!signer) {
        setError('Please connect your wallet');
        setLoading(false);
        return;
      }

      console.log('🔍 Checking if already voted...');
      const alreadyVoted = await web3.hasVoted(signer);
      console.log('🔍 Already voted:', alreadyVoted);
      
      if (alreadyVoted) {
        setError('You have already voted on the blockchain!');
        setLoading(false);
        return;
      }

      console.log('🔍 Casting vote for candidate:', selectedCandidate.id);
      const result = await web3.castVote(signer, selectedCandidate.id);
      console.log('🔍 Result:', result);
      
      if (result.success) {
        // ✅ Create Etherscan link
        const etherscanLink = `https://sepolia.etherscan.io/tx/${result.txHash}`;
        setSuccess(
          <div className="space-y-2">
            <div className="font-semibold text-green-600">✅ Vote cast for {selectedCandidate.name}!</div>
            <div className="text-sm">
              <a 
                href={etherscanLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                🔗 View Transaction on Etherscan
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className="text-xs text-gray-400">
              Transaction: {result.txHash.slice(0, 16)}...{result.txHash.slice(-8)}
            </div>
          </div>
        );
        setHasVoted(true);
        setFaceVerified(false);
        setIsVotingActive(false);
        stopWebcam();
      } else {
        setError(`❌ Vote failed: ${result.error}`);
      }
    } catch (err) {
      console.error('❌ Voting error:', err);
      setError(`Failed to cast vote: ${err.message}`);
    }
    setLoading(false);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  if (hasVoted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
            <div className="text-6xl mb-4">🗳️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Voting!</h2>
            <p className="text-gray-500">Your vote has been recorded securely on the blockchain.</p>
            {typeof success === 'object' && success}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🗳️ Cast Your Vote</h1>

        {voterInfo && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-4">
            <p className="text-sm">
              <strong>Voter:</strong> {voterInfo.name} | <strong>Constituency:</strong> {voterInfo.constituency}
            </p>
          </div>
        )}

        <VoteStatus
          error={error}
          success={success}
          multiPersonDetected={multiPersonDetected}
          faceCount={faceCount}
          emotionBlocked={emotionBlocked}
          faceMatchPercentage={faceMatchPercentage}
          faceVerified={faceVerified}
        />

        <VoteTimer timeLeft={timeLeft} isVotingActive={isVotingActive} />

        <VoteCamera
          isCameraOn={isCameraOn}
          startWebcam={startWebcam}
          stopWebcam={stopWebcam}
          verifyFace={verifyFace}
          loading={loading}
          faceVerified={faceVerified}
          modelsLoaded={modelsLoaded}
          faceCount={faceCount}
          emotions={emotions}
          dominantEmotion={dominantEmotion}
          stressDetected={stressDetected}
          emotionBlocked={emotionBlocked}
          videoRef={videoRef}
          canvasRef={canvasRef}
        />

        <VoteCandidates
          candidates={candidates}
          selectedCandidate={selectedCandidate}
          setSelectedCandidate={setSelectedCandidate}
          voterInfo={voterInfo}
          faceVerified={faceVerified}
          emotionBlocked={emotionBlocked}
          multiPersonDetected={multiPersonDetected}
        />

        <VoteActions
          isConnected={isConnected}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          loading={loading}
          faceVerified={faceVerified}
          emotionBlocked={emotionBlocked}
          multiPersonDetected={multiPersonDetected}
          selectedCandidate={selectedCandidate}
          handleVote={handleVote}
          address={address}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Vote;