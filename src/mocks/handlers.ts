import { http, HttpResponse } from 'msw'

// Base URL from the assignment
const BASE_URL = 'http://localhost:4000'

const getStoredProjects = (userId: string) => {
  const stored = localStorage.getItem(`mock_projects_${userId}`);

  if (stored) return JSON.parse(stored);

  const defaults = [
    {
      id: "proj-1",
      name: "Greening India Tech",
      description: "Internal task tracker",
      owner_id: userId,
      created_at: new Date().toISOString()
    }
  ];

  localStorage.setItem(`mock_projects_${userId}`, JSON.stringify(defaults));
  return defaults;
};



const getStoredTasks = (projectId: string) => {
  const stored = localStorage.getItem(`mock_tasks_${projectId}`);
  // Default tasks for the default project
  const defaultTasks = projectId === "proj-1" ? [
    { id: "task-1", title: "Setup MSW Handlers", status: "done", priority: "high", project_id: "proj-1" },
    { id: "task-2", title: "Build TaskFlow UI", status: "in_progress", priority: "medium", project_id: "proj-1" }
  ] : [];
  return stored ? JSON.parse(stored) : defaultTasks;
};

export const handlers = [
  // 1. Auth: register
  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    const { name, email } = await request.json() as any;

    const user = {
      id: crypto.randomUUID(),
      name,
      email
    };

    return HttpResponse.json({
      token: "mock-jwt-token-123",
      user
    }, { status: 201 });
  }),

  // 2. Auth: Login
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const { email, password } = await request.json() as any;

    // ✅ test credentials
    if (email !== "test@example.com" || password !== "password123") {
      return HttpResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      token: "mock-jwt-token-123",
      user: { id: "user-1", name: "Test User", email }
    });
  }),

  // 3. Projects: List
  http.get(`${BASE_URL}/projects`, () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "user-1";
    return HttpResponse.json({
      projects: getStoredProjects(userId)
    });
  }),

  // 4. Tasks: List for Project
  http.get(`${BASE_URL}/projects/:id/tasks`, ({ params }) => {
    const tasks = getStoredTasks(params.id as string);
    return HttpResponse.json({ tasks });
  }),

  // 5. Project Detail
  http.get(`${BASE_URL}/projects/:id`, ({ params }) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "user-1";
    const project = getStoredProjects(userId).find(
      (p: any) => p.id === params.id
    );

    if (!project) {
      return new HttpResponse(null, { status: 404 });
    }

    const tasks = getStoredTasks(params.id as string);

    return HttpResponse.json({
      ...project,
      tasks
    });
  }),

  // 6. Task Create (To handle the "Add Task" button)
  http.post(`${BASE_URL}/projects/:id/tasks`, async ({ request, params }) => {
    try {
        const newTask = await request.json() as any;
        const projectId = params.id as string;
        
        // Get existing tasks or empty array
        const storedTasks = localStorage.getItem(`mock_tasks_${projectId}`);
        const currentTasks = storedTasks ? JSON.parse(storedTasks) : [];
        
        // Add new task
        const updatedTasks = [newTask, ...currentTasks];
        
        // Save back to localStorage
        localStorage.setItem(`mock_tasks_${projectId}`, JSON.stringify(updatedTasks));
        
        return HttpResponse.json(newTask, { status: 201 });
      } catch (error) {
        return new HttpResponse(null, { status: 500 });
      }
  }),

  // 7. Project Create
  http.post(`${BASE_URL}/projects`, async ({ request }) => {
    const newProject = await request.json() as any;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "user-1";
    const current = getStoredProjects(userId);

    const updated = [
      { ...newProject, owner_id: userId },
      ...current
    ];

    localStorage.setItem(`mock_projects_${userId}`, JSON.stringify(updated));

    return HttpResponse.json(newProject, { status: 201 });
  }),

  // 8. Tasks updated
  http.patch(`${BASE_URL}/tasks/:id`, async ({ request, params }) => {
    const updatedData = await request.json() as any;
    const taskId = params.id as string;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "user-1";
    const projects = getStoredProjects(userId);
    for (const project of projects) {
      const tasks = getStoredTasks(project.id);

      const updatedTasks = tasks.map((t: any) =>
        t.id === taskId ? { ...t, ...updatedData } : t
      );

      localStorage.setItem(`mock_tasks_${project.id}`, JSON.stringify(updatedTasks));
    }

    return HttpResponse.json({ id: taskId, ...updatedData });
  }),

  // 9. Delete tasks
  http.delete(`${BASE_URL}/tasks/:id`, ({ params }) => {
    const taskId = params.id as string;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "user-1";
    const projects = getStoredProjects(userId);
    for (const project of projects) {
      const tasks = getStoredTasks(project.id);

      const updatedTasks = tasks.filter((t: any) => t.id !== taskId);

      localStorage.setItem(`mock_tasks_${project.id}`, JSON.stringify(updatedTasks));
    }

    return new HttpResponse(null, { status: 204 });
  })
]