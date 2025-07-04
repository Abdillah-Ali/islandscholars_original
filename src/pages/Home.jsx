import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Building, Award, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const stats = [
    { label: 'Active Internships', value: '150+' },
    { label: 'Partner Organizations', value: '75+' },
    { label: 'Registered Students', value: '2,500+' },
    { label: 'Universities', value: '12' }
  ];

  const features = [
    {
      icon: <Search className="w-6 h-6 text-primary-red" />,
      title: 'Find Perfect Internships',
      description: 'Search and filter internships based on your field of study, location, and preferences.'
    },
    {
      icon: <Users className="w-6 h-6 text-primary-red" />,
      title: 'University Integration',
      description: 'Seamless connection with your university for supervisor assignment and academic requirements.'
    },
    {
      icon: <Building className="w-6 h-6 text-primary-red" />,
      title: 'Verified Organizations',
      description: 'All partner organizations are verified to ensure quality internship experiences.'
    },
    {
      icon: <Award className="w-6 h-6 text-primary-red" />,
      title: 'Academic Credit',
      description: 'Complete your mandatory field internship requirement with full academic recognition.'
    }
  ];

  const benefits = [
    'Direct application to internship opportunities',
    'University supervisor assignment',
    'Document management system',
    'Real-time application tracking',
    'Certificate generation',
    'Career development support'
  ];

  return (
    <div className="min-h-screen bg-primary-white">
      <div className="bg-gradient-to-br from-primary-black via-accent-persian-800 to-accent-burgundy text-primary-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Gateway to
              <span className="block text-accent-pink">Meaningful Internships</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-200 max-w-3xl mx-auto">
              Connect with top organizations across Tanzania for field internships that fulfill your academic requirements and launch your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/internships" 
                className="bg-gradient-to-r from-primary-red to-accent-pink text-primary-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-accent-dark-red hover:to-primary-red transition-all duration-300 inline-flex items-center justify-center shadow-lg"
              >
                Browse Internships
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                to="/signin" 
                className="border-2 border-accent-pink text-accent-pink px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-pink hover:text-primary-white transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-red mb-2">{stat.value}</div>
                <div className="text-neutral-600 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-black mb-4">
              Everything You Need for Success
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our platform is designed specifically for Tanzanian university students to streamline the internship process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-primary-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-neutral-200 hover:border-accent-pink group">
                <div className="mb-4 p-3 bg-accent-soft-red rounded-lg w-fit group-hover:bg-accent-pink group-hover:text-primary-white transition-all duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary-black mb-3">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-black mb-6">
                Built for Tanzanian Students
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Island Scholars Platform understands the unique requirements of Tanzanian universities 
                and provides a comprehensive solution for managing field internships.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-red flex-shrink-0" />
                    <span className="text-neutral-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-primary-white p-8 rounded-2xl shadow-xl border border-neutral-200">
              <h3 className="text-2xl font-bold text-primary-black mb-6">Ready to Get Started?</h3>
              <p className="text-neutral-600 mb-6">
                Join thousands of students who have successfully completed their internships through our platform.
              </p>
              <Link 
                to="/signin" 
                className="w-full bg-gradient-to-r from-primary-red to-accent-pink text-primary-white px-6 py-3 rounded-lg font-semibold hover:from-accent-dark-red hover:to-primary-red transition-all duration-300 inline-flex items-center justify-center shadow-lg"
              >
                Create Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;