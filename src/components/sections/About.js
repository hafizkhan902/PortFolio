import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import authService from '../../utils/authService';

const TimelineItem = ({ item }) => {
  return (
    <div className="relative grid grid-cols-[1fr,80px] md:grid-cols-[1fr,120px] gap-16 mb-10">
      {/* Content */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="pr-4"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-2 text-accent-blue">
            {item.title}
          </h3>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            {item.description}
          </p>
        </motion.div>
        
        {/* Timeline Dot */}
        <div className="absolute right-0 top-[30px] transform translate-x-[41px] md:translate-x-[61px]">
          <div className="relative">
            <div className="w-4 h-4 rounded-full border-2 border-accent-blue bg-white dark:bg-primary-dark"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-blue"></div>
          </div>
        </div>
      </div>

      {/* Year */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-start justify-start pt-[22px]"
      >
        <span className="inline-block bg-accent-blue/10 text-accent-blue font-medium px-4 py-1 rounded-full">
          {item.year}
        </span>
      </motion.div>
    </div>
  );
};

const About = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching timeline data from API...');
      const response = await authService.getPublicJourneyMilestones();
      console.log('📊 API Response:', response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Sort by displayOrder, then by year
        const sortedData = response.data
          .map(item => ({
            _id: item._id,
            year: item.year.toString(), // Convert number to string
            title: item.title,
            description: item.description,
            order: item.displayOrder || 0 // Map displayOrder to order
          }))
          .sort((a, b) => {
            if (a.order !== b.order) {
              return (a.order || 0) - (b.order || 0);
            }
            return a.year.localeCompare(b.year);
          });
        
        console.log('✅ Timeline data loaded from API:', sortedData);
        setTimelineData(sortedData);
        setError(null);
      } else {
        console.log('⚠️ API response invalid, using fallback data');
        // Fallback to default data if API fails
        setTimelineData([
          {
            year: '2021',
            title: 'Joined DIU',
            description: '.',
          },
          {
            year: '2022',
            title: 'Started building Opdrape',
            description: 'Began working on my first major project, exploring the intersection of technology and fashion.',
          },
          {
            year: '2023',
            title: 'Discovered passion for UI/UX',
            description: 'Fell in love with creating beautiful, intuitive user interfaces and experiences.',
          },
          {
            year: '2025',
            title: 'Dived into research',
            description: 'Started exploring advanced topics in software engineering and contributing to research projects.',
          },
        ]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch timeline data:', error);
      setError(error.message);
      // Fallback to default data
      setTimelineData([
        {
          year: '2021',
          title: 'Joined DIU',
          description: 'Started my journey in Software Engineering at Daffodil International University.',
        },
        {
          year: '2022',
          title: 'Started building Opdrape',
          description: 'Began working on my first major project, exploring the intersection of technology and fashion.',
        },
        {
          year: '2023',
          title: 'Discovered passion for UI/UX',
          description: 'Fell in love with creating beautiful, intuitive user interfaces and experiences.',
        },
        {
          year: '2025',
          title: 'Dived into research',
          description: 'Started exploring advanced topics in software engineering and contributing to research projects.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Section
        id="about"
        title="About Me"
        subtitle="My journey through technology and creativity"
        className="py-20"
      >
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="about"
      title="About Me"
      subtitle="My journey through technology and creativity"
      className="py-20"
    >
      <div className="max-w-3xl mx-auto px-4 relative">
        {/* Vertical Line */}
        <div className="absolute right-[84px] md:right-[124px] top-0 bottom-0 w-px bg-accent-blue/20"></div>
        
        {/* Timeline Items */}
        <div className="relative pt-16 space-y-8">
          {timelineData.length > 0 ? (
            timelineData.map((item, index) => (
              <TimelineItem key={item._id || index} item={item} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No milestones to display</p>
            </div>
          )}
        </div>

        {error && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Using default timeline data
            </p>
          </div>
        )}
      </div>
    </Section>
  );
};

export default About; 