# 🌱 TaskFlow – Project & Task Management App

A responsive task management application built as part of the Zomato frontend assignment.
It allows users to manage projects and tasks using a clean Kanban-style interface.

---

## 🚀 Features

### 🔐 Authentication

* Login with test credentials
* JWT stored in localStorage
* Protected routes for authenticated users

---

### 📁 Projects

* View all projects
* Create new projects
* Projects are user-specific (multi-user support using localStorage)

---

### ✅ Tasks

* Create, edit, and delete tasks
* Tasks grouped by:

  * To Do
  * In Progress
  * Done
* Add:

  * Priority
  * Assignee
  * Due date
* Optimistic UI updates for smooth experience

---

### 🎨 UI/UX

* Fully responsive (mobile + desktop)
* Modal-based task creation/editing
* Clean Kanban board layout
* Loading and error states handled
* Smooth transitions and hover effects

---

## 🛠️ Tech Stack

* **React + TypeScript**
* **React Router**
* **React Query**
* **Tailwind CSS (custom UI components)**
* **MSW (Mock Service Worker)** for API simulation

---

## 📡 API (Mocked via MSW)

## 📘 API Reference

All APIs are mocked using MSW (Mock Service Worker).

---

### 🔐 Auth

#### POST `/auth/login`

**Request:**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "mock-jwt-token-123",
  "user": {
    "id": "user-1",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

#### POST `/auth/register`

**Request:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response:**

```json
{
  "token": "mock-jwt-token-123",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

### 📁 Projects

#### GET `/projects`

Returns all projects for the logged-in user.

---

#### POST `/projects`

**Request:**

```json
{
  "name": "New Project",
  "description": "Project description"
}
```

---

#### GET `/projects/:id`

Returns project details along with tasks.

---

### ✅ Tasks

#### GET `/projects/:id/tasks`

Supports optional query params:

* `status`
* `assignee`

---

#### POST `/projects/:id/tasks`

**Request:**

```json
{
  "title": "Design dashboard",
  "status": "todo",
  "priority": "medium",
  "assignee_id": "user-1",
  "due_date": "2026-04-15"
}
```

---

#### PATCH `/tasks/:id`

Updates an existing task.

---

#### DELETE `/tasks/:id`

Deletes a task.

---


## 🚧 What I'd Do With More Time

* Implement a real backend (Node.js + PostgreSQL) instead of MSW for persistent data storage
* Add drag-and-drop functionality for tasks (Kanban interaction)
* Improve assignee system with selectable users instead of free text
* Add real-time updates using WebSockets or SSE
* Enhance accessibility (ARIA roles, keyboard navigation)
* Add unit and integration tests (React Testing Library)
* Implement dark mode with theme persistence
* Optimize performance for large task lists (virtualization)

### Tradeoffs Made

* Used MSW instead of a real backend to focus on frontend functionality and UX
* Simplified authentication (mock JWT) for faster development
* Assignee stored as simple string instead of relational user model

---

## 🔑 Test Credentials

Use the following to log in:

```
Email: test@example.com  
Password: password123
```

---

## ▶️ Running Locally (Docker)

This project can be run entirely using Docker (no Node.js installation required).

```bash
git clone https://github.com/Uzrakhan/taskflow-UzraKhan
cd taskflow-uzra-khan
cp .env.example .env
docker compose up --build
```

The app will be available at:

👉 http://localhost:3000

---

## 🧪 Running Without Docker (Optional)

```bash
npm install
npm run dev
```

---

## 🧠 Architecture Notes

* API is mocked using **MSW** — no real backend required
* Data is persisted in **localStorage**
* Multi-user support implemented using user-specific storage keys
* React Query is used for:

  * Data fetching
  * Cache management
  * Optimistic UI updates

---

## 🐳 Docker

* Multi-stage Docker build used for optimized production image
* Frontend served using a lightweight static server (`serve`)
* Entire app runs with a single command using Docker Compose

---

## ✨ Highlights

* Full CRUD for tasks
* Optimistic UI updates
* Clean and responsive UI
* Realistic API simulation with MSW
* Multi-user data isolation
* One-command Docker setup

---

## 📌 Author

**Uzra Khan**
