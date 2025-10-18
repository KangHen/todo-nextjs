"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { User } from "@/types";

export const useUser = () => {
  const { user, updateUser: updateAuthUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserById = async (id: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await userService.getUserById(id);
      return userData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await userService.getUserByEmail(email);
      return userData;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch user by email";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserByUsername = async (username: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await userService.getUserByUsername(username);
      return userData;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch user by username";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      setIsLoading(true);
      setError(null);
      const updatedUser = await userService.updateUser(user.id, userData);
      updateAuthUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update user";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const getUserStats = async () => {
    if (!user) return null;

    try {
      setIsLoading(true);
      setError(null);
      const stats = await userService.getUserStats(user.id);
      return stats;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user stats";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    getUserById,
    getUserByEmail,
    getUserByUsername,
    updateUserProfile,
    getUserStats,
    clearError,
  };
};
