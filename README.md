# SD_Projects

A collection of software development projects.

## Projects

### [Google Drive Clone](./GoogleDrive/)

A modern Google Drive clone built with Next.js, Node.js, and AWS S3 for file storage.

**Front-end Features:**

- File upload with drag & drop interface
- File viewing with grid and list views
- File download
- User authentication with JWT

**Tech Stack:** Next.js 15, React 19, Node.js, Express, TypeScript, Prisma, PostgreSQL, AWS S3

**System Functional requirement:**

- upload a file
- download a file
- automatically sync files across devices

**Out of scope:**

- roll my own blob storage, we will use  AWS S3

**Nonfunctional requirements:**

- availability >> consistency (CAP theorem)
- low latency upload and downloads(as low as possible)
- support larger files as 50GB
    resumable uploades
- high data integrity (sync accuracy)

**Core Entities:**

***Files(raw bytes)***

***File Metadata***

-id
-s3_link
-name
-mineType(pdf, docs, etc.)
-size
-owner_id
-date_created
-date_updated
...

***User***

-id
-name
-email
-date_created
-last_login
...

**API:**

***Upload files***
Post /files
body: File & FileMeata Data

***Download files***
GET /files/:filesId -> File& FileMetadata

***Query updated files before syncing***
GET /changes?since={timestamp} -> fileMetadata[]

