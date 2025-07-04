import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building, 
  BookOpen, 
  FileText, 
  Settings, 
  User,
  GraduationCap,
  BarChart3,
  Calendar,
  MessageSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: getDashboardRoute(), icon: Home, current: location.pathname === getDashboardRoute() },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...baseItems,
          { name: 'Internships', href: '/internships', icon: BookOpen, current: location.pathname === '/internships' },
          { name: 'My Applications', href: '/student-applications', icon: FileText, current: location.pathname === '/student-applications' },
          { name: 'Profile', href: '/profile', icon: User, current: location.pathname === '/profile' },
          { name: 'Settings', href: '/student-settings', icon: Settings, current: location.pathname === '/student-settings' },
        ];
      case 'organization':
        return [
          ...baseItems,
          { name: 'Post Internships', href: '/organization-internships', icon: BookOpen, current: location.pathname === '/organization-internships' },
          { name: 'Applications', href: '/organization-applications', icon: FileText, current: location.pathname === '/organization-applications' },
          { name: 'Analytics', href: '/organization-analytics', icon: BarChart3, current: location.pathname === '/organization-analytics' },
          { name: 'Settings', href: '/organization-settings', icon: Settings, current: location.pathname === '/organization-settings' },
        ];
      case 'university':
        return [
          ...baseItems,
          { name: 'Students', href: '/university-students', icon: Users, current: location.pathname === '/university-students' },
          { name: 'Supervisors', href: '/university-supervisors', icon: GraduationCap, current: location.pathname === '/university-supervisors' },
          { name: 'Reports', href: '/university-reports', icon: BarChart3, current: location.pathname === '/university-reports' },
          { name: 'Settings', href: '/university-settings', icon: Settings, current: location.pathname === '/university-settings' },
        ];
      case 'admin':
        return [
          ...baseItems,
          { name: 'Users', href: '/admin-users', icon: Users, current: location.pathname === '/admin-users' },
          { name: 'Organizations', href: '/admin-organizations', icon: Building, current: location.pathname === '/admin-organizations' },
          { name: 'Universities', href: '/admin-universities', icon: GraduationCap, current: location.pathname === '/admin-universities' },
          { name: 'Analytics', href: '/admin-analytics', icon: BarChart3, current: location.pathname === '/admin-analytics' },
          { name: 'Settings', href: '/admin-settings', icon: Settings, current: location.pathname === '/admin-settings' },
        ];
      default:
        return baseItems;
    }
  };

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'student': return '/student-dashboard';
      case 'organization': return '/organization-dashboard';
      case 'university': return '/university-dashboard';
      case 'admin': return '/admin-dashboard';
      default: return '/';
    }
  };

  const navigation = getNavigationItems();

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-primary-black transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-primary-black border-b border-neutral-800">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-red to-accent-pink rounded-lg flex items-center justify-center">
                  <span className="text-primary-white font-bold text-sm">IS</span>
                </div>
                <span className="text-xl font-bold text-primary-white">Island Scholars</span>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-primary-white p-1 rounded"
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-8 px-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      item.current
                        ? 'bg-gradient-to-r from-primary-red to-accent-pink text-primary-white shadow-lg'
                        : 'text-neutral-400 hover:text-primary-white hover:bg-neutral-800'
                    }`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <Icon className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 ${
                      item.current ? 'text-primary-white' : 'text-neutral-400 group-hover:text-primary-white'
                    }`} />
                    {!sidebarCollapsed && item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Page header */}
        <div className="bg-primary-white shadow-sm border-b border-neutral-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-black">{title}</h1>
            {subtitle && <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>}
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;