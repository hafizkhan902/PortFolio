import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaBehance } from 'react-icons/fa';
import { HiDocumentDownload } from 'react-icons/hi';
import Section from '../layout/Section';
import { submitContactForm } from '../../utils/api';
import { useNotification } from '../ui/Notification';

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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification();

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
    
    try {
      await submitContactForm(formData);
      showSuccess('Message sent successfully! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      showError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section
      id="contact"
      title="Let's Connect"
      subtitle="Have a project in mind? Let's bring it to life"
      className="py-20"
    >
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-primary-dark/5 dark:bg-primary-light/5 p-8 rounded-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark border border-primary-dark/10 dark:border-primary-light/10 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark border border-primary-dark/10 dark:border-primary-light/10 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark border border-primary-dark/10 dark:border-primary-light/10 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark border border-primary-dark/10 dark:border-primary-light/10 focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>

        {/* Social Links & Info */}
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
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-primary-dark/5 dark:bg-primary-light/5 text-accent-blue hover:text-accent-purple transition-colors"
                >
                  <link.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Resume</h3>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 btn-outline"
            >
              <HiDocumentDownload className="w-5 h-5" />
              <span>Download CV</span>
            </a>
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