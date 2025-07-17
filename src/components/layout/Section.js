import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Section = ({ id, title, subtitle, children, className = '' }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const variants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section
      id={id}
      className={`section ${className}`}
      ref={ref}
    >
      <div className="container">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={variants}
          className="text-center mb-12"
        >
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={variants}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default Section; 