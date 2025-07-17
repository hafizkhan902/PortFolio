import { useState, useEffect } from 'react';
import { getGithubActivity } from '../utils/api';

const useGithubActivity = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getGithubActivity();
        setActivity(response.data);
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch GitHub activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return { activity, loading, error };
};

export default useGithubActivity; 