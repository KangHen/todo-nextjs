export interface User {
  id: string;
  email: string;
  name?: string;
  username: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    todos: number;
  };
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  userId: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TodoState {
  todos: Todo[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name?: string;
  username: string;
  password: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  categoryId?: string;
}

export interface UpdateTodoData extends Partial<CreateTodoData> {
  completed?: boolean;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
}