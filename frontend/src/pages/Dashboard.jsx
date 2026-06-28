// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { getDashboardData } from '../api/dashboard';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PartyPerformance from '../components/dashboard/PartyPerformance';
import ProjectTracker from '../components/dashboard/ProjectTracker';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isConnected, connectWallet } = useWeb3();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await getDashboardData();
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.welcome', { name: user?.name || 'User' })}
          </h1>
          <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
        </div>

        {/* Quick Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500">{t('dashboard.parties')}</p>
              <p className="text-3xl font-bold text-gray-900">{summary.totalParties || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500">{t('dashboard.projects')}</p>
              <p className="text-3xl font-bold text-gray-900">{summary.totalProjects || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500">{t('dashboard.promises')}</p>
              <p className="text-3xl font-bold text-green-600">
                {summary.totalPromisesFulfilled || 0}
              </p>
            </div>
          </div>
        )}

        {/* Wallet Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{t('dashboard.walletStatus')}</p>
            <p className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? '✅ Connected' : '❌ Not Connected'}
            </p>
          </div>
          {!isConnected && (
            <button
              onClick={connectWallet}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {t('dashboard.connectWallet')}
            </button>
          )}
        </div>

        {/* Party Performance */}
        <div className="mb-10">
          <PartyPerformance />
        </div>

        {/* Project Tracker */}
        <ProjectTracker />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;