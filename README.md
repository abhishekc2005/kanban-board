# Appzeto - Real-Time Collaborative Kanban Board

A production-level Trello/Jira clone built with the MERN stack and Socket.io for real-time synchronization.

## Features

- **Authentication**: JWT-based login/signup with secure password hashing.
- **Board Management**: Create multiple boards, invite members, and switch between them.
- **Real-Time Synergy**: Live task movements, creations, and updates visible to all board members instantly.
- **Kanban Flow**: 4 columns (Todo, In Progress, Review, Done) with smooth Drag-and-Drop (dnd-kit).
- **Modern UI**: Clean SaaS dashboard with responsive design, premium typography, and subtle animations.
- **Task Details**: Priority levels, due dates, member assignments, and more.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Zustand, dnd-kit, Socket.io-client, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Socket.io, JWT, Mongoose.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Installation

1.  **Clone the repository**
2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    cp .env.example .env # Add your MongoDB URI and JWT Secret
    npm run dev
    ```
3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Usage

- Register a new account.
- Create a board from the sidebar.
- Start adding tasks to columns.
- Drag and drop tasks to change their status or order.
- (Optional) Open the same board in another browser window to see real-time synchronization in action.

## Deployment

- **Frontend**: Optimized for Vercel or Netlify.
- **Backend**: Optimized for Render, Heroku, or AWS.
- **Database**: Use MongoDB Atlas for cloud storage.
