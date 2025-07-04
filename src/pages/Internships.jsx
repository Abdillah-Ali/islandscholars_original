import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Building, Users, XCircle, X } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ location: '', duration: '', field: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/internships');
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

    fetchInternships();
  }, []);

  // Reset filters and search
  const resetFilters = () => {
    setFilters({ location: '', duration: '', field: '', type: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Filter internships based on search and filters
  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.organizationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = !filters.location || internship.location.includes(filters.location);
    const matchesDuration = !filters.duration || internship.duration === filters.duration;
    const matchesField = !filters.field || internship.field === filters.field;
    const matchesType = !filters.type || internship.type === filters.type;

    return matchesSearch && matchesLocation && matchesDuration && matchesField && matchesType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredInternships.length / ITEMS_PER_PAGE);
  const paginatedInternships = filteredInternships.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading internships...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Internships</h1>
        <p className="text-gray-600">Discover internship opportunities from verified organizations across Tanzania.</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-center">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search internships..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {['location', 'duration', 'field', 'type'].map((filterKey) => (
          <select
            key={filterKey}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filters[filterKey]}
            onChange={(e) => {
              setFilters({ ...filters, [filterKey]: e.target.value });
              setCurrentPage(1);
            }}
          >
            <option value="">{`All ${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}s`}</option>
            {getFilterOptions(filterKey).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ))}

        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-md transition-colors"
          title="Reset Filters"
        >
          <XCircle className="w-5 h-5 mr-2" />
          Reset Filters
        </button>
      </div>

      {/* Internship Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {paginatedInternships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{internship.title}</h3>
                    <p className="text-sm text-gray-600">{internship.organizationName}</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full capitalize">
                  {internship.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{internship.description}</p>

              <div className="space-y-2 mb-4">
                <Detail icon={MapPin} value={internship.location} />
                <Detail icon={Clock} value={internship.duration} />
                <Detail icon={Users} value={`${internship.spotsAvailable} spots available`} />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">{internship.field}</span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">{internship.type}</span>
              </div>

              <button
                onClick={() => handleViewDetails(internship)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center block"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      )}

      {filteredInternships.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {selectedInternship && (
        <InternshipModal internship={selectedInternship} onClose={closeModal} />
      )}
    </div>
  );
};

const Detail = ({ icon: Icon, value }) => (
  <div className="flex items-center text-sm text-gray-500">
    <Icon className="w-4 h-4 mr-2" />
    {value}
  </div>
);

const InternshipModal = ({ internship, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex items-start justify-between mb-6 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{internship.title}</h2>
            <p className="text-md text-gray-600 mt-1">{internship.organizationName}</p>
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Simple page numbers with next/prev buttons
  const pages = [];

  // Limit max pages shown for large number of pages (optional)
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        aria-label="Previous Page"
      >
        &laquo;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${
            page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        aria-label="Next Page"
      >
        &raquo;
      </button>
    </nav>
  );
};

const getFilterOptions = (filterKey) => {
  const options = {
    location: ['Dar es Salaam', 'Zanzibar', 'Arusha', 'Mwanza'],
    duration: ['1-3 months', '3-6 months', '6+ months'],
    field: ['Technology', 'Business', 'Healthcare', 'Education', 'Engineering'],
    type: ['Full-time', 'Part-time', 'Remote'],
  };
  return options[filterKey] || [];
};

export default Internships;
