import React, { useState, useEffect } from 'react';
import { Plus, Users, FileText, Calendar, Building, Edit, Eye, TrendingUp, Target, Award, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const OrganizationDashboard = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [directApplications, setDirectApplications] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [newInternship, setNewInternship] = useState({
    title: '',
    description: '',
    location: '',
    duration: '1-2 months',
    field: '',
    type: 'Full-time',
    spotsAvailable: 1,
    startDate: '',
    requirements: '',
    responsibilities: ''
  });

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const [internshipsRes, applicationsRes, directAppsRes, orgRes] = await Promise.all([
        fetch(`http://localhost:8080/api/internships/organization/${user.organizationId}`),
        fetch(`http://localhost:8080/api/applications/organization/${user.organizationId}`),
        fetch(`http://localhost:8080/api/applications/organization/${user.organizationId}/direct`),
        fetch(`http://localhost:8080/api/organizations/${user.organizationId}`)
      ]);

      if (internshipsRes.ok) {
        const internshipsData = await internshipsRes.json();
        setInternships(internshipsData);
      }

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        setApplications(applicationsData);
      }

      if (directAppsRes.ok) {
        const directAppsData = await directAppsRes.json();
        setDirectApplications(directAppsData);
      }

      if (orgRes.ok) {
        const orgData = await orgRes.json();
        setOrganization(orgData);
      }
    } catch (error) {
      console.error('Error fetching organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newInternship,
          organizationId: user.organizationId,
          requirements: newInternship.requirements.split('\n').filter(r => r.trim()),
          responsibilities: newInternship.responsibilities.split('\n').filter(r => r.trim())
        }),
      });

      if (response.ok) {
        setMessage('Internship created successfully!');
        setTimeout(() => {
          setShowCreateForm(false);
          setNewInternship({
            title: '',
            description: '',
            location: '',
            duration: '1-2 months',
            field: '',
            type: 'Full-time',
            spotsAvailable: 1,
            startDate: '',
            requirements: '',
            responsibilities: ''
          });
          setMessage('');
          fetchOrganizationData();
        }, 2000);
      } else {
        setMessage('Error creating internship. Please try again.');
      }
    } catch (error) {
      setMessage('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/${action}`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchOrganizationData();
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error(`Error ${action} application:`, error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Organization Dashboard" subtitle="Manage your internship postings and applications">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const allApplications = [...applications, ...directApplications];
  const pendingApplications = allApplications.filter(app => app.status.toLowerCase() === 'pending');

  const stats = [
    {
      name: 'Active Internships',
      value: internships.length,
      icon: Building,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Total Applications',
      value: allApplications.length,
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Pending Review',
      value: pendingApplications.length,
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Accepted',
      value: allApplications.filter(app => app.status.toLowerCase() === 'accepted').length,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const durationOptions = [
    '1-2 months',
    '1-3 months',
    '2-3 months',
    '3-4 months',
    '3-6 months',
    '6+ months'
  ];

  return (
    <DashboardLayout title={`${organization?.name || 'Organization'} Dashboard`} subtitle="Manage your internship postings and applications">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-black">Pending Applications</h2>
            </div>
            <div className="p-6">
              {pendingApplications.length > 0 ? (
                <div className="space-y-4">
                  {pendingApplications.map((application) => (
                    <div key={application.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <h3 className="font-medium text-primary-black">
                            {application.student.user.firstName} {application.student.user.lastName}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {application.internship ? application.internship.title : 'Direct Application'}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {application.student.fieldOfStudy} • {application.student.university.name}
                          </p>
                          <div className="mt-2">
                            <p className="text-sm text-neutral-600 line-clamp-2">{application.coverLetter}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="p-2 text-neutral-400 hover:text-primary-red transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApplicationAction(application.id, 'accept')}
                            className="flex-1 bg-green-600 text-primary-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleApplicationAction(application.id, 'reject')}
                            className="flex-1 bg-red-600 text-primary-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-black mb-2">No pending applications</h3>
                  <p className="text-neutral-600">New applications will appear here for review.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-black">Your Internships</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-lg hover:from-accent-dark-red hover:to-primary-red transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </button>
            </div>
            <div className="p-6">
              {internships.length > 0 ? (
                <div className="space-y-4">
                  {internships.map((internship) => (
                    <div key={internship.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-primary-red">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <h3 className="font-medium text-primary-black">{internship.title}</h3>
                          <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{internship.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                            <span>{internship.location}</span>
                            <span>{internship.duration}</span>
                            <span>{internship.spotsAvailable} spots</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-neutral-400 hover:text-primary-red transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-neutral-400 hover:text-primary-red transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">
                            {applications.filter(app => app.internship?.id === internship.id).length} applications
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            internship.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {internship.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-black mb-2">No internships posted yet</h3>
                  <p className="text-neutral-600 mb-6">Create your first internship posting to start receiving applications.</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-lg hover:from-accent-dark-red hover:to-primary-red transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Internship
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-primary-black">Application Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Direct Applications</span>
                  <span className="text-sm font-medium text-primary-black">{directApplications.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Internship Applications</span>
                  <span className="text-sm font-medium text-primary-black">{applications.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Acceptance Rate</span>
                  <span className="text-sm font-medium text-primary-black">
                    {allApplications.length > 0 
                      ? Math.round((allApplications.filter(app => app.status.toLowerCase() === 'accepted').length / allApplications.length) * 100)
                      : 0
                    }%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-soft-red to-accent-soft-pink rounded-xl p-6">
            <h3 className="font-semibold text-primary-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center text-primary-red hover:text-accent-dark-red text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Internship
              </button>
              <button className="flex items-center text-primary-red hover:text-accent-dark-red text-sm font-medium">
                <FileText className="w-4 h-4 mr-2" />
                View All Applications
              </button>
              <button className="flex items-center text-primary-red hover:text-accent-dark-red text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-primary-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-black">Create New Internship</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {message && (
              <div className={`mb-4 p-4 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleCreateInternship} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newInternship.title}
                  onChange={(e) => setNewInternship({...newInternship, title: e.target.value})}
                  placeholder="Software Development Intern"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Description</label>
                <textarea
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newInternship.description}
                  onChange={(e) => setNewInternship({...newInternship, description: e.target.value})}
                  placeholder="Describe the internship opportunity..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">Location</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                    value={newInternship.location}
                    onChange={(e) => setNewInternship({...newInternship, location: e.target.value})}
                    placeholder="Dar es Salaam"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">Duration</label>
                  <select
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                    value={newInternship.duration}
                    onChange={(e) => setNewInternship({...newInternship, duration: e.target.value})}
                    required
                  >
                    {durationOptions.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">Field</label>
                  <select
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                    value={newInternship.field}
                    onChange={(e) => setNewInternship({...newInternship, field: e.target.value})}
                    required
                  >
                    <option value="">Select Field</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">Available Spots</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                    value={newInternship.spotsAvailable}
                    onChange={(e) => setNewInternship({...newInternship, spotsAvailable: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newInternship.startDate}
                  onChange={(e) => setNewInternship({...newInternship, startDate: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-md text-sm font-medium hover:from-accent-dark-red hover:to-primary-red transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-primary-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-black">Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-primary-black">
                  {selectedApplication.student.user.firstName} {selectedApplication.student.user.lastName}
                </h3>
                <p className="text-sm text-neutral-600">{selectedApplication.student.user.email}</p>
                <p className="text-sm text-neutral-500">
                  {selectedApplication.student.fieldOfStudy} • {selectedApplication.student.university.name}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary-black mb-2">Cover Letter</h4>
                <p className="text-sm text-neutral-600">{selectedApplication.coverLetter}</p>
              </div>

              <div>
                <h4 className="font-medium text-primary-black mb-2">Why Interested</h4>
                <p className="text-sm text-neutral-600">{selectedApplication.whyInterested}</p>
              </div>

              <div>
                <h4 className="font-medium text-primary-black mb-2">Relevant Experience</h4>
                <p className="text-sm text-neutral-600">{selectedApplication.relevantExperience}</p>
              </div>

              <div>
                <h4 className="font-medium text-primary-black mb-2">Availability</h4>
                <p className="text-sm text-neutral-600">{selectedApplication.availability}</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleApplicationAction(selectedApplication.id, 'accept')}
                  className="flex-1 bg-green-600 text-primary-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Accept Application
                </button>
                <button
                  onClick={() => handleApplicationAction(selectedApplication.id, 'reject')}
                  className="flex-1 bg-red-600 text-primary-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrganizationDashboard;