import { User, Category, Todo, Priority } from '@/types';

const STORAGE_KEYS = {
  USERS: 'todoapp_users',
  CATEGORIES: 'todoapp_categories', 
  TODOS: 'todoapp_todos',
  CURRENT_USER: 'todoapp_current_user',
  AUTH_TOKEN: 'todoapp_auth_token'
} as const;

export class LocalStorageService {
  // Generic methods
  private get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error getting data from localStorage for key ${key}:`, error);
      return [];
    }
  }

  private set<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting data to localStorage for key ${key}:`, error);
    }
  }

  private getSingle<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting single item from localStorage for key ${key}:`, error);
      return null;
    }
  }

  private setSingle<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting single item to localStorage for key ${key}:`, error);
    }
  }

  private remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  // User methods
  getUsers(): User[] {
    return this.get<User>(STORAGE_KEYS.USERS);
  }

  saveUsers(users: User[]): void {
    this.set(STORAGE_KEYS.USERS, users);
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  getUserByUsername(username: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.username === username) || null;
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateUser(id: string, userData: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date(),
    };
    this.saveUsers(users);
    return users[index];
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    if (filteredUsers.length === users.length) return false;
    
    this.saveUsers(filteredUsers);
    // Also delete user's todos and categories
    this.deleteUserTodos(id);
    this.deleteUserCategories(id);
    return true;
  }

  // Category methods
  getCategories(): Category[] {
    return this.get<Category>(STORAGE_KEYS.CATEGORIES);
  }

  saveCategories(categories: Category[]): void {
    this.set(STORAGE_KEYS.CATEGORIES, categories);
  }

  getCategoriesByUserId(userId: string): Category[] {
    const categories = this.getCategories();
    return categories.filter(category => category.userId === userId);
  }

  getCategoryById(id: string): Category | null {
    const categories = this.getCategories();
    return categories.find(category => category.id === id) || null;
  }

  createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...categoryData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  }

  updateCategory(id: string, categoryData: Partial<Category>): Category | null {
    const categories = this.getCategories();
    const index = categories.findIndex(category => category.id === id);
    if (index === -1) return null;
    
    categories[index] = {
      ...categories[index],
      ...categoryData,
      updatedAt: new Date(),
    };
    this.saveCategories(categories);
    return categories[index];
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    if (filteredCategories.length === categories.length) return false;
    
    this.saveCategories(filteredCategories);
    // Update todos that had this category to remove the category reference
    this.removeCategoryFromTodos(id);
    return true;
  }

  private deleteUserCategories(userId: string): void {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(category => category.userId !== userId);
    this.saveCategories(filteredCategories);
  }

  // Todo methods
  getTodos(): Todo[] {
    return this.get<Todo>(STORAGE_KEYS.TODOS);
  }

  saveTodos(todos: Todo[]): void {
    this.set(STORAGE_KEYS.TODOS, todos);
  }

  getTodosByUserId(userId: string): Todo[] {
    const todos = this.getTodos();
    return todos.filter(todo => todo.userId === userId);
  }

  getTodoById(id: string): Todo | null {
    const todos = this.getTodos();
    return todos.find(todo => todo.id === id) || null;
  }

  createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo {
    const todos = this.getTodos();
    const newTodo: Todo = {
      ...todoData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    todos.push(newTodo);
    this.saveTodos(todos);
    return newTodo;
  }

  updateTodo(id: string, todoData: Partial<Todo>): Todo | null {
    const todos = this.getTodos();
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;
    
    todos[index] = {
      ...todos[index],
      ...todoData,
      updatedAt: new Date(),
    };
    this.saveTodos(todos);
    return todos[index];
  }

  deleteTodo(id: string): boolean {
    const todos = this.getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    if (filteredTodos.length === todos.length) return false;
    
    this.saveTodos(filteredTodos);
    return true;
  }

  private deleteUserTodos(userId: string): void {
    const todos = this.getTodos();
    const filteredTodos = todos.filter(todo => todo.userId !== userId);
    this.saveTodos(filteredTodos);
  }

  private removeCategoryFromTodos(categoryId: string): void {
    const todos = this.getTodos();
    const updatedTodos = todos.map(todo => 
      todo.categoryId === categoryId 
        ? { ...todo, categoryId: undefined }
        : todo
    );
    this.saveTodos(updatedTodos);
  }

  // Auth methods
  getCurrentUser(): User | null {
    return this.getSingle<User>(STORAGE_KEYS.CURRENT_USER);
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      this.setSingle(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      this.remove(STORAGE_KEYS.CURRENT_USER);
    }
  }

  getAuthToken(): string | null {
    return this.getSingle<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.setSingle(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      this.remove(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  // Utility methods
  clearAll(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Statistics methods
  getUserStats(userId: string) {
    const userTodos = this.getTodosByUserId(userId);
    const userCategories = this.getCategoriesByUserId(userId);
    
    const completedTodos = userTodos.filter(todo => todo.completed).length;
    const pendingTodos = userTodos.filter(todo => !todo.completed).length;
    
    return {
      totalTodos: userTodos.length,
      totalCategories: userCategories.length,
      completedTodos,
      pendingTodos,
    };
  }
}

export const localStorageService = new LocalStorageService();