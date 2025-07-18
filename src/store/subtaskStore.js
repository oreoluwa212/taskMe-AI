// src/store/subtaskStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useSubtaskStore = create(
    persist(
        (set, get) => ({
            // State
            subtasks: [],
            subtaskStats: null,
            loading: false,
            error: null,
            generatingSubtasks: false,

            // Actions
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            setGeneratingSubtasks: (generating) => set({ generatingSubtasks: generating }),

            // Generate AI subtasks for a project
            generateAISubtasks: async (projectId, regenerate = false) => {
                set({ generatingSubtasks: true, error: null });
                try {
                    const response = await api.post(`/subtasks/projects/${projectId}/generate`, {
                        regenerate,
                    });

                    // Handle response structure - could be nested in data or direct
                    const responseData = response.data;
                    const newSubtasks = responseData.subtasks || responseData.data?.subtasks || responseData;

                    // Update subtasks for this project
                    set((state) => ({
                        subtasks: [
                            ...state.subtasks.filter(subtask =>
                                subtask.projectId !== projectId &&
                                subtask.project !== projectId
                            ),
                            ...newSubtasks
                        ],
                        generatingSubtasks: false,
                    }));

                    return newSubtasks;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to generate subtasks',
                        generatingSubtasks: false
                    });
                    throw error;
                }
            },

            // Get all subtasks for a project
            getProjectSubtasks: async (projectId) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.get(`/subtasks/projects/${projectId}`);
                    const responseData = response.data;
                    const projectSubtasks = responseData.subtasks || responseData.data?.subtasks || responseData;

                    // Update subtasks for this project
                    set((state) => ({
                        subtasks: [
                            ...state.subtasks.filter(subtask =>
                                subtask.projectId !== projectId &&
                                subtask.project !== projectId
                            ),
                            ...projectSubtasks
                        ],
                        loading: false,
                    }));

                    return projectSubtasks;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch subtasks',
                        loading: false
                    });
                    throw error;
                }
            },

            // Create a new subtask
            createSubtask: async (projectId, subtaskData) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.post(`/subtasks/projects/${projectId}`, subtaskData);
                    const responseData = response.data;
                    const newSubtask = responseData.subtask || responseData.data?.subtask || responseData;

                    set((state) => ({
                        subtasks: [...state.subtasks, newSubtask],
                        loading: false,
                    }));

                    return newSubtask;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to create subtask',
                        loading: false
                    });
                    throw error;
                }
            },

            // Update a subtask
            updateSubtask: async (subtaskId, updates) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.put(`/subtasks/${subtaskId}`, updates);
                    const responseData = response.data;
                    const updatedSubtask = responseData.subtask || responseData.data?.subtask || responseData;

                    set((state) => ({
                        subtasks: state.subtasks.map(subtask =>
                            (subtask.id === subtaskId || subtask._id === subtaskId)
                                ? { ...subtask, ...updatedSubtask }
                                : subtask
                        ),
                        loading: false,
                    }));

                    return updatedSubtask;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to update subtask',
                        loading: false
                    });
                    throw error;
                }
            },

            // Delete a subtask
            deleteSubtask: async (subtaskId) => {
                set({ loading: true, error: null });
                try {
                    await api.delete(`/subtasks/${subtaskId}`);

                    set((state) => ({
                        subtasks: state.subtasks.filter(subtask =>
                            subtask.id !== subtaskId && subtask._id !== subtaskId
                        ),
                        loading: false,
                    }));
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to delete subtask',
                        loading: false
                    });
                    throw error;
                }
            },

            // Get subtask statistics
            getSubtaskStats: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await api.get('/subtasks/stats');
                    const responseData = response.data;
                    const stats = responseData.stats || responseData.data?.stats || responseData;

                    set({
                        subtaskStats: stats,
                        loading: false
                    });

                    return stats;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Failed to fetch subtask stats',
                        loading: false
                    });
                    throw error;
                }
            },

            // Get subtasks for a specific project (from local state)
            getSubtasksByProjectId: (projectId) => {
                return get().subtasks.filter(subtask =>
                    subtask.projectId === projectId || subtask.project === projectId
                );
            },

            // Clear subtasks for a project
            clearProjectSubtasks: (projectId) => {
                set((state) => ({
                    subtasks: state.subtasks.filter(subtask =>
                        subtask.projectId !== projectId && subtask.project !== projectId
                    )
                }));
            },

            // Clear all subtasks
            clearAllSubtasks: () => set({ subtasks: [], subtaskStats: null }),

            // Mark subtask as complete
            markSubtaskComplete: async (subtaskId) => {
                return get().updateSubtask(subtaskId, { status: 'Completed' });
            },

            // Mark subtask as pending
            markSubtaskPending: async (subtaskId) => {
                return get().updateSubtask(subtaskId, { status: 'Pending' });
            },

            // Mark subtask as in progress
            markSubtaskInProgress: async (subtaskId) => {
                return get().updateSubtask(subtaskId, { status: 'In Progress' });
            },
        }),
        {
            name: 'subtask-store',
            partialize: (state) => ({
                subtasks: state.subtasks,
                subtaskStats: state.subtaskStats,
            }),
        }
    )
);

export default useSubtaskStore;