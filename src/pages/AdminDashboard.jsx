import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Calendar,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalOrganizations: 0,
    totalUniversities: 0,
    totalInternships: 0,
    totalApplications: 0,
    activeInternships: 0,
    pendingApplications: 0,
    completedInternships: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/stats'),
        fetch('http://localhost:8080/api/admin/recent-activity')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard" subtitle="System overview and analytics for Island Scholars Platform">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading admin dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const mainStats = [
    {
      name: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Organizations',
      value: stats.totalOrganizations,
      icon: Building,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Universities',
      value: stats.totalUniversities,
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      name: 'Total Internships',
      value: stats.totalInternships,
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const secondaryStats = [
    {
      name: 'Active Internships',
      value: stats.activeInternships,
      icon: Activity,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      name: 'Pending Applications',
      value: stats.pendingApplications,
      icon: AlertTriangle,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Total Applications',
      value: stats.totalApplications,
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      name: 'Completed',
      value: stats.completedInternships,
      icon: Calendar,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="System overview and analytics for Island Scholars Platform">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-primary-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-primary-black mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {secondaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-primary-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-primary-black mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-primary-black">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 10).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-red to-accent-pink rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-primary-black">{activity.description}</p>
                      <p className="text-xs text-neutral-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary-black mb-2">No recent activity</h3>
                <p className="text-neutral-600">System activity will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-primary-black">System Health</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-primary-black">Database</span>
                </div>
                <span className="text-sm text-green-600">Healthy</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-primary-black">API Services</span>
                </div>
                <span className="text-sm text-green-600">Online</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-primary-black">Email Service</span>
                </div>
                <span className="text-sm text-green-600">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-primary-black">SMS Service</span>
                </div>
                <span className="text-sm text-yellow-600">Limited</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Analytics */}
      <div className="mt-8 bg-primary-white rounded-xl shadow-sm border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-primary-black">Platform Analytics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-accent-soft-red to-accent-soft-pink rounded-lg">
              <h3 className="text-lg font-semibold text-primary-black mb-2">Application Success Rate</h3>
              <div className="text-3xl font-bold text-primary-red mb-2">
                {stats.totalApplications > 0 
                  ? Math.round((stats.totalApplications - stats.pendingApplications) / stats.totalApplications * 100)
                  : 0
                }%
              </div>
              <p className="text-sm text-neutral-600">Applications processed</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-accent-soft-red to-accent-soft-pink rounded-lg">
              <h3 className="text-lg font-semibold text-primary-black mb-2">Average Internships per Org</h3>
              <div className="text-3xl font-bold text-primary-red mb-2">
                {stats.totalOrganizations > 0 
                  ? Math.round(stats.totalInternships / stats.totalOrganizations * 10) / 10
                  : 0
                }
              </div>
              <p className="text-sm text-neutral-600">Internships posted</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-accent-soft-red to-accent-soft-pink rounded-lg">
              <h3 className="text-lg font-semibold text-primary-black mb-2">Students per University</h3>
              <div className="text-3xl font-bold text-primary-red mb-2">
                {stats.totalUniversities > 0 
                  ? Math.round(stats.totalStudents / stats.totalUniversities)
                  : 0
                }
              </div>
              <p className="text-sm text-neutral-600">Average enrollment</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;