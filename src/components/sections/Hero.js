import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const roles = ['Student', 'Engineer', 'Researcher', 'Builder'];

const Hero = () => {
  const roleRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;
    let element = roleRef.current;
    
    const animateText = () => {
      gsap.to(element, {
        duration: 1,
        text: roles[currentIndex],
        ease: "none",
        onComplete: () => {
          setTimeout(() => {
            currentIndex = (currentIndex + 1) % roles.length;
            if (element) {
              animateText();
            }
          }, 2000);
        }
      });
    };

    animateText();

    return () => {
      gsap.killTweensOf(element);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 via-accent-blue/5 to-accent-purple/5 dark:from-primary-dark/5 dark:via-accent-blue/5 dark:to-accent-purple/5" />
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent-blue/10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-lg md:text-xl font-medium text-accent-blue mb-4">
            Hello, I'm
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hafiz Al Asad
          </h1>
          <div className="text-2xl md:text-3xl font-space mb-8 h-12">
            I am a <span ref={roleRef} className="text-accent-blue"></span>
          </div>
          <p className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto">
            Where Logic Meets Aesthetics
          </p>
          <div className="flex items-center justify-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline"
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            >
              Let's Collaborate
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-accent-blue rounded-full p-1">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-2 h-2 bg-accent-blue rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero; 