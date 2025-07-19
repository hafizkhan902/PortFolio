import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage, FaExternalLinkAlt, FaEye, FaEyeSlash, FaStar, FaUpload, FaPalette, FaFilter, FaSort, FaSearch, FaList, FaImages, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useNotification } from '../ui/Notification';
import authService from '../../utils/authService';

const PortfolioHighlightsManager = () => {
  const [highlights, setHighlights] = useState([]);
  const [filteredHighlights, setFilteredHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('displayOrder');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    imageUrl: '',
    images: [], // New field for multiple images
    projectUrl: '',
    tools: [],
    category: 'ui-design',
    displayOrder: 0,
    isActive: true,
    featured: false,
    completionDate: '',
    clientName: '',
    projectDuration: ''
  });
  const [toolInput, setToolInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageInputType, setImageInputType] = useState('upload'); // 'upload' or 'link'
  const [imagePreview, setImagePreview] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(''); // For adding new images
  // const [draggedImageIndex, setDraggedImageIndex] = useState(null); // Unused - commented out
  const { showSuccess, showError } = useNotification();

  const categories = [
    { id: 'ui-design', label: 'UI Design', icon: '🎨', color: 'bg-purple-100 text-purple-800' },
    { id: 'ux-research', label: 'UX Research', icon: '🔍', color: 'bg-blue-100 text-blue-800' },
    { id: 'mobile-app', label: 'Mobile App', icon: '📱', color: 'bg-green-100 text-green-800' },
    { id: 'web-design', label: 'Web Design', icon: '💻', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'branding', label: 'Branding', icon: '✨', color: 'bg-pink-100 text-pink-800' },
    { id: 'prototype', label: 'Prototype', icon: '🔧', color: 'bg-orange-100 text-orange-800' },
    { id: 'wireframe', label: 'Wireframe', icon: '📐', color: 'bg-gray-100 text-gray-800' },
    { id: 'user-testing', label: 'User Testing', icon: '👥', color: 'bg-teal-100 text-teal-800' },
    { id: 'other', label: 'Other', icon: '🌟', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[categories.length - 1];
  };

  const fetchHighlights = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching portfolio highlights from admin API...');
      const response = await authService.getPortfolioHighlights();
      console.log('📊 Portfolio Highlights API Response:', response);
      if (response.success) {
        const processedHighlights = (response.data || []).map(highlight => ({
          ...highlight,
          // Convert single imageUrl to images array for backward compatibility
          images: highlight.images || (highlight.imageUrl ? [{ url: highlight.imageUrl, caption: '', isPrimary: true }] : [])
        }));
        setHighlights(processedHighlights);
        setFilteredHighlights(processedHighlights);
      }
    } catch (error) {
      console.error('❌ Failed to fetch portfolio highlights:', error);
      showError('Failed to fetch portfolio highlights: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  // Filter and sort highlights
  useEffect(() => {
    let filtered = highlights.filter(highlight => {
      const matchesSearch = highlight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          highlight.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          highlight.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || highlight.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort highlights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'completionDate':
          return new Date(b.completionDate || 0) - new Date(a.completionDate || 0);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return (a.displayOrder || 0) - (b.displayOrder || 0);
      }
    });

    setFilteredHighlights(filtered);
  }, [highlights, searchTerm, filterCategory, sortBy]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    
    if (type === 'checkbox') {
      newValue = checked;
    } else if (name === 'displayOrder') {
      newValue = parseInt(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleImageTypeChange = (type) => {
    setImageInputType(type);
    setNewImageUrl('');
    setImagePreview('');
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setNewImageUrl(url);
    
    if (url && imageInputType === 'link') {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  // Multiple Images Management
  const handleAddImageFromUrl = () => {
    if (newImageUrl.trim()) {
      const newImage = {
        url: newImageUrl.trim(),
        caption: '',
        isPrimary: formData.images.length === 0 // First image is primary
      };
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage],
        // Set as main imageUrl for backward compatibility
        imageUrl: prev.images.length === 0 ? newImageUrl.trim() : prev.imageUrl
      }));
      
      setNewImageUrl('');
      setImagePreview('');
      showSuccess('Image added successfully');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      console.log('📤 Uploading image:', file.name);
      const response = await authService.uploadImage(file);
      console.log('📥 Image upload response:', response);
      
      if (response.success) {
        const imageUrl = response.data.url;
        const newImage = {
          url: imageUrl,
          caption: '',
          isPrimary: formData.images.length === 0 // First image is primary
        };
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage],
          // Set as main imageUrl for backward compatibility
          imageUrl: prev.images.length === 0 ? imageUrl : prev.imageUrl
        }));
        
        showSuccess('Image uploaded successfully');
      } else {
        showError(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      showError('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      
      // If we removed the primary image, make the first remaining image primary
      if (newImages.length > 0 && prev.images[index].isPrimary) {
        newImages[0].isPrimary = true;
      }
      
      return {
        ...prev,
        images: newImages,
        // Update main imageUrl for backward compatibility
        imageUrl: newImages.length > 0 ? newImages.find(img => img.isPrimary)?.url || newImages[0].url : ''
      };
    });
  };

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      })),
      // Update main imageUrl for backward compatibility
      imageUrl: prev.images[index].url
    }));
  };

  const handleUpdateImageCaption = (index, caption) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, caption } : img
      )
    }));
  };

  const handleMoveImage = (fromIndex, toIndex) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const handleAddTool = () => {
    if (toolInput.trim() && !formData.tools.includes(toolInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, toolInput.trim()]
      }));
      setToolInput('');
    }
  };

  const handleRemoveTool = (toolToRemove) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(tool => tool !== toolToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('📤 Submitting portfolio highlight data:', formData);
      
      // Validate required fields
      if (!formData.title || !formData.description || !formData.completionDate) {
        throw new Error('Title, description, and completion date are required');
      }

      // Format completion date as ISO string and prepare submit data
      const submitData = {
        ...formData,
        completionDate: new Date(formData.completionDate).toISOString(),
        // For backward compatibility, use the primary image as imageUrl
        imageUrl: formData.images.find(img => img.isPrimary)?.url || formData.images[0]?.url || formData.imageUrl
      };

      let response;
      if (editingHighlight) {
        console.log('🔄 Updating portfolio highlight:', editingHighlight.title);
        response = await authService.updatePortfolioHighlight(editingHighlight._id, submitData);
      } else {
        console.log('➕ Creating new portfolio highlight:', formData.title);
        response = await authService.createPortfolioHighlight(submitData);
      }

      console.log('📥 Submit response:', response);

      if (response.success) {
        showSuccess(editingHighlight ? 'Portfolio highlight updated successfully' : 'Portfolio highlight created successfully');
        fetchHighlights();
        handleCancel();
      } else {
        showError(response.message || 'Failed to save portfolio highlight');
      }
    } catch (error) {
      console.error('❌ Submit error:', error);
      showError('Failed to save portfolio highlight: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (highlight) => {
    setEditingHighlight(highlight);
    setToolInput('');
    setNewImageUrl('');
    setImagePreview('');
    
    // Format completion date for date input
    const completionDate = highlight.completionDate ? 
      new Date(highlight.completionDate).toISOString().split('T')[0] : '';
    
    // Set image input type based on existing images
    const hasImages = highlight.images && highlight.images.length > 0;
    setImageInputType(hasImages ? 'link' : 'upload');
    
    setFormData({
      title: highlight.title || '',
      description: highlight.description || '',
      shortDescription: highlight.shortDescription || '',
      imageUrl: highlight.imageUrl || '',
      images: highlight.images || (highlight.imageUrl ? [{ url: highlight.imageUrl, caption: '', isPrimary: true }] : []),
      projectUrl: highlight.projectUrl || '',
      tools: highlight.tools || [],
      category: highlight.category || 'ui-design',
      displayOrder: highlight.displayOrder || 0,
      isActive: highlight.isActive !== undefined ? highlight.isActive : true,
      featured: highlight.featured !== undefined ? highlight.featured : false,
      completionDate: completionDate,
      clientName: highlight.clientName || '',
      projectDuration: highlight.projectDuration || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (highlightId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio highlight?')) return;

    try {
      const response = await authService.deletePortfolioHighlight(highlightId);
      if (response.success) {
        showSuccess('Portfolio highlight deleted successfully');
        fetchHighlights();
      } else {
        showError(response.message || 'Failed to delete portfolio highlight');
      }
    } catch (error) {
      showError('Failed to delete portfolio highlight: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHighlight(null);
    setToolInput('');
    setImageInputType('upload');
    setImagePreview('');
    setNewImageUrl('');
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      imageUrl: '',
      images: [],
      projectUrl: '',
      tools: [],
      category: 'ui-design',
      displayOrder: 0,
      isActive: true,
      featured: false,
      completionDate: '',
      clientName: '',
      projectDuration: ''
    });
  };

  const handleAddNew = () => {
    setEditingHighlight(null);
    setToolInput('');
    setImageInputType('upload');
    setImagePreview('');
    setNewImageUrl('');
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      imageUrl: '',
      images: [],
      projectUrl: '',
      tools: [],
      category: 'ui-design',
      displayOrder: highlights.length,
      isActive: true,
      featured: false,
      completionDate: '',
      clientName: '',
      projectDuration: ''
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-accent-blue to-accent-purple"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaPalette className="w-6 h-6 text-accent-blue animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <FaPalette className="w-6 h-6 mr-3 text-accent-blue" />
            Portfolio Highlights
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Manage your creative portfolio showcase with multiple images
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add New Highlight</span>
        </motion.button>
      </div>

      {/* Enhanced Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search highlights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <FaSort className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
              >
                <option value="displayOrder">Display Order</option>
                <option value="title">Title</option>
                <option value="category">Category</option>
                <option value="completionDate">Completion Date</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 text-accent-blue shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <FaImages className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-accent-blue shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <FaList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredHighlights.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center mb-6">
            <FaPalette className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No highlights found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filterCategory !== 'all' ? 'Try adjusting your search or filters' : 'Get started by adding your first portfolio highlight'}
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNew}
              className="bg-gradient-to-r from-accent-blue to-accent-purple text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Your First Highlight
            </motion.button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-6' : 'divide-y divide-gray-200 dark:divide-gray-700'}>
          <AnimatePresence>
            {filteredHighlights.map((highlight, index) => {
              const categoryInfo = getCategoryInfo(highlight.category);
              const primaryImage = highlight.images?.find(img => img.isPrimary) || highlight.images?.[0];
              
              return viewMode === 'grid' ? (
                // Grid Card View
                <motion.div
                  key={highlight._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-accent-blue/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Featured Badge */}
                  {highlight.featured && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <FaStar className="w-3 h-3" />
                        <span>Featured</span>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                      highlight.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {highlight.isActive ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
                      <span>{highlight.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>

                  {/* Image Count Badge */}
                  {highlight.images && highlight.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 z-10">
                      <div className="bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <FaImages className="w-3 h-3" />
                        <span>{highlight.images.length}</span>
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                    {primaryImage?.url || highlight.imageUrl ? (
                      <img
                        src={primaryImage?.url || highlight.imageUrl}
                        alt={highlight.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaImage className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 flex-1">
                        {highlight.title}
                      </h3>
                      <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.icon}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {highlight.shortDescription || highlight.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-3">
                        {highlight.completionDate && (
                          <span>{new Date(highlight.completionDate).toLocaleDateString()}</span>
                        )}
                        {highlight.clientName && (
                          <span>{highlight.clientName}</span>
                        )}
                      </div>
                      <span>#{highlight.displayOrder}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(highlight)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <FaEdit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(highlight._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                      
                      {highlight.projectUrl && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={highlight.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-accent-blue hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <FaExternalLinkAlt className="w-4 h-4" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                // List View (existing code remains the same)
                <motion.div
                  key={highlight._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {primaryImage?.url || highlight.imageUrl ? (
                        <div className="relative">
                          <img
                            src={primaryImage?.url || highlight.imageUrl}
                            alt={highlight.title}
                            className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-gray-600"
                          />
                          {highlight.images && highlight.images.length > 1 && (
                            <div className="absolute -top-1 -right-1 bg-accent-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {highlight.images.length}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                          <FaImage className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                              {highlight.title}
                            </h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                              {categoryInfo.icon} {categoryInfo.label}
                            </div>
                            {highlight.featured && (
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                <FaStar className="w-3 h-3" />
                                <span>Featured</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                            {highlight.shortDescription || highlight.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            {highlight.completionDate && (
                              <span>{new Date(highlight.completionDate).toLocaleDateString()}</span>
                            )}
                            {highlight.clientName && (
                              <span>{highlight.clientName}</span>
                            )}
                            <span>Order: #{highlight.displayOrder}</span>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              highlight.isActive 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {highlight.isActive ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(highlight)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <FaEdit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(highlight._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <FaTrash className="w-4 h-4" />
                          </motion.button>
                          {highlight.projectUrl && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={highlight.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-accent-blue hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <FaExternalLinkAlt className="w-4 h-4" />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Enhanced Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-xs sm:max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg">
                      <FaPalette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {editingHighlight ? 'Edit Portfolio Highlight' : 'Create New Highlight'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {editingHighlight ? 'Update your creative masterpiece with multiple images' : 'Add a new project to your portfolio with image gallery'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCancel}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Basic Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        maxLength={100}
                        placeholder="e.g., E-commerce Mobile App UI"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      maxLength={150}
                      placeholder="Brief one-line description for preview"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Detailed Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      maxLength={500}
                      rows="4"
                      placeholder="Describe your project, your role, challenges solved, and key achievements..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">{formData.description.length}/500 characters</p>
                  </div>
                </div>

                {/* Project Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Project Details</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Completion Date *
                      </label>
                      <input
                        type="date"
                        name="completionDate"
                        value={formData.completionDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Client Name
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        placeholder="e.g., TechCorp Inc."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Project Duration
                      </label>
                      <input
                        type="text"
                        name="projectDuration"
                        value={formData.projectDuration}
                        onChange={handleInputChange}
                        placeholder="e.g., 3 months"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Project URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="projectUrl"
                      value={formData.projectUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/project"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Enhanced Multiple Images Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">3</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Project Images Gallery</h4>
                  </div>

                  {/* Existing Images Gallery */}
                  {formData.images.length > 0 && (
                    <div className="space-y-4">
                      <h5 className="text-md font-medium text-gray-700 dark:text-gray-300">Current Images ({formData.images.length})</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formData.images.map((image, index) => (
                          <motion.div
                            key={index}
                            layout
                            className="relative group bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600"
                          >
                            <div className="aspect-video relative">
                              <img
                                src={image.url}
                                alt={`Project ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(index)}
                                  className={`p-2 rounded-lg text-white transition-colors ${
                                    image.isPrimary 
                                      ? 'bg-yellow-500 hover:bg-yellow-600' 
                                      : 'bg-gray-600 hover:bg-gray-700'
                                  }`}
                                  title={image.isPrimary ? 'Primary Image' : 'Set as Primary'}
                                >
                                  <FaStar className="w-4 h-4" />
                                </motion.button>
                                
                                {index > 0 && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => handleMoveImage(index, index - 1)}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                                    title="Move Up"
                                  >
                                    <FaArrowUp className="w-4 h-4" />
                                  </motion.button>
                                )}
                                
                                {index < formData.images.length - 1 && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => handleMoveImage(index, index + 1)}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                                    title="Move Down"
                                  >
                                    <FaArrowDown className="w-4 h-4" />
                                  </motion.button>
                                )}
                                
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                                  title="Remove Image"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                            
                            {/* Image Caption */}
                            <div className="p-3">
                              <input
                                type="text"
                                value={image.caption}
                                onChange={(e) => handleUpdateImageCaption(index, e.target.value)}
                                placeholder="Add image caption (optional)"
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                              />
                              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                <span>Image {index + 1}</span>
                                {image.isPrimary && (
                                  <span className="text-yellow-600 font-medium flex items-center">
                                    <FaStar className="w-3 h-3 mr-1" />
                                    Primary
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Image Section */}
                  <div className="space-y-4">
                    <h5 className="text-md font-medium text-gray-700 dark:text-gray-300">Add New Image</h5>
                    
                    {/* Image Input Type Toggle */}
                    <div className="flex space-x-2 mb-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleImageTypeChange('upload')}
                        className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          imageInputType === 'upload'
                            ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <FaUpload className="w-4 h-4 inline mr-2" />
                        Upload Image
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleImageTypeChange('link')}
                        className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          imageInputType === 'link'
                            ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <FaImage className="w-4 h-4 inline mr-2" />
                        Image Link
                      </motion.button>
                    </div>

                    {/* Upload Section */}
                    {imageInputType === 'upload' && (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                        <div className="space-y-6">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                            <FaUpload className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <label className="cursor-pointer group">
                              <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className="inline-block text-accent-blue hover:text-accent-purple font-semibold text-lg group-hover:underline"
                              >
                                {uploading ? 'Uploading image...' : 'Click to upload project image'}
                              </motion.span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="hidden"
                              />
                            </label>
                            <p className="text-gray-500 text-sm mt-2">
                              PNG, JPG, GIF up to 5MB • Recommended: 1200x800px
                            </p>
                          </div>
                          {uploading && (
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* URL Input Section */}
                    {imageInputType === 'link' && (
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <input
                              type="url"
                              value={newImageUrl}
                              onChange={handleImageUrlChange}
                              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <FaImage className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={handleAddImageFromUrl}
                            disabled={!newImageUrl.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaPlus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        {imagePreview && (
                          <div className="space-y-3">
                            <div className="relative inline-block w-full">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-w-md h-64 object-cover rounded-xl mx-auto shadow-lg"
                                onError={() => {
                                  setImagePreview('');
                                  showError('Invalid image URL');
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-gray-500 flex items-center">
                          <FaImage className="w-4 h-4 mr-2" />
                          Enter a direct URL to add to your project gallery
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tools Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">4</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tools & Technologies</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={toolInput}
                        onChange={(e) => setToolInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTool();
                          }
                        }}
                        placeholder="Enter tool or technology (e.g., Figma, React, Adobe XD)"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleAddTool}
                        className="px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <FaPlus className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {formData.tools.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tools.map((tool, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg font-medium border border-blue-200 dark:border-blue-700"
                          >
                            <span>{tool}</span>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                              type="button"
                              onClick={() => handleRemoveTool(tool)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <FaTimes className="w-3 h-3" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Settings Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">5</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Settings</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Display Order
                      </label>
                      <input
                        type="number"
                        name="displayOrder"
                        value={formData.displayOrder}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 mt-2">Lower numbers appear first</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                        Visibility
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-accent-blue bg-gray-100 border-gray-300 rounded focus:ring-accent-blue focus:ring-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {formData.isActive ? 'Active (visible on website)' : 'Inactive (hidden)'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                        Featured
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-accent-blue bg-gray-100 border-gray-300 rounded focus:ring-accent-blue focus:ring-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {formData.featured ? 'Featured project' : 'Regular project'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="w-4 h-4" />
                        <span>{editingHighlight ? 'Update Highlight' : 'Create Highlight'}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioHighlightsManager; 