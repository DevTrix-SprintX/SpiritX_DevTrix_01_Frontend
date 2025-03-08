import React, { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import apiService from '@/services/AxiosInstence';

// Define interfaces for type safety
interface UserData {
  username: string;
  firstName: string;
  lastName: string;
  [key: string]: unknown; 
}

interface ApiResponse {status: number, user: { username: string ,firstName:  string ,lastName:  string }}


const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        setLoading(true);
        
    
        const response = await apiService.get('/auth/profile') as ApiResponse;
        console.log('User profile response:', response);
        
        if (response.status !== 200) {
          throw new Error('Failed to fetch user profile');
        }

        
        const data = response as ApiResponse;
        console.log('User data received:', data); // Add this for debugging
        
        if (data.user) {
          setUser(data.user);
        } else {
          throw new Error('User data not found in response');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleLogout = (): void => {
    // Clear token from localStorage
    localStorage.removeItem('authToken');
    // Redirect to login page
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4 text-center text-lg">Error: {error}</div>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">MyApp</span>
            </div>
            
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{user?.username || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 flex items-center transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome, {user?.firstName || 'User'}!
            </h1>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Your Profile Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Username:</span> {user?.username}</p>
                <p><span className="font-medium">Full Name:</span> {user?.firstName} {user?.lastName}</p>
                <p><span className="font-medium">User ID:</span> {user?.id}</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-md text-blue-800">
              <p className="font-medium">You are now logged in!</p>
              <p>This dashboard displays your basic profile information. You can customize this page to include any user-specific content you need.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;