import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaBehance, FaPalette, FaLeaf, FaRocket, FaCode, FaTimes } from 'react-icons/fa';
import { HiDocumentDownload } from 'react-icons/hi';
import { BsFillChatDotsFill } from 'react-icons/bs';
import Section from '../layout/Section';
import { submitContactForm } from '../../utils/api';
import { useNotification } from '../ui/Notification';
import authService from '../../utils/authService';

const socialLinks = [
  {
    name: 'GitHub',
    icon: FaGithub,
    url: 'https://github.com/yourusername',
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    url: 'https://linkedin.com/in/yourusername',
  },
  {
    name: 'Behance',
    icon: FaBehance,
    url: 'https://behance.net/yourusername',
  },
];

// Theme configurations
const themes = {
  default: {
    name: 'Default',
    icon: FaPalette,
    colors: {
      primary: 'from-accent-blue to-accent-purple',
      secondary: 'from-blue-500 to-purple-600',
      accent: 'text-accent-blue',
      bg: 'bg-white dark:bg-gray-800',
      border: 'border-gray-200 dark:border-gray-700',
    }
  },
  cyberpunk: {
    name: 'Cyberpunk',
    icon: FaCode,
    colors: {
      primary: 'from-cyan-400 to-pink-500',
      secondary: 'from-purple-500 to-cyan-500',
      accent: 'text-cyan-400',
      bg: 'bg-gray-900',
      border: 'border-cyan-500/30',
    }
  },
  nature: {
    name: 'Nature',
    icon: FaLeaf,
    colors: {
      primary: 'from-green-400 to-emerald-600',
      secondary: 'from-emerald-500 to-teal-600',
      accent: 'text-green-500',
      bg: 'bg-green-50 dark:bg-gray-800',
      border: 'border-green-200 dark:border-green-700',
    }
  }
};

