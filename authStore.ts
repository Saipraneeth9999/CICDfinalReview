import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    fullName: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    login: (user, accessToken, refreshToken) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
    },

    initAuth: () => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');
        if (userStr && token) {
            set({ user: JSON.parse(userStr), isAuthenticated: true });
        }
    },
}));
