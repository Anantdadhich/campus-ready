# PDF-to-XML Converter 

Welcome to **PDF-to-XML Converter**, a powerful full-stack web application that transforms your PDF files into structured XML with ease!.Built with a sleek Next.js frontend and a robust Node.js backend, it’s designed for seamless document conversion and a delightful user experience.

##  Features

- **Secure Authentication**: Log in or register with confidence using JSON Web Tokens (JWT) for secure access.
- **Effortless PDF Upload**: Drag-and-drop uploader with validation—10MB max, PDFs only!
- **Conversion History**: Browse your past conversions, preview results, or delete them with a click.
- **Real-Time Preview**: View your PDFs and their XML output side-by-side (conversion mocked for now, but ready to scale).
- **Responsive Design**: A stunning UI with a sidebar for desktop and a toggleable menu for mobile.
- **Quick Stats Dashboard**: See your total, pending, and completed conversions at a glance.
- **Backend Power**: Converts PDFs to XML, stores files, and tracks everything in a PostgreSQL database.

---

##  Setup and Run Instructions

### **Prerequisites**
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: For cloning the repo

### **Clone the Repository**
```bash
git clone https://github.com/Anantdadhich/campus-ready.git
cd campus-ready
```

---

##  Project Structure
```plaintext
campus-ready/
├── backend/           # Node.js + Express backend
├── frontend/          # Next.js frontend
└── README.md          # You’re reading it!
```

---

## Backend Setup

### **1. Navigate to Backend**
```bash
cd backend
```

### **2. Install Dependencies**
```bash
npm install
```
Installs **express, multer, pdf-parse, xml2js, bcrypt, jsonwebtoken, cors, prisma,** and more.

### **3. Environment Variables**
Create a `.env` file in `backend/`:
```env
PORT=3001
JWT_SECRET=your-super-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/campusready?schema=public
FRONTEND_URL=http://localhost:3000
```

### **4. Set Up Prisma**
Initialize your database:
```bash
npx prisma migrate dev --name init
```
This runs migrations to create tables like **User** and **Conversion**.

### **5. Run Backend**
```bash
npm start
```
Your backend will fire up at **http://localhost:3001**.

---

##  Frontend Setup

### **1. Navigate to Frontend**
```bash
cd frontend
```

### **2. Install Dependencies**
```bash
npm install
```
Installs **Next.js, TypeScript, Shadcn UI, Lucide Icons,** and more.

### **3. Environment Variables**
Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **4. Run Frontend**
```bash
npm run dev
```
---

##  Running Both Backend & Frontend
Open two terminal windows:
- **Backend**:
  ```bash
  cd backend && npx tsc - b 
  node dist/index.js
  ```
- **Frontend**:
  ```bash
  cd frontend && npm run dev
  ```
  
---

##  Technology Choices

### **Frontend**
- **Next.js**
- **TypeScript**
- **Shadcn UI**

### **Backend**
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **Multer**
- **pdf-parse**
- **xml2js**
- **bcrypt & jsonwebtoken**

---

##  Challenge Level Implemented

This project hits **Level 2 (Intermediate)** with flair:
- **JWT Authentication**: Secure login/register via `useAuth` and token-based API calls.
- **PDF-to-XML Conversion**: Fully implemented in the backend with `pdfprocess`, though preview is mocked in the frontend.
- **History Management**: Fetches and displays conversions with view/delete options.
- **UI Features**: Sidebar navigation, responsive design, and a stats dashboard.

---

##  Assumptions and Limitations

### **Assumptions**
- PDFs are text-based (no complex layouts like tables or images yet).
- Users are authenticated via JWT tokens from `/api/auth/login`.
- Local filesystem (`uploads/`) is available for storage.

### **Limitations**
- **Preview**: Frontend shows mocked XML; real previews need integration with backend XML files.
- **PDF Complexity**: Only handles basic text extraction, not advanced structures.
- **Error Feedback**: Basic error messages;

---

##  Future Improvements
- **Cloud Storage**: Move files to AWS S3 or similar for scalability.
- **Admin Panel**: Add user management and conversion oversight .
- **WebSockets**: Real-time status updates for conversions.
- **Testing**: Unit tests with Jest for backend logic.
- **UI Polish**: Better mobile optimization and error handling UX.
- **O Auth**: for secure we use google oauth for authentication.

---


