# Backend Integration Guide

This document explains how the frontend integrates with your existing backend API running on localhost:4000.

## API Integration Overview

The frontend now connects to your backend API through several utility functions and custom hooks:

### 1. API Utility Functions (`src/utils/api.js`)

- **`submitContactForm(formData)`** - Submits contact form data to `/api/contact`
- **`getProjects(category, featured)`** - Fetches projects from `/api/projects`
- **`getProjectDetails(projectId)`** - Fetches single project details from `/api/projects/:id`
- **`getGithubActivity()`** - Fetches GitHub activity from `/api/github/activity`
- **`getGithubRepos()`** - Fetches GitHub repositories from `/api/github/repos`

### 2. Custom Hooks

- **`useGithubActivity`** (`src/hooks/useGithubActivity.js`) - Manages GitHub activity state
- **`useGithubRepos`** (`src/hooks/useGithubRepos.js`) - Manages GitHub repositories state
- **`useApiState`** - Generic hook for API state management

### 3. Updated Components

#### Contact Form (`src/components/sections/Contact.js`)
- Now submits to your backend API
- Includes all required fields: name, email, subject, message
- Uses notification system for user feedback
- Handles loading states and errors

#### Projects Section (`src/components/sections/Projects.js`)
- Fetches projects from your backend API
- Supports category filtering
- Handles loading states and errors
- Displays project details in modal

#### GitHub Section (`src/components/sections/GitHub.js`)
- New section displaying GitHub activity and repositories
- Tabbed interface for activity vs repositories
- Real-time data from your backend API

### 4. Notification System (`src/components/ui/Notification.js`)
- Global notification system for success/error messages
- Animated notifications with auto-dismiss
- Context-based for use across components

## Backend API Requirements

Your backend should implement these endpoints as documented in `API_DOCUMENTATION.txt`:

### Contact Form Endpoint
```
POST /api/contact
Body: { name, email, subject, message }
```

### Projects Endpoints
```
GET /api/projects?category=Web&featured=true
GET /api/projects/:id
```

### GitHub Integration Endpoints
```
GET /api/github/activity
GET /api/github/repos
```

## Data Structures Expected

### Project Object
```javascript
{
  _id: string,
  title: string,
  description: string,
  technologies: string[],
  imageUrl: string,
  githubUrl: string,
  liveUrl?: string,
  category: 'Web' | 'UI' | 'Fullstack' | 'Research' | 'Other',
  featured: boolean,
  challenges?: string[],
  solutions?: string[],
  completionDate: Date,
  createdAt: Date
}
```

### GitHub Activity Object
```javascript
{
  id: string,
  type: string,
  repo: string,
  createdAt: string,
  commits?: Array<{
    message: string,
    url: string
  }>
}
```

### GitHub Repository Object
```javascript
{
  id: string,
  name: string,
  description: string,
  url: string,
  stars: number,
  forks: number,
  language: string,
  updatedAt: string
}
```

## Error Handling

All API calls include proper error handling:
- Network errors are caught and displayed to users
- Server errors show appropriate messages
- Loading states are managed consistently
- Fallback UI for when data is unavailable

## CORS Configuration

Make sure your backend allows requests from `http://localhost:3000`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## Testing the Integration

1. Start your backend server on port 4000
2. Start the frontend development server: `npm start`
3. Test each section:
   - Contact form submission
   - Projects loading and filtering
   - GitHub activity and repositories display

## Environment Variables

If needed, you can modify the API base URL in `src/utils/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your backend has proper CORS configuration
2. **Network Errors**: Check if backend is running on port 4000
3. **Data Format**: Ensure your backend returns data in expected format
4. **Loading States**: Check browser console for API errors

### Debug Mode:

All API calls log errors to the console. Check browser developer tools for detailed error information.

## Next Steps

1. Ensure your backend implements all required endpoints
2. Test each API endpoint individually
3. Verify data formats match expected structures
4. Configure proper error handling on backend
5. Set up environment variables for production deployment 