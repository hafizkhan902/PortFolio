import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUpload, 
  FaDownload, 
  FaTrash, 
  FaFilePdf, 
  FaFileAlt,
  FaCalendarAlt,
  FaHdd,
  FaToggleOn,
  FaToggleOff,
  FaGlobe,
  FaEyeSlash,
  FaPlus,
  FaTimes
} from 'react-icons/fa';
import { useNotification } from '../ui/Notification';
import authService from '../../utils/authService';

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    version: '',
    description: '',
    tags: '',
    isPublic: true
  });
  const { showSuccess, showError } = useNotification();

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching resumes...');
      const response = await authService.getResumes();
      console.log('📄 Resumes API Response:', response);
      
      if (response.success) {
        setResumes(response.data || []);
      } else {
        showError(response.message || 'Failed to fetch resumes');
      }
    } catch (error) {
      console.error('❌ Failed to fetch resumes:', error);
      showError('Failed to fetch resumes: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('📁 File selected:', { name: file.name, size: file.size, type: file.type });

    // Validate file type (only PDF allowed according to API)
    if (file.type !== 'application/pdf') {
      showError('Please select a PDF file only');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Auto-fill title if empty
    if (!uploadForm.title) {
      const fileName = file.name.replace('.pdf', '');
      setUploadForm(prev => ({ ...prev, title: fileName }));
    }
    
    // Auto-fill version if empty
    if (!uploadForm.version) {
      const timestamp = new Date().toISOString().split('T')[0];
      setUploadForm(prev => ({ ...prev, version: `v1.0-${timestamp}` }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError('Please select a file first');
      return;
    }

    if (!uploadForm.title || !uploadForm.version) {
      showError('Please fill in title and version');
      return;
    }

    try {
      setUploading(true);
      console.log('📤 Uploading resume with metadata:', uploadForm);
      
      const response = await authService.uploadResume(selectedFile, uploadForm);
      console.log('📥 Resume upload response:', response);
      
      if (response.success) {
        showSuccess('Resume uploaded successfully');
        setSelectedFile(null);
        setUploadForm({
          title: '',
          version: '',
          description: '',
          tags: '',
          isPublic: true
        });
        setShowUploadForm(false);
        fetchResumes(); // Refresh the resumes list
      } else {
        showError(response.message || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('❌ Resume upload failed:', error);
      showError('Failed to upload resume: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await authService.deleteResume(resumeId);
      if (response.success) {
        showSuccess('Resume deleted successfully');
        fetchResumes(); // Refresh the list
      } else {
        showError(response.message || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('❌ Resume deletion failed:', error);
      showError('Failed to delete resume: ' + error.message);
    }
  };

  const handleToggleActive = async (resumeId) => {
    try {
      const response = await authService.toggleResumeActive(resumeId);
      if (response.success) {
        showSuccess('Resume status updated successfully');
        fetchResumes(); // Refresh the list
      } else {
        showError(response.message || 'Failed to update resume status');
      }
    } catch (error) {
      console.error('❌ Toggle active failed:', error);
      showError('Failed to update resume status: ' + error.message);
    }
  };

  const handleTogglePublic = async (resumeId) => {
    try {
      const response = await authService.toggleResumePublic(resumeId);
      if (response.success) {
        showSuccess('Resume visibility updated successfully');
        fetchResumes(); // Refresh the list
      } else {
        showError(response.message || 'Failed to update resume visibility');
      }
    } catch (error) {
      console.error('❌ Toggle public failed:', error);
      showError('Failed to update resume visibility: ' + error.message);
    }
  };

  const handleDownload = async (resume) => {
    try {
      await authService.downloadResume(resume._id, resume.originalName);
      showSuccess('Resume downloaded successfully');
    } catch (error) {
      console.error('❌ Resume download failed:', error);
      showError('Failed to download resume: ' + error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Resume Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload and manage multiple resumes for your portfolio
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <FaPlus className="w-4 h-4" />
          <span>{showUploadForm ? 'Cancel' : 'Upload New Resume'}</span>
        </motion.button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg">
              <FaUpload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Upload New Resume</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload a new PDF resume with metadata
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resume File (PDF only)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {selectedFile ? (
                  <div className="space-y-2">
                    <FaFilePdf className="w-8 h-8 text-red-500 mx-auto" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <FaTimes className="w-4 h-4 inline mr-1" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to select PDF file
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Metadata Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-blue focus:border-accent-blue dark:bg-gray-700 dark:text-white"
                  placeholder="My Professional Resume"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Version *
                </label>
                <input
                  type="text"
                  value={uploadForm.version}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, version: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-blue focus:border-accent-blue dark:bg-gray-700 dark:text-white"
                  placeholder="v1.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-blue focus:border-accent-blue dark:bg-gray-700 dark:text-white"
                  placeholder="Brief description of this resume version"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags
                </label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-blue focus:border-accent-blue dark:bg-gray-700 dark:text-white"
                  placeholder="professional, 2024, full-stack"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={uploadForm.isPublic}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="h-4 w-4 text-accent-blue focus:ring-accent-blue border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Make public (available for download)
                </label>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowUploadForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !uploadForm.title || !uploadForm.version || uploading}
              className="px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FaUpload className="w-4 h-4" />
                  <span>Upload Resume</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Resumes List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Your Resumes ({resumes.length})
        </h3>
        
        {resumes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FaFileAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No resumes uploaded yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Upload your first resume to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {resumes.map((resume) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <FaFilePdf className="w-8 h-8 text-red-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {resume.title}
                        </h4>
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                          {resume.version}
                        </span>
                        {resume.isActive && (
                          <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                            Active
                          </span>
                        )}
                        {resume.isPublic ? (
                          <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded flex items-center">
                            <FaGlobe className="w-3 h-3 mr-1" />
                            Public
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded flex items-center">
                            <FaEyeSlash className="w-3 h-3 mr-1" />
                            Private
                          </span>
                        )}
                      </div>
                      
                      {resume.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {resume.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <FaHdd className="w-3 h-3" />
                          <span>{formatFileSize(resume.fileSize)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>Uploaded {formatDate(resume.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaDownload className="w-3 h-3" />
                          <span>{resume.downloadCount || 0} downloads</span>
                        </div>
                      </div>
                      
                      {resume.tags && resume.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resume.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(resume)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Download"
                    >
                      <FaDownload className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleActive(resume._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        resume.isActive
                          ? 'text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      title={resume.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {resume.isActive ? <FaToggleOn className="w-4 h-4" /> : <FaToggleOff className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleTogglePublic(resume._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        resume.isPublic
                          ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      title={resume.isPublic ? 'Make Private' : 'Make Public'}
                    >
                      {resume.isPublic ? <FaGlobe className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteResume(resume._id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeManager; 