import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/signin';
    switch (user.role) {
      case 'student': return '/student-dashboard';
      case 'organization': return '/organization-dashboard';
      case 'university': return '/university-dashboard';
      case 'admin': return '/admin-dashboard';
      default: return '/profile';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setShowNotifications(false);
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <nav className="bg-primary-white shadow-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-red to-accent-pink rounded-lg flex items-center justify-center">
                <span className="text-primary-white font-bold text-sm">IS</span>
              </div>
              <span className="text-xl font-bold text-primary-black">Island Scholars</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link to="/internships" className="text-neutral-600 hover:text-primary-red px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Internships
              </Link>
              <Link to="/organizations" className="text-neutral-600 hover:text-primary-red px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Organizations
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to={getDashboardLink()} 
                    className="text-neutral-600 hover:text-primary-red px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>

                  {/* Notifications */}
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-neutral-600 hover:text-primary-black hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-red text-primary-white text-xs rounded-full flex items-center justify-center font-medium">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-96 bg-primary-white rounded-lg shadow-lg border border-neutral-200 z-50 max-h-96 overflow-hidden">
                        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-primary-black">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-primary-red hover:text-accent-dark-red font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.slice(0, 10).map((notification) => (
                              <div 
                                key={notification.id} 
                                className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors ${
                                  !notification.isRead ? 'bg-accent-soft-red' : ''
                                }`}
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-primary-black">{notification.title}</h4>
                                    <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                                    <p className="text-xs text-neutral-500 mt-2">
                                      {formatNotificationTime(notification.createdAt)}
                                    </p>
                                  </div>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-primary-red rounded-full mt-2 ml-2"></div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center">
                              <Bell className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                              <p className="text-neutral-600">No notifications yet</p>
                            </div>
                          )}
                        </div>
                        {notifications.length > 10 && (
                          <div className="p-4 border-t border-neutral-200">
                            <button className="text-sm text-primary-red hover:text-accent-dark-red font-medium w-full text-center">
                              View all notifications
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Settings */}
                  <Link 
                    to={`/${user.role}-settings`}
                    className="p-2 text-neutral-600 hover:text-primary-black hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>

                  {/* Profile dropdown */}
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-2 p-2 text-neutral-600 hover:text-primary-black hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-red to-accent-pink rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-white" />
                      </div>
                      <span className="hidden lg:block text-sm font-medium text-primary-black">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-primary-white rounded-lg shadow-lg border border-neutral-200 z-50">
                        <div className="p-4 border-b border-neutral-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-red to-accent-pink rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-primary-white" />
                            </div>
                            <div>
                              <p className="font-medium text-primary-black">{user?.firstName} {user?.lastName}</p>
                              <p className="text-sm text-neutral-600">{user?.email}</p>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-soft-red text-primary-red mt-1">
                                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Profile Settings
                          </Link>
                          <Link
                            to={`/${user?.role}-settings`}
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Account Settings
                          </Link>
                        </div>
                        <div className="border-t border-neutral-200 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-accent-dark-red hover:bg-neutral-50"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/signup" className="bg-gradient-to-r from-accent-pink to-accent-burgundy text-primary-white px-4 py-2 rounded-md text-sm font-medium hover:from-accent-dark-red hover:to-accent-persian-800 transition-all duration-300">
                    Sign Up
                  </Link>
                  <Link to="/signin" className="bg-gradient-to-r from-primary-red to-accent-pink text-primary-white px-4 py-2 rounded-md text-sm font-medium hover:from-accent-dark-red hover:to-primary-red transition-all duration-300">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-600 hover:text-primary-red p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-white border-t border-neutral-200">
              <Link to="/internships" className="text-neutral-600 hover:text-primary-red block px-3 py-2 rounded-md text-base font-medium">
                Internships
              </Link>
              <Link to="/organizations" className="text-neutral-600 hover:text-primary-red block px-3 py-2 rounded-md text-base font-medium">
                Organizations
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="text-neutral-600 hover:text-primary-red block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-neutral-600 hover:text-accent-dark-red block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signup" className="text-neutral-600 hover:text-primary-red block px-3 py-2 rounded-md text-base font-medium">
                    Sign Up
                  </Link>
                  <Link to="/signin" className="text-neutral-600 hover:text-primary-red block px-3 py-2 rounded-md text-base font-medium">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;