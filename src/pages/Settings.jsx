import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Save, 
  Bell, 
  Shield, 
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    bio: '',
    website: '',
    location: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    deadlineReminders: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      let endpoint = '';
      if (user.role === 'student') {
        endpoint = `http://localhost:8080/api/students/${user.id}`;
      } else if (user.role === 'organization') {
        endpoint = `http://localhost:8080/api/organizations/${user.organizationId}`;
      } else if (user.role === 'university') {
        endpoint = `http://localhost:8080/api/universities/${user.universityId}`;
      } else {
        endpoint = `http://localhost:8080/api/users/${user.id}`;
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          firstName: data.user?.firstName || data.firstName || user.firstName || '',
          lastName: data.user?.lastName || data.lastName || user.lastName || '',
          email: data.user?.email || data.email || user.email || '',
          phoneNumber: data.user?.phoneNumber || data.phoneNumber || user.phoneNumber || '',
          address: data.address || '',
          bio: data.bio || data.description || '',
          website: data.website || '',
          location: data.location || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let endpoint = '';
      let updateData = {};

      if (user.role === 'student') {
        endpoint = `http://localhost:8080/api/students/${user.id}`;
        updateData = {
          address: profileData.address,
          bio: profileData.bio
        };
      } else if (user.role === 'organization') {
        endpoint = `http://localhost:8080/api/organizations/${user.organizationId}`;
        updateData = {
          description: profileData.bio,
          website: profileData.website,
          location: profileData.location
        };
      } else if (user.role === 'university') {
        endpoint = `http://localhost:8080/api/universities/${user.universityId}`;
        updateData = {
          description: profileData.bio,
          website: profileData.website,
          location: profileData.location
        };
      } else {
        endpoint = `http://localhost:8080/api/users/${user.id}`;
        updateData = {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phoneNumber: profileData.phoneNumber
        };
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Error updating profile. Please try again.');
      }
    } catch (error) {
      setMessage('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage('New passwords do not match.');
      setLoading(false);
      return;
    }

    if (securityData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword
        }),
      });

      if (response.ok) {
        setMessage('Password changed successfully!');
        setSecurityData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage('Error changing password. Please check your current password.');
      }
    } catch (error) {
      setMessage('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'privacy', name: 'Privacy', icon: Eye }
  ];

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences and security">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-red to-accent-pink text-primary-white'
                        : 'text-neutral-600 hover:text-primary-black hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
            {message && (
              <div className={`mx-6 mt-6 p-4 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-primary-black mb-6">Profile Information</h2>
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          disabled={user.role === 'organization' || user.role === 'university'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          disabled={user.role === 'organization' || user.role === 'university'}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type="email"
                        className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md bg-neutral-50"
                        value={profileData.email}
                        disabled
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type="tel"
                        className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  {(user.role === 'organization' || user.role === 'university') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">
                          Website
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            type="url"
                            className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                            value={profileData.website}
                            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {user.role === 'student' && (
                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          value={profileData.address}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2">
                      {user.role === 'student' ? 'Bio' : 'Description'}
                    </label>
                    <textarea
                      rows={4}
                      className="block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder={user.role === 'student' ? 'Tell us about yourself...' : 'Describe your organization...'}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-2 border border-transparent rounded-md text-sm font-medium text-primary-white bg-gradient-to-r from-primary-red to-accent-pink hover:from-accent-dark-red hover:to-primary-red disabled:opacity-50 transition-all duration-300"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-primary-black mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-primary-black">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'applicationUpdates' && 'Get notified when your application status changes'}
                          {key === 'deadlineReminders' && 'Receive reminders about application deadlines'}
                          {key === 'systemUpdates' && 'Get notified about system updates and maintenance'}
                          {key === 'marketingEmails' && 'Receive promotional emails and newsletters'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={value}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            [key]: e.target.checked
                          })}
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-red"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-primary-black mb-6">Security Settings</h2>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="block w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-neutral-400" /> : <Eye className="h-5 w-5 text-neutral-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                        required
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Must be at least 6 characters long</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-black mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-2 border border-transparent rounded-md text-sm font-medium text-primary-white bg-gradient-to-r from-primary-red to-accent-pink hover:from-accent-dark-red hover:to-primary-red disabled:opacity-50 transition-all duration-300"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-primary-black mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-primary-black mb-2">Data Usage</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      We use your data to provide and improve our services. Your information is never shared with third parties without your consent.
                    </p>
                    <button className="text-sm text-primary-red hover:text-accent-dark-red font-medium">
                      View Privacy Policy
                    </button>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-primary-black mb-2">Account Deletion</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      If you want to delete your account, all your data will be permanently removed from our servers.
                    </p>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                      Request Account Deletion
                    </button>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-primary-black mb-2">Data Export</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      You can request a copy of all your data stored in our system.
                    </p>
                    <button className="text-sm text-primary-red hover:text-accent-dark-red font-medium">
                      Export My Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;