Real-Time Collaborative Kanban Board

A modern production-level Trello/Jira-inspired real-time collaborative Kanban Board application built using MERN Stack and Socket.io.

🚀 Project Overview

This application allows multiple users to collaborate in real time on task management boards with instant synchronization, drag-and-drop task movement, live updates, typing indicators, online presence tracking, comments, attachments, and analytics.

The project is designed with scalable SaaS architecture and modern UI/UX practices.

---

✨ Features

🔐 Authentication System

- User Signup/Login
- JWT Authentication
- Protected Routes
- Persistent User Sessions
- Profile Dropdown

---

📋 Kanban Board Features

- Create Multiple Boards
- Invite Team Members
- Real-Time Collaboration
- Live Task Synchronization
- Drag & Drop Task Movement
- Editable Task Modal
- Task Reordering
- Task Filtering & Search

---

📌 Task Management

Each task supports:

- Title
- Description
- Priority
- Due Date
- Assigned Members
- Status Tracking
- Comments
- Attachments
- Activity Logs

---

⚡ Real-Time Features

Implemented using Socket.io:

- Instant Task Updates
- Live Task Movement
- Online Members Tracking
- Typing Indicators
- Real-Time Comments
- Board State Synchronization
- Auto Refresh Sync
- Reconnect Handling

---

📊 Analytics Dashboard

- Total Tasks
- Completed Tasks
- Productivity Statistics
- Board Progress
- Completion Percentage

---

🛠 Tech Stack

Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Socket.io Client
- Zustand / Context API
- React Beautiful DnD / DnD Kit

Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.io
- JWT Authentication
- bcryptjs
- dotenv
- CORS

---

📁 Project Structure

Frontend

frontend/src/
├── components/
├── pages/
├── hooks/
├── store/
├── context/
├── services/
├── layouts/
├── routes/
├── socket/
├── utils/
├── assets/

Backend

backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── socket/
├── utils/
├── uploads/
├── server.js

---

📦 Installation

1️⃣ Clone Repository

git clone <repository-url>
cd kanban-board

---

⚙️ Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173

---

⚙️ Backend Setup

cd backend
npm install
npm run dev

Backend runs on:

http://localhost:5000

---

🔑 Environment Variables

Create ".env" inside backend folder.

Example ".env"

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

---

🗄 Database Models

User Model

- name
- email
- password
- avatar
- isOnline
- lastSeen

Board Model

- title
- createdBy
- members[]

Task Model

- title
- description
- priority
- dueDate
- assignedTo
- status
- position
- comments[]
- attachments[]

---

🔌 API Endpoints

Authentication APIs

Method| Endpoint
POST| /api/auth/register
POST| /api/auth/login
GET| /api/auth/me

---

Board APIs

Method| Endpoint
POST| /api/boards/create
GET| /api/boards
GET| /api/boards/:id
POST| /api/boards/:id/invite

---

Task APIs

Method| Endpoint
POST| /api/tasks/create
PUT| /api/tasks/:id/move
PUT| /api/tasks/:id/update
DELETE| /api/tasks/:id
GET| /api/boards/:id/tasks

---

🔄 Socket.io Events

Event| Description
connection| User connected
disconnect| User disconnected
join-board| Join board room
task-created| New task created
task-moved| Task moved
task-updated| Task updated
typing| Typing indicator
stop-typing| Stop typing
online-users| Active users list

---

🎨 UI Features

- Modern SaaS Dashboard
- Trello/Jira Inspired Design
- Fully Responsive
- Sticky Sidebar
- Sticky Header
- Dark/Light Mode
- Smooth Animations
- Skeleton Loaders
- Toast Notifications

---

⚠️ Edge Cases Handled

- Duplicate Updates
- Invalid Drag Positions
- Simultaneous Updates
- Reorder Conflicts
- Disconnect/Reconnect Recovery
- Empty Board States

---

🚀 Deployment

Frontend Deployment

Recommended:

- Vercel

Backend Deployment

Recommended:

- Render

Database

- MongoDB Atlas

---

📈 Future Improvements

- Voice Notes
- Team Chat
- Calendar View
- Notifications System
- AI Task Suggestions
- Time Tracking
- Workspace Permissions

---

🧠 Performance Optimizations

- Lazy Loading
- Memoization
- Optimistic UI Updates
- Efficient Re-Renders
- Code Splitting

---

👨‍💻 Author

Built using MERN Stack and Socket.io with modern scalable architecture and real-time collaboration features.

---

📄 License

This project is developed for learning, portfolio, and technical assessment purposes.