import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaPaintBrush, FaTools } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as DiIcons from 'react-icons/di';
import * as FiIcons from 'react-icons/fi';
import * as GiIcons from 'react-icons/gi';
import * as GoIcons from 'react-icons/go';
import * as GrIcons from 'react-icons/gr';
import * as HiIcons from 'react-icons/hi';
import * as ImIcons from 'react-icons/im';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import * as TbIcons from 'react-icons/tb';
import * as TiIcons from 'react-icons/ti';
import * as VscIcons from 'react-icons/vsc';
import Section from '../layout/Section';
import authService from '../../utils/authService';

// Icon library mapping
const iconLibraries = {
  'react-icons/fa': FaIcons,
  'react-icons/si': SiIcons,
  'react-icons/ai': AiIcons,
  'react-icons/bi': BiIcons,
  'react-icons/bs': BsIcons,
  'react-icons/di': DiIcons,
  'react-icons/fi': FiIcons,
  'react-icons/gi': GiIcons,
  'react-icons/go': GoIcons,
  'react-icons/gr': GrIcons,
  'react-icons/hi': HiIcons,
  'react-icons/im': ImIcons,
  'react-icons/io': IoIcons,
  'react-icons/md': MdIcons,
  'react-icons/ri': RiIcons,
  'react-icons/tb': TbIcons,
  'react-icons/ti': TiIcons,
  'react-icons/vsc': VscIcons,
};

// Function to get icon component from library and name
const getIconComponent = (iconData) => {
  if (!iconData || !iconData.library || !iconData.name) {
    return null;
  }
  
  const library = iconLibraries[iconData.library];
  if (!library) {
    return null;
  }
  
  return library[iconData.name];
};

const Skills = () => {
  const [skillsData, setSkillsData] = useState({
    programming: [],
    design: [],
    tools: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const fetchSkillsData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching skills data from API...');
      const response = await authService.getPublicSkills();
      console.log('📊 Skills API Response:', response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Map backend categories to frontend categories
        const categoryMap = {
          'frontend': 'programming',
          'backend': 'programming',
          'fullstack': 'programming',
          'programming': 'programming',
          'languages': 'programming',
          'frameworks': 'programming',
          'mobile': 'programming',
          'uiux': 'design',
          'design': 'design',
          'ui': 'design',
          'ux': 'design',
          'tools': 'tools',
          'database': 'tools',
          'devops': 'tools',
          'cloud': 'tools',
          'other': 'tools'
        };

        // Group skills by category and sort by displayOrder
        const groupedSkills = {
          programming: [],
          design: [],
          tools: []
        };

        response.data.forEach(skill => {
          const category = categoryMap[skill.category] || 'tools';
          groupedSkills[category].push(skill);
        });

        // Sort each category by displayOrder
        Object.keys(groupedSkills).forEach(category => {
          groupedSkills[category].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        });

        console.log('✅ Skills data processed:', groupedSkills);
        setSkillsData(groupedSkills);
      } else {
        console.log('⚠️ Skills API response invalid, using empty data');
        setSkillsData({
          programming: [],
          design: [],
          tools: []
        });
      }
    } catch (error) {
      console.error('❌ Failed to fetch skills:', error);
      setError(error.message);
      setSkillsData({
        programming: [],
        design: [],
        tools: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Section
        id="skills"
        title="Skills & Expertise"
        subtitle="My technical toolkit and proficiencies"
        className="py-20"
      >
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
        </div>
      </Section>
    );
  }

  const skillCategories = [
    {
      title: 'Programming',
      icon: FaCode,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      skills: skillsData.programming
    },
    {
      title: 'Design',
      icon: FaPaintBrush,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      skills: skillsData.design
    },
    {
      title: 'Tools',
      icon: FaTools,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      skills: skillsData.tools
    }
  ];

  return (
    <Section
      id="skills"
      title="Skills & Expertise"
      subtitle="My technical toolkit and proficiencies"
      className="py-20"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {skillCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${category.bgColor} rounded-xl p-6 hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="flex items-center mb-6">
                <Icon className={`w-8 h-8 ${category.color} mr-3`} />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {category.title}
                </h3>
              </div>
              
              {category.skills.length > 0 ? (
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => {
                    const IconComponent = getIconComponent(skill.icon);
                    
                    return (
                      <motion.div
                        key={skill._id || skillIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + (skillIndex * 0.05) }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 min-w-0"
                      >
                        <div className="flex items-center flex-1">
                          <div className="w-10 h-10 flex items-center justify-center mr-4">
                            {IconComponent ? (
                              <IconComponent 
                                className={`w-6 h-6 ${skill.icon?.className || 'text-gray-600'}`}
                                style={{ color: skill.color }}
                              />
                            ) : (
                              <div 
                                className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: skill.color }}
                              >
                                <span className="text-white font-semibold text-sm">
                                  {skill.name ? skill.name.charAt(0).toUpperCase() : '?'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {skill.name || 'Unknown Skill'}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {skill.proficiencyLevel || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <motion.div 
                                className="h-2 rounded-full transition-all duration-1000"
                                style={{ 
                                  width: `${skill.proficiencyLevel || 0}%`,
                                  background: skill.color ? `linear-gradient(90deg, ${skill.color}, ${skill.color}80)` : 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                                }}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiencyLevel || 0}%` }}
                                viewport={{ once: true }}
                                transition={{ delay: (index * 0.1) + (skillIndex * 0.05) + 0.3, duration: 0.8 }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No {category.title.toLowerCase()} skills added yet
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {error && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {error}
          </p>
        </div>
      )}
    </Section>
  );
};

export default Skills; 