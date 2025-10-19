"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { LoginCredentials, RegisterData, User } from "@/types";

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setLoading,
    updateUser,
    initializeFromStorage,
  } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    if (token && !user && !isLoading) {
      setLoading(true);
      authService
        .getCurrentUser(token)
        .then((currentUser) => {
          login(currentUser, token);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token, user, isLoading, login, logout, setLoading]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const { user, token } = await authService.login(credentials);
      login(user, token);
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const { user } = await authService.register(userData);
      // Registration auto-logs in the user, so we just need to navigate
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    logout();
    router.push("/");
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    try {
      if (user) {
        updateUser(userData);
        return { success: true };
      }
      return { success: false, error: "No user logged in" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Update failed",
      };
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser: handleUpdateUser,
  };
};
