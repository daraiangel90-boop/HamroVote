// frontend/src/pages/Profile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { authAPI } from '../api/auth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import VoterCardVerification from '../components/auth/VoterCardVerification';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { address, isConnected } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showVoterVerification, setShowVoterVerification] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updateProfile(updateForm);
      if (response.success) {
        setSuccess('✅ Profile updated successfully!');
        updateUser(response);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">👤 My Profile</h1>

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

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setUpdateForm({ name: user?.name || '', email: user?.email || '' });
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Cancel
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">{user?.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{user?.email || 'Not set'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">NRN ID</span>
                <span className="font-medium">{user?.nrnId || 'Not set'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Wallet</span>
                <span className="font-medium text-xs">
                  {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not connected'}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Verified</span>
                <span className={`font-medium ${user?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user?.isVerified ? '✅ Yes' : '⏳ Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Voted</span>
                <span className={`font-medium ${user?.hasVoted ? 'text-green-600' : 'text-gray-600'}`}>
                  {user?.hasVoted ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={updateForm.email}
                  onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* ✅ Voter Card Verification Button */}
          {!user?.hasVoted && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  // Check if NRN ID exists (basic validation)
                  if (!user?.nrnId || user.nrnId === 'N/A') {
                    setError('⚠️ Please complete your profile with NRN ID first');
                    setTimeout(() => setError(''), 3000);
                    return;
                  }
                  setShowVoterVerification(true);
                }}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                🗳️ Verify Voter Card to Vote
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Upload your Voter Card and verify your face to start voting
              </p>
            </div>
          )}
        </div>

        {/* ✅ Voter Card Verification Modal */}
        {showVoterVerification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <VoterCardVerification
                user={user}
                onVerified={(data) => {
                  console.log('Voter verified:', data);
                  localStorage.setItem('voterData', JSON.stringify({
                    ...data,
                    faceDescriptor: data.faceDescriptor
                  }));
                  localStorage.setItem('voterId', data.voterId);
                  setShowVoterVerification(false);
                  navigate('/vote');
                }}
                onCancel={() => setShowVoterVerification(false)}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;