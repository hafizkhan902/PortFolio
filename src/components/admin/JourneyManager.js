import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaRoute } from 'react-icons/fa';
import { useNotification } from '../ui/Notification';
import authService from '../../utils/authService';

const JourneyManager = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    title: '',
    description: '',
    displayOrder: 0
  });
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useNotification();

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching milestones from admin API...');
      const response = await authService.getJourneyMilestones();
      console.log('📊 Admin API Response:', response);
      if (response.success) {
        setMilestones(response.data || []);
      }
    } catch (error) {
      console.error('❌ Failed to fetch milestones:', error);
      showError('Failed to fetch milestones: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert year to number for API
      const submitData = {
        ...formData,
        year: parseInt(formData.year)
      };
      
      console.log('📤 Submitting milestone data:', submitData);
      
      let response;
      if (editingMilestone) {
        response = await authService.updateJourneyMilestone(editingMilestone._id, submitData);
      } else {
        response = await authService.createJourneyMilestone(submitData);
      }

      console.log('📥 Submit response:', response);

      if (response.success) {
        showSuccess(editingMilestone ? 'Milestone updated successfully' : 'Milestone created successfully');
        fetchMilestones();
        handleCancel();
      } else {
        showError(response.message || 'Failed to save milestone');
      }
    } catch (error) {
      console.error('❌ Submit error:', error);
      showError('Failed to save milestone: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      year: milestone.year.toString(),
      title: milestone.title,
      description: milestone.description,
      displayOrder: milestone.displayOrder || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (milestoneId) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;

    try {
      const response = await authService.deleteJourneyMilestone(milestoneId);
      if (response.success) {
        showSuccess('Milestone deleted successfully');
        fetchMilestones();
      } else {
        showError(response.message || 'Failed to delete milestone');
      }
    } catch (error) {
      showError('Failed to delete milestone: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMilestone(null);
    setFormData({
      year: new Date().getFullYear().toString(),
      title: '',
      description: '',
      displayOrder: 0
    });
  };

  const handleAddNew = () => {
    setEditingMilestone(null);
    setFormData({
      year: new Date().getFullYear().toString(),
      title: '',
      description: '',
      displayOrder: milestones.length
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Journey Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage timeline milestones for the About Me section</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-accent-purple transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <FaRoute className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No milestones yet</h3>
            <p className="text-gray-500 dark:text-gray-500">Add your first milestone to get started</p>
          </div>
        ) : (
          milestones
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((milestone, index) => (
              <motion.div
                key={milestone._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-block bg-accent-blue/10 text-accent-blue font-medium px-3 py-1 rounded-full text-sm">
                        {milestone.year}
                      </span>
                      <span className="text-sm text-gray-500">Order: {milestone.displayOrder || 0}</span>
                    </div>
                    <h3 className="text-xl font-bold text-accent-blue mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{milestone.description}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(milestone)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(milestone._id)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Year *</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    placeholder="2024"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Started my journey..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Describe this milestone in your journey..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the timeline</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      saving
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-accent-blue hover:bg-accent-purple text-white'
                    }`}
                  >
                    <FaSave className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Milestone'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default JourneyManager; 