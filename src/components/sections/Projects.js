import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Section from '../layout/Section';
import { getProjects } from '../../utils/api';

const categories = ['All', 'Web', 'UI', 'Fullstack', 'Research', 'Other'];

const ProjectCard = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative overflow-hidden rounded-xl bg-primary-dark/5 dark:bg-primary-light/5"
      >
        <div className="aspect-video overflow-hidden">
          <img
            src={project.imageUrl || '/project-placeholder.jpg'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-sm opacity-80 mb-4">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies?.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:text-accent-purple transition-colors"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:text-accent-purple transition-colors"
                >
                  <FaExternalLinkAlt className="w-5 h-5" />
                </a>
              )}
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-accent-blue hover:text-accent-purple transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-primary-light dark:bg-primary-dark rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{project.title}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-2xl hover:text-accent-blue transition-colors"
                >
                  ×
                </button>
              </div>
              
              <img
                src={project.imageUrl || '/project-placeholder.jpg'}
                alt={project.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="opacity-80">{project.description}</p>
                </div>
                
                {project.challenges && project.challenges.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Challenges</h3>
                    <ul className="opacity-80 space-y-1">
                      {project.challenges.map((challenge, index) => (
                        <li key={index}>• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.solutions && project.solutions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Solutions</h3>
                    <ul className="opacity-80 space-y-1">
                      {project.solutions.map((solution, index) => (
                        <li key={index}>• {solution}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      <FaGithub className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProjects();
        setProjects(response.data || []);
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch projects:', error);
        // Fallback to empty array on error
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <Section
      id="projects"
      title="Featured Projects"
      subtitle="A showcase of my recent work and experiments"
      className="py-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-accent-blue text-primary-light'
                  : 'bg-primary-dark/5 dark:bg-primary-light/5 hover:bg-accent-blue/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load projects: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Projects Message */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg opacity-80">
              {selectedCategory === 'All' 
                ? 'No projects found.' 
                : `No projects found in ${selectedCategory} category.`}
            </p>
          </div>
        )}
      </div>
    </Section>
  );
};

export default Projects; 