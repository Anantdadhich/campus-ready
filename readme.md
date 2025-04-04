<img width="1470" alt="2" src="https://github.com/user-attachments/assets/0ba87418-6b95-4649-821a-da33e66c26b2" /># PDF-to-XML Converter (Campus ready Assingment)

Welcome to **Convo**, a powerful full-stack web application that transforms your PDF files into structured XML with ease!.Built with a  Next.js frontend and  Node.js backend, it’s designed for seamless document conversion and a delightful user experience.

##  Features

- **Secure Authentication**: Log in or register with (JWT) for secure access.
- **Effortless PDF Upload**: Drag-and-drop uploader with validation—10MB max, PDFs only!
- **Conversion History**: Browse your past conversions, preview results, or Downlaod them with a click.
- **Real-Time Preview**: View your PDFs and their XML output side-by-side in history section.
- **Responsive Design**: A stunning UI with a sidebar for desktop and a toggleable menu for mobile.
- **Quick Stats Dashboard**: See your total, pending, and completed conversions at a glance.
- **Backend Power**: Converts PDFs to XML, stores files, and tracks everything in a PostgreSQL database with the help of Prisma ORM.

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
├── backend/               # Node.js + Express backend  
│   ├── prisma/            # Database schema and migrations  
│   │   └── schema.prisma  # Prisma schema file  
│   ├── src/               # Source code  
│       ├── conversion/    # PDF-to-XML conversion logic  
│       ├── db/            # Database connection and queries  
│       ├── middleware/    # Middleware functions  
│       ├── config.ts      # Configuration settings  
│       ├── index.ts       # Main server entry point  
│       ├── storage.ts     # File storage logic    
│   
│  
├── frontend/              # Next.js frontend   
│   ├── node_modules/      # Installed dependencies  
│   ├── public/            # Static assets  
│   ├── src/               # Frontend source code  
│   │   ├── app/           # Next.js app structure  
│   │   ├── components/    # Reusable UI components  
│   │   │   ├── ui/        # UI elements (buttons, inputs, etc.)  
│   │   │  
│       
└── README.md              # You're reading it!  
│── record.mov-            #Recording of Project
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

##  Technology Choices

### **Frontend**
- **Next.js**
- **TypeScript**
- **Shadcn UI Components**
- **Axios**

### **Backend**
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **Multer**
- **pdf-parse**
- **xml2js**
- **bcrypt & jsonwebtoken**
- **Axios**

---

##  Challenge Level Implemented

This project hits **Level 2 (Intermediate)** with flair:
- **JWT Authentication**: Secure login/register via `useAuth` and token-based API calls.
- **PDF-to-XML Conversion**: Fully implemented in the backend with `pdfprocess`, though preview is mocked in the frontend.
- **History Management**: Fetches and displays conversions with view/delete options and download the files easily in your machine.
- **UI Features**: Sidebar navigation and a stats dashboard.
- **User Profile**:User can login and logout easily.
---

## Approach 
 - My approach to building this application was simple:

 1 Database Setup: I used Prisma ORM to connect to the database easily with JavaScript and handle migrations smoothly.

 2 Backend Development: I started by creating basic routes and added JWT middleware for authentication. Then, using Multer and other libraries, I built routes for uploading and downloading converted files.

 3 Frontend Development: I chose Next.js because of its file-based routing and easy deployment. For the UI, I used shadcn/ui to create components and added designs to make the interface clean and user-friendly.



### **Limitations**
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

## Screenshots
  


 ![alt text](image.png) 
 

 <img width="1470" alt="2" src="https://github.com/user-attachments/assets/2111e1a6-5411-40f7-9e7b-75c678d676a9" />

 <img width="1470" alt="4" src="https://github.com/user-attachments/assets/a6b9d9dc-1d9c-4929-956d-ae373871dc42" />
<img width="1470" alt="5" src="https://github.com/user-attachments/assets/51e0de17-ac82-4712-85f6-9e32b824ba1c" />
  <img width="1470" alt="1" src="https://github.com/user-attachments/assets/ad199679-ef56-4414-84b5-0c09027c8a2a" /> 

  you can aslo downlaod the record.mov to see compelete good solution project for reference the video given below
  

    

https://github.com/user-attachments/assets/1b2b7ee2-7862-4114-a5cc-5c66b0b58391



--- 