// Floating elements data
const floatingElements = [
  { type: 'bubble', size: 60, delay: 0, duration: 6 },
  { type: 'hexagon', size: 40, delay: 1, duration: 8 },
  { type: 'bracket', size: 50, delay: 2, duration: 7 },
  { type: 'bubble', size: 30, delay: 3, duration: 5 },
  { type: 'hexagon', size: 70, delay: 4, duration: 9 },
  { type: 'bracket', size: 45, delay: 5, duration: 6 },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const containerRef = useRef(null);
  const { showError } = useNotification();

  // Mouse tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    fetchResume();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const fetchResume = async () => {
    try {
      setResumeLoading(true);
      const response = await authService.getActiveResume();
      if (response.success && response.data) {
        setResume(response.data);
      }
    } catch (error) {
      console.log('No active resume available or error fetching resume:', error.message);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setChatMode(true);

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: formData.message,
      timestamp: new Date(),
    };
    setChatMessages([userMessage]);

    // Simulate typing animation
    setTimeout(async () => {
      try {
        await submitContactForm(formData);
        
        // Add success message to chat
        const successMessage = {
          id: Date.now() + 1,
          type: 'system',
          content: "Message sent successfully! I'll get back to you soon. 🚀",
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, successMessage]);
        
        // Reset form after delay
        setTimeout(() => {
          setFormData({ name: '', email: '', subject: '', message: '' });
          setChatMode(false);
          setChatMessages([]);
          setIsSubmitting(false);
        }, 3000);
        
      } catch (error) {
        // Add error message to chat
        const errorMessage = {
          id: Date.now() + 1,
          type: 'system',
          content: `Failed to send message: ${error.message}`,
          timestamp: new Date(),
          isError: true,
        };
        setChatMessages(prev => [...prev, errorMessage]);
        
        setTimeout(() => {
          setChatMode(false);
          setChatMessages([]);
          setIsSubmitting(false);
        }, 3000);
      }
    }, 2000);
  };

  const FloatingElement = ({ element, index }) => {
    const theme = themes[currentTheme];
    const x = useTransform(mouseX, [0, 800], [-20, 20]);
    const y = useTransform(mouseY, [0, 600], [-20, 20]);

    const renderElement = () => {
      switch (element.type) {
        case 'bubble':
          return (
            <motion.div
              className={`absolute rounded-full opacity-20 ${theme.colors.accent}`}
              style={{
                width: element.size,
                height: element.size,
                x,
                y,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                delay: element.delay,
                ease: "easeInOut",
              }}
            />
          );
        case 'hexagon':
          return (
            <motion.div
              className={`absolute opacity-10 ${theme.colors.accent}`}
              style={{
                width: element.size,
                height: element.size,
                x,
                y,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                delay: element.delay,
                ease: "linear",
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50,10 90,30 90,70 50,90 10,70 10,30"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </motion.div>
          );
        case 'bracket':
          return (
            <motion.div
              className={`absolute opacity-15 ${theme.colors.accent} font-mono text-2xl font-bold`}
              style={{
                x,
                y,
              }}
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                delay: element.delay,
                ease: "easeInOut",
              }}
            >
              {'{'}
            </motion.div>
          );
        default:
          return null;
      }
    };

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${20 + (index * 15)}%`,
          top: `${30 + (index * 10)}%`,
        }}
      >
        {renderElement()}
      </div>
    );
  };

  const ChatMessage = ({ message }) => {
    const isUser = message.type === 'user';
    const theme = themes[currentTheme];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
            isUser
              ? `bg-gradient-to-r ${theme.colors.primary} text-white`
              : message.isError
              ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <p className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </motion.div>
    );
  };

  const theme = themes[currentTheme];

  return (
    <Section
      id="contact"
      title="Get In Touch"
      subtitle="Let's discuss your next project or just say hello!"
      className="py-20 relative overflow-hidden"
    >
      {/* Floating Elements */}
      <div ref={containerRef} className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element, index) => (
          <FloatingElement key={index} element={element} index={index} />
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-8 right-8 z-10">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className={`p-3 rounded-full bg-gradient-to-r ${theme.colors.primary} text-white shadow-lg`}
          >
            <theme.icon className="w-5 h-5" />
          </motion.button>

          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[200px]"
              >
                {Object.entries(themes).map(([key, themeConfig]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentTheme(key);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      currentTheme === key ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    <themeConfig.icon className="w-4 h-4" />
                    <span className="text-sm">{themeConfig.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 relative z-10">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">Send a Message</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              I'm always interested in new opportunities and collaborations.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!chatMode ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg ${theme.colors.bg} focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200 ${theme.colors.border}`}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg ${theme.colors.bg} focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200 ${theme.colors.border}`}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg ${theme.colors.bg} focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200 ${theme.colors.border}`}
                    placeholder="Project inquiry, collaboration, etc."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className={`w-full px-4 py-3 border rounded-lg ${theme.colors.bg} focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200 resize-none ${theme.colors.border}`}
                    placeholder="Tell me about your project or what you'd like to discuss..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r ${theme.colors.primary} text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                >
                  <BsFillChatDotsFill className="w-5 h-5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-96 flex flex-col"
              >
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.colors.primary}`} />
                    <h4 className="font-semibold">Chat with Hafiz</h4>
                  </div>
                  <button
                    onClick={() => {
                      setChatMode(false);
                      setChatMessages([]);
                      setIsSubmitting(false);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {isSubmitting && chatMessages.length === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-xs">
                        <div className="flex items-center space-x-2">
                          <FaRocket className="w-4 h-4 text-accent-blue animate-bounce" />
                          <span className="text-sm">Sending to Hafiz 🚀...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {chatMessages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">Connect With Me</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-full bg-gradient-to-r ${theme.colors.primary} text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  <link.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Resume</h3>
            {resumeLoading ? (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-blue"></div>
                <span>Loading resume...</span>
              </div>
            ) : resume ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  try {
                    await authService.downloadResume(resume._id, resume.originalName);
                  } catch (error) {
                    showError('Failed to download resume: ' + error.message);
                  }
                }}
                className={`inline-flex items-center space-x-2 px-4 py-2 border rounded-lg hover:shadow-lg transition-all duration-200 ${theme.colors.border} ${theme.colors.bg}`}
              >
                <HiDocumentDownload className="w-5 h-5" />
                <span>Download CV</span>
              </motion.button>
            ) : (
              <div className="text-gray-500 italic">
                Resume not available
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Let's Build Something Amazing</h3>
            <p className="text-lg leading-relaxed">
              Whether you have a project in mind or just want to chat about technology and design,
              I'm always excited to connect with fellow creators and innovators.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Contact; 