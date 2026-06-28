// frontend/src/pages/Results.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Results = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.isVerified) {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchResults();
    }
  }, [isAuthenticated]);

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/election/results', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch results');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResults(data.data);
      setIsResultsVisible(data.data.isResultsVisible);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load results');
    }
    setLoading(false);
  };

  // Create demo election if none exists
  const createDemoElection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/election/create-demo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('Demo election created! Refresh to see results.');
        fetchResults();
      }
    } catch (err) {
      console.error('Error creating election:', err);
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to view election results</p>
            <a href="/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Login</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl max-w-md">
            <p className="font-semibold">❌ {error}</p>
            {error.includes('No active election') && (
              <button
                onClick={createDemoElection}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Demo Election
              </button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-xl max-w-md">
            <p className="font-semibold">📭 No election results available</p>
            <button
              onClick={createDemoElection}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Demo Election
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canViewResults = isAdmin || (isResultsVisible && results.isResultsVisible);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 Election Results</h1>
          {!isAdmin && !isResultsVisible && (
            <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg">
              <span className="text-lg">⏰</span>
              <span className="text-sm font-medium">Results pending</span>
            </div>
          )}
          {isAdmin && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <span className="text-lg">👁️</span>
              <span className="text-sm font-medium">Admin View</span>
            </div>
          )}
        </div>

        {/* Results Visibility Status */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex items-center gap-3">
            {canViewResults ? (
              <>
                <span className="text-green-600 text-lg">✅</span>
                <span className="text-sm text-green-600 font-medium">Results are visible</span>
              </>
            ) : (
              <>
                <span className="text-gray-400 text-lg">🔒</span>
                <span className="text-sm text-gray-500">
                  Results will be visible after {new Date(results.election?.endDate).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        {canViewResults ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Votes</p>
                    <p className="text-2xl font-bold text-gray-900">{results.summary?.totalVotes || 0}</p>
                  </div>
                  <span className="text-3xl">👥</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Voter Turnout</p>
                    <p className="text-2xl font-bold text-gray-900">{results.summary?.voterTurnout || 0}%</p>
                  </div>
                  <span className="text-3xl">📈</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Winner</p>
                    <p className="text-lg font-bold text-blue-600 truncate">{results.summary?.winner?.name || 'N/A'}</p>
                  </div>
                  <span className="text-3xl">🏆</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Winning Party</p>
                    <p className="text-lg font-bold text-purple-600 truncate">{results.summary?.winningParty || 'N/A'}</p>
                  </div>
                  <span className="text-3xl">📊</span>
                </div>
              </div>
            </div>

            {/* Candidate Results */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Candidate Results</h2>
              
              <div className="space-y-4">
                {results.results?.map((candidate, index) => {
                  const totalVotes = results.summary?.totalVotes || 1;
                  const percentage = Math.round((candidate.voteCount / totalVotes) * 100);
                  const isWinner = index === 0 && candidate.voteCount > 0;

                  return (
                    <div key={candidate.id || index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{candidate.symbol || '🏛️'}</span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {candidate.name}
                              {isWinner && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">🏆 Winner</span>}
                            </p>
                            <p className="text-xs text-gray-500">{candidate.party}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{candidate.voteCount} votes</p>
                          <p className="text-sm text-gray-500">{percentage}%</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isWinner ? 'bg-blue-600' : index === 1 ? 'bg-gray-400' : 'bg-gray-300'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Election Info */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-between text-xs text-gray-400">
                <span>🗳️ {results.election?.title || 'Election'}</span>
                <span>📅 Ends: {new Date(results.election?.endDate).toLocaleString()}</span>
                <span>🔄 Auto-refresh: 30 seconds</span>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Not Yet Available</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Election results will be visible after the voting period ends.
              {isAdmin && (
                <span className="block mt-4 text-blue-600">
                  (You're an admin - switch to admin view to see results)
                </span>
              )}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Results;