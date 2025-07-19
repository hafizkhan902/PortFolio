import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCog, FaCode, FaPaintBrush, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { 
  FaReact, FaNodeJs, FaGithub, FaJs, FaPython, FaJava, FaPhp, FaGitAlt, FaDocker, FaAws, FaCss3Alt, FaHtml5 
} from 'react-icons/fa';
import { 
  SiMongodb, SiExpress, SiTailwindcss, SiFigma, SiAdobeillustrator, SiAdobephotoshop, 
  SiSketch, SiCanva, SiMysql, SiPostgresql, SiRedis, SiNextdotjs, SiVuedotjs, 
  SiAngular, SiDjango, SiFlask, SiPostman, SiJira, SiSlack, SiNotion, SiTypescript
} from 'react-icons/si';
import { useNotification } from '../ui/Notification';
import authService from '../../utils/authService';

// Available icons with their library information
const availableIcons = {
  // FontAwesome Icons
  'FaReact': { library: 'react-icons/fa', component: FaReact, label: 'React', color: '#61DAFB' },
  'FaNodeJs': { library: 'react-icons/fa', component: FaNodeJs, label: 'Node.js', color: '#339933' },
  'FaJs': { library: 'react-icons/fa', component: FaJs, label: 'JavaScript', color: '#F7DF1E' },
  'FaPython': { library: 'react-icons/fa', component: FaPython, label: 'Python', color: '#3776AB' },
  'FaJava': { library: 'react-icons/fa', component: FaJava, label: 'Java', color: '#007396' },
  'FaPhp': { library: 'react-icons/fa', component: FaPhp, label: 'PHP', color: '#777BB4' },
  'FaGithub': { library: 'react-icons/fa', component: FaGithub, label: 'GitHub', color: '#181717' },
  'FaGitAlt': { library: 'react-icons/fa', component: FaGitAlt, label: 'Git', color: '#F05032' },
  'FaDocker': { library: 'react-icons/fa', component: FaDocker, label: 'Docker', color: '#2496ED' },
  'FaAws': { library: 'react-icons/fa', component: FaAws, label: 'AWS', color: '#FF9900' },
  'FaCss3Alt': { library: 'react-icons/fa', component: FaCss3Alt, label: 'CSS3', color: '#1572B6' },
  'FaHtml5': { library: 'react-icons/fa', component: FaHtml5, label: 'HTML5', color: '#E34F26' },
  
  // Simple Icons
  'SiMongodb': { library: 'react-icons/si', component: SiMongodb, label: 'MongoDB', color: '#47A248' },
  'SiExpress': { library: 'react-icons/si', component: SiExpress, label: 'Express.js', color: '#000000' },
  'SiTailwindcss': { library: 'react-icons/si', component: SiTailwindcss, label: 'Tailwind CSS', color: '#06B6D4' },
  'SiFigma': { library: 'react-icons/si', component: SiFigma, label: 'Figma', color: '#F24E1E' },
  'SiAdobeillustrator': { library: 'react-icons/si', component: SiAdobeillustrator, label: 'Adobe Illustrator', color: '#FF9A00' },
  'SiAdobephotoshop': { library: 'react-icons/si', component: SiAdobephotoshop, label: 'Adobe Photoshop', color: '#31A8FF' },
  'SiSketch': { library: 'react-icons/si', component: SiSketch, label: 'Sketch', color: '#F7B500' },
  'SiCanva': { library: 'react-icons/si', component: SiCanva, label: 'Canva', color: '#00C4CC' },
  'SiMysql': { library: 'react-icons/si', component: SiMysql, label: 'MySQL', color: '#4479A1' },
  'SiPostgresql': { library: 'react-icons/si', component: SiPostgresql, label: 'PostgreSQL', color: '#336791' },
  'SiRedis': { library: 'react-icons/si', component: SiRedis, label: 'Redis', color: '#DC382D' },
  'SiNextdotjs': { library: 'react-icons/si', component: SiNextdotjs, label: 'Next.js', color: '#000000' },
  'SiVuedotjs': { library: 'react-icons/si', component: SiVuedotjs, label: 'Vue.js', color: '#4FC08D' },
  'SiAngular': { library: 'react-icons/si', component: SiAngular, label: 'Angular', color: '#DD0031' },
  'SiDjango': { library: 'react-icons/si', component: SiDjango, label: 'Django', color: '#092E20' },
  'SiFlask': { library: 'react-icons/si', component: SiFlask, label: 'Flask', color: '#000000' },
  'SiPostman': { library: 'react-icons/si', component: SiPostman, label: 'Postman', color: '#FF6C37' },
  'SiJira': { library: 'react-icons/si', component: SiJira, label: 'Jira', color: '#0052CC' },
  'SiSlack': { library: 'react-icons/si', component: SiSlack, label: 'Slack', color: '#4A154B' },
  'SiNotion': { library: 'react-icons/si', component: SiNotion, label: 'Notion', color: '#000000' },
  'SiTypescript': { library: 'react-icons/si', component: SiTypescript, label: 'TypeScript', color: '#3178C6' },
  
  // Fallback
  'FaCog': { library: 'react-icons/fa', component: FaCog, label: 'General Tool', color: '#6B7280' }
};

