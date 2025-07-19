import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaTimes, FaImage, FaSpinner } from 'react-icons/fa';
import { useNotification } from '../ui/Notification';
import authService from '../../utils/authService';

const ProjectForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    challenges: [],
    solutions: [],
    imageUrl: '',
    completionDate: new Date().toISOString().split('T')[0] // Add completion date
  });
  const [techInput, setTechInput] = useState('');
  const [challengeInput, setChallengeInput] = useState('');
  const [solutionInput, setSolutionInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageInputType, setImageInputType] = useState('upload'); // 'upload' or 'link'
  const { showSuccess, showError } = useNotification();

  const categories = ['Web', 'UI', 'Fullstack', 'Research', 'Other'];

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || 'Web',
        technologies: project.technologies || [],
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        featured: project.featured || false,
        challenges: project.challenges || [],
        solutions: project.solutions || [],
        imageUrl: project.imageUrl || '',
        completionDate: project.completionDate ? new Date(project.completionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
      setImagePreview(project.imageUrl || '');
      // Set image input type based on existing project
      setImageInputType(project.imageUrl ? 'link' : 'upload');
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
    setImagePreview(url);
    setImageFile(null); // Clear file when using URL
  };

  const handleImageTypeChange = (type) => {
    setImageInputType(type);
    if (type === 'upload') {
      setFormData(prev => ({ ...prev, imageUrl: '' }));
      setImagePreview('');
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  const uploadImage = async () => {
    // If using URL input, return the URL directly
    if (imageInputType === 'link') {
      return formData.imageUrl;
    }
    
    // If using file upload but no file selected, return existing imageUrl
    if (!imageFile) return formData.imageUrl;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', imageFile);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4000/api/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl || data.url || data.data?.imageUrl || data.data?.url;
      } else {
        const errorData = await response.json();
        console.error('Upload error:', errorData);
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showError('Failed to upload image');
      return formData.imageUrl;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl) => {
    if (!imageUrl) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4000/api/upload/images', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (response.ok) {
        console.log('Image deleted successfully');
        return true;
      } else {
        const errorData = await response.json();
        console.error('Delete error:', errorData);
        throw new Error(errorData.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showError('Failed to delete image');
      return false;
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const addChallenge = () => {
    if (challengeInput.trim() && !formData.challenges.includes(challengeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        challenges: [...prev.challenges, challengeInput.trim()]
      }));
      setChallengeInput('');
    }
  };

  const removeChallenge = (challenge) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.filter(c => c !== challenge)
    }));
  };

  const addSolution = () => {
    if (solutionInput.trim() && !formData.solutions.includes(solutionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        solutions: [...prev.solutions, solutionInput.trim()]
      }));
      setSolutionInput('');
    }
  };

  const removeSolution = (solution) => {
    setFormData(prev => ({
      ...prev,
      solutions: prev.solutions.filter(s => s !== solution)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    console.log('🔄 NEW VERSION: handleSubmit called');

    try {
      console.log('🚀 Starting project submission...');
      
      // Upload image first if there's a new one
      const imageUrl = await uploadImage();
      
      // Validate required fields first
      if (!formData.title || !formData.description) {
        throw new Error('Title and description are required');
      }

      console.log('📝 Is editing existing project?', !!project);

      // Use authService instead of direct fetch
      let response;
      if (project) {
        console.log('🔄 Updating existing project with ID:', project._id);
        
        // For updates, use full data structure
        const projectData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          technologies: formData.technologies,
          githubUrl: formData.githubUrl || '',
          liveUrl: formData.liveUrl || '',
          featured: formData.featured,
          challenges: formData.challenges,
          solutions: formData.solutions,
          imageUrl: imageUrl || '',
          completionDate: formData.completionDate ? new Date(formData.completionDate).toISOString() : new Date().toISOString()
        };
        
        console.log('📝 Update project data:', projectData);
        response = await authService.updateProject(project._id, projectData);
      } else {
        console.log('➕ Creating new project');
        
        // For creation, start with minimal required fields only
        const minimalProjectData = {
          title: formData.title,
          description: formData.description,
          category: formData.category || 'Web',
          featured: formData.featured || false
        };
        
        console.log('📝 Minimal project data for creation:', minimalProjectData);
        console.log('📝 Minimal project data JSON:', JSON.stringify(minimalProjectData, null, 2));
        
        try {
          response = await authService.createProject(minimalProjectData);
          console.log('✅ Minimal project creation successful!');
        } catch (minimalError) {
          console.error('❌ Minimal project creation failed:', minimalError);
          console.error('❌ Minimal error details:', minimalError.message);
          
          // If minimal fails, try with a bit more data
          const basicProjectData = {
            title: formData.title,
            description: formData.description,
            category: formData.category || 'Web',
            technologies: formData.technologies || [],
            featured: formData.featured || false,
            challenges: formData.challenges || [],
            solutions: formData.solutions || []
          };
          
          console.log('📝 Trying with basic project data:', basicProjectData);
          console.log('📝 Basic project data JSON:', JSON.stringify(basicProjectData, null, 2));
          
          try {
            response = await authService.createProject(basicProjectData);
            console.log('✅ Basic project creation successful!');
          } catch (basicError) {
            console.error('❌ Basic project creation also failed:', basicError);
            console.error('❌ Basic error details:', basicError.message);
            
            // If basic also fails, try with the full data structure like updates
            const fullProjectData = {
              title: formData.title,
              description: formData.description,
              category: formData.category,
              technologies: formData.technologies,
              githubUrl: formData.githubUrl || '',
              liveUrl: formData.liveUrl || '',
              featured: formData.featured,
              challenges: formData.challenges,
              solutions: formData.solutions,
              imageUrl: imageUrl || '',
              completionDate: formData.completionDate ? new Date(formData.completionDate).toISOString() : new Date().toISOString()
            };
            
            console.log('📝 Trying with full project data (like updates):', fullProjectData);
            console.log('📝 Full project data JSON:', JSON.stringify(fullProjectData, null, 2));
            
            response = await authService.createProject(fullProjectData);
            console.log('✅ Full project creation successful!');
          }
        }
      }

      console.log('✅ Project saved successfully:', response);
      showSuccess(`Project ${project ? 'updated' : 'created'} successfully`);
      onSave(response.data);
      
    } catch (error) {
      console.error('❌ Error saving project:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      
      // Show more specific error messages
      if (error.message.includes('jwt') || error.message.includes('token')) {
        showError('Session expired. Please login again.');
      } else if (error.message.includes('required')) {
        showError(error.message);
      } else {
        showError(error.message || 'Failed to save project. Please check your input and try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 w-full max-w-xs sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Completion Date</label>
                <input
                  type="date"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Live URL</label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Featured Project</label>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Image</label>
                
                {/* Image Input Type Toggle */}
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleImageTypeChange('upload')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageInputType === 'upload'
                        ? 'bg-accent-blue text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <FaUpload className="w-4 h-4 inline mr-2" />
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageTypeChange('link')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageInputType === 'link'
                        ? 'bg-accent-blue text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <FaImage className="w-4 h-4 inline mr-2" />
                    Image Link
                  </button>
                </div>

                {/* Image Upload Section */}
                {imageInputType === 'upload' && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            // If there's a previously uploaded image, delete it from server
                            if (formData.imageUrl && !imageFile) {
                              await deleteImage(formData.imageUrl);
                            }
                            setImageFile(null);
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FaImage className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <label className="cursor-pointer">
                            <span className="text-accent-blue hover:text-accent-purple">
                              Choose file
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-sm text-gray-500">
                          Upload an image file (JPG, PNG, GIF)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Image URL Section */}
                {imageInputType === 'link' && (
                  <div className="space-y-4">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={handleImageUrlChange}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                    />
                    {imagePreview && (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                          onError={() => {
                            setImagePreview('');
                            showError('Invalid image URL');
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                            setImagePreview('');
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Clear Image URL
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      Enter a direct URL to an image
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium mb-2">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                placeholder="Add technology..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-blue/20 text-accent-blue"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div>
            <label className="block text-sm font-medium mb-2">Challenges</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={challengeInput}
                onChange={(e) => setChallengeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChallenge())}
                placeholder="Add challenge..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
              <button
                type="button"
                onClick={addChallenge}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.challenges.map((challenge, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span className="text-sm">{challenge}</span>
                  <button
                    type="button"
                    onClick={() => removeChallenge(challenge)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <label className="block text-sm font-medium mb-2">Solutions</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={solutionInput}
                onChange={(e) => setSolutionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSolution())}
                placeholder="Add solution..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
              <button
                type="button"
                onClick={addSolution}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.solutions.map((solution, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span className="text-sm">{solution}</span>
                  <button
                    type="button"
                    onClick={() => removeSolution(solution)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {(saving || uploading) && <FaSpinner className="animate-spin" />}
              <span>
                {saving ? 'Saving...' : uploading ? 'Uploading...' : project ? 'Update' : 'Create'}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectForm; 