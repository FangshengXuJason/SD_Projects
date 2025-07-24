# Google Drive Clone - Development Plan

## Project Overview

A Google Drive clone with core functionality: upload files, view files, and download files.

## Tech Stack

### Frontend

- **Next.js 15** (React 19) - Full-stack framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **React Query/TanStack Query** - Server state management
- **Axios** - HTTP client
- **React Dropzone** - File upload handling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Multer** - File upload middleware
- **AWS SDK** - S3 integration

### Infrastructure

- **Amazon S3** - File storage
- **PostgreSQL** - Database (local development)
- **Redis** - Caching (local development)
- **Docker** - Containerization

## Project Structure

```
GoogleDrive/
├── front-end/          # Next.js frontend
├── back-end/           # Node.js backend
├── shared/             # Shared types and utilities
└── docs/              # Documentation
```

## Core Features Breakdown

### 1. File Management

- **Upload Files**
  - Drag & drop interface
  - Multiple file selection
  - Progress indicators
  - File type validation
  - Size limits
  - Direct S3 upload with presigned URLs

- **View Files**
  - Grid and list view modes
  - File thumbnails for images
  - File type icons
  - File metadata display
  - Search and filter functionality
  - Sort by name, date, size

- **Download Files**
  - Single file download
  - Batch download (zip)
  - Direct S3 download links
  - Progress tracking

### 2. User Management

- User registration/login
- JWT authentication
- User profile management
- File ownership and permissions

### 3. Database Schema

```sql
-- Users table
users (
  id, email, password_hash, name, created_at, updated_at
)

-- Files table
files (
  id, user_id, name, original_name, size, mime_type,
  s3_key, s3_bucket, created_at, updated_at
)

-- Folders table (for future expansion)
folders (
  id, user_id, name, parent_id, created_at, updated_at
)
```

## Development Phases

### Phase 1: Backend Foundation (Week 1)

1. Set up Node.js/Express server with TypeScript
2. Configure Prisma with PostgreSQL
3. Set up AWS S3 integration
4. Implement user authentication (JWT)
5. Create basic file upload/download endpoints
6. Set up Redis for caching

### Phase 2: Frontend Foundation (Week 2)

1. Set up Next.js with additional dependencies
2. Create authentication pages (login/register)
3. Implement JWT token management
4. Create basic layout and navigation
5. Set up API client with Axios

### Phase 3: File Upload (Week 3)

1. Create drag & drop upload component
2. Implement file upload with progress
3. Handle multiple file uploads
4. Add file validation and error handling
5. Create upload queue management

### Phase 4: File Viewing (Week 4)

1. Create file grid/list view components
2. Implement file thumbnails
3. Add search and filter functionality
4. Create file details modal
5. Implement sorting options

### Phase 5: File Download (Week 5)

1. Implement single file download
2. Add batch download functionality
3. Create download progress indicators
4. Handle download errors

### Phase 6: Polish & Testing (Week 6)

1. Add error boundaries and loading states
2. Implement responsive design
3. Add unit and integration tests
4. Performance optimization
5. Security hardening

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Files

- `GET /api/files` - List user files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/:id/download` - Download file
- `POST /api/files/batch-download` - Batch download

### S3

- `POST /api/s3/presigned-url` - Get upload URL
- `GET /api/s3/presigned-url/:key` - Get download URL

## Security Considerations

- File type validation
- File size limits
- S3 bucket policies
- CORS configuration
- Rate limiting
- Input sanitization
- JWT token expiration
- Secure file access

## Performance Optimizations

- S3 presigned URLs for direct upload/download
- Redis caching for frequently accessed data
- Image thumbnails generation
- Lazy loading for file lists
- Pagination for large file collections
- CDN for static assets

## Deployment Strategy

- Frontend: Vercel/Netlify
- Backend: AWS EC2/DigitalOcean
- Database: AWS RDS/Managed PostgreSQL
- File Storage: Amazon S3
- Caching: AWS ElastiCache/Redis Cloud

## Next Steps

1. Set up backend project structure
2. Configure development environment
3. Set up AWS S3 bucket and IAM roles
4. Create database schema
5. Implement authentication system
