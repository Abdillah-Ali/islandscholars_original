import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  X, 
  Eye, 
  Calendar,
  User,
  Building,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const OrganizationApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/applications/organization/${user.organizationId}/all`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/${action}`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchApplications();
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error(`Error ${action} application:`, error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(application => {
    const studentName = `${application.student.user.firstName} ${application.student.user.lastName}`;
    const internshipTitle = application.internship?.title || 'Direct Application';
    
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.student.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout title="Applications" subtitle="Review and manage student applications">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading applications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const pendingApplications = filteredApplications.filter(app => app.status.toLowerCase() === 'pending');
  const reviewedApplications = filteredApplications.filter(app => app.status.toLowerCase() !== 'pending');

  return (
    <DashboardLayout title="Applications" subtitle="Review and manage student applications">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <select 
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Applications</p>
              <p className="text-3xl font-bold text-primary-black mt-2">{applications.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Pending Review</p>
              <p className="text-3xl font-bold text-primary-black mt-2">{pendingApplications.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Accepted</p>
              <p className="text-3xl font-bold text-primary-black mt-2">
                {applications.filter(app => app.status.toLowerCase() === 'accepted').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Rejected</p>
              <p className="text-3xl font-bold text-primary-black mt-2">
                {applications.filter(app => app.status.toLowerCase() === 'rejected').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-primary-black">
            Applications ({filteredApplications.length})
          </h2>
        </div>
        
        <div className="p-6">
          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-red to-accent-pink rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary-black">
                          {application.student.user.firstName} {application.student.user.lastName}
                        </h3>
                        <p className="text-sm text-neutral-600">{application.student.user.email}</p>
                        <p className="text-sm text-neutral-500">
                          {application.student.fieldOfStudy} • {application.student.university.name}
                        </p>
                        <div className="flex items-center text-xs text-neutral-500 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary-black">
                          {application.internship ? application.internship.title : 'Direct Application'}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="p-2 text-neutral-400 hover:text-primary-red transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {application.coverLetter}
                    </p>
                    {application.status.toLowerCase() === 'pending' && (
                      <div className="flex space-x-2 mt-3">
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary-black mb-2">No applications found</h3>
              <p className="text-neutral-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Applications from students will appear here.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

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
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-medium text-primary-black mb-2">
                  {selectedApplication.student.user.firstName} {selectedApplication.student.user.lastName}
                </h3>
                <p className="text-sm text-neutral-600">{selectedApplication.student.user.email}</p>
                <p className="text-sm text-neutral-500">
                  {selectedApplication.student.fieldOfStudy} • {selectedApplication.student.university.name}
                </p>
                <p className="text-sm text-neutral-500">Student ID: {selectedApplication.student.studentId}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-primary-black mb-2">Applied For</h4>
                <p className="text-sm text-neutral-600">
                  {selectedApplication.internship ? selectedApplication.internship.title : 'Direct Application to Organization'}
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

              {selectedApplication.additionalInfo && (
                <div>
                  <h4 className="font-medium text-primary-black mb-2">Additional Information</h4>
                  <p className="text-sm text-neutral-600">{selectedApplication.additionalInfo}</p>
                </div>
              )}

              {selectedApplication.status.toLowerCase() === 'pending' && (
                <div className="flex space-x-3 pt-4 border-t border-neutral-200">
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
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrganizationApplications;