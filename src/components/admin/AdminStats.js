import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaProjectDiagram, FaEnvelope, FaEye, FaStar, FaGithub, FaCalendarAlt, FaSync } from 'react-icons/fa';
import authService from '../../utils/authService';
import { useNotification } from '../ui/Notification';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalViews: 0,
    githubRepos: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { showError } = useNotification();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching statistics...');
      
      const response = await authService.getStatistics();
      console.log('📊 Statistics response:', response);
      
      if (response.success && response.data) {
        setStats(response.data);
        setLastUpdated(new Date());
      } else {
        console.error('Invalid statistics response:', response);
        showError('Failed to load statistics');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      showError('Failed to load statistics: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FaProjectDiagram,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Featured Projects',
      value: stats.featuredProjects,
      icon: FaStar,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      icon: FaEnvelope,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: FaEnvelope,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Portfolio Views',
      value: stats.totalViews,
      icon: FaEye,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'GitHub Repos',
      value: stats.githubRepos,
      icon: FaGithub,
      color: 'bg-gray-500',
      textColor: 'text-gray-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Admin Dashboard</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
            loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          <FaSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Stats'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaCalendarAlt className="w-5 h-5 mr-2 text-accent-blue" />
          Recent Activity
        </h3>
        
        {stats.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center space-x-2 p-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <FaEye />
            <span>View Live Portfolio</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 p-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
          >
            <FaCalendarAlt />
            <span>Refresh Stats</span>
          </button>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Project Categories</h4>
            <div className="space-y-2">
              {['Web', 'UI', 'Fullstack', 'Research', 'Other'].map((category) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{category}</span>
                  <span className="text-sm font-medium text-accent-blue">
                    {Math.floor(Math.random() * 10)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Monthly Growth</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Projects Added</span>
                <span className="text-sm font-medium text-green-600">+{Math.floor(Math.random() * 5)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Messages Received</span>
                <span className="text-sm font-medium text-blue-600">+{Math.floor(Math.random() * 20)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Portfolio Views</span>
                <span className="text-sm font-medium text-purple-600">+{Math.floor(Math.random() * 100)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminStats; 