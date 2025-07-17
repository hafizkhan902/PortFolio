import { useState, useEffect } from 'react';
import { getGithubRepos } from '../utils/api';

const useGithubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getGithubRepos();
        setRepos(response.data);
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch GitHub repos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
};

export default useGithubRepos; 