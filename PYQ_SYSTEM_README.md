# PYQ Papers Management System

## Overview

This PYQ (Previous Year Questions) Papers Management System allows users to upload, organize, and browse previous year question papers by semester and year. The system is built with a comprehensive backend API and a modern React frontend.

## Features

### Core Features
- **Upload PYQ Papers**: Users can upload question papers with detailed metadata
- **Semester & Year Organization**: Papers are organized by course, semester, and year
- **Advanced Filtering**: Filter papers by course, semester, year, subject, exam type, and difficulty
- **File Management**: Support for multiple file formats (PDF, DOC, DOCX, JPG, JPEG, PNG)
- **Approval System**: Admin approval workflow for quality control
- **Download Tracking**: Track download counts for analytics
- **Search Functionality**: Search papers by title, subject, description, and tags

### User Management
- **User Authentication**: Secure user registration and login
- **Role-Based Access**: Admin and regular user roles
- **Personal Dashboard**: Users can manage their uploaded papers
- **Profile Management**: Update user profiles and preferences

### Admin Features
- **Paper Approval**: Review and approve submitted papers
- **Content Moderation**: Edit or remove inappropriate content
- **Analytics Dashboard**: View statistics and usage metrics
- **User Management**: Manage user accounts and permissions

## API Endpoints

### PYQ Paper Routes (`/api/pyq`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create` | Create a new PYQ paper | ✓ |
| GET | `/getpyqs` | Get PYQ papers with filtering | ✗ |
| GET | `/organized` | Get PYQs organized by semester/year | ✗ |
| GET | `/stats` | Get PYQ statistics | ✗ |
| PUT | `/update/:pyqId` | Update PYQ paper | ✓ |
| DELETE | `/delete/:pyqId` | Delete PYQ paper | ✓ |
| PUT | `/approve/:pyqId` | Approve PYQ paper (Admin only) | ✓ |
| PUT | `/download/:pyqId` | Increment download count | ✗ |

### Query Parameters for `/getpyqs`

| Parameter | Type | Description |
|-----------|------|-------------|
| `course` | String | Filter by course (BCA, MCA, BTech, etc.) |
| `semester` | Number | Filter by semester (1-8) |
| `year` | Number | Filter by year |
| `subject` | String | Filter by subject name |
| `examType` | String | Filter by exam type |
| `university` | String | Filter by university |
| `difficulty` | String | Filter by difficulty (Easy, Medium, Hard) |
| `searchTerm` | String | Search in title, subject, description, tags |
| `isApproved` | Boolean | Filter by approval status |
| `startIndex` | Number | Pagination start index |
| `limit` | Number | Number of results per page |
| `order` | String | Sort order (asc/desc) |

## Database Schema

### PYQ Paper Model

```javascript
{
  userId: String,           // User who uploaded the paper
  title: String,            // Paper title
  subject: String,          // Subject name
  course: String,           // Course (BCA, MCA, BTech, etc.)
  semester: Number,         // Semester number (1-8)
  year: Number,             // Year of the exam
  examType: String,         // Exam type (Mid-Semester, End-Semester, etc.)
  university: String,       // University name
  fileUrl: String,          // File storage URL
  fileName: String,         // Original file name
  fileType: String,         // File extension
  fileSize: Number,         // File size in bytes
  description: String,      // Optional description
  tags: [String],           // Tags for categorization
  difficulty: String,       // Difficulty level
  downloadCount: Number,    // Number of downloads
  isApproved: Boolean,      // Approval status
  approvedBy: String,       // Admin who approved
  approvedAt: Date,         // Approval timestamp
  slug: String,             // URL-friendly identifier
  createdAt: Date,          // Creation timestamp
  updatedAt: Date           // Last update timestamp
}
```

## Frontend Components

### Pages
- **CreatePYQ**: Upload new PYQ papers
- **UpdatePYQ**: Edit existing PYQ papers
- **PYQBrowser**: Browse and search PYQ papers
- **Dashboard**: User dashboard with PYQ management

### Components
- **DashPYQs**: Dashboard component for managing user's PYQ papers
- **PYQCard**: Display individual PYQ papers
- **PYQFilters**: Advanced filtering interface
- **PYQStats**: Statistics and analytics display

## Installation & Setup

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd api
   npm install
   ```

2. **Environment Variables**
   Create `.env` file in the api directory:
   ```env
   MONGO=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Firebase Configuration**
   Configure Firebase in `src/firebase.js` for file uploads

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Usage Guide

### For Students

1. **Browse Papers**
   - Navigate to "PYQ Papers" in the main menu
   - Use filters to find papers by course, semester, year
   - Switch between organized view and list view

2. **Upload Papers**
   - Sign in to your account
   - Click "Upload PYQ" or go to Dashboard → My PYQs
   - Fill in paper details and upload file
   - Wait for admin approval

3. **Manage Your Papers**
   - Go to Dashboard → My PYQs
   - View, edit, or delete your uploaded papers
   - Track download statistics

### For Admins

1. **Review Papers**
   - Access admin dashboard
   - Review pending papers for approval
   - Edit or reject inappropriate content

2. **Manage System**
   - View system statistics
   - Manage user accounts
   - Monitor content quality

## File Upload Guidelines

### Supported Formats
- **Documents**: PDF, DOC, DOCX
- **Images**: JPG, JPEG, PNG

### File Size Limits
- Maximum file size: 10MB per file
- Recommended: Compress large files before upload

### Quality Guidelines
- Ensure papers are clear and readable
- Include proper metadata (subject, year, etc.)
- Use descriptive titles and tags

## Search and Filter Options

### Basic Filters
- **Course**: Select from available courses
- **Semester**: Choose semester (1-8)
- **Year**: Select year range
- **Exam Type**: Filter by exam type

### Advanced Search
- **Text Search**: Search in title, subject, description
- **Tag Search**: Find papers by tags
- **Difficulty**: Filter by difficulty level
- **University**: Search by university name

## Security Features

### Authentication
- JWT-based authentication
- Secure password hashing
- Role-based access control

### File Security
- Secure file upload via Firebase
- File type validation
- Size restrictions
- Virus scanning (recommended for production)

### Data Protection
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS protection
- Secure headers

## Performance Optimizations

### Database
- Indexed queries for better performance
- Pagination for large datasets
- Aggregation pipelines for statistics

### Frontend
- Lazy loading of components
- Image optimization
- Caching strategies
- Code splitting

### File Storage
- CDN integration via Firebase
- Optimized file serving
- Compression and resizing

## Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Standards
- Follow existing code style
- Add comments for complex logic
- Write unit tests for new features
- Update documentation

## Future Enhancements

### Planned Features
- **Mobile App**: React Native mobile application
- **OCR Integration**: Text extraction from image files
- **Advanced Analytics**: Detailed usage analytics
- **Collaboration**: Study groups and sharing features
- **API Documentation**: Interactive API documentation
- **Notification System**: Email/SMS notifications
- **Bulk Upload**: Upload multiple files at once
- **Version Control**: Track paper versions and updates

### Technical Improvements
- **Caching**: Redis caching layer
- **Search**: Elasticsearch integration
- **Monitoring**: Application performance monitoring
- **Testing**: Comprehensive test coverage
- **CI/CD**: Automated deployment pipeline

## Support

For technical support or feature requests:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

## License

This project is licensed under the MIT License. See LICENSE file for details.
