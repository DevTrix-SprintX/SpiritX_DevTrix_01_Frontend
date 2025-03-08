import React, { useState, useEffect, use } from 'react';
import { LogOut, User } from 'lucide-react';
import apiService from '@/services/AxiosInstence';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { 
  Shield, 
  Menu, 
  UserCircle, 
  Edit, 
  CheckCircle, 
  Lock, 
  RefreshCw, 
  Globe, 
  Activity,
  LogIn,
  Bell,
  ArrowRight,
  LifeBuoy,
  Settings
} from 'lucide-react';

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
  const [currentTime, setCurrentTime] = useState<string>('');

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        setLoading(true);
        
        setCurrentTime(new Date().toLocaleTimeString());
    
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
    auth.logout();
    navigate('/login');
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">SecureConnect</span>
              </div>
              
              <div className="hidden ml-10 md:flex space-x-8">
                <a href="#" className="border-b-2 border-blue-500 text-gray-900 flex items-center px-1 pt-1 text-sm font-medium">
                  Dashboard
                </a>
                <a href="#" className="border-transparent hover:border-gray-300 border-b-2 text-gray-500 hover:text-gray-700 flex items-center px-1 pt-1 text-sm font-medium">
                  Settings
                </a>
                <a href="#" className="border-transparent hover:border-gray-300 border-b-2 text-gray-500 hover:text-gray-700 flex items-center px-1 pt-1 text-sm font-medium">
                  Activities
                </a>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="hidden md:flex items-center">
                <div className="flex items-center px-3 py-1 rounded-full bg-gray-100">
                  <User className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{user?.username || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1.5 rounded-md text-sm text-white bg-red-500 hover:bg-red-600 flex items-center transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  Logout
                </button>
              </div>
              <button className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
  
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="mb-6">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="px-6 py-5 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-full">
                  <User className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">
                    Welcome back, {user?.firstName || 'User'}!
                  </h1>
                  <p className="mt-1 text-blue-100">
                    Last login: {currentTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-1">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UserCircle className="h-5 w-5 mr-2 text-blue-600" />
                Profile Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-32 text-sm font-medium text-gray-500">Username</div>
                  <div className="flex-1 text-sm text-gray-900">{user?.username || 'username'}</div>
                </div>
                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-32 text-sm font-medium text-gray-500">First Name</div>
                  <div className="flex-1 text-sm text-gray-900">{user?.firstName || 'First'}</div>
                </div>
                <div className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-32 text-sm font-medium text-gray-500">Last Name</div>
                  <div className="flex-1 text-sm text-gray-900"> {user?.lastName || 'Last'}</div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 text-sm font-medium text-gray-500">Account Type</div>
                  <div className="flex-1 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      User
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full mt-2 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
  
          {/* Account Security Status */}
          <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Security Status
              </h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Account Active and Secure</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your account security status is good. You have all recommended security features enabled.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-md">
                  <div className="divide-y divide-gray-200">


                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button className="flex-1 flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Settings
                </button>
                <button className="flex-1 flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Summary */}
        <div className="mt-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </h2>
              <div className="flow-root">
                <ul className="mb-8">
                  
                  <li>
                    <div className="relative">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                            <Bell className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">No Activities</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            -
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>


                </ul>
              </div>
              <div className="mt-6 text-center">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  View All Activity
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center md:flex md:items-center md:justify-between">
            <div className="text-sm text-gray-500">
              &copy; 2025 SecureConnect. All rights reserved.
            </div>
            <div className="flex justify-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Support</span>
                <LifeBuoy className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Settings</span>
                <Settings className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy</span>
                <Lock className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Dashboard;