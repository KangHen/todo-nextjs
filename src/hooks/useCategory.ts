"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTodoStore } from "@/store/todoStore";
import { categoryService } from "@/services/categoryService";
import { Category, CreateCategoryData } from "@/types";

export const useCategory = () => {
  const { user } = useAuthStore();
  const {
    categories,
    isLoading,
    error,
    setCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    setLoading,
    setError,
    clearError,
  } = useTodoStore();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchCategories = async () => {
    if (!user) return;

    try {
      setLoading(true);
      clearError();
      const categories = await categoryService.getAllCategories(user.id);
      setCategories(categories);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryData) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      setIsCreating(true);
      clearError();
      const newCategory = await categoryService.createCategory(
        categoryData,
        user.id
      );
      addCategory(newCategory);
      return { success: true, category: newCategory };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create category";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsCreating(false);
    }
  };

  const updateCategoryById = async (
    id: string,
    categoryData: Partial<CreateCategoryData>
  ) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      setIsUpdating(id);
      clearError();
      const updatedCategory = await categoryService.updateCategory(
        id,
        categoryData,
        user.id
      );
      updateCategory(id, updatedCategory);
      return { success: true, category: updatedCategory };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update category";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteCategoryById = async (id: string) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      setIsDeleting(id);
      clearError();
      await categoryService.deleteCategory(id, user.id);
      deleteCategory(id);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete category";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(null);
    }
  };

  const getCategoryById = async (id: string): Promise<Category | null> => {
    if (!user) return null;

    try {
      clearError();
      const category = await categoryService.getCategoryById(id, user.id);
      return category;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch category"
      );
      return null;
    }
  };

  const getCategoryWithTodos = async (id: string) => {
    if (!user) return null;

    try {
      clearError();
      const category = await categoryService.getCategoryWithTodos(id, user.id);
      return category;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch category with todos"
      );
      return null;
    }
  };

  const refetch = fetchCategories;

  return {
    categories,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createCategory,
    updateCategory: updateCategoryById,
    deleteCategory: deleteCategoryById,
    getCategoryById,
    getCategoryWithTodos,
    refetch,
    clearError,
  };
};
