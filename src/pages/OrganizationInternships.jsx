import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Building, 
  MapPin, 
  Clock, 
  Users, 
  Edit, 
  Eye, 
  Trash2,
  Calendar,
  BookOpen,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const OrganizationInternships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/internships/organization/${user.organizationId}`);
      if (response.ok) {
        const data = await response.json();
        setInternships(data);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
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
          fetchInternships();
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

  const handleDeleteInternship = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/internships/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchInternships();
        }
      } catch (error) {
        console.error('Error deleting internship:', error);
      }
    }
  };

  const durationOptions = [
    '1-2 months',
    '1-3 months',
    '2-3 months',
    '3-4 months',
    '3-6 months',
    '6+ months'
  ];

  if (loading) {
    return (
      <DashboardLayout title="Post Internships" subtitle="Create and manage your internship postings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading internships...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Post Internships" subtitle="Create and manage your internship postings">
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-lg hover:from-accent-dark-red hover:to-primary-red transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Internship
        </button>
      </div>

      <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-primary-black">
            Your Internships ({internships.length})
          </h2>
        </div>
        
        <div className="p-6">
          {internships.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {internships.map((internship) => (
                <div key={internship.id} className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-black text-lg mb-2">{internship.title}</h3>
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{internship.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-neutral-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          {internship.location}
                        </div>
                        <div className="flex items-center text-sm text-neutral-500">
                          <Clock className="w-4 h-4 mr-2" />
                          {internship.duration}
                        </div>
                        <div className="flex items-center text-sm text-neutral-500">
                          <Users className="w-4 h-4 mr-2" />
                          {internship.spotsAvailable} spots available
                        </div>
                        <div className="flex items-center text-sm text-neutral-500">
                          <BookOpen className="w-4 h-4 mr-2" />
                          {internship.field}
                        </div>
                        {internship.startDate && (
                          <div className="flex items-center text-sm text-neutral-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            Starts {new Date(internship.startDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-neutral-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-primary-red transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteInternship(internship.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {internship.type}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        internship.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {internship.status || 'Active'}
                      </span>
                    </div>
                    <span className="text-sm text-neutral-500">
                      Created {new Date(internship.createdAt).toLocaleDateString()}
                    </span>
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
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-lg hover:from-accent-dark-red hover:to-primary-red transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Internship
              </button>
            </div>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-primary-white rounded-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-black">Create New Internship</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleCreateInternship} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">
                    Internship Title <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block text-sm font-medium text-primary-black mb-2">
                    Field <span className="text-red-500">*</span>
                  </label>
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
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newInternship.description}
                  onChange={(e) => setNewInternship({...newInternship, description: e.target.value})}
                  placeholder="Describe the internship opportunity, what the intern will learn and contribute..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block text-sm font-medium text-primary-black mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
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

                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">
                    Available Spots <span className="text-red-500">*</span>
                  </label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-black mb-2">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                    value={newInternship.type}
                    onChange={(e) => setNewInternship({...newInternship, type: e.target.value})}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Requirements (one per line)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newInternship.requirements}
                  onChange={(e) => setNewInternship({...newInternship, requirements: e.target.value})}
                  placeholder="Currently enrolled in university&#10;Strong communication skills&#10;Basic knowledge of relevant field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Responsibilities (one per line)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newInternship.responsibilities}
                  onChange={(e) => setNewInternship({...newInternship, responsibilities: e.target.value})}
                  placeholder="Assist with daily operations&#10;Participate in team meetings&#10;Complete assigned projects"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-md text-sm font-medium hover:from-accent-dark-red hover:to-primary-red transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrganizationInternships;