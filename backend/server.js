const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data for testing
const mockProjects = [
  {
    _id: '1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with React and Node.js',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    imageUrl: 'https://via.placeholder.com/400x300',
    githubUrl: 'https://github.com/username/ecommerce',
    liveUrl: 'https://ecommerce-demo.com',
    category: 'Fullstack',
    featured: true,
    completionDate: new Date('2023-12-01'),
    challenges: ['Payment integration', 'Real-time inventory'],
    solutions: ['Stripe API integration', 'WebSocket implementation'],
    createdAt: new Date('2023-10-01')
  },
  {
    _id: '2',
    title: 'Task Management App',
    description: 'A React-based task management application with drag-and-drop',
    technologies: ['React', 'Redux', 'Material-UI', 'Firebase'],
    imageUrl: 'https://via.placeholder.com/400x300',
    githubUrl: 'https://github.com/username/task-manager',
    liveUrl: 'https://task-manager-demo.com',
    category: 'Web',
    featured: true,
    completionDate: new Date('2023-11-15'),
    challenges: ['Drag and drop functionality', 'Real-time updates'],
    solutions: ['React DnD library', 'Firebase real-time database'],
    createdAt: new Date('2023-09-15')
  },
  {
    _id: '3',
    title: 'Portfolio Website',
    description: 'A modern portfolio website with dark mode and animations',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
    imageUrl: 'https://via.placeholder.com/400x300',
    githubUrl: 'https://github.com/username/portfolio',
    liveUrl: 'https://portfolio-demo.com',
    category: 'Web',
    featured: false,
    completionDate: new Date('2023-10-30'),
    challenges: ['Responsive design', 'Animation performance'],
    solutions: ['Mobile-first approach', 'Optimized animations'],
    createdAt: new Date('2023-08-01')
  }
];

const mockGithubActivity = [
  {
    id: '1',
    type: 'PushEvent',
    repo: 'username/portfolio',
    createdAt: '2023-12-01T10:30:00Z',
    commits: [
      {
        message: 'Add new project to portfolio',
        url: 'https://github.com/username/portfolio/commit/abc123'
      },
      {
        message: 'Update README.md',
        url: 'https://github.com/username/portfolio/commit/def456'
      }
    ]
  },
  {
    id: '2',
    type: 'CreateEvent',
    repo: 'username/new-project',
    createdAt: '2023-11-28T14:20:00Z',
    refType: 'repository'
  },
  {
    id: '3',
    type: 'IssuesEvent',
    repo: 'username/task-manager',
    createdAt: '2023-11-25T09:15:00Z',
    action: 'opened',
    title: 'Fix drag and drop bug',
    url: 'https://github.com/username/task-manager/issues/15'
  }
];

const mockGithubRepos = [
  {
    id: '1',
    name: 'portfolio',
    description: 'My personal portfolio website built with React',
    url: 'https://github.com/username/portfolio',
    stars: 25,
    forks: 8,
    language: 'JavaScript',
    updatedAt: '2023-12-01T10:30:00Z'
  },
  {
    id: '2',
    name: 'task-manager',
    description: 'A task management application with drag-and-drop functionality',
    url: 'https://github.com/username/task-manager',
    stars: 42,
    forks: 15,
    language: 'TypeScript',
    updatedAt: '2023-11-28T14:20:00Z'
  },
  {
    id: '3',
    name: 'ecommerce-platform',
    description: 'Full-stack e-commerce solution with React and Node.js',
    url: 'https://github.com/username/ecommerce-platform',
    stars: 78,
    forks: 23,
    language: 'JavaScript',
    updatedAt: '2023-11-25T09:15:00Z'
  }
];

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Simulate email sending (in real app, use nodemailer)
    console.log('Contact form submission:', { name, email, subject, message });
    
    res.json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: Date.now().toString(),
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Get all projects
app.get('/api/projects', (req, res) => {
  try {
    const { category, featured } = req.query;
    let filteredProjects = [...mockProjects];
    
    // Filter by category
    if (category && category !== 'All') {
      filteredProjects = filteredProjects.filter(project => 
        project.category === category
      );
    }
    
    // Filter by featured status
    if (featured !== undefined) {
      const isFeatured = featured === 'true';
      filteredProjects = filteredProjects.filter(project => 
        project.featured === isFeatured
      );
    }
    
    res.json({
      success: true,
      message: 'Projects retrieved successfully',
      data: filteredProjects
    });
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = mockProjects.find(p => p._id === id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project retrieved successfully',
      data: project
    });
  } catch (error) {
    console.error('Project fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// Get GitHub activity
app.get('/api/github/activity', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'GitHub activity retrieved successfully',
      data: mockGithubActivity
    });
  } catch (error) {
    console.error('GitHub activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GitHub activity'
    });
  }
});

// Get GitHub repositories
app.get('/api/github/repos', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'GitHub repositories retrieved successfully',
      data: mockGithubRepos
    });
  } catch (error) {
    console.error('GitHub repos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GitHub repositories'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 