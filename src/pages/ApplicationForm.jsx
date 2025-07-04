import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Send, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState({
    coverLetter: '',
    whyInterested: '',
    relevantExperience: '',
    availability: '',
    additionalInfo: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/signin');
      return;
    }
    fetchInternshipDetails();
  }, [id, user, navigate]);

  const fetchInternshipDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/internships/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInternship(data);
      } else {
        navigate('/internships');
      }
    } catch (error) {
      console.error('Error fetching internship details:', error);
      navigate('/internships');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
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
          internshipId: id,
          ...application
        }),
      });

      if (response.ok) {
        setMessage('Application submitted successfully! You will be notified of any updates.');
        setTimeout(() => {
          navigate('/student-dashboard');
        }, 2000);
      } else {
        const errorText = await response.text();
        setMessage(errorText || 'Error submitting application. Please try again.');
      }
    } catch (error) {
      setMessage('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setApplication({
      ...application,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Internship Not Found</h2>
          <Link to="/internships" className="text-blue-600 hover:text-blue-700">
            Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            to={`/internships/${id}`} 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Internship Details
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Internship</h1>
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-800">{internship.title}</h2>
              <p className="text-gray-600">{internship.organization.name}</p>
              <p className="text-sm text-gray-500">{internship.location} • {internship.duration}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Application Form</h2>
            <p className="text-sm text-gray-600 mt-1">
              Please fill out all required fields to submit your application.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={6}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={application.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Write a compelling cover letter explaining why you're the perfect candidate for this internship..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Introduce yourself and highlight your most relevant qualifications.
                </p>
              </div>

              <div>
                <label htmlFor="whyInterested" className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you interested in this internship? *
                </label>
                <textarea
                  id="whyInterested"
                  name="whyInterested"
                  rows={4}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={application.whyInterested}
                  onChange={handleInputChange}
                  placeholder="Explain what specifically interests you about this role and organization..."
                />
              </div>

              <div>
                <label htmlFor="relevantExperience" className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Experience & Skills *
                </label>
                <textarea
                  id="relevantExperience"
                  name="relevantExperience"
                  rows={4}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={application.relevantExperience}
                  onChange={handleInputChange}
                  placeholder="Describe your relevant experience, projects, coursework, and skills that make you a good fit..."
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability *
                </label>
                <textarea
                  id="availability"
                  name="availability"
                  rows={3}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={application.availability}
                  onChange={handleInputChange}
                  placeholder="When are you available to start? Any scheduling constraints or commitments we should know about?"
                />
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={application.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Any additional information you'd like to share (optional)..."
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Supporting Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Upload Resume</p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Choose File
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Additional Documents</p>
                    <p className="text-xs text-gray-500">Portfolio, Certificates, etc.</p>
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Choose Files
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Documents can also be uploaded later from your profile.
                </p>
              </div>
            </div>

            {message && (
              <div className={`mt-6 p-4 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>By submitting this application, you agree to our terms and conditions.</p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to={`/internships/${id}`}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;