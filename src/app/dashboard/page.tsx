'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTodo } from '@/hooks/useTodo';
import { useCategory } from '@/hooks/useCategory';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, Clock, Target, TrendingUp, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { todos, isLoading: todosLoading } = useTodo();
  const { categories, isLoading: categoriesLoading } = useCategory();
  const { getUserStats, isLoading: statsLoading } = useUser();


  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = todos.filter(todo => !todo.completed).length;
  const completionRate = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;

  const recentTodos = todos.slice(0, 5);
  const todayTodos = todos.filter(todo => {
    const today = new Date();
    const todoDate = new Date(todo.createdAt);
    return todoDate.toDateString() === today.toDateString();
  });

  const highPriorityTodos = todos.filter(todo => todo.priority === 'HIGH' && !todo.completed);

  if (todosLoading || categoriesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || user?.username}!</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/todos">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Todo
            </Button>
          </Link>
          <Link href="/categories">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todos.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTodos} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTodos}</div>
            <p className="text-xs text-muted-foreground">
              {highPriorityTodos.length} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Organize your tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Todos */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Todos</CardTitle>
            <CardDescription>Your latest tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTodos.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No todos yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first todo.</p>
                <div className="mt-6">
                  <Link href="/todos/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Todo
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTodos.map((todo) => (
                  <div key={todo.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      todo.completed ? 'bg-green-500' : 
                      todo.priority === 'HIGH' ? 'bg-red-500' :
                      todo.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {todo.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {todo.category?.name || 'No category'}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Todos */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Todos</CardTitle>
            <CardDescription>Tasks created today</CardDescription>
          </CardHeader>
          <CardContent>
            {todayTodos.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No todos today</h3>
                <p className="mt-1 text-sm text-gray-500">Create some tasks for today!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTodos.map((todo) => (
                  <div key={todo.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      todo.completed ? 'bg-green-500' : 
                      todo.priority === 'HIGH' ? 'bg-red-500' :
                      todo.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {todo.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {todo.category?.name || 'No category'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/todos">
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="mr-2 h-4 w-4" />
                View All Todos
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" className="w-full justify-start">
                <Target className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}