import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt } from 'react-icons/fa';
import Section from '../layout/Section';
import useGithubActivity from '../../hooks/useGithubActivity';
import useGithubRepos from '../../hooks/useGithubRepos';

const GitHubActivity = () => {
  const { activity, loading, error } = useGithubActivity();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-sm">Failed to load GitHub activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activity.slice(0, 10).map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-primary-dark/5 dark:bg-primary-light/5 p-4 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-accent-green rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{event.type}</span> in{' '}
                  <span className="text-accent-blue">{event.repo}</span>
                </p>
                {event.commits && event.commits.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {event.commits.slice(0, 3).map((commit, idx) => (
                      <p key={idx} className="text-xs opacity-80">
                        • {commit.message}
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-xs opacity-60 mt-1">
                  {new Date(event.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const GitHubRepos = () => {
  const { repos, loading, error } = useGithubRepos();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-sm">Failed to load GitHub repositories</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Popular Repositories</h3>
      <div className="grid gap-4">
        {repos.slice(0, 6).map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-primary-dark/5 dark:bg-primary-light/5 p-4 rounded-lg hover:bg-primary-dark/10 dark:hover:bg-primary-light/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-accent-blue hover:text-accent-purple transition-colors">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <span>{repo.name}</span>
                    <FaExternalLinkAlt className="w-3 h-3" />
                  </a>
                </h4>
                <p className="text-sm opacity-80 mt-1 line-clamp-2">
                  {repo.description || 'No description available'}
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs opacity-60">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                    <span>{repo.language}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaStar className="w-3 h-3" />
                    <span>{repo.stars}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaCodeBranch className="w-3 h-3" />
                    <span>{repo.forks}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const GitHub = () => {
  const [activeTab, setActiveTab] = useState('activity');

  return (
    <Section
      id="github"
      title="GitHub Activity"
      subtitle="My latest contributions and repositories"
      className="py-20"
    >
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-primary-dark/5 dark:bg-primary-light/5 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'activity'
                  ? 'bg-accent-blue text-primary-light'
                  : 'hover:bg-primary-dark/10 dark:hover:bg-primary-light/10'
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab('repos')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'repos'
                  ? 'bg-accent-blue text-primary-light'
                  : 'hover:bg-primary-dark/10 dark:hover:bg-primary-light/10'
              }`}
            >
              Repositories
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'activity' ? <GitHubActivity /> : <GitHubRepos />}
        </motion.div>

        {/* GitHub Profile Link */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/hafizkhan902"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 btn-outline"
          >
            <FaGithub className="w-5 h-5" />
            <span>View Full Profile</span>
          </a>
        </div>
      </div>
    </Section>
  );
};

export default GitHub; 