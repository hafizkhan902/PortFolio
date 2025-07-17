import { useState } from 'react';

const API_BASE_URL = 'http://localhost:4000/api';

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

// Contact Form API
export const submitContactForm = async (formData) => {
  try {
    const response = await apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    console.log('Message sent:', response.message);
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

// Projects API
export const getProjects = async (category, featured) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (featured) params.append('featured', featured.toString());
  
  return apiCall(`/projects?${params.toString()}`);
};

export const getProjectDetails = async (projectId) => {
  return apiCall(`/projects/${projectId}`);
};

// GitHub Integration API
export const getGithubActivity = async () => {
  return apiCall('/github/activity');
};

export const getGithubRepos = async () => {
  return apiCall('/github/repos');
};

// Admin API Functions
export const adminLogin = async (credentials) => {
  return apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const verifyAdminToken = async (token) => {
  return apiCall('/admin/verify', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getAdminProfile = async (token) => {
  return apiCall('/admin/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getAdminProjects = async (token) => {
  return apiCall('/admin/projects', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createProject = async (projectData, token) => {
  return apiCall('/admin/projects', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
};

export const updateProject = async (projectId, projectData, token) => {
  return apiCall(`/admin/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
};

export const deleteProject = async (projectId, token) => {
  return apiCall(`/admin/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const toggleProjectFeatured = async (projectId, featured, token) => {
  return apiCall(`/admin/projects/${projectId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ featured })
  });
};

export const uploadImage = async (imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getAdminStats = async (token) => {
  return apiCall('/admin/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getContactMessages = async (token) => {
  return apiCall('/admin/messages', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const markMessageAsRead = async (messageId, token) => {
  return apiCall(`/admin/messages/${messageId}/read`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const deleteContactMessage = async (messageId, token) => {
  return apiCall(`/admin/messages/${messageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// API State Management Hook
export const useApiState = (apiCall) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(...args);
      setData(result.data);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};

export default apiCall; 