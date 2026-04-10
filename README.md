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

Implemented endpoints:

* `POST /auth/login`
* `POST /auth/register`
* `GET /projects`
* `POST /projects`
* `GET /projects/:id`
* `GET /projects/:id/tasks`
* `POST /projects/:id/tasks`
* `PATCH /tasks/:id`
* `DELETE /tasks/:id`

---

## 🔑 Test Credentials

Use the following to log in:

```
Email: test@example.com
Password: password123
```

---

## ▶️ Getting Started

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

No Docker setup is required for this project.
Since the backend is mocked using MSW and runs entirely in the browser, the application can be started with standard npm scripts.

---

## ✨ Highlights

* Full CRUD for tasks
* Optimistic UI updates
* Clean and responsive UI
* Realistic API simulation with MSW
* Multi-user data isolation

---

## 📌 Author

**Uzra Khan**
