import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ── Actions ────────────────────────────────────────────────

      register: async ({ name, email, password, password_confirmation }) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register({ name, email, password, password_confirmation });
          const { user, token } = res.data;
          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const error = err.response?.data?.message ?? 'Registration failed.';
          set({ isLoading: false, error });
          return { success: false, error };
        }
      },

      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login({ email, password });
          const { user, token } = res.data;
          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const error = err.response?.data?.message ?? 'Invalid credentials.';
          set({ isLoading: false, error });
          return { success: false, error };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (_) {
          // swallow — clear state regardless
        } finally {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
        }
      },

      fetchUser: async () => {
        if (!get().token) return;
        try {
          const res = await authApi.user();
          set({ user: res.data, isAuthenticated: true });
        } catch (_) {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'eboss-auth',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;