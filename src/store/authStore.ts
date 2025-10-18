import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "@/types";
import { localStorageService } from "@/lib/localStorage";

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User, token: string) => {
        // Store in localStorage service
        localStorageService.setCurrentUser(user);
        localStorageService.setAuthToken(token);

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // Clear from localStorage service
        localStorageService.setCurrentUser(null);
        localStorageService.setAuthToken(null);

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };

          // Update in localStorage service
          localStorageService.updateUser(currentUser.id, userData);
          localStorageService.setCurrentUser(updatedUser);

          set({
            user: updatedUser,
          });
        }
      },

      initializeFromStorage: () => {
        // Initialize auth state from localStorage service
        const storedUser = localStorageService.getCurrentUser();
        const storedToken = localStorageService.getAuthToken();

        if (storedUser) {
          set({
            user: storedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrating auth store from storage", state);
        if (state) {
          state.initializeFromStorage();
        }
      },
    }
  )
);
