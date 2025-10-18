import { User } from '@/types';
import { localStorageService } from '@/lib/localStorage';

class UserService {
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = localStorageService.getUserById(id);
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = localStorageService.getUserByEmail(email);
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user by email');
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const user = localStorageService.getUserByUsername(username);
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user by username');
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const updatedUser = localStorageService.updateUser(id, userData);
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const deleted = localStorageService.deleteUser(id);
      if (!deleted) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const user = localStorageService.createUser(userData);
      return user;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  async getUserStats(userId: string) {
    try {
      const stats = localStorageService.getUserStats(userId);
      return stats;
    } catch (error) {
      throw new Error('Failed to fetch user stats');
    }
  }
}

export const userService = new UserService();