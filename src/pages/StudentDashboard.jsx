import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  User,
  Calendar,
  MapPin,
  Building,
  TrendingUp,
  Target,
  Award,
  Plus,
  Upload,
  Eye,
  Send,
  Star,
  Lightbulb,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [suggestedInternships, setSuggestedInternships] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDirectApplicationModal, setShowDirectApplicationModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [directApplicationData, setDirectApplicationData] = useState({
    coverLetter: '',
    whyInterested: '',
    relevantExperience: '',
    availability: '',
    additionalInfo: ''
  });

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const [applicationsRes, organizationsRes, profileRes, suggestionsRes] = await Promise.all([
        fetch(`http://localhost:8080/api/applications/student/${user.id}`),
        fetch('http://localhost:8080/api/organizations'),
        fetch(`http://localhost:8080/api/students/${user.id}`),
        fetch(`http://localhost:8080/api/suggestions/internships/student/${user.id}`)
      ]);

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        const filteredApplications = applicationsData.filter(app => 
          app.status.toLowerCase() === 'accepted' || app.status.toLowerCase() === 'rejected'
        );
        setApplications(filteredApplications);
      }

      if (organizationsRes.ok) {
        const organizationsData = await organizationsRes.json();
        setOrganizations(organizationsData);
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      if (suggestionsRes.ok) {
        const suggestionsData = await suggestionsRes.json();
        setSuggestedInternships(suggestionsData);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user.id,
          organizationId: selectedOrganization,
          ...directApplicationData
        }),
      });

      if (response.ok) {
        setMessage('Application submitted successfully!');
        setTimeout(() => {
          setShowDirectApplicationModal(false);
          setDirectApplicationData({
            coverLetter: '',
            whyInterested: '',
            relevantExperience: '',
            availability: '',
            additionalInfo: ''
          });
          setSelectedOrganization('');
          setMessage('');
          fetchStudentData();
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Error submitting application. Please try again.');
      }
    } catch (error) {
      setMessage('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', user.id);
    formData.append('documentType', documentType);

    try {
      const response = await fetch('http://localhost:8080/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchStudentData();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
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
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Dashboard" subtitle="Track your internship journey">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      name: 'Total Applications',
      value: applications.length,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Accepted',
      value: applications.filter(app => app.status.toLowerCase() === 'accepted').length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Rejected',
      value: applications.filter(app => app.status.toLowerCase() === 'rejected').length,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      name: 'Suggested Opportunities',
      value: suggestedInternships.length,
      icon: Lightbulb,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <DashboardLayout title="Student Dashboard" subtitle="Apply to internships and track your progress">
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
              <h2 className="text-lg font-semibold text-primary-black">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowDirectApplicationModal(true)}
                  className="p-4 border-2 border-dashed border-accent-burgundy rounded-lg hover:bg-accent-persian-50 transition-colors text-center bg-gradient-to-br from-accent-persian-50 to-accent-soft-pink"
                >
                  <Send className="w-8 h-8 text-accent-burgundy mx-auto mb-2" />
                  <h3 className="font-medium text-primary-black">Apply Directly to Organization</h3>
                  <p className="text-sm text-neutral-600 mt-1">Send application directly to any organization</p>
                </button>

                <button
                  onClick={() => setShowUploadModal(true)}
                  className="p-4 border-2 border-dashed border-accent-pink rounded-lg hover:bg-accent-soft-pink transition-colors text-center"
                >
                  <Upload className="w-8 h-8 text-accent-pink mx-auto mb-2" />
                  <h3 className="font-medium text-primary-black">Upload Documents</h3>
                  <p className="text-sm text-neutral-600 mt-1">Upload CV, introduction letter, and other files</p>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-black flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-accent-pink" />
                Smart Suggestions for You
              </h2>
              <Link to="/internships" className="text-primary-red hover:text-accent-dark-red text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-6">
              {suggestedInternships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedInternships.slice(0, 4).map((internship) => (
                    <div key={internship.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-accent-pink bg-gradient-to-br from-accent-soft-red to-accent-rose">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Star className="w-4 h-4 text-accent-pink mr-1" />
                            <span className="text-xs font-medium text-accent-pink">Suggested for you</span>
                          </div>
                          <h3 className="font-medium text-primary-black text-sm mb-1">{internship.title}</h3>
                          <p className="text-xs text-neutral-600">{internship.organization.name}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Open
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs text-neutral-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {internship.location}
                        </div>
                        <div className="flex items-center text-xs text-neutral-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {internship.duration}
                        </div>
                        <div className="flex items-center text-xs text-neutral-500">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {internship.field}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(internship)}
                        className="text-xs text-primary-red hover:text-accent-dark-red font-medium"
                      >
                        View Details & Apply →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-black mb-2">No suggestions yet</h3>
                  <p className="text-neutral-600 mb-6">Apply to some internships to get personalized suggestions.</p>
                  <Link
                    to="/internships"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-lg hover:from-accent-dark-red hover:to-primary-red transition-all duration-300"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Internships
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-black">Application Results</h2>
            </div>
            <div className="p-6">
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
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
                          <div className="flex items-center text-xs text-neutral-500 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-black mb-2">No application results yet</h3>
                  <p className="text-neutral-600 mb-6">Your accepted or rejected applications will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {profile && profile.supervisor && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-semibold text-primary-black mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Your Supervisor
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-primary-black">
                    {profile.supervisor.user.firstName} {profile.supervisor.user.lastName}
                  </p>
                  <p className="text-sm text-neutral-600">{profile.supervisor.user.email}</p>
                  <p className="text-sm text-neutral-500">{profile.supervisor.department} Department</p>
                </div>
                <div className="pt-3 border-t border-green-200">
                  <p className="text-sm text-green-700">
                    ✓ Supervisor assigned by {profile.university?.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-accent-soft-red to-accent-soft-pink rounded-xl p-6">
            <h3 className="font-semibold text-primary-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/internships"
                className="flex items-center text-primary-red hover:text-accent-dark-red text-sm font-medium"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Internships
              </Link>
              <button
                onClick={() => setShowDirectApplicationModal(true)}
                className="flex items-center text-primary-red hover:text-accent-dark-red text-sm font-medium"
              >
                <Send className="w-4 h-4 mr-2" />
                Apply Directly
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center text-primary-red hover:text-accent-dark-red text-sm font-medium"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </button>
            </div>
          </div>

          <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="font-semibold text-primary-black mb-4">Profile Summary</h3>
            {profile && (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-neutral-600">University:</span>
                  <p className="font-medium text-primary-black">{profile.university?.name || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-neutral-600">Field of Study:</span>
                  <p className="font-medium text-primary-black">{profile.fieldOfStudy || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-neutral-600">Year:</span>
                  <p className="font-medium text-primary-black">{profile.yearOfStudy ? `${profile.yearOfStudy} Year` : 'Not specified'}</p>
                </div>
              </div>
            )}
            <Link
              to="/profile"
              className="mt-4 w-full bg-neutral-100 text-primary-black px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors text-center block text-sm font-medium"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {showDirectApplicationModal && (
        <div className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-primary-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-black">Apply Directly to Organization</h2>
              <button
                onClick={() => setShowDirectApplicationModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {message && (
              <div className={`mb-4 p-4 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleDirectApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Select Organization</label>
                <select
                  value={selectedOrganization}
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  required
                >
                  <option value="">Choose an organization</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Cover Letter</label>
                <textarea
                  rows={4}
                  value={directApplicationData.coverLetter}
                  onChange={(e) => setDirectApplicationData({...directApplicationData, coverLetter: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  placeholder="Write your cover letter..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Why are you interested?</label>
                <textarea
                  rows={3}
                  value={directApplicationData.whyInterested}
                  onChange={(e) => setDirectApplicationData({...directApplicationData, whyInterested: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  placeholder="Explain your interest..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Relevant Experience</label>
                <textarea
                  rows={3}
                  value={directApplicationData.relevantExperience}
                  onChange={(e) => setDirectApplicationData({...directApplicationData, relevantExperience: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  placeholder="Describe your relevant experience..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Availability</label>
                <textarea
                  rows={2}
                  value={directApplicationData.availability}
                  onChange={(e) => setDirectApplicationData({...directApplicationData, availability: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  placeholder="When are you available?"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDirectApplicationModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-md text-sm font-medium hover:from-accent-dark-red hover:to-primary-red transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-primary-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-black">Upload Documents</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">CV/Resume</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'cv')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">University Introduction Letter</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'introduction_letter')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Other Documents</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'other')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInternship && (
        <InternshipModal internship={selectedInternship} onClose={closeModal} />
      )}
    </DashboardLayout>
  );
};

const InternshipModal = ({ internship, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex items-start justify-between mb-6 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{internship.title}</h2>
            <p className="text-md text-gray-600 mt-1">{internship.organization.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 pr-6 border-r">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{internship.description}</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Details</h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3 text-blue-500" />
              <span>{internship.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-3 text-green-500" />
              <span>{internship.duration}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Building className="w-5 h-5 mr-3 text-purple-500" />
              <span>{internship.field}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-3 text-yellow-500" />
              <span>{internship.spotsAvailable} spots available</span>
            </div>
             <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-3 text-red-500" />
              <span>{internship.type}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex justify-end space-x-4">
           <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
