// This is a simple test file to verify localStorage functionality
// You can run this in the browser console to test the localStorage service

import { localStorageService } from '../src/lib/localStorage';

// Test user creation
const testUser = {
  email: 'test@example.com',
  name: 'Test User',
  username: 'testuser',
  password: 'password123'
};

// Test category creation
const testCategory = {
  name: 'Work',
  description: 'Work related tasks',
  color: '#3B82F6'
};

// Test todo creation
const testTodo = {
  title: 'Test Todo',
  description: 'This is a test todo',
  priority: 'HIGH' as const,
  categoryId: undefined
};

console.log('Testing localStorage service...');

// Test user operations
const user = localStorageService.createUser(testUser);
console.log('Created user:', user);

const retrievedUser = localStorageService.getUserById(user.id);
console.log('Retrieved user:', retrievedUser);

// Test category operations
const category = localStorageService.createCategory({
  ...testCategory,
  userId: user.id
});
console.log('Created category:', category);

// Test todo operations
const todo = localStorageService.createTodo({
  ...testTodo,
  userId: user.id,
  categoryId: category.id
});
console.log('Created todo:', todo);

// Test user stats
const stats = localStorageService.getUserStats(user.id);
console.log('User stats:', stats);

console.log('localStorage service test completed!');