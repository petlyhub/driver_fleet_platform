import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  sessionId: string | null;
  login: (sessionId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      sessionId: null,
      login: (sessionId: string) => set({ 
        isAuthenticated: true, 
        sessionId,
        token: sessionId 
      }),
      logout: () => set({ 
        isAuthenticated: false, 
        sessionId: null,
        token: null 
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
