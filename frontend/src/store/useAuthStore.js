import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const res = await api.post('/auth/login', { email, password });
                    const { token, user } = res.data;
                    set({ user, token, isAuthenticated: true, isLoading: false });
                    return { success: true };
                } catch (error) {
                    set({ isLoading: false });
                    return {
                        success: false,
                        message: error.response?.data?.message || 'Login failed',
                    };
                }
            },

            register: async (username, email, password) => {
                set({ isLoading: true });
                try {
                    const res = await api.post('/auth/register', { username, email, password });
                    const { token, user } = res.data;
                    set({ user, token, isAuthenticated: true, isLoading: false });
                    return { success: true };
                } catch (error) {
                    set({ isLoading: false });
                    return {
                        success: false,
                        message: error.response?.data?.message || 'Registration failed',
                    };
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            getToken: () => get().token,
        }),
        {
            name: 'margin-auth',
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);

export default useAuthStore;
