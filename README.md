# Ethara Team Task Manager
# [ Live Demo](https://team-task-manager-aap-production.up.railway.app/login)

## 📖 Overview
Ethara Team Task Manager is a full-stack, comprehensive web application designed to streamline collaboration and task management for teams. Built entirely on the MERN stack (MongoDB, Express, React, Node.js), this application mirrors the core functionalities of industry-standard tools like Trello and Asana. 

The primary goal of this project is to provide a seamless environment where users can create projects, assign tasks, and track team progress through a centralized, dynamic dashboard.

---

## ✨ Core Features

### 1. Secure User Authentication
* **Registration & Login:** Secure user authentication implemented using JSON Web Tokens (JWT).
* **Role-Based Access Control (RBAC):** Users are assigned either an **Admin** or **Member** role upon registration, dictating their permissions throughout the application.

### 2. Project & Team Management
* **Admin Privileges:** Admins have the exclusive ability to create new projects and act as the project owner.
* **Team Roster:** Admins can dynamically add or remove team members from specific projects.
* **Data Isolation:** Members are restricted to viewing and interacting only with projects they have been explicitly invited to.

### 3. Advanced Task Tracking
* **Task Creation:** Admins can assign tasks to specific members within a project. Tasks include detailed descriptions, a due date, and a Priority level (`Low`, `Medium`, `High`).
* **Progress Tracking:** Members can update the status of their assigned tasks across three stages: `To Do`, `In Progress`, and `Done`.
* **Strict Visibility:** Members can only view and update tasks that are directly assigned to them, ensuring focused workflows.

### 4. Dynamic Analytics Dashboard
* **Team Overview (Admin):** Admins have access to a bird's-eye view of all project metrics, including Total Tasks, tasks categorized by status, and an itemized breakdown of "Tasks per User".
* **Personal View (Member):** Members receive a personalized dashboard reflecting only their specific workload and overdue alerts.

---

## 🛠️ Technology Stack

* **Frontend:** React.js (Vite framework), React Router DOM, Axios, Lucide React (Icons).
* **Styling:** Custom CSS Design System (Glassmorphism aesthetics, fully responsive).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (using Mongoose ODM for schema modeling).
* **Security:** bcryptjs (password hashing), jsonwebtoken (auth validation).

---

## 🚀 Running the Project Locally

If you wish to test this application locally, follow these steps:

### Prerequisites
* Node.js installed on your machine.
* A MongoDB cluster (Atlas or local).

### Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd ethara-team-task-manager
   ```

2. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the Development Servers:**
   Open two separate terminal windows.
   * **Terminal 1 (Backend):** Run `npm run dev` in the root directory.
   * **Terminal 2 (Frontend):** Run `cd frontend` then `npm run dev`.

6. Open your browser and navigate to `http://localhost:5173`.
