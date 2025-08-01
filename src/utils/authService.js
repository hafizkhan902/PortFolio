/**
 * Authentication utilities for React frontend
 * Handles JWT authentication with the Portfolio backend
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';
console.log('🌐 API Base URL:', API_BASE_URL);
const TOKEN_KEY = 'adminToken'; // Changed from 'authToken' to 'adminToken'

class AuthService {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
    this.isLoggingIn = false;
  }

  /**
   * Login with username and password
   */
  async login(username, password) {
    if (this.isLoggingIn) {
      throw new Error('Login already in progress');
    }

    this.isLoggingIn = true;
    
    try {
      console.log('🔐 Attempting login...');
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (data.success) {
        this.token = data.data.token;
        localStorage.setItem(TOKEN_KEY, this.token);
        console.log('✅ Login successful, token stored');
        return data.data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    } finally {
      this.isLoggingIn = false;
    }
  }

  /**
   * Logout user
   */
  logout() {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
    console.log('✅ Logged out successfully');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Get stored token
   */
  getToken() {
    return this.token || localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Make authenticated request
   */
  async makeAuthenticatedRequest(url, options = {}) {
    console.log('🔄 NEW VERSION: makeAuthenticatedRequest called for:', url);
    
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, create a generic error object
        data = { 
          success: false, 
          message: `HTTP ${response.status}: ${response.statusText}`,
          error: 'Failed to parse response as JSON'
        };
      }
      
      // Handle token expiration
      if (response.status === 401) {
        console.log('❌ Token expired or invalid, clearing auth state');
        this.logout();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        // Log the full error details for debugging
        console.error('❌ Backend error response:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          url: url,
          method: options.method || 'GET'
        });
        
        // Use the backend's error message if available, otherwise create a descriptive one
        const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('❌ Authenticated request failed:', error);
      
      // Clear auth state on authentication errors
      if (error.message.includes('jwt') || error.message.includes('token') || error.message.includes('Session expired')) {
        this.logout();
      }
      
      throw error;
    }
  }

  /**
   * Get admin profile
   */
  async getProfile() {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/profile`);
  }

  /**
   * Get admin projects
   */
  async getAdminProjects(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.featured !== undefined) params.append('featured', filters.featured);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const url = `${API_BASE_URL}/admin/projects${params.toString() ? '?' + params.toString() : ''}`;
    return this.makeAuthenticatedRequest(url);
  }

  /**
   * Create new project
   */
  async createProject(projectData) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/projects`, {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
      return result;
    } catch (error) {
      console.error('❌ Create project failed:', error.message);
      throw error;
    }
  }

  /**
   * Update project
   */
  async updateProject(projectId, projectData) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(projectData)
      });
      return result;
    } catch (error) {
      console.error('❌ Update project failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete project
   */
  async deleteProject(projectId) {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/projects/${projectId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Get project statistics
   */
  async getStats() {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/projects/stats`);
  }

  /**
   * Get admin statistics
   */
  async getStatistics() {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/statistics`);
      return result;
    } catch (error) {
      console.error('❌ Get statistics failed:', error.message);
      throw error;
    }
  }

  /**
   * Upload image
   */
  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const token = this.getToken();
      const response = await fetch(`${API_BASE_URL}/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Image upload failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete image
   */
  async deleteImage(imageUrl) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/upload/images`, {
        method: 'DELETE',
        body: JSON.stringify({ imageUrl })
      });
      return result;
    } catch (error) {
      console.error('❌ Image delete failed:', error.message);
      throw error;
    }
  }

  /**
   * Get journey milestones
   */
  async getJourneyMilestones() {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/journey`);
      return result;
    } catch (error) {
      console.error('❌ Get journey milestones failed:', error.message);
      throw error;
    }
  }

  /**
   * Create journey milestone
   */
  async createJourneyMilestone(milestoneData) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/journey`, {
        method: 'POST',
        body: JSON.stringify(milestoneData)
      });
      return result;
    } catch (error) {
      console.error('❌ Create journey milestone failed:', error.message);
      throw error;
    }
  }

  /**
   * Update journey milestone
   */
  async updateJourneyMilestone(milestoneId, milestoneData) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/journey/${milestoneId}`, {
        method: 'PUT',
        body: JSON.stringify(milestoneData)
      });
      return result;
    } catch (error) {
      console.error('❌ Update journey milestone failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete journey milestone
   */
  async deleteJourneyMilestone(milestoneId) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/journey/${milestoneId}`, {
        method: 'DELETE'
      });
      return result;
    } catch (error) {
      console.error('❌ Delete journey milestone failed:', error.message);
      throw error;
    }
  }

  /**
   * Get public journey milestones (for About Me section)
   */
  async getPublicJourneyMilestones() {
    try {
      const response = await fetch(`${API_BASE_URL}/journey`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Get public journey milestones failed:', error.message);
      throw error;
    }
  }

  /**
   * Get skills (admin)
   */
  async getSkills() {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/skills`);
      return result;
    } catch (error) {
      console.error('❌ Get skills failed:', error.message);
      throw error;
    }
  }

  /**
   * Create skill
   */
  async createSkill(skillData) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/skills`, {
        method: 'POST',
        body: JSON.stringify(skillData)
      });
      return result;
    } catch (error) {
      console.error('❌ Create skill failed:', error.message);
      throw error;
    }
  }

  /**
   * Update skill
   */
  async updateSkill(skillId, skillData) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/skills/${skillId}`, {
        method: 'PUT',
        body: JSON.stringify(skillData)
      });
      return result;
    } catch (error) {
      console.error('❌ Update skill failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete skill
   */
  async deleteSkill(skillId) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/skills/${skillId}`, {
        method: 'DELETE'
      });
      return result;
    } catch (error) {
      console.error('❌ Delete skill failed:', error.message);
      throw error;
    }
  }

  /**
   * Get public skills (for Skills section)
   */
  async getPublicSkills() {
    try {
      const response = await fetch(`${API_BASE_URL}/skills`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Get public skills failed:', error.message);
      throw error;
    }
  }

  /**
   * Get portfolio highlights (admin)
   */
  async getPortfolioHighlights() {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/highlights`);
      return result;
    } catch (error) {
      console.error('❌ Get portfolio highlights failed:', error.message);
      throw error;
    }
  }

  /**
   * Create portfolio highlight
   */
  async createPortfolioHighlight(highlightData) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/highlights`, {
        method: 'POST',
        body: JSON.stringify(highlightData)
      });
      return result;
    } catch (error) {
      console.error('❌ Create portfolio highlight failed:', error.message);
      throw error;
    }
  }

  /**
   * Update portfolio highlight
   */
  async updatePortfolioHighlight(highlightId, highlightData) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/highlights/${highlightId}`, {
        method: 'PUT',
        body: JSON.stringify(highlightData)
      });
      return result;
    } catch (error) {
      console.error('❌ Update portfolio highlight failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete portfolio highlight
   */
  async deletePortfolioHighlight(highlightId) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/highlights/${highlightId}`, {
        method: 'DELETE'
      });
      return result;
    } catch (error) {
      console.error('❌ Delete portfolio highlight failed:', error.message);
      throw error;
    }
  }

  /**
   * Get public portfolio highlights (for Skills section)
   */
  async getPublicPortfolioHighlights() {
    try {
      const response = await fetch(`${API_BASE_URL}/highlights`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Get public portfolio highlights failed:', error.message);
      throw error;
    }
  }

  /**
   * Get all resumes (for admin)
   */
  async getResumes() {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/resume`);
      return result;
    } catch (error) {
      console.error('❌ Get resumes failed:', error.message);
      throw error;
    }
  }

  /**
   * Get single resume by ID (for admin)
   */
  async getResume(resumeId) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/resume/${resumeId}`);
      return result;
    } catch (error) {
      console.error('❌ Get resume failed:', error.message);
      throw error;
    }
  }

  /**
   * Upload resume (for admin)
   */
  async uploadResume(file, metadata = {}) {
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('resume', file);
      
      // Add metadata fields
      if (metadata.title) formData.append('title', metadata.title);
      if (metadata.version) formData.append('version', metadata.version);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.tags) formData.append('tags', metadata.tags);
      if (metadata.isPublic !== undefined) formData.append('isPublic', metadata.isPublic);
      
      console.log('📤 Uploading resume to:', `${API_BASE_URL}/admin/resume`);
      console.log('📁 File details:', { name: file.name, size: file.size, type: file.type });
      console.log('📋 Metadata:', metadata);
      console.log('🔑 Token available:', !!token);
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it automatically
        },
        body: formData,
      };
      
      console.log('📤 Request options:', {
        method: requestOptions.method,
        headers: requestOptions.headers,
        hasBody: !!requestOptions.body
      });
      
      const response = await fetch(`${API_BASE_URL}/admin/resume`, requestOptions);
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Upload resume failed:', error.message);
      throw error;
    }
  }

  /**
   * Update resume metadata (for admin)
   */
  async updateResume(resumeId, updateData) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/resume/${resumeId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      return result;
    } catch (error) {
      console.error('❌ Update resume failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete resume (for admin)
   */
  async deleteResume(resumeId) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/resume/${resumeId}`, {
        method: 'DELETE'
      });
      return result;
    } catch (error) {
      console.error('❌ Delete resume failed:', error.message);
      throw error;
    }
  }

  /**
   * Toggle resume active status (for admin)
   */
  async toggleResumeActive(resumeId) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/resume/${resumeId}/toggle-active`, {
        method: 'PATCH'
      });
      return result;
    } catch (error) {
      console.error('❌ Toggle resume active failed:', error.message);
      throw error;
    }
  }

  /**
   * Toggle resume public status (for admin)
   */
  async toggleResumePublic(resumeId) {
    try {
      const result = await this.makeAuthenticatedRequest(`${API_BASE_URL}/admin/resume/${resumeId}/toggle-public`, {
        method: 'PATCH'
      });
      return result;
    } catch (error) {
      console.error('❌ Toggle resume public failed:', error.message);
      throw error;
    }
  }

  /**
   * Get active public resume
   */
  async getActiveResume() {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/active`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Get active resume failed:', error.message);
      throw error;
    }
  }

  /**
   * Get all public resumes
   */
  async getPublicResumes() {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/public`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Get public resumes failed:', error.message);
      throw error;
    }
  }

  /**
   * Download resume
   */
  async downloadResume(resumeId, filename) {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/download/${resumeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Download resume failed:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService; 