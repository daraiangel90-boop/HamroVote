// frontend/src/components/dashboard/ProjectTracker.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardData } from '../../api/dashboard';

const ProjectTracker = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getDashboardData();
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
        <p>{t('dashboard.noProjects')}</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatBudget = (budget) => {
    if (!budget) return 'N/A';
    if (budget >= 1000000000) {
      return `NPR ${(budget / 1000000000).toFixed(1)}B`;
    }
    if (budget >= 10000000) {
      return `NPR ${(budget / 10000000).toFixed(1)} Cr`;
    }
    return `NPR ${budget.toLocaleString()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{t('dashboard.projectsTitle')}</h2>
        <span className="text-sm text-gray-500">{projects.length} projects</span>
      </div>

      <div className="space-y-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-[200px]">
                <h4 className="font-semibold text-gray-900">{project.title}</h4>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                  <span>🏛️ {project.party || 'N/A'}</span>
                  <span>💰 {formatBudget(project.budget)}</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTracker;