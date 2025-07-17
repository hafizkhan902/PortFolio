# Admin Interface Setup Guide

## Overview

A comprehensive admin interface has been created for managing your portfolio website. This includes project management, contact message handling, file uploads, and analytics.

## Features

### 🔐 Authentication
- Secure login with JWT tokens
- Token verification and auto-logout
- Protected routes and API endpoints

### 📁 Project Management
- **Create Projects**: Add new projects with all details
- **Edit Projects**: Update existing project information
- **Delete Projects**: Remove projects from portfolio
- **Featured Toggle**: Mark projects as featured/unfeatured
- **Image Upload**: Upload project images with preview
- **Categories**: Organize projects by Web, UI, Fullstack, Research, Other
- **Technologies**: Add/remove technology tags
- **Challenges & Solutions**: Document project challenges and solutions

### 📧 Contact Messages
- **View Messages**: Read messages from contact form
- **Mark as Read/Unread**: Track message status
- **Reply**: Direct email reply functionality
- **Delete Messages**: Remove unwanted messages
- **Filter**: View all, read, or unread messages

### 📊 Analytics & Stats
- **Project Statistics**: Total and featured project counts
- **Message Analytics**: Total and unread message counts
- **Portfolio Views**: Track website visits
- **GitHub Integration**: Repository and activity stats
- **Recent Activity**: Timeline of admin actions

### 🔧 File Management
- **Image Upload**: Support for project images
- **File Preview**: Preview images before upload
- **File Validation**: Ensure proper file types and sizes

## File Structure

```
src/
├── components/
│   └── admin/
│       ├── AdminApp.js          # Main admin application
│       ├── AdminLogin.js        # Login component
│       ├── AdminDashboard.js    # Dashboard with tabs
│       ├── ProjectForm.js       # Project creation/editing
│       ├── ProjectList.js       # Project listing
│       ├── AdminStats.js        # Statistics dashboard
│       └── ContactMessages.js   # Message management
├── utils/
│   └── api.js                   # API functions (updated)
├── AdminApp.js                  # Admin app wrapper
├── admin.js                     # Admin entry point
└── public/
    └── admin.html               # Admin HTML template
```

## Backend Requirements

Your backend needs to implement these admin endpoints:

### Authentication
```javascript
POST /api/admin/login
GET /api/admin/verify
```

### Project Management
```javascript
GET /api/admin/projects
POST /api/admin/projects
PUT /api/admin/projects/:id
PATCH /api/admin/projects/:id
DELETE /api/admin/projects/:id
```

### File Upload
```javascript
POST /api/admin/upload
```

### Statistics
```javascript
GET /api/admin/stats
```

### Messages
```javascript
GET /api/admin/messages
PATCH /api/admin/messages/:id/read
DELETE /api/admin/messages/:id
```

## Setup Instructions

### 1. Build Configuration

Update your build process to handle the admin interface:

```javascript
// In your build script or webpack config
// Build both main app and admin app
npm run build:main
npm run build:admin
```

### 2. Routing Setup

Configure your server to serve the admin interface:

```javascript
// Express.js example
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'admin.html'));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'admin.html'));
});
```

### 3. Environment Variables

Add admin-specific environment variables:

```bash
REACT_APP_ADMIN_API_URL=http://localhost:4000/api/admin
REACT_APP_UPLOAD_MAX_SIZE=5242880  # 5MB
```

### 4. Backend Authentication

Implement JWT-based authentication:

```javascript
// Example middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

## Usage Guide

### Accessing Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. Login with admin credentials
3. Access dashboard with three main tabs:
   - **Projects**: Manage portfolio projects
   - **Statistics**: View analytics and metrics
   - **Messages**: Handle contact form messages

### Adding Projects

1. Click "Add Project" button
2. Fill in project details:
   - Title (required)
   - Description (required)
   - Category
   - Technologies (add multiple)
   - GitHub URL
   - Live URL
   - Featured status
   - Challenges & Solutions
   - Project image
3. Click "Create" to save

### Managing Images

1. Click "Choose file" in project form
2. Select image file (JPG, PNG, GIF)
3. Preview appears immediately
4. Image uploads automatically on form submit
5. Remove image by clicking "Remove Image"

### Handling Messages

1. Go to "Messages" tab
2. Filter by All/Read/Unread
3. Click message to view details
4. Use "Reply" to respond via email
5. Mark as read or delete as needed

### Viewing Analytics

1. Go to "Statistics" tab
2. View overview cards with key metrics
3. Check recent activity timeline
4. Use quick actions for common tasks

## Security Considerations

### Token Management
- Tokens expire after set time
- Automatic logout on token expiry
- Secure token storage in localStorage

### API Security
- All admin endpoints require authentication
- CORS configured for admin domain
- Input validation on all forms

### File Upload Security
- File type validation
- Size limits enforced
- Secure file storage

## Troubleshooting

### Common Issues

1. **Login Failed**
   - Check backend is running on port 4000
   - Verify admin credentials in database
   - Check CORS configuration

2. **Image Upload Failed**
   - Ensure file is under size limit
   - Check file type is supported
   - Verify upload endpoint exists

3. **Projects Not Loading**
   - Check API endpoint `/api/admin/projects`
   - Verify authentication token
   - Check network connectivity

### Debug Mode

Enable debug mode by adding to localStorage:
```javascript
localStorage.setItem('adminDebug', 'true');
```

## Deployment

### Production Build

```bash
# Build both main and admin apps
npm run build

# Deploy both builds to server
# Main app: build/
# Admin app: build/admin/
```

### Server Configuration

```nginx
# Nginx example
location /admin {
    try_files $uri $uri/ /admin.html;
}

location /api/admin {
    proxy_pass http://localhost:4000;
}
```

## API Documentation

### Project Object Structure
```javascript
{
  _id: string,
  title: string,
  description: string,
  category: 'Web' | 'UI' | 'Fullstack' | 'Research' | 'Other',
  technologies: string[],
  githubUrl?: string,
  liveUrl?: string,
  imageUrl?: string,
  featured: boolean,
  challenges?: string[],
  solutions?: string[],
  createdAt: Date,
  updatedAt: Date
}
```

### Message Object Structure
```javascript
{
  _id: string,
  name: string,
  email: string,
  subject: string,
  message: string,
  read: boolean,
  createdAt: Date
}
```

### Stats Object Structure
```javascript
{
  totalProjects: number,
  featuredProjects: number,
  totalMessages: number,
  unreadMessages: number,
  totalViews: number,
  githubRepos: number,
  recentActivity: Array<{
    action: string,
    timestamp: string
  }>
}
```

## Support

For issues or questions about the admin interface:
1. Check this documentation
2. Review browser console for errors
3. Verify backend API endpoints
4. Check network requests in DevTools

The admin interface is now ready for use! Access it at `/admin` and start managing your portfolio content efficiently. 