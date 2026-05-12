# Job Tracker API

A RESTful API built with Node.js and Express for tracking job applications.
Handles authentication, authorization, and full CRUD operations for job applications.

## 🚀 Live API
https://your-render-url.onrender.com

## 🛠 Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Groq SDK (LLaMA 3.3 70B)
- ES Modules

## ✨ Features
- User registration and login with JWT
- Protected routes with middleware
- Full CRUD for job applications
- Search by company or position
- Filter by application status
- Notes per job application
- Follow-up reminder dates
- AI cover letter generation powered by Groq + LLaMA 3.3
- Global error handling

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get token |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/update | Update name and email |
| PUT | /api/auth/password | Change password |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | Get all jobs (supports ?search= and ?status=) |
| POST | /api/jobs | Create a new job |
| GET | /api/jobs/:id | Get a single job |
| PUT | /api/jobs/:id | Update a job |
| DELETE | /api/jobs/:id | Delete a job |
| GET | /api/jobs/stats | Get application statistics |
| POST | /api/jobs/:id/cover-letter | Generate AI cover letter |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs/:id/notes | Get all notes for a job |
| POST | /api/jobs/:id/notes | Add a note to a job |
| DELETE | /api/jobs/:id/notes/:noteId | Delete a note |

## 🏃 Run Locally

1. Clone the repo
   git clone https://github.com/your-username/job-tracker-api

2. Install dependencies
   npm install

3. Create a .env file
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   CLIENT_URL=http://localhost:5173
   PORT=5000
   GROQ_API_KEY=your_groq_api_key

4. Start the server
   npm run dev