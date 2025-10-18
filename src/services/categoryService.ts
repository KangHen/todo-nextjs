import { Category, CreateCategoryData } from '@/types';
import { localStorageService } from '@/lib/localStorage';

class CategoryService {
  async getAllCategories(userId: string): Promise<Category[]> {
    try {
      const categories = localStorageService.getCategoriesByUserId(userId);
      // Add todo count to each category
      const categoriesWithCount = categories.map(category => {
        const todos = localStorageService.getTodosByUserId(userId);
        const categoryTodos = todos.filter(todo => todo.categoryId === category.id);
        return {
          ...category,
          _count: {
            todos: categoryTodos.length,
          },
        };
      });
      // Sort by creation date (newest first)
      return categoriesWithCount.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  }

  async getCategoryById(id: string, userId: string): Promise<Category | null> {
    try {
      const category = localStorageService.getCategoryById(id);
      // Ensure the category belongs to the user
      if (category && category.userId === userId) {
        // Add todo count
        const todos = localStorageService.getTodosByUserId(userId);
        const categoryTodos = todos.filter(todo => todo.categoryId === category.id);
        return {
          ...category,
          _count: {
            todos: categoryTodos.length,
          },
        };
      }
      return null;
    } catch (error) {
      throw new Error('Failed to fetch category');
    }
  }

  async createCategory(categoryData: CreateCategoryData, userId: string): Promise<Category> {
    try {
      const category = localStorageService.createCategory({
        ...categoryData,
        userId,
      });
      return {
        ...category,
        _count: {
          todos: 0,
        },
      };
    } catch (error) {
      throw new Error('Failed to create category');
    }
  }

  async updateCategory(id: string, categoryData: Partial<CreateCategoryData>, userId: string): Promise<Category> {
    try {
      // First check if the category belongs to the user
      const existingCategory = localStorageService.getCategoryById(id);
      if (!existingCategory || existingCategory.userId !== userId) {
        throw new Error('Category not found or unauthorized');
      }

      const updatedCategory = localStorageService.updateCategory(id, categoryData);
      if (!updatedCategory) {
        throw new Error('Failed to update category');
      }

      // Add todo count
      const todos = localStorageService.getTodosByUserId(userId);
      const categoryTodos = todos.filter(todo => todo.categoryId === id);
      
      return {
        ...updatedCategory,
        _count: {
          todos: categoryTodos.length,
        },
      };
    } catch (error) {
      throw new Error('Failed to update category');
    }
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    try {
      // First check if the category belongs to the user
      const existingCategory = localStorageService.getCategoryById(id);
      if (!existingCategory || existingCategory.userId !== userId) {
        throw new Error('Category not found or unauthorized');
      }

      const deleted = localStorageService.deleteCategory(id);
      if (!deleted) {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      throw new Error('Failed to delete category');
    }
  }

  async getCategoryWithTodos(id: string, userId: string) {
    try {
      const category = localStorageService.getCategoryById(id);
      if (!category || category.userId !== userId) {
        throw new Error('Category not found or unauthorized');
      }

      const todos = localStorageService.getTodosByUserId(userId);
      const categoryTodos = todos.filter(todo => todo.categoryId === id);
      
      return {
        ...category,
        todos: categoryTodos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        _count: {
          todos: categoryTodos.length,
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch category with todos');
    }
  }
}

export const categoryService = new CategoryService();