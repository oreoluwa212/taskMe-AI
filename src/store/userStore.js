// src/store/userStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,

    // Fetch user profile
    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/auth/profile');
            set({ user: response.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch profile', loading: false });
        }
    },

    // Clear user data
    clearUser: () => set({ user: null, error: null }),
}));
