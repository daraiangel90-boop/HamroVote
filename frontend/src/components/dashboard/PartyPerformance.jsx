// frontend/src/components/dashboard/PartyPerformance.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardData } from '../../api/dashboard';

const PartyPerformance = () => {
  const { t } = useTranslation();
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getDashboardData();
      setParties(response.data.partyPerformance || []);
    } catch (error) {
      console.error('Error fetching parties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (parties.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl">
        No party data available. Please seed the database.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('dashboard.partyPerformance')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {parties.map((party, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{party.symbol || '🏛️'}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{party.name}</h3>
                  <span className="text-xs text-gray-500">{party.shortName}</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">{t('party.billsPassed')}</p>
                <p className="text-xl font-bold text-gray-900">{party.billsPassed || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">{t('party.budgetUsed')}</p>
                <p className="text-xl font-bold text-gray-900">{party.budgetUtilized || 0}%</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">{t('party.projectsDone')}</p>
                <p className="text-xl font-bold text-gray-900">{party.projectsCompleted || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">{t('party.promisesKept')}</p>
                <p className="text-xl font-bold text-gray-900">{party.promisesFulfilled || 0}</p>
              </div>
            </div>

            {/* Budget Utilization Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{t('party.budgetUtilization')}</span>
                <span>{party.budgetUtilized || 0}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    party.budgetUtilized >= 70
                      ? 'bg-green-500'
                      : party.budgetUtilized >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${party.budgetUtilized || 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartyPerformance;