import { create } from 'zustand';
import { TodoState, Todo, Category } from '@/types';

interface TodoStore extends TodoState {
  setTodos: (todos: Todo[]) => void;
  setCategories: (categories: Category[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  categories: [],
  isLoading: false,
  error: null,

  setTodos: (todos: Todo[]) => {
    set({ todos });
  },

  setCategories: (categories: Category[]) => {
    set({ categories });
  },

  addTodo: (todo: Todo) => {
    set((state) => ({
      todos: [...state.todos, todo],
    }));
  },

  updateTodo: (id: string, todoData: Partial<Todo>) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...todoData } : todo
      ),
    }));
  },

  deleteTodo: (id: string) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },

  addCategory: (category: Category) => {
    set((state) => ({
      categories: [...state.categories, category],
    }));
  },

  updateCategory: (id: string, categoryData: Partial<Category>) => {
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...categoryData } : category
      ),
    }));
  },

  deleteCategory: (id: string) => {
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));