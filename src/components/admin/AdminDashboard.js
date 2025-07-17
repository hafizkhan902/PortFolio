import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaSignOutAlt,
  FaProjectDiagram,
  FaChartBar,
  FaEnvelope,
  FaRoute,
  FaCog,
  FaPaintBrush
} from 'react-icons/fa';
import { useNotification } from '../ui/Notification';
import authService from '../../utils/authService';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import AdminStats from './AdminStats';
import ContactMessages from './ContactMessages';
import JourneyManager from './JourneyManager';
import SkillsManager from './SkillsManager';
import PortfolioHighlightsManager from './PortfolioHighlightsManager';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { showSuccess, showError } = useNotification();

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'journey', label: 'Journey', icon: FaRoute },
    { id: 'skills', label: 'Skills', icon: FaCog },
    { id: 'portfolio', label: 'Portfolio Highlights', icon: FaPaintBrush },
    { id: 'stats', label: 'Statistics', icon: FaChartBar },
    { id: 'messages', label: 'Messages', icon: FaEnvelope },
  ];

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authService.getAdminProjects();
      setProjects(response.data || []);
    } catch (error) {
      showError('Failed to fetch projects');
      if (error.message.includes('Session expired')) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [showError, onLogout]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await authService.deleteProject(projectId);
      setProjects(projects.filter(p => p._id !== projectId));
      showSuccess('Project deleted successfully');
    } catch (error) {
      showError('Failed to delete project');
    }
  };

  const handleToggleFeatured = async (projectId, featured) => {
    try {
      await authService.updateProject(projectId, { featured: !featured });
      setProjects(projects.map(p => 
        p._id === projectId ? { ...p, featured: !featured } : p
      ));
      showSuccess(`Project ${!featured ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      showError('Failed to update project');
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const handleProjectSaved = (savedProject) => {
    if (editingProject) {
      setProjects(projects.map(p => p._id === savedProject._id ? savedProject : p));
    } else {
      setProjects([savedProject, ...projects]);
    }
    setShowProjectForm(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-accent-blue">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent-blue text-white'
                    : 'text-gray-600 hover:text-accent-blue'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Project Management</h2>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-accent-purple transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              <ProjectList
                projects={projects}
                loading={loading}
                onEdit={(project) => {
                  setEditingProject(project);
                  setShowProjectForm(true);
                }}
                onDelete={handleDeleteProject}
                onToggleFeatured={handleToggleFeatured}
              />
            </div>
          )}

          {activeTab === 'journey' && <JourneyManager />}
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'portfolio' && <PortfolioHighlightsManager />}
          {activeTab === 'stats' && <AdminStats />}
          {activeTab === 'messages' && <ContactMessages />}
        </motion.div>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleProjectSaved}
          onCancel={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;