"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTodoStore } from "@/store/todoStore";
import { todoService } from "@/services/todoService";
import { Todo, CreateTodoData, UpdateTodoData } from "@/types";

export const useTodo = () => {
  const { user } = useAuthStore();
  const {
    todos,
    isLoading,
    error,
    setTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    setLoading,
    setError,
    clearError,
  } = useTodoStore();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchTodos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      clearError();
      const todos = await todoService.getAllTodos(user.id);
      setTodos(todos);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch todos"
      );
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData: CreateTodoData) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      setIsCreating(true);
      clearError();
      const newTodo = await todoService.createTodo(todoData, user.id);
      addTodo(newTodo);
      return { success: true, todo: newTodo };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create todo";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsCreating(false);
    }
  };

  const updateTodoById = async (id: string, todoData: UpdateTodoData) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      setIsUpdating(id);
      clearError();
      const updatedTodo = await todoService.updateTodo(id, todoData, user.id);
      updateTodo(id, updatedTodo);
      return { success: true, todo: updatedTodo };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update todo";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteTodoById = async (id: string) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      setIsDeleting(id);
      clearError();
      await todoService.deleteTodo(id, user.id);
      deleteTodo(id);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete todo";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleTodoComplete = async (id: string) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      setIsUpdating(id);
      clearError();
      const updatedTodo = await todoService.toggleTodoComplete(id, user.id);
      updateTodo(id, updatedTodo);
      return { success: true, todo: updatedTodo };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to toggle todo";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(null);
    }
  };

  const getTodoById = async (id: string): Promise<Todo | null> => {
    if (!user) return null;

    try {
      clearError();
      const todo = await todoService.getTodoById(id, user.id);
      return todo;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch todo");
      return null;
    }
  };

  const getTodosByCategory = async (categoryId: string) => {
    if (!user) return [];

    try {
      clearError();
      const todos = await todoService.getTodosByCategory(categoryId, user.id);
      return todos;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch todos by category"
      );
      return [];
    }
  };

  const refetch = fetchTodos;

  return {
    todos,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createTodo,
    updateTodo: updateTodoById,
    deleteTodo: deleteTodoById,
    toggleComplete: toggleTodoComplete,
    getTodoById,
    getTodosByCategory,
    refetch,
    clearError,
  };
};
