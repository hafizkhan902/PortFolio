import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Section from '../layout/Section';

const passionStatements = [
  'I love researching AI and its potential to transform lives...',
  'I build things from scratch because creation is my passion...',
  'I get excited by new ideas and innovative solutions...',
  'I believe in the power of technology to make a difference...',
  'I enjoy solving complex problems with elegant solutions...',
];

const Terminal = () => {
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect
  const typeText = useCallback(() => {
    const statement = passionStatements[currentIndex];
    if (currentText.length < statement.length) {
      setCurrentText(statement.slice(0, currentText.length + 1));
    } else {
      setIsTyping(false);
      setTimeout(() => {
        setIsTyping(true);
        setCurrentText('');
        setCurrentIndex((prev) => (prev + 1) % passionStatements.length);
      }, 2000);
    }
  }, [currentText, currentIndex]);

  useEffect(() => {
    if (isTyping) {
      const typingTimeout = setTimeout(typeText, 50);
      return () => clearTimeout(typingTimeout);
    }
  }, [isTyping, typeText]);

  const handleRunMore = () => {
    setIsTyping(true);
    setCurrentText('');
    setCurrentIndex((prev) => (prev + 1) % passionStatements.length);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary-dark/90 dark:bg-primary-light/10 rounded-lg overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-2 bg-primary-dark dark:bg-primary-light/20">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-4 text-sm text-text-dark dark:text-text-light opacity-75">
            passion.sh
          </span>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm md:text-base">
          <div className="flex items-center text-accent-green mb-4">
            <span className="mr-2">$</span>
            <span className="mr-2">echo</span>
            <span className="text-text-dark dark:text-text-light">
              {currentText}
              <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>
                ▋
              </span>
            </span>
          </div>

          <button
            onClick={handleRunMore}
            className="flex items-center text-accent-blue hover:text-accent-purple transition-colors"
          >
            <span className="mr-2">$</span>
            run more.sh
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Passion = () => {
  return (
    <Section
      id="passion"
      title="Passion Terminal"
      subtitle="A glimpse into what drives me"
      className="py-20"
    >
      <Terminal />
    </Section>
  );
};

export default Passion; 