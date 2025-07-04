import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Building, Users, Calendar, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InternshipDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/internships/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInternship(data);
        } else {
          setInternship(null);
        }
      } catch (error) {
        console.error('Error fetching internship details:', error);
        setInternship(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading internship details...</p>
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

  const responsibilities = internship.responsibilities
    ? internship.responsibilities.split('\n')
    : [];

  const requirements = internship.requirements
    ? internship.requirements.split('\n')
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/internships" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Internships
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Building className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{internship.title}</h1>
                <p className="text-blue-100 text-lg">{internship.organization.name}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{internship.location}</div>
              <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{internship.duration}</div>
              <div className="flex items-center"><Users className="w-4 h-4 mr-2" />{internship.spotsAvailable} spots available</div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Internship</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{internship.description}</p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                    <ul className="space-y-2">
                      {responsibilities.length > 0 ? responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      )) : <li className="text-gray-500">No responsibilities listed.</li>}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {requirements.length > 0 ? requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      )) : <li className="text-gray-500">No requirements listed.</li>}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Internship Details</h3>
                  <div className="space-y-4">
                    <DetailItem icon={Calendar} label="Start Date" value={internship.startDate || 'Flexible'} />
                    <DetailItem icon={Clock} label="Duration" value={internship.duration} />
                    <DetailItem icon={BookOpen} label="Field" value={internship.field} />
                    <DetailItem icon={Users} label="Type" value={internship.type} />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Info</h3>
                  <div className="space-y-3">
                    <p className="text-gray-700">{internship.organization.name}</p>
                    <p className="text-sm text-gray-600">{internship.organization.description}</p>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium">{internship.organization.email}</p>
                    </div>
                  </div>
                </div>

                {user && user.role === 'student' ? (
                  <div className="mt-6">
                    <Link to={`/apply/${internship.id}`} className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block">
                      Apply Now
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6">
                    <Link to="/signin" className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center block">
                      Sign In to Apply
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon className="w-5 h-5 text-gray-400 mr-3" />
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default InternshipDetails;
