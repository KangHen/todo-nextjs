import { LoginCredentials, RegisterData, User } from '@/types';
import { localStorageService } from '@/lib/localStorage';

const API_BASE = 'https://dummyjson.com';

class AuthService {
  async login(credentials: LoginCredentials) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // For localStorage implementation, we'll create/update user locally
      let user = localStorageService.getUserByUsername(credentials.username);
      
      if (!user) {
        // Create new user in localStorage if doesn't exist
        user = localStorageService.createUser({
          email: data.email || `${credentials.username}@example.com`,
          name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.username,
          username: data.username,
          password: credentials.password, // In real app, this would be hashed
          avatar: data.image,
        });
      } else {
        // Update existing user with fresh data from API
        localStorageService.updateUser(user.id, {
          email: data.email || user.email,
          name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : user.name,
          avatar: data.image || user.avatar,
        });
        user = localStorageService.getUserByUsername(credentials.username);
      }

      // Store in localStorage for persistence
      localStorageService.setCurrentUser(user);
      localStorageService.setAuthToken(data.token);

      return {
        user: user!,
        token: data.token,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async register(userData: RegisterData) {
    try {
      // Check if user already exists
      const existingUser = localStorageService.getUserByEmail(userData.email) ||
                           localStorageService.getUserByUsername(userData.username);
      
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Create new user in localStorage
      const user = localStorageService.createUser(userData);

      // Auto-login after registration
      const loginResult = await this.login({
        username: userData.username,
        password: userData.password,
      });

      return { user: loginResult.user };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  async getCurrentUser(token: string) {
    try {
      // First try to get from localStorage
      const localUser = localStorageService.getCurrentUser();
      if (localUser) {
        return localUser;
      }

      // If not in localStorage, try to fetch from API
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get current user');
      }

      const data = await response.json();
      
      // Create or update user in localStorage
      let user = localStorageService.getUserByUsername(data.username);
      
      if (!user) {
        user = localStorageService.createUser({
          email: data.email || `${data.username}@example.com`,
          name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.username,
          username: data.username,
          password: '', // Password not returned from API
          avatar: data.image,
        });
      } else {
        localStorageService.updateUser(user.id, {
          email: data.email || user.email,
          name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : user.name,
          avatar: data.image || user.avatar,
        });
        user = localStorageService.getUserByUsername(data.username);
      }

      // Store in localStorage
      localStorageService.setCurrentUser(user!);
      localStorageService.setAuthToken(token);

      return user!;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get current user');
    }
  }

  logout() {
    // Clear localStorage
    localStorageService.setCurrentUser(null);
    localStorageService.setAuthToken(null);
  }
}

export const authService = new AuthService();