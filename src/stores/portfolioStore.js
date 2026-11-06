import { create } from 'zustand';
import api from '../lib/api';

export const usePortfolioStore = create((set, get) => ({
    hero: null,
    about: null,
    projects: [],
    experiences: [],
    messages: [],
    settings: null,
    isLoading: false,
    error: null,

    // Settings Actions
    fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/portfolio/settings');
            set({ settings: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
    updateSettings: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post(`/portfolio/settings/${id}`, data);
            set({ settings: res.data, isLoading: false });
            return res.data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Hero Actions
    fetchHero: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/portfolio/hero');
            set({ hero: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
    updateHero: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post(`/portfolio/hero/${id}`, data);
            set({ hero: res.data, isLoading: false });
            return res.data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // About Actions
    fetchAbout: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/portfolio/about');
            set({ about: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
    updateAbout: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post(`/portfolio/about/${id}`, data);
            set({ about: res.data, isLoading: false });
            return res.data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Projects CRUD
    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/portfolio/projects');
            set({ projects: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
    saveProject: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/portfolio/projects', data);
            set({ isLoading: false });
            get().fetchProjects();
            return res.data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },
    deleteProject: async (id) => {
        try {
            await api.delete(`/portfolio/projects/${id}`);
            get().fetchProjects();
        } catch (err) {
            set({ error: err.message });
            throw err;
        }
    },

    // Experience CRUD
    fetchExperiences: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/portfolio/experience');
            set({ experiences: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
    saveExperience: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/portfolio/experience', data);
            set({ isLoading: false });
            get().fetchExperiences();
            return res.data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },
    deleteExperience: async (id) => {
        try {
            await api.delete(`/portfolio/experience/${id}`);
            get().fetchExperiences();
        } catch (err) {
            set({ error: err.message });
            throw err;
        }
    },

    // Messages Inbox
    fetchMessages: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/contact');
            set({ messages: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },
}));
