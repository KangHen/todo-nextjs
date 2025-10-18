import { Todo, CreateTodoData, UpdateTodoData, Priority } from '@/types';
import { localStorageService } from '@/lib/localStorage';

class TodoService {
  async getAllTodos(userId: string): Promise<Todo[]> {
    try {
      const todos = localStorageService.getTodosByUserId(userId);
      const categories = localStorageService.getCategoriesByUserId(userId);
      
      // Add category information to each todo
      const todosWithCategories = todos.map(todo => {
        const category = todo.categoryId 
          ? categories.find(cat => cat.id === todo.categoryId)
          : null;
        
        return {
          ...todo,
          category: category || undefined,
        };
      });
      
      // Sort by creation date (newest first)
      return todosWithCategories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      throw new Error('Failed to fetch todos');
    }
  }

  async getTodoById(id: string, userId: string): Promise<Todo | null> {
    try {
      const todo = localStorageService.getTodoById(id);
      // Ensure the todo belongs to the user
      if (todo && todo.userId === userId) {
        // Add category information if needed
        if (todo.categoryId) {
          const category = localStorageService.getCategoryById(todo.categoryId);
          return {
            ...todo,
            category: category || undefined,
          };
        }
        return todo;
      }
      return null;
    } catch (error) {
      throw new Error('Failed to fetch todo');
    }
  }

  async createTodo(todoData: CreateTodoData, userId: string): Promise<Todo> {
    try {
      const todo = localStorageService.createTodo({
        ...todoData,
        userId,
        completed: false,
        priority: todoData.priority || Priority.MEDIUM,
      });
      
      // Add category information if needed
      if (todo.categoryId) {
        const category = localStorageService.getCategoryById(todo.categoryId);
        return {
          ...todo,
          category: category || undefined,
        };
      }
      
      return todo;
    } catch (error) {
      throw new Error('Failed to create todo');
    }
  }

  async updateTodo(id: string, todoData: UpdateTodoData, userId: string): Promise<Todo> {
    try {
      // First check if the todo belongs to the user
      const existingTodo = localStorageService.getTodoById(id);
      if (!existingTodo || existingTodo.userId !== userId) {
        throw new Error('Todo not found or unauthorized');
      }

      const updatedTodo = localStorageService.updateTodo(id, todoData);
      if (!updatedTodo) {
        throw new Error('Failed to update todo');
      }
      
      // Add category information if needed
      if (updatedTodo.categoryId) {
        const category = localStorageService.getCategoryById(updatedTodo.categoryId);
        return {
          ...updatedTodo,
          category: category || undefined,
        };
      }
      
      return updatedTodo;
    } catch (error) {
      throw new Error('Failed to update todo');
    }
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    try {
      // First check if the todo belongs to the user
      const existingTodo = localStorageService.getTodoById(id);
      if (!existingTodo || existingTodo.userId !== userId) {
        throw new Error('Todo not found or unauthorized');
      }

      const deleted = localStorageService.deleteTodo(id);
      if (!deleted) {
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      throw new Error('Failed to delete todo');
    }
  }

  async toggleTodoComplete(id: string, userId: string): Promise<Todo> {
    try {
      const todo = localStorageService.getTodoById(id);
      if (!todo || todo.userId !== userId) {
        throw new Error('Todo not found or unauthorized');
      }

      const updatedTodo = localStorageService.updateTodo(id, {
        completed: !todo.completed,
      });

      if (!updatedTodo) {
        throw new Error('Failed to toggle todo completion');
      }

      // Add category information if needed
      if (updatedTodo.categoryId) {
        const category = localStorageService.getCategoryById(updatedTodo.categoryId);
        return {
          ...updatedTodo,
          category: category || undefined,
        };
      }

      return updatedTodo;
    } catch (error) {
      throw new Error('Failed to toggle todo completion');
    }
  }

  async getTodosByCategory(categoryId: string, userId: string): Promise<Todo[]> {
    try {
      const todos = localStorageService.getTodosByUserId(userId);
      const categoryTodos = todos.filter(todo => todo.categoryId === categoryId);
      const category = localStorageService.getCategoryById(categoryId);
      
      // Add category information to each todo
      const todosWithCategory = categoryTodos.map(todo => ({
        ...todo,
        category: category || undefined,
      }));
      
      // Sort by creation date (newest first)
      return todosWithCategory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      throw new Error('Failed to fetch todos by category');
    }
  }

  async getTodosByPriority(priority: Priority, userId: string): Promise<Todo[]> {
    try {
      const todos = localStorageService.getTodosByUserId(userId);
      const priorityTodos = todos.filter(todo => todo.priority === priority);
      const categories = localStorageService.getCategoriesByUserId(userId);
      
      // Add category information to each todo
      const todosWithCategories = priorityTodos.map(todo => {
        const category = todo.categoryId 
          ? categories.find(cat => cat.id === todo.categoryId)
          : null;
        
        return {
          ...todo,
          category: category || undefined,
        };
      });
      
      // Sort by creation date (newest first)
      return todosWithCategories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      throw new Error('Failed to fetch todos by priority');
    }
  }
}

export const todoService = new TodoService();