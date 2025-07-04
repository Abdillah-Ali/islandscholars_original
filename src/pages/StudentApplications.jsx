import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Building, 
  Calendar,
  MapPin,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const StudentApplications = () => {
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
      const response = await fetch(`http://localhost:8080/api/applications/student/${user.id}`);
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

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = (application.internship?.title || 'Direct Application')
      .toLowerCase().includes(searchTerm.toLowerCase()) ||
      (application.internship?.organization?.name || application.organization?.name)
      .toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout title="My Applications" subtitle="Track your internship applications">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading applications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Applications" subtitle="Track your internship applications">
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
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-red to-accent-pink rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-primary-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary-black">
                          {application.internship ? application.internship.title : 'Direct Application'}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {application.internship ? application.internship.organization.name : application.organization?.name}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                          {application.internship && (
                            <>
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {application.internship.location}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {application.internship.duration}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status}</span>
                      </span>
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
                    {application.reviewedAt && (
                      <p className="text-xs text-neutral-500 mt-2">
                        Reviewed on {new Date(application.reviewedAt).toLocaleDateString()}
                      </p>
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
                  : 'You haven\'t submitted any applications yet. Start exploring internship opportunities!'
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
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-primary-black mb-2">
                  {selectedApplication.internship ? selectedApplication.internship.title : 'Direct Application'}
                </h3>
                <p className="text-sm text-neutral-600">
                  {selectedApplication.internship ? selectedApplication.internship.organization.name : selectedApplication.organization?.name}
                </p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedApplication.status)}`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="ml-1 capitalize">{selectedApplication.status}</span>
                </span>
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

              <div className="pt-4 border-t border-neutral-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600">Applied:</span>
                    <p className="font-medium text-primary-black">
                      {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedApplication.reviewedAt && (
                    <div>
                      <span className="text-neutral-600">Reviewed:</span>
                      <p className="font-medium text-primary-black">
                        {new Date(selectedApplication.reviewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentApplications;