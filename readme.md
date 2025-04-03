# PDF-to-XML Converter Web Application

A full-stack web application that allows users to upload PDF files, convert them to XML while preserving document structure, and manage their conversion history. The application includes user authentication, file upload, conversion functionality, and a user-friendly interface for previewing and downloading results.

### Features
Level 2 (Intermediate Implementation)
User Authentication: Secure login/registration system using JWT (JSON Web Tokens).

 File Upload: Upload PDF files with validation (max 10MB, PDF only).

 PDF-to-XML Conversion: Converts PDFs to XML, preserving basic structure (paragraphs, metadata).

 Conversion History: View and manage past conversions with a sidebar navigation.

 Preview: Multi-tab preview of original PDF and converted XML content.

Download: Download converted XML files with proper naming.

User Profile: Basic profile management (name, email).

Error Handling: Robust error handling and validation throughout the application.

## Technical Stack
### Frontend: 
- Next.js (React framework)

- TypeScript

- Shadcn UI (for components like Button, Tabs, Progress)

- Axios (API requests)

### Backend: 
- Express.js (Node.js framework)

- TypeScript

- Prisma (ORM for database interactions)

- pdf-parse (PDF parsing)

- xml2js (XML generation)

- multer (file uploads)

- jsonwebtoken (JWT authentication)

- bcrypt (password hashing)

- Database: PostgreSQL (configurable to - via Prisma)

## Prerequisites
- Node.js: v18 or higher

- npm: v9 or higher (or use yarn/pnpm)

- PostgreSQL: A running instance (or adjust Prisma for another database)

- Git: For cloning the repository

## Setup Instructions
1. Clone the Repository
 git clone https://github.com/Anantdadhich/campus-ready.git
 cd pdf2xml-converter

2. Install Dependencies
Backend
bash

- cd backend
- npm install

Frontend
bash

- cd frontend
- npm install

3. Configure Environment Variables
Backend
Create a .env file in the backend directory:

- PORT=3001
 - JWT_PASSWORD=your-secret-key
- DATABASE_URL=postgresql://user:password@localhost:5432/pdf2xml_db
- FRONTEND_URL=http://localhost:3000




