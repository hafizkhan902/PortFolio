import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaStar, FaRegStar, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectList = ({ projects, loading, onEdit, onDelete, onToggleFeatured }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No projects found.</p>
        <p className="text-gray-400 text-sm mt-2">Click "Add Project" to create your first project.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.category === 'Web' ? 'bg-blue-100 text-blue-800' :
                  project.category === 'UI' ? 'bg-green-100 text-green-800' :
                  project.category === 'Fullstack' ? 'bg-purple-100 text-purple-800' :
                  project.category === 'Research' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.category}
                </span>
                <button
                  onClick={() => onToggleFeatured(project._id, project.featured)}
                  className={`p-1 rounded ${
                    project.featured 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                  title={project.featured ? 'Remove from featured' : 'Add to featured'}
                >
                  {project.featured ? <FaStar /> : <FaRegStar />}
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies?.slice(0, 5).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-accent-blue/20 text-accent-blue rounded-full"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies?.length > 5 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{project.technologies.length - 5} more
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-accent-blue"
                  >
                    <FaGithub />
                    <span>GitHub</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-accent-blue"
                  >
                    <FaExternalLinkAlt />
                    <span>Live Demo</span>
                  </a>
                )}
                <span>
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2 ml-4">
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-24 h-16 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onEdit(project)}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FaEdit />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectList; 