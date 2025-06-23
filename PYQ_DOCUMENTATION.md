# PYQ (Previous Year Questions) System Documentation

## Overview
The PYQ system allows administrators to upload and organize previous year question papers using Google Drive links, while users can browse and access these papers in a structured way by course, semester, and year.

## Features

### For Students/Users:
- 📚 **Browse PYQ Papers**: Access papers organized by course, semester, and year
- 🔍 **Advanced Search**: Search by subject, university, exam type, difficulty
- 📄 **Google Drive Integration**: Papers are hosted on Google Drive for reliable access
- 📊 **Statistics**: View download counts and paper statistics
- 🏷️ **Tags & Categories**: Papers are tagged for easy discovery
- 📱 **Responsive Design**: Works on all devices
- 🔗 **Direct Links**: Click to view papers directly in Google Drive

### For Admins Only:
- ⬆️ **Upload Papers via Google Drive**: Admins upload papers by providing Google Drive sharing links
- ✏️ **Edit Papers**: Update paper details and replace Google Drive links
- 📋 **Manage All Papers**: Dashboard to oversee all papers in the system
- 🗂️ **Content Management**: Full control over all papers in the system
- 📊 **Analytics**: View comprehensive statistics and usage metrics
- 🔗 **Google Drive Link Validation**: System validates and processes Google Drive URLs

## Database Schema

### PYQ Paper Model
```javascript
{
  userId: String,           // User who uploaded
  title: String,           // Paper title
  subject: String,         // Subject name
  course: String,          // BCA, MCA, BTech, etc.
  semester: Number,        // 1-8
  year: Number,           // Exam year
  examType: String,       // Mid/End-Semester, Internal, etc.
  university: String,     // University name
  fileUrl: String,        // Google Drive direct download URL
  viewUrl: String,        // Google Drive view URL
  googleDriveId: String,  // Google Drive file ID
  fileName: String,       // Original file name
  fileType: String,       // pdf, doc, jpg, etc.
  fileSize: Number,       // File size in bytes (0 for Google Drive)
  description: String,    // Optional description  tags: [String],         // Array of tags
  difficulty: String,     // Easy, Medium, Hard
  downloadCount: Number,  // Number of downloads
  slug: String,           // Unique URL slug
  createdAt: Date,        // Upload timestamp
  updatedAt: Date         // Last modified
}```

## API Endpoints

### Public Endpoints
- `GET /api/pyq/getpyqs` - Get PYQ papers with filtering
- `GET /api/pyq/organized` - Get papers organized by semester/year
- `GET /api/pyq/stats` - Get statistics
- `PUT /api/pyq/download/:pyqId` - Increment download count

### Protected Endpoints (Admin Only)
- `POST /api/pyq/create` - Upload new PYQ paper (Admin only)
- `PUT /api/pyq/update/:pyqId` - Update PYQ paper (Admin only)
- `DELETE /api/pyq/delete/:pyqId` - Delete PYQ paper (Admin only)

## Frontend Routes

### Public Routes
- `/pyq-browser` - Browse and search PYQ papers

### Protected Routes (Admin Only)
- `/create-pyq` - Upload new PYQ paper (Admin only)
- `/update-pyq/:pyqId` - Edit existing PYQ paper (Admin only)
- `/dashboard?tab=pyqs` - Manage all PYQ papers (Admin only)

## How to Test the System

Since your project is already running, you can test the PYQ system:

### 1. Access PYQ Browser
- Navigate to: `http://localhost:3000/pyq-browser`
- You should see the PYQ browser page with course filters

### 2. Upload a PYQ Paper (Admin Only)
- Login as an admin account
- Go to: `http://localhost:3000/create-pyq`
- Fill in the form with test data:
  - Title: "Data Structures Final Exam 2023"
  - Course: "BCA"
  - Subject: "Data Structures"
  - Semester: "3"
  - Year: "2023"
  - Exam Type: "End-Semester"
  - University: "Test University"
  - **Google Drive Link**: Paste a Google Drive sharing link
    - Upload a file to Google Drive
    - Right-click → Share → Anyone with the link
    - Copy and paste the sharing URL

### 3. Manage Your Papers
- Go to: `http://localhost:3000/dashboard?tab=pyqs`
- You should see your uploaded papers
- All uploaded papers are immediately available

### 4. Browse Papers
- Go back to PYQ Browser
- Try different filters and view modes
- Test the organized view vs list view

### 5. Admin Features (if you're admin)
- Edit and delete papers
- View comprehensive statistics

## Quick Start Guide

1. **Browse Papers**: Visit `/pyq-browser` to explore existing papers
2. **Upload Paper (Admin Only)**: Visit `/create-pyq` to upload via Google Drive link
3. **Manage Papers (Admin Only)**: Check `/dashboard?tab=pyqs` to see uploaded papers
4. **Search & Filter**: Use the advanced filtering options in PYQ Browser

## Google Drive Integration

### How to Upload Papers:
1. **Upload to Google Drive**: First, upload your PYQ paper to Google Drive
2. **Set Sharing Permissions**: Right-click the file → Share → Change to "Anyone with the link"
3. **Copy Link**: Copy the sharing URL
4. **Paste in Form**: Go to Create PYQ page and paste the Google Drive link
5. **System Processing**: The system automatically extracts the file ID and creates direct/view URLs

### Supported Google Drive URL Formats:
- `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- `https://drive.google.com/open?id=FILE_ID`
- `https://docs.google.com/document/d/FILE_ID/edit`

### Benefits of Google Drive Integration:
- ✅ Reliable file hosting and bandwidth
- ✅ No server storage requirements
- ✅ Easy file management for admins
- ✅ Direct preview in Google Drive
- ✅ Automatic file type detection

The system is now fully integrated into your existing project with:
- ✅ Backend API endpoints
- ✅ Database models with Google Drive support
- ✅ Frontend components with Google Drive link input
- ✅ Dashboard integration for admin management
- ✅ Navigation links (admin-only)
- ✅ Google Drive link validation and processing
- ✅ Authentication & authorization
- ✅ Admin-only upload restrictions

Start by uploading a test paper via Google Drive link to see the system in action!
