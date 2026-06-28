// frontend/src/components/auth/VoterCardVerification.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as faceapi from 'face-api.js';

const VoterCardVerification = ({ onVerified, onCancel, user }) => {
  const [voterCardImage, setVoterCardImage] = useState(null);
  const [faceMatchPercentage, setFaceMatchPercentage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cardFaceDescriptor, setCardFaceDescriptor] = useState(null);
  const [liveFaceDescriptor, setLiveFaceDescriptor] = useState(null);
  const [formData, setFormData] = useState({
    voterId: '',
    name: user?.name || '',
    age: '',
    district: '',
    municipality: '',
    ward: '',
    pollingCenter: '',
    visaNumber: ''
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const districts = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Morang', 'Kaski',
    'Banke', 'Dang', 'Chitwan', 'Sunsari', 'Jhapa'
  ];

  // Load face models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        console.log('✅ Face models loaded for voter verification');
      } catch (err) {
        console.error('Error loading face models:', err);
        setError('Failed to load face detection models');
      }
    };
    loadModels();
  }, []);

  // Cleanup stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Dropzone for Voter Card upload
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setVoterCardImage(imageUrl);
    setError('');
    setSuccess('');
    setFaceMatchPercentage(null);
    setLiveFaceDescriptor(null);

    await extractFaceFromCard(imageUrl);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1
  });

  // Extract face from Voter Card
  const extractFaceFromCard = async (imageUrl) => {
    try {
      if (!modelsLoaded) {
        setError('Face models are still loading. Please wait.');
        return;
      }

      const img = await faceapi.fetchImage(imageUrl);
      
      let detection = null;
      let attempts = 0;
      while (!detection && attempts < 3) {
        detection = await faceapi.detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        attempts++;
        if (!detection) {
          await new Promise(r => setTimeout(r, 200));
        }
      }

      if (detection) {
        setCardFaceDescriptor(detection.descriptor);
        setSuccess('✅ Face detected in Voter Card! Now capture your live face.');
      } else {
        setError('❌ No face detected in Voter Card. Please upload a clear image.');
      }
    } catch (err) {
      console.error('Error extracting face:', err);
      setError('Failed to extract face from image.');
    }
  };

  // Start webcam with BIGGER video
  const startWebcam = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 800, 
          height: 600, 
          facingMode: 'user' 
        }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
        setIsCameraOn(true);
        setError('');
      }
    } catch (err) {
      setError('Please allow camera access');
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOn(false);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Capture live face
  const captureLiveFace = async () => {
    if (!videoRef.current || !modelsLoaded) {
      setError('Please wait for camera and models to load');
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      let detection = null;
      let attempts = 0;
      while (!detection && attempts < 5) {
        detection = await faceapi.detectSingleFace(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptor();
        attempts++;
        if (!detection) {
          await new Promise(r => setTimeout(r, 200));
        }
      }

      if (detection) {
        setLiveFaceDescriptor(detection.descriptor);
        setSuccess('✅ Live face captured!');
        
        if (canvasRef.current) {
          const displaySize = { width: 800, height: 600 };
          const resized = faceapi.resizeResults(detection, displaySize);
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resized);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
        }

        await verifyFaceMatch(detection.descriptor);
      } else {
        setError('❌ No face detected. Please look at the camera.');
      }
    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture face');
    }
    setIsVerifying(false);
  };

  // Verify face match (60% threshold)
  const verifyFaceMatch = async (liveDescriptor) => {
    if (!cardFaceDescriptor) {
      setError('Please upload a Voter Card first');
      return;
    }

    try {
      const distance = faceapi.euclideanDistance(cardFaceDescriptor, liveDescriptor);
      const matchPercentage = Math.max(0, Math.min(100, (1 - distance) * 100));
      setFaceMatchPercentage(matchPercentage);

      if (matchPercentage >= 60) {
        setSuccess(`✅ Face match confirmed! (${matchPercentage.toFixed(1)}% match)`);
      } else {
        setError(`❌ Face match too low (${matchPercentage.toFixed(1)}%). Please try again.`);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Face verification failed');
    }
  };

  // Handle form submit and save to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (faceMatchPercentage < 60) {
      setError('Please verify your face first (60%+ match required)');
      return;
    }

    if (!formData.voterId || !formData.name || !formData.age || !formData.district) {
      setError('Please fill all required fields');
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      // Save voter to database
      const response = await fetch('/api/voter/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          voterId: formData.voterId,
          age: parseInt(formData.age),
          district: formData.district,
          municipality: formData.municipality,
          ward: formData.ward,
          constituency: 'Kathmandu-1'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register voter');
      }

      setSuccess('✅ Voter registered successfully!');

      // Pass everything including faceDescriptor
      onVerified({
        ...formData,
        faceVerified: true,
        matchPercentage: faceMatchPercentage,
        faceDescriptor: liveFaceDescriptor ? Array.from(liveFaceDescriptor) : null
      });

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register voter. Please try again.');
    }
    setIsVerifying(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Reset everything
  const resetAll = () => {
    setVoterCardImage(null);
    setCardFaceDescriptor(null);
    setLiveFaceDescriptor(null);
    setFaceMatchPercentage(null);
    setError('');
    setSuccess('');
    setIsCameraOn(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setFormData({
      voterId: '',
      name: user?.name || '',
      age: '',
      district: '',
      municipality: '',
      ward: '',
      pollingCenter: '',
      visaNumber: ''
    });
  };

  if (!modelsLoaded) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading face detection models...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Voter Card Verification</h2>
      <p className="text-gray-500 text-sm mb-6">
        Upload your Voter Card, capture your live face, and enter your details to vote
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Upload Voter Card + Form */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Step 1: Upload Voter Card</h3>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition"
          >
            <input {...getInputProps()} />
            <div className="text-4xl mb-2">📄</div>
            <p className="text-gray-500 text-sm">Drop Voter Card image here</p>
            <p className="text-xs text-gray-400">or click to browse (JPG, PNG)</p>
          </div>

          {voterCardImage && (
            <div className="mt-4">
              <img
                src={voterCardImage}
                alt="Voter Card"
                className="w-full max-h-48 object-contain rounded-lg border"
              />
              {cardFaceDescriptor && (
                <p className="text-green-600 text-sm mt-2">✅ Face detected in card</p>
              )}
            </div>
          )}

          {/* Manual Entry Form */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Voter Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Voter ID *</label>
                <input
                  type="text"
                  name="voterId"
                  value={formData.voterId}
                  onChange={handleChange}
                  placeholder="e.g., NRN-123456"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="18+"
                  min="18"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Municipality</label>
                <input
                  type="text"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  placeholder="e.g., Kathmandu Metropolitan City"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ward</label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    placeholder="e.g., Ward 10"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Polling Center</label>
                  <input
                    type="text"
                    name="pollingCenter"
                    value={formData.pollingCenter}
                    onChange={handleChange}
                    placeholder="e.g., Kathmandu-1"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Visa Number (Optional)</label>
                <input
                  type="text"
                  name="visaNumber"
                  value={formData.visaNumber}
                  onChange={handleChange}
                  placeholder="e.g., VISA-123456"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Face Capture - BIGGER */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Step 2: Capture Live Face</h3>
          
          <div className="relative bg-gray-900 rounded-xl overflow-hidden" style={{ minHeight: '320px' }}>
            <video
              ref={videoRef}
              className="w-full h-72 object-cover"
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
                <p className="text-white text-sm">Click "Start Camera"</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {!isCameraOn ? (
              <button
                onClick={startWebcam}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex-1"
              >
                📷 Start Camera
              </button>
            ) : (
              <button
                onClick={stopWebcam}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm flex-1"
              >
                🛑 Stop
              </button>
            )}
            <button
              onClick={captureLiveFace}
              disabled={!isCameraOn || !cardFaceDescriptor || isVerifying}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm flex-1 disabled:opacity-50"
            >
              {isVerifying ? 'Capturing...' : '📸 Capture Face'}
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
            >
              🔄 Reset
            </button>
          </div>

          {faceMatchPercentage !== null && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${faceMatchPercentage >= 60 ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              <p className="font-semibold">
                Match: {faceMatchPercentage.toFixed(1)}%
                {faceMatchPercentage >= 60 ? ' ✅ Verified!' : ' ❌ Too Low (need 60%)'}
              </p>
            </div>
          )}

          {liveFaceDescriptor && (
            <p className="text-green-600 text-sm mt-2">✅ Live face captured!</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={faceMatchPercentage < 60 || isVerifying}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 flex-1"
        >
          {isVerifying ? 'Registering...' : faceMatchPercentage >= 60 ? '✅ Proceed to Vote' : '⚠️ Verify Face First'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VoterCardVerification;