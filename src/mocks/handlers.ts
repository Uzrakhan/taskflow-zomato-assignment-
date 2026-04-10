import { http, HttpResponse } from 'msw'

// Base URL from the assignment
const BASE_URL = 'http://localhost:4000'

const getStoredProjects = () => {
    const stored = localStorage.getItem('mock_projects');
    if (stored) return JSON.parse(stored);
    const defaults = [
        { 
        id: "proj-1", 
        name: "Greening India Tech", 
        description: "Internal task tracker for tree plantation", 
        owner_id: "user-1",
        created_at: new Date().toISOString()
        }
    ];
    localStorage.setItem('mock_projects', JSON.stringify(defaults));
    return defaults;
}


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
  // 1. Auth: Login
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const { email } = await request.json() as any;
    
    return HttpResponse.json({
      token: "mock-jwt-token-123",
      user: { id: "user-1", name: "Uzra Khan", email: email }
    }, { status: 200 })
  }),

  // 2. Projects: List
  http.get(`${BASE_URL}/projects`, () => {
    return HttpResponse.json({
      projects: getStoredProjects()
    })
  }),

  // 3. Tasks: List for Project
  http.get(`${BASE_URL}/projects/:id/tasks`, ({ params }) => {
    const tasks = getStoredTasks(params.id as string);
    return HttpResponse.json({ tasks });
  }),

  // 4. Project Detail
  http.get(`${BASE_URL}/projects/:id`, ({ params }) => {
    const project = getStoredProjects().find((p: any) => p.id === params.id);

    if (!project) {
      return new HttpResponse(null, { status: 404 });
    }

    // ✅ GET TASKS FROM STORAGE
    const tasks = getStoredTasks(params.id as string);
    return HttpResponse.json({
      ...project,
      tasks // 🔥 THIS FIXES EVERYTHING
    });
  }),

  // 5. Task Create (To handle the "Add Task" button)
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

  // 6. Project Create
  http.post(`${BASE_URL}/projects`, async ({ request }) => {
    const newProject = await request.json() as any;
    const current = getStoredProjects();
    const updated = [newProject, ...current];
    
    localStorage.setItem('mock_projects', JSON.stringify(updated));
    return HttpResponse.json(newProject, { status: 201 });
  })
]