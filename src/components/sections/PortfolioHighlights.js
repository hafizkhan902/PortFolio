import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, 
  FaExternalLinkAlt, 
  FaCalendar,
  FaUser,
  FaClock,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaCode,
  FaPalette,
  FaRocket,
  FaMagic,
  FaLightbulb,
  FaDesktop,
  FaMobile,
  FaTablet,
  FaGem,
  FaFire,
  Fa500Px
} from 'react-icons/fa';
import Section from '../layout/Section';
import authService from '../../utils/authService';

const PortfolioHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [viewMode, setViewMode] = useState('masonry'); // 'masonry', 'carousel', 'grid'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filter, setFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  const categories = [
    { id: 'all', label: 'All Projects', icon: FaRocket, color: 'from-purple-500 to-pink-500' },
    { id: 'ui-design', label: 'UI Design', icon: FaPalette, color: 'from-blue-500 to-purple-500' },
    { id: 'ux-research', label: 'UX Research', icon: FaLightbulb, color: 'from-green-500 to-blue-500' },
    { id: 'mobile-app', label: 'Mobile App', icon: FaMobile, color: 'from-pink-500 to-red-500' },
    { id: 'web-design', label: 'Web Design', icon: FaDesktop, color: 'from-indigo-500 to-purple-500' },
    { id: 'branding', label: 'Branding', icon: FaMagic, color: 'from-yellow-500 to-orange-500' },
    { id: 'prototype', label: 'Prototype', icon: FaCode, color: 'from-teal-500 to-green-500' }
  ];

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching public portfolio highlights...');
      const response = await authService.getPublicPortfolioHighlights();
      console.log('📊 Full API Response:', response);
      
      if (response.success && response.data) {
        const activeHighlights = response.data
          .filter(highlight => highlight.isActive !== false)
          .map(highlight => {
            console.log('🖼️ Processing highlight:', highlight.title);
            console.log('📷 Raw images array:', highlight.images);
            console.log('🖼️ Raw imageUrl (fallback):', highlight.imageUrl);
            
            // Prioritize images array over imageUrl
            let processedImages = [];
            
            if (highlight.images && Array.isArray(highlight.images) && highlight.images.length > 0) {
              // Use the images array if it exists and has content
              // Convert to expected format with isPrimary field
              processedImages = highlight.images.map((img, index) => ({
                url: img.url,
                caption: img.caption || '',
                isPrimary: index === 0, // First image is primary
                _id: img._id
              }));
              console.log('✅ Using images array:', processedImages);
            } else if (highlight.imageUrl) {
              // Fallback to imageUrl if images array is empty or doesn't exist
              processedImages = [{ url: highlight.imageUrl, caption: '', isPrimary: true }];
              console.log('⚠️ Fallback to imageUrl:', processedImages);
            }
            
            const processed = {
              ...highlight,
              images: processedImages,
              // Set primary image for card display
              primaryImage: processedImages.length > 0 ? processedImages.find(img => img.isPrimary) || processedImages[0] : null
            };
            
            console.log('✅ Final processed images:', processed.images);
            console.log('🎯 Primary image for card:', processed.primaryImage);
            console.log('📝 Title:', processed.title);
            console.log('📄 Description:', processed.shortDescription || processed.description);
            return processed;
          })
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        
        console.log('🎯 Final highlights to display:', activeHighlights);
        setHighlights(activeHighlights);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio highlights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHighlights = filter === 'all' 
    ? highlights 
    : highlights.filter(h => h.category === filter);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredHighlights.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredHighlights.length) % filteredHighlights.length);
  };

  const CreativeCard = ({ highlight, index, style = {} }) => {
    const categoryInfo = getCategoryInfo(highlight.category);
    const isHovered = hoveredCard === highlight._id;

    // Debug logging
    console.log('🎨 CreativeCard rendering:', {
      title: highlight.title,
      primaryImage: highlight.primaryImage,
      description: highlight.shortDescription || highlight.description,
      category: highlight.category,
      tools: highlight.tools
    });

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.1 }}
        style={style}
        className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[400px] flex flex-col"
        onMouseEnter={() => setHoveredCard(highlight._id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => setSelectedHighlight(highlight)}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-green rounded-full blur-lg"></div>
        </div>

        {/* Background Image with Parallax Effect */}
        <div className="relative overflow-hidden">
          {highlight.primaryImage ? (
            <div className="aspect-[3/2] relative">
              <img
                src={highlight.primaryImage.url}
                alt={highlight.primaryImage.caption || highlight.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Floating Elements */}
              <motion.div
                animate={isHovered ? { y: -10, opacity: 1 } : { y: 0, opacity: 0.8 }}
                className="absolute top-4 right-4 flex space-x-2"
              >
                {highlight.featured && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 shadow-lg">
                    <FaStar className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}
                {(() => {
                  const CategoryIcon = categoryInfo.icon;
                  return (
                    <div className={`bg-gradient-to-r ${categoryInfo.color} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
                      <CategoryIcon className="w-3 h-3 inline mr-1" />
                      {categoryInfo.label}
                    </div>
                  );
                })()}
              </motion.div>

              {/* Hover Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isHovered ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  className="text-white text-center"
                >
                  <FaExpand className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Click to explore</p>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <div className="aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <FaPalette className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-accent-blue transition-colors flex-1 mr-2">
                {highlight.title || 'Untitled Project'}
              </h3>
              {highlight.projectUrl && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={highlight.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                </motion.a>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
              {highlight.shortDescription || highlight.description || 'No description available'}
            </p>

            {/* Tools */}
            {highlight.tools && highlight.tools.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {highlight.tools.slice(0, 4).map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-lg font-medium"
                  >
                    {tool}
                  </span>
                ))}
                {highlight.tools.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg">
                    +{highlight.tools.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Meta Info - Always at bottom */}
          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center space-x-3">
                {highlight.completionDate && (
                  <div className="flex items-center space-x-1">
                    <FaCalendar className="w-3 h-3" />
                    <span>{new Date(highlight.completionDate).toLocaleDateString()}</span>
                  </div>
                )}
                {highlight.clientName && (
                  <div className="flex items-center space-x-1">
                    <FaUser className="w-3 h-3" />
                    <span>{highlight.clientName}</span>
                  </div>
                )}
              </div>
              {highlight.projectDuration && (
                <div className="flex items-center space-x-1">
                  <FaClock className="w-3 h-3" />
                  <span>{highlight.projectDuration} days</span>
                </div>
              )}
            </div>

            {/* Category Badge */}
            {highlight.category && (
              <div className="flex items-center justify-between">
                {(() => {
                  const categoryInfo = getCategoryInfo(highlight.category);
                  const CategoryIcon = categoryInfo.icon;
                  return (
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryInfo.color} text-white`}>
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      {categoryInfo.label}
                    </div>
                  );
                })()}
                {highlight.featured && (
                  <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                    <FaStar className="w-3 h-3" />
                    <span className="text-xs font-medium">Featured</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-blue/50 transition-all duration-300" />
        
        {/* Sparkle Effect */}
        <motion.div
          className="absolute top-2 left-2 text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Fa500Px className="w-4 h-4" />
        </motion.div>
      </motion.div>
    );
  };

  const MasonryView = () => {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {filteredHighlights.map((highlight, index) => (
            <div key={highlight._id} className="break-inside-avoid mb-6">
              <CreativeCard
                highlight={highlight}
                index={index}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const CarouselView = () => {
    return (
      <div className="relative">
        <div className="overflow-hidden rounded-2xl">
          <motion.div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {filteredHighlights.map((highlight, index) => (
              <div key={highlight._id} className="w-full flex-shrink-0">
                <div className="mx-4">
                  <CreativeCard highlight={highlight} index={index} />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
        >
          <FaChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
        >
          <FaChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {filteredHighlights.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-accent-blue scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const GridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredHighlights.map((highlight, index) => (
            <CreativeCard key={highlight._id} highlight={highlight} index={index} />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const DetailModal = ({ highlight, onClose }) => {
    const categoryInfo = getCategoryInfo(highlight.category);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Get all images - prioritize the images array, fallback to imageUrl
    let allImages = highlight.images && highlight.images.length > 0 
      ? highlight.images 
      : (highlight.imageUrl ? [{ url: highlight.imageUrl, caption: '', isPrimary: true }] : []);
    
    // Track if we're in demo mode
    const isDemoMode = allImages.length === 1 && allImages[0].url;
    
    // For demonstration purposes, if we only have one image, create additional demo images
    // This allows users to see the gallery functionality
    if (isDemoMode) {
      const baseImage = allImages[0];
      allImages = [
        { ...baseImage, caption: 'Main Project View' },
        { url: baseImage.url, caption: 'Desktop Version', isPrimary: false },
        { url: baseImage.url, caption: 'Mobile Version', isPrimary: false },
        { url: baseImage.url, caption: 'Detail View', isPrimary: false }
      ];
    }
    
    const currentImage = allImages[currentImageIndex];

    const nextImage = useCallback(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, [allImages.length]);

    const prevImage = useCallback(() => {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }, [allImages.length]);

    const handleKeyDown = useCallback((e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') onClose();
    }, [nextImage, prevImage, onClose]);

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Flash Card Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ perspective: "1000px" }}
        >
          {/* Glass Card */}
          <div className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/2 via-transparent to-white/1 pointer-events-none" />
            
            {/* Minimal Border Effect */}
            <div className="absolute inset-0 rounded-3xl border border-white/15" />

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20"
            >
              <FaTimes className="w-5 h-5" />
            </motion.button>

            {/* Content Container */}
            <div className="relative z-10 p-8 h-full max-h-[90vh] overflow-y-auto">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row gap-8 mb-8">
                {/* Project Image Gallery */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:w-1/2"
                >
                  <div className="relative group">
                    {/* Main Image Display */}
                    {currentImage ? (
                      <div className="relative">
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                          <img
                            src={currentImage.url}
                            alt={currentImage.caption || highlight.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        
                        {/* Image Caption */}
                        {currentImage.caption && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3"
                          >
                            <p className="text-white text-sm">{currentImage.caption}</p>
                          </motion.div>
                        )}
                        
                        {/* Navigation Arrows for Multiple Images */}
                        {allImages.length > 1 && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20"
                            >
                              <FaChevronLeft className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20"
                            >
                              <FaChevronRight className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                        
                        {/* Image Counter */}
                        {allImages.length > 0 && (
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                            {currentImageIndex + 1} / {allImages.length}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                        <FaPalette className="w-16 h-16 text-white/40" />
                      </div>
                    )}
                    
                    {/* Thumbnail Gallery */}
                    {allImages.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white/80 text-sm font-medium">
                            Project Gallery ({allImages.length} images)
                            {isDemoMode && (
                              <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                Demo Gallery
                              </span>
                            )}
                          </h4>
                          {allImages.length > 1 && (
                            <div className="text-white/60 text-xs">
                              {isDemoMode 
                                ? 'Demo: Add multiple images in admin to see real gallery' 
                                : 'Click thumbnails to view'
                              }
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {allImages.map((image, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                index === currentImageIndex
                                  ? 'border-accent-blue shadow-lg ring-2 ring-accent-blue/50'
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                            >
                              <img
                                src={image.url}
                                alt={image.caption || `Image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Floating Category Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -bottom-4 left-4"
                    >
                      <div className={`bg-gradient-to-r ${categoryInfo.color} text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center space-x-2`}>
                        <categoryInfo.icon className="w-4 h-4" />
                        <span>{categoryInfo.label}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Project Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:w-1/2 flex flex-col justify-center"
                >
                  {/* Title and Featured Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      {highlight.title}
                    </h2>
                    {highlight.featured && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 shadow-lg"
                      >
                        <FaStar className="w-3 h-3" />
                        <span>Featured</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    {highlight.shortDescription || highlight.description}
                  </p>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {highlight.completionDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                      >
                        <FaCalendar className="w-5 h-5 text-accent-blue" />
                        <div>
                          <p className="text-white/60 text-sm">Completed</p>
                          <p className="text-white font-medium">
                            {new Date(highlight.completionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    )}
                    {highlight.clientName && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                      >
                        <FaUser className="w-5 h-5 text-accent-purple" />
                        <div>
                          <p className="text-white/60 text-sm">Client</p>
                          <p className="text-white font-medium">{highlight.clientName}</p>
                        </div>
                      </motion.div>
                    )}
                    {highlight.projectDuration && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                      >
                        <FaClock className="w-5 h-5 text-accent-green" />
                        <div>
                          <p className="text-white/60 text-sm">Duration</p>
                          <p className="text-white font-medium">{highlight.projectDuration}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    {highlight.projectUrl && (
                      <motion.a
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href={highlight.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        <span>View Live Project</span>
                      </motion.a>
                    )}
                    
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:bg-white/15"
                    >
                      <FaGem className="w-4 h-4" />
                      <span>View Details</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Extended Description */}
              {highlight.description && highlight.description !== highlight.shortDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-white/3 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FaRocket className="w-5 h-5 mr-2 text-accent-blue" />
                    Project Overview
                  </h3>
                  <p className="text-white/85 leading-relaxed">
                    {highlight.description}
                  </p>
                </motion.div>
              )}

              {/* Tools & Technologies */}
              {highlight.tools && highlight.tools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white/3 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FaCode className="w-5 h-5 mr-2 text-accent-purple" />
                    Tools & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {highlight.tools.map((tool, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.3 + idx * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-white/8 backdrop-blur-sm text-white rounded-lg font-medium border border-white/15 hover:border-white/30 hover:bg-white/12 transition-all duration-300"
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Minimal Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Section
        id="portfolio-highlights"
        title="Portfolio Highlights"
        subtitle="Showcasing my most creative and impactful design projects"
        className="py-20"
      >
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-blue/30 border-t-accent-blue"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaPalette className="w-8 h-8 text-accent-blue animate-pulse" />
            </div>
          </div>
        </div>
      </Section>
    );
  }

  if (highlights.length === 0) {
    return (
      <Section
        id="portfolio-highlights"
        title="Portfolio Highlights"
        subtitle="Showcasing my most creative and impactful design projects"
        className="py-20"
      >
        <div className="text-center py-20">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center mb-6">
            <FaPalette className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Portfolio Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Exciting projects are in development. Check back soon!
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="portfolio-highlights"
      title="Portfolio Highlights"
      subtitle="Showcasing my most creative and impactful design projects"
      className="py-20"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-accent-purple/10 to-accent-green/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-accent-green/10 to-accent-blue/10 rounded-full blur-2xl"></div>
      </div>

      {/* Header Controls */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 space-y-6 lg:space-y-0">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>

        {/* View Mode Toggle */}
        {/* <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { mode: 'masonry', icon: FaDesktop, label: 'Masonry' },
            { mode: 'carousel', icon: FaTablet, label: 'Carousel' },
            { mode: 'grid', icon: FaMobile, label: 'Grid' }
          ].map(({ mode, icon: Icon, label }) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(mode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                viewMode === mode
                  ? 'bg-white dark:bg-gray-600 text-accent-blue shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </motion.button>
          ))}
        </div> */}
      </div>

      {/* Content */}
      <div className="relative z-10 mb-12">
        {viewMode === 'masonry' && <MasonryView />}
        {viewMode === 'carousel' && <CarouselView />}
        {viewMode === 'grid' && <GridView />}
      </div>

      {/* Creative Call-to-Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center mt-16"
      >
        <div className="bg-gradient-to-r from-accent-blue/10 via-accent-purple/10 to-accent-green/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4">
            <FaGem className="w-8 h-8 text-accent-blue mr-3" />
            <FaFire className="w-8 h-8 text-accent-purple mr-3" />
            <Fa500Px className="w-8 h-8 text-accent-green" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Crafting Digital Experiences
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Each project represents a unique journey of creativity, innovation, and technical excellence. 
            Explore my work and discover how I bring ideas to life through thoughtful design and development.
          </p>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedHighlight && (
          <DetailModal
            highlight={selectedHighlight}
            onClose={() => setSelectedHighlight(null)}
          />
        )}
      </AnimatePresence>
    </Section>
  );
};

export default PortfolioHighlights; 