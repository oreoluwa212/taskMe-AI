// src/store/projectStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useProjectStore = create(
    persist(
        (set, get) => ({
            projects: [],
            loading: false,
            error: null,
            currentProject: null,
            initialized: false, // Track if store has been initialized
            lastFetch: null, // Track last fetch time

            // Initialize store - prevents empty state flash
            initialize: async (force = false) => {
                const { initialized, lastFetch, projects } = get();

                // If already initialized and has data, and not forcing, skip
                if (initialized && projects.length > 0 && !force) {
                    return projects;
                }

                // If last fetch was recent (< 5 minutes), skip unless forced
                const now = Date.now();
                if (lastFetch && (now - lastFetch) < 300000 && !force) {
                    return projects;
                }

                return await get().fetchProjects();
            },

            // Fetch projects with better UX
            fetchProjects: async (showLoader = true) => {
                if (showLoader) {
                    set({ loading: true, error: null });
                }

                try {
                    const response = await api.get('/projects');
                    console.log('Fetch projects response:', response.data);

                    // Handle different response structures
                    let projects = [];
                    if (response.data) {
                        if (response.data.data && Array.isArray(response.data.data)) {
                            projects = response.data.data;
                        } else if (Array.isArray(response.data)) {
                            projects = response.data;
                        } else if (response.data.projects && Array.isArray(response.data.projects)) {
                            projects = response.data.projects;
                        }
                    }

                    set({
                        projects,
                        loading: false,
                        initialized: true,
                        lastFetch: Date.now(),
                        error: null
                    });

                    return projects;
                } catch (error) {
                    console.error('Fetch projects error:', error);
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to fetch projects';

                    set({
                        error: errorMessage,
                        loading: false,
                        initialized: true,
                        lastFetch: Date.now()
                    });

                    throw error;
                }
            },

            // Create project with optimistic update
            createProject: async (projectData) => {
                set({ loading: true, error: null });

                try {
                    console.log('Creating project with data:', projectData);
                    const response = await api.post('/projects', projectData);
                    console.log('Create project response:', response.data);

                    const newProject = response.data?.data || response.data;

                    set(state => ({
                        projects: Array.isArray(state.projects)
                            ? [...state.projects, newProject]
                            : [newProject],
                        loading: false,
                        lastFetch: Date.now()
                    }));

                    return newProject;
                } catch (error) {
                    console.error('Create project error:', error);
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to create project';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Update project with optimistic update
            updateProject: async (projectId, projectData) => {
                // Optimistic update
                set(state => ({
                    projects: Array.isArray(state.projects)
                        ? state.projects.map(p =>
                            (p.id === projectId || p._id === projectId)
                                ? { ...p, ...projectData }
                                : p
                        )
                        : []
                }));

                try {
                    console.log('Updating project:', projectId, projectData);
                    const response = await api.put(`/projects/${projectId}`, projectData);
                    console.log('Update project response:', response.data);

                    const updatedProject = response.data?.data || response.data;

                    set(state => ({
                        projects: Array.isArray(state.projects)
                            ? state.projects.map(p =>
                                (p.id === projectId || p._id === projectId)
                                    ? { ...p, ...updatedProject }
                                    : p
                            )
                            : [updatedProject],
                        loading: false,
                        lastFetch: Date.now()
                    }));

                    return updatedProject;
                } catch (error) {
                    console.error('Update project error:', error);
                    // Revert optimistic update on error
                    await get().fetchProjects(false);

                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to update project';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Update project progress with optimistic update
            updateProjectProgress: async (projectId, progress) => {
                // Optimistic update
                set(state => ({
                    projects: Array.isArray(state.projects)
                        ? state.projects.map(p =>
                            (p.id === projectId || p._id === projectId)
                                ? { ...p, progress }
                                : p
                        )
                        : []
                }));

                try {
                    const response = await api.patch(`/projects/${projectId}/progress`, { progress });
                    console.log('Update progress response:', response.data);

                    const updatedProject = response.data?.data || response.data;

                    set(state => ({
                        projects: Array.isArray(state.projects)
                            ? state.projects.map(p =>
                                (p.id === projectId || p._id === projectId)
                                    ? { ...p, progress }
                                    : p
                            )
                            : [updatedProject],
                        loading: false,
                        lastFetch: Date.now()
                    }));

                    return updatedProject;
                } catch (error) {
                    console.error('Update project progress error:', error);
                    // Revert optimistic update on error
                    await get().fetchProjects(false);

                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to update project progress';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Delete project with optimistic update
            deleteProject: async (projectId) => {
                // Store original projects for potential revert
                const originalProjects = get().projects;

                // Optimistic update
                set(state => ({
                    projects: Array.isArray(state.projects)
                        ? state.projects.filter(p => p.id !== projectId && p._id !== projectId)
                        : []
                }));

                try {
                    await api.delete(`/projects/${projectId}`);
                    set({
                        loading: false,
                        lastFetch: Date.now()
                    });
                } catch (error) {
                    console.error('Delete project error:', error);
                    // Revert optimistic update on error
                    set({ projects: originalProjects });

                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to delete project';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Get single project
            fetchProjectById: async (projectId) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.get(`/projects/${projectId}`);
                    console.log('Fetch project by ID response:', response.data);

                    const project = response.data?.data || response.data;
                    set({ currentProject: project, loading: false });
                    return project;
                } catch (error) {
                    console.error('Fetch project by ID error:', error);
                    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to fetch project';
                    set({ error: errorMessage, loading: false });
                    throw error;
                }
            },

            // Get project statistics
            getProjectStats: () => {
                const { projects } = get();
                const projectsArray = Array.isArray(projects) ? projects : [];

                const totalProjects = projectsArray.length;
                const completedProjects = projectsArray.filter(p =>
                    p.progress === 100 || p.progress === "100" || p.status === "Completed"
                ).length;
                const pendingProjects = projectsArray.filter(p =>
                    p.status === "Pending" || (!p.progress || p.progress === 0 || p.progress === "0")
                ).length;
                const inProgressProjects = projectsArray.filter(p =>
                    p.status === "In Progress" || (p.progress > 0 && p.progress < 100)
                ).length;

                return {
                    total: totalProjects,
                    completed: completedProjects,
                    pending: pendingProjects,
                    inProgress: inProgressProjects
                };
            },

            // Fetch project stats from API
            fetchProjectStats: async () => {
                try {
                    const response = await api.get('/projects/stats');
                    console.log('Fetch project stats response:', response.data);
                    return response.data?.data || response.data;
                } catch (error) {
                    console.error('Fetch project stats error:', error);
                    // Fallback to calculated stats
                    return get().getProjectStats();
                }
            },

            // Get project by ID from store
            getProjectById: (projectId) => {
                const { projects } = get();
                const projectsArray = Array.isArray(projects) ? projects : [];
                return projectsArray.find(p =>
                    p.id === projectId ||
                    p.id === parseInt(projectId) ||
                    p._id === projectId
                );
            },

            // Set current project
            setCurrentProject: (project) => {
                set({ currentProject: project });
            },

            // Clear current project
            clearCurrentProject: () => {
                set({ currentProject: null });
            },

            // Clear projects
            clearProjects: () => set({
                projects: [],
                error: null,
                currentProject: null,
                initialized: false,
                lastFetch: null
            }),

            // Clear error
            clearError: () => set({ error: null }),

            // Reset store
            resetStore: () => set({
                projects: [],
                loading: false,
                error: null,
                currentProject: null,
                initialized: false,
                lastFetch: null
            }),

            // Refresh projects
            refreshProjects: async () => {
                return await get().fetchProjects(true);
            },

            // Check if should show loading
            shouldShowLoading: () => {
                const { loading, initialized, projects } = get();
                return loading && (!initialized || projects.length === 0);
            }
        }),
        {
            name: 'project-storage',
            partialize: (state) => ({
                projects: Array.isArray(state.projects) ? state.projects : [],
                currentProject: state.currentProject,
                initialized: state.initialized,
                lastFetch: state.lastFetch
            }),
        }
    )
);