const categories = [
  { id: 'frontend', label: 'Frontend Development', icon: FaCode },
  { id: 'backend', label: 'Backend Development', icon: FaCode },
  { id: 'uiux', label: 'UI/UX & Design', icon: FaPaintBrush },
  { id: 'tools', label: 'Tools & Others', icon: FaCog },
  { id: 'database', label: 'Database', icon: FaCog },
  { id: 'devops', label: 'DevOps', icon: FaCog },
  { id: 'languages', label: 'Programming Languages', icon: FaCode },
  { id: 'frameworks', label: 'Frameworks', icon: FaCode },
  { id: 'cloud', label: 'Cloud Services', icon: FaCog },
  { id: 'mobile', label: 'Mobile Development', icon: FaCode },
  { id: 'other', label: 'Other', icon: FaCog }
];

const proficiencyLevels = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'expert', label: 'Expert' }
];

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [formData, setFormData] = useState({
    // Required fields
    name: '',
    category: 'frontend',
    proficiency: 'intermediate',
    proficiencyLevel: 50,
    icon: {
      library: 'react-icons/fa',
      name: 'FaReact',
      size: 24,
      className: 'text-blue-500'
    },
    color: '#61DAFB',
    
    // Optional fields
    description: '',
    displayOrder: 0,
    isActive: true,
    yearsOfExperience: 1,
    projects: [],
    certifications: []
  });
  const [projectInput, setProjectInput] = useState('');
  const [certificationInput, setCertificationInput] = useState({
    name: '',
    issuer: '',
    date: '',
    url: ''
  });
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useNotification();

  // Function to auto-calculate proficiency based on percentage
  const calculateProficiency = (level) => {
    if (level >= 80) return 'expert';
    if (level >= 60) return 'advanced';
    if (level >= 40) return 'intermediate';
    return 'beginner';
  };

  // Function to get color class from hex color
  const getColorClass = (hexColor) => {
    const colorMap = {
      '#61DAFB': 'text-blue-500',
      '#339933': 'text-green-600',
      '#F7DF1E': 'text-yellow-500',
      '#3776AB': 'text-blue-600',
      '#007396': 'text-orange-600',
      '#777BB4': 'text-purple-500',
      '#181717': 'text-gray-800',
      '#F05032': 'text-red-500',
      '#2496ED': 'text-blue-500',
      '#FF9900': 'text-orange-500',
      '#1572B6': 'text-blue-600',
      '#E34F26': 'text-red-600',
      '#47A248': 'text-green-600',
      '#000000': 'text-gray-800',
      '#06B6D4': 'text-cyan-500',
      '#F24E1E': 'text-red-500',
      '#FF9A00': 'text-orange-500',
      '#31A8FF': 'text-blue-500',
      '#F7B500': 'text-yellow-500',
      '#00C4CC': 'text-cyan-500',
      '#4479A1': 'text-blue-600',
      '#336791': 'text-blue-700',
      '#DC382D': 'text-red-600',
      '#4FC08D': 'text-green-500',
      '#DD0031': 'text-red-600',
      '#092E20': 'text-green-800',
      '#FF6C37': 'text-orange-500',
      '#0052CC': 'text-blue-600',
      '#4A154B': 'text-purple-800',
      '#3178C6': 'text-blue-600'
    };
    return colorMap[hexColor] || 'text-gray-500';
  };

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching skills from admin API...');
      const response = await authService.getSkills();
      console.log('📊 Admin Skills API Response:', response);
      if (response.success) {
        setSkills(response.data || []);
      }
    } catch (error) {
      console.error('❌ Failed to fetch skills:', error);
      showError('Failed to fetch skills: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    
    // Handle different input types
    if (type === 'checkbox') {
      newValue = checked;
    } else if (name === 'proficiencyLevel' || name === 'displayOrder' || name === 'yearsOfExperience') {
      newValue = parseInt(value);
    }
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      
      // Auto-calculate proficiency when proficiencyLevel changes
      if (name === 'proficiencyLevel') {
        updated.proficiency = calculateProficiency(newValue);
      }
      
      // Auto-select color and update icon className when color changes
      if (name === 'color') {
        updated.icon = {
          ...updated.icon,
          className: getColorClass(newValue)
        };
      }
      
      return updated;
    });
  };

  // Handle icon selection
  const handleIconChange = (e) => {
    const iconName = e.target.value;
    const iconData = availableIcons[iconName];
    
    if (iconData) {
      setFormData(prev => ({
        ...prev,
        icon: {
          library: iconData.library,
          name: iconName,
          size: prev.icon.size,
          className: getColorClass(iconData.color)
        },
        color: iconData.color
      }));
    }
  };

  // Handle icon size change
  const handleIconSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      icon: {
        ...prev.icon,
        size: size
      }
    }));
  };

  // Handle adding projects
  const handleAddProject = () => {
    if (projectInput.trim() && !formData.projects.includes(projectInput.trim())) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, projectInput.trim()]
      }));
      setProjectInput('');
    }
  };

  // Handle removing projects
  const handleRemoveProject = (projectToRemove) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project !== projectToRemove)
    }));
  };

  // Handle certification input changes
  const handleCertificationInputChange = (e) => {
    const { name, value } = e.target;
    setCertificationInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding certifications
  const handleAddCertification = () => {
    if (certificationInput.name.trim() && certificationInput.issuer.trim()) {
      const newCertification = {
        name: certificationInput.name.trim(),
        issuer: certificationInput.issuer.trim(),
        date: certificationInput.date || new Date().toISOString().split('T')[0],
        url: certificationInput.url.trim()
      };
      
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification]
      }));
      
      setCertificationInput({
        name: '',
        issuer: '',
        date: '',
        url: ''
      });
    }
  };

  // Handle removing certifications
  const handleRemoveCertification = (certificationToRemove) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certificationToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('📤 Submitting skill data:', formData);
      console.log('📤 Icon object details:', {
        icon: formData.icon,
        iconName: formData.icon.name,
        iconLibrary: formData.icon.library,
        iconSize: formData.icon.size,
        iconClassName: formData.icon.className
      });
      console.log('📤 Complete icon object being sent:', JSON.stringify(formData.icon, null, 2));
      
      // Validate required fields
      if (!formData.name || !formData.category || !formData.proficiency || formData.proficiencyLevel === undefined) {
        throw new Error('Name, category, proficiency, and proficiency level are required');
      }

      // Validate icon object
      if (!formData.icon.name || !formData.icon.library) {
        throw new Error('Icon name and library are required');
      }
      
      // Validate that we have all required icon properties
      if (!formData.icon.className || !formData.icon.size) {
        console.warn('⚠️ Icon object missing some properties:', formData.icon);
      }
      
      let response;
      if (editingSkill) {
        console.log('🔄 Updating skill:', editingSkill.name, 'with icon:', formData.icon);
        response = await authService.updateSkill(editingSkill._id, formData);
      } else {
        console.log('➕ Creating new skill:', formData.name, 'with icon:', formData.icon);
        response = await authService.createSkill(formData);
      }

      console.log('📥 Submit response:', response);
      console.log('📥 Returned icon data:', response.data?.icon);

      if (response.success) {
        showSuccess(editingSkill ? 'Skill updated successfully' : 'Skill created successfully');
        fetchSkills();
        handleCancel();
      } else {
        showError(response.message || 'Failed to save skill');
      }
    } catch (error) {
      console.error('❌ Submit error:', error);
      showError('Failed to save skill: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setProjectInput('');
    setCertificationInput({
      name: '',
      issuer: '',
      date: '',
      url: ''
    });
    
    // Handle incomplete icon objects properly
    let iconObject = {
      library: 'react-icons/fa',
      name: 'FaReact',
      size: 24,
      className: 'text-blue-500'
    };
    
    if (skill.icon) {
      if (typeof skill.icon === 'object' && skill.icon.name && skill.icon.library) {
        // Complete icon object - use as is
        iconObject = {
          library: skill.icon.library,
          name: skill.icon.name,
          size: skill.icon.size || 24,
          className: skill.icon.className || 'text-blue-500'
        };
      } else if (typeof skill.icon === 'object' && skill.icon.size) {
        // Incomplete icon object (only has size) - use fallback with preserved size
        console.warn('⚠️ Incomplete icon object detected for skill:', skill.name, skill.icon);
        iconObject = {
          library: 'react-icons/fa',
          name: 'FaReact',
          size: skill.icon.size || 24,
          className: 'text-blue-500'
        };
      } else if (typeof skill.icon === 'string') {
        // Old SVG format - convert to React icon
        const legacyIconMapping = {
          'nodejs-icon.svg': { name: 'FaNodeJs', library: 'react-icons/fa', className: 'text-green-600' },
          'react-icon.svg': { name: 'FaReact', library: 'react-icons/fa', className: 'text-blue-500' },
          'mongodb-icon.svg': { name: 'SiMongodb', library: 'react-icons/si', className: 'text-green-600' },
          'express-icon.svg': { name: 'SiExpress', library: 'react-icons/si', className: 'text-gray-800' },
          'javascript-icon.svg': { name: 'FaJs', library: 'react-icons/fa', className: 'text-yellow-500' },
          'typescript-icon.svg': { name: 'SiTypescript', library: 'react-icons/si', className: 'text-blue-600' },
          'python-icon.svg': { name: 'FaPython', library: 'react-icons/fa', className: 'text-blue-600' },
          'java-icon.svg': { name: 'FaJava', library: 'react-icons/fa', className: 'text-orange-600' },
          'php-icon.svg': { name: 'FaPhp', library: 'react-icons/fa', className: 'text-purple-500' },
          'github-icon.svg': { name: 'FaGithub', library: 'react-icons/fa', className: 'text-gray-800' },
          'git-icon.svg': { name: 'FaGitAlt', library: 'react-icons/fa', className: 'text-red-500' },
          'docker-icon.svg': { name: 'FaDocker', library: 'react-icons/fa', className: 'text-blue-500' },
          'aws-icon.svg': { name: 'FaAws', library: 'react-icons/fa', className: 'text-orange-500' },
          'css3.svg': { name: 'FaCss3Alt', library: 'react-icons/fa', className: 'text-blue-600' },
          'html5-icon.svg': { name: 'FaHtml5', library: 'react-icons/fa', className: 'text-red-600' },
          'tailwind-icon.svg': { name: 'SiTailwindcss', library: 'react-icons/si', className: 'text-cyan-500' },
          'figma-icon.svg': { name: 'SiFigma', library: 'react-icons/si', className: 'text-red-500' },
          'illustrator-icon.svg': { name: 'SiAdobeillustrator', library: 'react-icons/si', className: 'text-orange-500' },
          'photoshop-icon.svg': { name: 'SiAdobephotoshop', library: 'react-icons/si', className: 'text-blue-500' },
          'sketch-icon.svg': { name: 'SiSketch', library: 'react-icons/si', className: 'text-yellow-500' },
          'canva-icon.svg': { name: 'SiCanva', library: 'react-icons/si', className: 'text-cyan-500' },
          'mysql-icon.svg': { name: 'SiMysql', library: 'react-icons/si', className: 'text-blue-600' },
          'postgresql-icon.svg': { name: 'SiPostgresql', library: 'react-icons/si', className: 'text-blue-700' },
          'redis-icon.svg': { name: 'SiRedis', library: 'react-icons/si', className: 'text-red-600' },
          'nextjs-icon.svg': { name: 'SiNextdotjs', library: 'react-icons/si', className: 'text-gray-800' },
          'vuejs-icon.svg': { name: 'SiVuedotjs', library: 'react-icons/si', className: 'text-green-500' },
          'angular-icon.svg': { name: 'SiAngular', library: 'react-icons/si', className: 'text-red-600' },
          'django-icon.svg': { name: 'SiDjango', library: 'react-icons/si', className: 'text-green-800' },
          'flask-icon.svg': { name: 'SiFlask', library: 'react-icons/si', className: 'text-gray-800' },
          'postman-icon.svg': { name: 'SiPostman', library: 'react-icons/si', className: 'text-orange-500' },
          'jira-icon.svg': { name: 'SiJira', library: 'react-icons/si', className: 'text-blue-600' },
          'slack-icon.svg': { name: 'SiSlack', library: 'react-icons/si', className: 'text-purple-800' },
          'notion-icon.svg': { name: 'SiNotion', library: 'react-icons/si', className: 'text-gray-800' }
        };
        
        const mappedIcon = legacyIconMapping[skill.icon];
        if (mappedIcon) {
          iconObject = {
            library: mappedIcon.library,
            name: mappedIcon.name,
            size: 24,
            className: mappedIcon.className
          };
        }
      }
    }
    
    setFormData({
      // Required fields
      name: skill.name || '',
      category: skill.category || 'frontend',
      proficiency: skill.proficiency || calculateProficiency(skill.proficiencyLevel || 50),
      proficiencyLevel: skill.proficiencyLevel || 50,
      icon: iconObject,
      color: skill.color || '#61DAFB',
      
      // Optional fields
      description: skill.description || '',
      displayOrder: skill.displayOrder || 0,
      isActive: skill.isActive !== undefined ? skill.isActive : true,
      yearsOfExperience: skill.yearsOfExperience || 1,
      projects: skill.projects || [],
      certifications: skill.certifications || []
    });
    setShowForm(true);
  };

  const handleDelete = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await authService.deleteSkill(skillId);
      if (response.success) {
        showSuccess('Skill deleted successfully');
        fetchSkills();
      } else {
        showError(response.message || 'Failed to delete skill');
      }
    } catch (error) {
      showError('Failed to delete skill: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
    setShowOptionalFields(false);
    setProjectInput('');
    setCertificationInput({
      name: '',
      issuer: '',
      date: '',
      url: ''
    });
    setFormData({
      // Required fields
      name: '',
      category: 'frontend',
      proficiency: 'intermediate',
      proficiencyLevel: 50,
      icon: {
        library: 'react-icons/fa',
        name: 'FaReact',
        size: 24,
        className: 'text-blue-500'
      },
      color: '#61DAFB',
      
      // Optional fields
      description: '',
      displayOrder: 0,
      isActive: true,
      yearsOfExperience: 1,
      projects: [],
      certifications: []
    });
  };

  const handleAddNew = () => {
    setEditingSkill(null);
    setShowOptionalFields(false);
    setProjectInput('');
    setCertificationInput({
      name: '',
      issuer: '',
      date: '',
      url: ''
    });
    setFormData({
      // Required fields
      name: '',
      category: 'frontend',
      proficiency: 'intermediate',
      proficiencyLevel: 50,
      icon: {
        library: 'react-icons/fa',
        name: 'FaReact',
        size: 24,
        className: 'text-blue-500'
      },
      color: '#61DAFB',
      
      // Optional fields
      description: '',
      displayOrder: skills.length,
      isActive: true,
      yearsOfExperience: 1,
      projects: [],
      certifications: []
    });
    setShowForm(true);
  };

  const getSkillsByCategory = (categoryId) => {
    return skills.filter(skill => skill.category === categoryId)
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  };

  // Render skill icon
  const renderSkillIcon = (skill) => {
    if (skill.icon && skill.icon.name && availableIcons[skill.icon.name]) {
      const IconComponent = availableIcons[skill.icon.name].component;
      return <IconComponent className={skill.icon.className || 'text-accent-blue'} />;
    }
    return <FaCog className="text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Skills Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your technical skills and expertise levels</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-accent-purple transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills by Category */}
      <div className="space-y-8">
        {categories.map(category => {
          const categorySkills = getSkillsByCategory(category.id);
          
          return (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <category.icon className="w-6 h-6 text-accent-blue" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{category.label}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {categorySkills.length} skills
                </span>
              </div>
              
              {categorySkills.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No skills in this category yet
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-w-0"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-2xl" style={{ fontSize: skill.icon?.size || 24 }}>
                          {renderSkillIcon(skill)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{skill.name}</h4>
                          {skill.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {skill.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {skill.proficiency ? skill.proficiency.charAt(0).toUpperCase() + skill.proficiency.slice(1) : 'Proficiency'}
                                </span>
                                <span className="text-sm font-medium text-accent-blue">{skill.proficiencyLevel}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div 
                                  className="h-full transition-all duration-300"
                                  style={{ 
                                    width: `${skill.proficiencyLevel}%`,
                                    backgroundColor: skill.color || '#3B82F6'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Order: {skill.displayOrder || 0}</span>
                            {skill.yearsOfExperience && (
                              <span>Experience: {skill.yearsOfExperience} years</span>
                            )}
                            {skill.projects && skill.projects.length > 0 && (
                              <span>Projects: {skill.projects.length}</span>
                            )}
                            {skill.certifications && skill.certifications.length > 0 && (
                              <span>Certifications: {skill.certifications.length}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-xs sm:max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Required Fields Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Required Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Skill Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        maxLength={100}
                        placeholder="e.g., React.js, Figma, MongoDB"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Proficiency *</label>
                      <select
                        name="proficiency"
                        value={formData.proficiency}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      >
                        {proficiencyLevels.map(level => (
                          <option key={level.id} value={level.id}>{level.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Proficiency Level * (1-100)</label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          name="proficiencyLevel"
                          value={formData.proficiencyLevel}
                          onChange={handleInputChange}
                          min="1"
                          max="100"
                          required
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>1</span>
                          <div className="text-center">
                            <span className="font-medium text-accent-blue">{formData.proficiencyLevel}</span>
                            <div className="text-xs text-gray-400 mt-1">
                              Auto-suggests: <span className="capitalize font-medium">{calculateProficiency(formData.proficiencyLevel)}</span>
                            </div>
                          </div>
                          <span>100</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Icon *</label>
                      <div className="space-y-3">
                        <select
                          value={formData.icon.name}
                          onChange={handleIconChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        >
                          {Object.entries(availableIcons).map(([iconName, iconData]) => (
                            <option key={iconName} value={iconName}>{iconData.label}</option>
                          ))}
                        </select>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Icon Size</label>
                            <input
                              type="number"
                              value={formData.icon.size}
                              onChange={handleIconSizeChange}
                              min="12"
                              max="48"
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-accent-blue"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Library</label>
                            <input
                              type="text"
                              value={formData.icon.library}
                              readOnly
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-600 text-gray-500"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Preview:</span>
                          <div style={{ fontSize: formData.icon.size }}>
                            {(() => {
                              const iconData = availableIcons[formData.icon.name];
                              if (iconData) {
                                const IconComponent = iconData.component;
                                return <IconComponent className={formData.icon.className} />;
                              }
                              return <FaCog className="text-gray-500" />;
                            })()}
                          </div>
                          <div className="text-sm">
                            <div className="font-medium text-gray-700 dark:text-gray-300">
                              {availableIcons[formData.icon.name]?.label || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formData.icon.name} • {formData.icon.size}px • {formData.icon.className}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Color *</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          name="color"
                          value={formData.color}
                          onChange={handleInputChange}
                          className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          name="color"
                          value={formData.color}
                          onChange={handleInputChange}
                          required
                          pattern="^#[0-9A-Fa-f]{6}$"
                          placeholder="#61DAFB"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-updates icon className: {formData.icon.className}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional Fields Toggle */}
                <div className="border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Optional Fields
                    </span>
                    {showOptionalFields ? (
                      <FaChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Optional Fields Section */}
                {showOptionalFields && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        maxLength={500}
                        rows="3"
                        placeholder="Brief description of your experience with this skill..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Years of Experience (0-50)</label>
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={handleInputChange}
                          min="0"
                          max="50"
                          placeholder="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Display Order</label>
                        <input
                          type="number"
                          name="displayOrder"
                          value={formData.displayOrder}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-accent-blue bg-gray-100 border-gray-300 rounded focus:ring-accent-blue"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Active (visible on website)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Projects</label>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={projectInput}
                            onChange={(e) => setProjectInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProject())}
                            maxLength={200}
                            placeholder="Add project name..."
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                          />
                          <button
                            type="button"
                            onClick={handleAddProject}
                            className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        {formData.projects.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.projects.map((project, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {project}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProject(project)}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Certifications</label>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="name"
                            value={certificationInput.name}
                            onChange={handleCertificationInputChange}
                            maxLength={200}
                            placeholder="Certification name *"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                          />
                          <input
                            type="text"
                            name="issuer"
                            value={certificationInput.issuer}
                            onChange={handleCertificationInputChange}
                            maxLength={100}
                            placeholder="Issuer *"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            name="date"
                            value={certificationInput.date}
                            onChange={handleCertificationInputChange}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                          />
                          <input
                            type="url"
                            name="url"
                            value={certificationInput.url}
                            onChange={handleCertificationInputChange}
                            maxLength={500}
                            placeholder="Certificate URL"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCertification}
                          className="w-full px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-purple transition-colors"
                        >
                          Add Certification
                        </button>
                        
                        {formData.certifications.length > 0 && (
                          <div className="space-y-2">
                            {formData.certifications.map((cert, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-green-800 dark:text-green-200">
                                    {cert.name}
                                  </div>
                                  <div className="text-sm text-green-600 dark:text-green-400">
                                    {cert.issuer} {cert.date && `• ${new Date(cert.date).toLocaleDateString()}`}
                                  </div>
                                  {cert.url && (
                                    <div className="text-xs text-green-500 truncate">
                                      {cert.url}
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCertification(cert)}
                                  className="ml-2 text-green-600 hover:text-green-800"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      saving
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-accent-blue hover:bg-accent-purple text-white'
                    }`}
                  >
                    <FaSave className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Skill'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SkillsManager; 