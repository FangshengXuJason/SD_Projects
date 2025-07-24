# Google Drive Clone

A modern Google Drive clone built with Next.js, Node.js, and AWS S3 for file storage.

## 🚀 Features

- **File Upload**: Drag & drop interface with progress tracking
- **File Viewing**: Grid and list view with file thumbnails
- **File Download**: Single and batch download capabilities
- **User Authentication**: JWT-based authentication system
- **Cloud Storage**: Amazon S3 integration for scalable file storage
- **Modern UI**: Built with Tailwind CSS and React 19

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **TanStack Query** - Server state management
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
- **JWT** - Authentication
- **AWS SDK** - S3 integration

### Infrastructure

- **Amazon S3** - File storage
- **PostgreSQL** - Database

## 📁 Project Structure

```
GoogleDrive/
├── front-end/          # Next.js frontend
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities and configurations
│   │   └── types/      # TypeScript types
│   └── package.json
├── back-end/           # Node.js backend
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── types/       # TypeScript types
│   ├── prisma/          # Database schema
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- AWS Account with S3 bucket
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd back-end
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp env.example .env
   ```

   Update `.env` with your configuration:

   ```env
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/google_drive_db"
   JWT_SECRET=your-super-secret-jwt-key
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-google-drive-bucket
   ```

4. **Set up database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server:**

   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd front-end
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   ```
   http://localhost:3000
   ```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Files

- `GET /api/files` - List user files
- `POST /api/files/upload` - Upload file metadata
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/:id/download` - Get download info

### S3

- `POST /api/s3/presigned-url` - Get upload URL
- `GET /api/s3/presigned-url/:key` - Get download URL

## 🗄 Database Schema

### Users

```sql
users (
  id, email, password_hash, name, created_at, updated_at
)
```

### Files

```sql
files (
  id, user_id, name, original_name, size, mime_type,
  s3_key, s3_bucket, created_at, updated_at
)
```

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- File type validation
- File size limits
- CORS configuration
- Rate limiting
- Input sanitization

## 📦 Deployment

### Backend Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Set up environment variables on your hosting platform
3. Deploy to your preferred hosting service (Heroku, DigitalOcean, AWS, etc.)

### Frontend Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy to Vercel, Netlify, or your preferred hosting service

### AWS S3 Setup

1. Create an S3 bucket
2. Configure CORS policy
3. Set up IAM user with S3 permissions
4. Update environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

## 🔄 Development Roadmap

- [ ] Folder support
- [ ] File sharing
- [ ] File preview
- [ ] Search functionality
- [ ] Mobile app
- [ ] Real-time collaboration
- [ ] Version control
- [ ] Advanced permissions
