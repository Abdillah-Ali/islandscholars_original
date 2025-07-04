import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Building, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Phone,
  MapPin,
  Globe,
  Calendar,
  FileText,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    university: '',
    studentId: '',
    yearOfStudy: '',
    fieldOfStudy: '',
    phone: '',
    companyName: '',
    industry: '',
    companySize: '',
    description: '',
    website: '',
    foundedYear: '',
    registrationNumber: '',
    location: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    establishedYear: '',
    studentCount: '',
    facultyCount: ''
  });
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const dashboardRoutes = {
        student: '/student-dashboard',
        organization: '/organization-dashboard',
        university: '/university-dashboard',
        admin: '/admin-dashboard'
      };
      navigate(dashboardRoutes[user.role] || '/profile');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/universities');
      if (response.ok) {
        const data = await response.json();
        setUniversities(data);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (message) setMessage('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.role) {
          setMessage('Please select your role');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.email) {
          setMessage('Email address is required');
          return false;
        }
        if (!formData.email.includes('@')) {
          setMessage('Please enter a valid email address');
          return false;
        }
        if (!formData.password) {
          setMessage('Password is required');
          return false;
        }
        if (formData.password.length < 6) {
          setMessage('Password must be at least 6 characters long');
          return false;
        }
        if (!formData.confirmPassword) {
          setMessage('Please confirm your password');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          return false;
        }
        
        if (formData.role === 'organization') {
          if (!formData.companyName) {
            setMessage('Organization name is required');
            return false;
          }
        } else {
          if (!formData.name) {
            setMessage('Name is required');
            return false;
          }
        }
        return true;
      
      case 3:
        if (formData.role === 'student') {
          if (!formData.university) {
            setMessage('University selection is required');
            return false;
          }
          if (formData.university === 'Other') {
            setMessage('Please select a valid university from the list');
            return false;
          }
          if (!formData.fieldOfStudy) {
            setMessage('Field of study is required');
            return false;
          }
        } else if (formData.role === 'organization') {
          if (!formData.industry) {
            setMessage('Industry selection is required');
            return false;
          }
          if (!formData.description) {
            setMessage('Company description is required');
            return false;
          }
          if (!formData.location) {
            setMessage('Company location is required');
            return false;
          }
        } else if (formData.role === 'university') {
          if (!formData.description) {
            setMessage('University description is required');
            return false;
          }
          if (!formData.location) {
            setMessage('University location is required');
            return false;
          }
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setMessage('');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await register(formData);
    if (result.success) {
      const dashboardRoutes = {
        student: '/student-dashboard',
        organization: '/organization-dashboard',
        university: '/university-dashboard',
        admin: '/admin-dashboard'
      };
      navigate(dashboardRoutes[result.user.role] || '/profile');
    } else {
      setMessage(result.message);
    }
    setLoading(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <User className="h-8 w-8" />;
      case 'organization':
        return <Building className="h-8 w-8" />;
      case 'university':
        return <GraduationCap className="h-8 w-8" />;
      default:
        return <User className="h-8 w-8" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'student':
        return 'Find internships and build your career';
      case 'organization':
        return 'List internship opportunities and find talent';
      case 'university':
        return 'Connect students with opportunities';
      default:
        return '';
    }
  };

  const industries = [
    'Technology',
    'Telecommunications',
    'Banking & Finance',
    'Aviation',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Agriculture',
    'Tourism',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-white to-accent-rose flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="bg-primary-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
          <div className="bg-gradient-to-r from-primary-black via-accent-persian-800 to-accent-burgundy px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary-white mb-2">
                {formData.role === 'organization' ? 'List Your Organization' : 
                 formData.role === 'university' ? 'Register Your University' : 'Create Account'}
              </h1>
              <p className="text-neutral-200">
                {formData.role === 'organization' 
                  ? 'Join our network of leading organizations in Tanzania'
                  : formData.role === 'university'
                  ? 'Connect your university with the Island Scholars platform'
                  : 'Join Island Scholars and discover amazing opportunities'
                }
              </p>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-center items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      currentStep >= step 
                        ? 'bg-primary-white text-primary-red' 
                        : 'bg-accent-persian-600 text-primary-white border-2 border-accent-pink'
                    }`}>
                      {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step ? 'bg-primary-white' : 'bg-accent-persian-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-primary-white text-sm opacity-90">
                <span>Choose Role</span>
                <span>Basic Info</span>
                <span>Details</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-md border-l-4 flex items-center ${
                message.includes('successful') 
                  ? 'bg-accent-soft-red border-primary-red text-primary-red' 
                  : 'bg-accent-soft-red border-accent-dark-red text-accent-dark-red'
              }`}>
                <span>{message}</span>
              </div>
            )}

            {loading && (
              <div className="mb-6 p-4 bg-accent-soft-red border-l-4 border-primary-red text-primary-red flex items-center rounded-md">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-red mr-3"></div>
                <span>Creating your account...</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="transition-all duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary-black mb-2">Choose Your Role</h2>
                    <p className="text-neutral-600">Select how you want to use Island Scholars</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['student', 'organization', 'university'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role }))}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                          formData.role === role
                            ? role === 'student' 
                              ? 'bg-accent-soft-red border-primary-red shadow-lg'
                              : role === 'organization'
                              ? 'bg-accent-soft-pink border-accent-pink shadow-lg'
                              : 'bg-accent-persian-50 border-accent-persian-500 shadow-lg'
                            : 'border-neutral-200 hover:border-neutral-400 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`mb-4 p-4 rounded-full ${
                            formData.role === role
                              ? role === 'student'
                                ? 'bg-accent-soft-red text-primary-red'
                                : role === 'organization'
                                ? 'bg-accent-soft-pink text-accent-pink'
                                : 'bg-accent-persian-100 text-accent-persian-600'
                              : 'bg-neutral-100 text-neutral-400'
                          }`}>
                            {getRoleIcon(role)}
                          </div>
                          <h3 className="text-lg font-semibold text-primary-black mb-2 capitalize">
                            {role}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {getRoleDescription(role)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="transition-all duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary-black mb-2">Basic Information</h2>
                    <p className="text-neutral-600">
                      {formData.role === 'organization' 
                        ? 'Tell us about your organization'
                        : formData.role === 'university'
                        ? 'Tell us about your university'
                        : 'Let\'s get to know you better'
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2">
                        {formData.role === 'organization' ? 'Organization Name' : 
                         formData.role === 'university' ? 'University Name' : 'Full Name'} 
                        <span className="text-accent-dark-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {formData.role === 'organization' ? 
                            <Building className="h-5 w-5 text-neutral-400" /> :
                            formData.role === 'university' ?
                            <GraduationCap className="h-5 w-5 text-neutral-400" /> :
                            <User className="h-5 w-5 text-neutral-400" />
                          }
                        </div>
                        <input
                          name={formData.role === 'organization' ? 'companyName' : 'name'}
                          type="text"
                          value={formData.role === 'organization' ? formData.companyName : formData.name}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          placeholder={
                            formData.role === 'organization' ? 'Vodacom Tanzania Ltd' : 
                            formData.role === 'university' ? 'University of Dar es Salaam' : 'John Doe'
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2">
                        Email Address <span className="text-accent-dark-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2">
                        Password <span className="text-accent-dark-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <p className="mt-1 text-xs text-neutral-600">Must be at least 6 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-black mb-2">
                        Confirm Password <span className="text-accent-dark-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="transition-all duration-300">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-primary-black mb-2">
                      {formData.role === 'organization' ? 'Organization Details' : 
                       formData.role === 'university' ? 'University Details' : 'Additional Information'}
                    </h2>
                    <p className="text-neutral-600">
                      {formData.role === 'organization' 
                        ? 'Complete your organization profile'
                        : formData.role === 'university'
                        ? 'Complete your university profile'
                        : 'Help us personalize your experience'
                      }
                    </p>
                  </div>

                  {formData.role === 'student' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">
                          University <span className="text-accent-dark-red">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <GraduationCap className="h-5 w-5 text-neutral-400" />
                          </div>
                          <select
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                            required
                          >
                            <option value="">Select your university</option>
                            {universities.map(uni => (
                              <option key={uni.id} value={uni.name}>{uni.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">Student ID</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FileText className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            name="studentId"
                            type="text"
                            value={formData.studentId}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                            placeholder="2021-04-12345"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">
                          Field of Study <span className="text-accent-dark-red">*</span>
                        </label>
                        <input
                          name="fieldOfStudy"
                          type="text"
                          value={formData.fieldOfStudy}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          placeholder="Computer Science"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">Year of Study</label>
                        <select
                          name="yearOfStudy"
                          value={formData.yearOfStudy}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                        >
                          <option value="">Select year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="5">5th Year</option>
                          <option value="graduate">Graduate</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-primary-black mb-2">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                            placeholder="+255 123 456 789"
                          />
                        </div>
                      </div>
                    </div>
                  ) : formData.role === 'organization' ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-primary-black mb-2">
                            Industry <span className="text-accent-dark-red">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building className="h-5 w-5 text-neutral-400" />
                            </div>
                            <select
                              name="industry"
                              value={formData.industry}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                              required
                            >
                              <option value="">Select industry</option>
                              {industries.map(industry => (
                                <option key={industry} value={industry.toLowerCase()}>{industry}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-primary-black mb-2">Company Size</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Users className="h-5 w-5 text-neutral-400" />
                            </div>
                            <select
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                            >
                              <option value="">Select company size</option>
                              {companySizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">
                          Location <span className="text-accent-dark-red">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                            placeholder="Dar es Salaam, Tanzania"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">
                          Company Description <span className="text-accent-dark-red">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="4"
                          className="block w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          placeholder="Describe your organization, what you do, and your mission..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-primary-black mb-2">Website</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Globe className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                              name="website"
                              type="url"
                              value={formData.website}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                              placeholder="https://yourcompany.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-primary-black mb-2">Founded Year</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                              name="foundedYear"
                              type="number"
                              min="1900"
                              max={new Date().getFullYear()}
                              value={formData.foundedYear}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                              placeholder="2010"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-neutral-200 pt-6">
                        <h3 className="text-lg font-semibold text-primary-black mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-primary-black mb-2">Contact Person</label>
                            <input
                              name="contactPerson"
                              type="text"
                              value={formData.contactPerson}
                              onChange={handleChange}
                              className="block w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                              placeholder="John Doe"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-primary-black mb-2">Contact Phone</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-neutral-400" />
                              </div>
                              <input
                                name="contactPhone"
                                type="tel"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                                placeholder="+255 123 456 789"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : formData.role === 'university' ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">
                          Location <span className="text-accent-dark-red">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-neutral-400" />
                          </div>
                          <input
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                            placeholder="Dar es Salaam, Tanzania"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-black mb-2">
                          University Description <span className="text-accent-dark-red">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="4"
                          className="block w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                          placeholder="Describe your university, its mission, and academic programs..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-primary-black mb-2">Website</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Globe className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                              name="website"
                              type="url"
                              value={formData.website}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                              placeholder="https://youruniversity.ac.tz"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-primary-black mb-2">Established Year</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                              name="establishedYear"
                              type="number"
                              min="1800"
                              max={new Date().getFullYear()}
                              value={formData.establishedYear}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                              placeholder="1961"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-primary-black mb-2">Student Count</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <GraduationCap className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                              name="studentCount"
                              type="number"
                              min="0"
                              value={formData.studentCount}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                              placeholder="40000"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-primary-black mb-2">Faculty Count</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Users className="h-5 w-5 text-neutral-400" />
                            </div>
                            <input
                              name="facultyCount"
                              type="number"
                              min="0"
                              value={formData.facultyCount}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                              placeholder="1200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-200">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-600 bg-primary-white hover:bg-neutral-50 disabled:opacity-50"
                      disabled={loading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center px-6 py-2 border border-transparent rounded-md text-sm font-medium text-primary-white bg-gradient-to-r from-primary-red to-accent-pink hover:from-accent-dark-red hover:to-primary-red transition-all duration-300"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-2 border border-transparent rounded-md text-sm font-medium text-primary-white bg-gradient-to-r from-primary-red to-accent-pink hover:from-accent-dark-red hover:to-primary-red disabled:opacity-50 transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-white mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          {formData.role === 'organization' ? 'List Organization' : 
                           formData.role === 'university' ? 'Register University' : 'Create Account'}
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-neutral-200 pt-6">
              <p className="text-neutral-600">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="text-primary-red hover:text-accent-dark-red font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;