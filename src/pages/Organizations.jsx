import React, { useState, useEffect } from 'react';
import { Building, MapPin, Users, Globe, Search } from 'lucide-react';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/organizations');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    const name = org.name?.toLowerCase() || '';
    const description = org.description?.toLowerCase() || '';
    const industry = org.industry?.toLowerCase() || '';
    const location = org.location?.toLowerCase() || '';

    const search = searchTerm.toLowerCase();
    const selectedLocation = locationFilter.toLowerCase();

    const matchesSearch =
      name.includes(search) ||
      description.includes(search) ||
      industry.includes(search);

    const matchesLocation = !locationFilter || location.includes(selectedLocation);

    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Partner Organizations</h1>
          <p className="text-gray-600">Browse verified organizations offering internships across Tanzania.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search organizations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Dar es Salaam">Dar es Salaam</option>
              <option value="Zanzibar">Zanzibar</option>
              <option value="Arusha">Arusha</option>
              <option value="Mwanza">Mwanza</option>
              <option value="Pemba">Pemba</option>
              <option value="Dodoma">Dodoma</option>
            </select>
          </div>
        </div>

        {filteredOrganizations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOrganizations.map(org => (
              <div key={org.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col h-full">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{org.name}</h3>
                    <p className="text-blue-600 font-medium text-sm">{org.industry}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{org.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    {org.location || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    {org.internships?.length || 0} active internships
                  </div>
                  {org.website && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 truncate"
                      >
                        {org.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {org.specializations && org.specializations.length > 0 ? (
                    org.specializations.slice(0, 3).map((spec, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                      {org.industry}
                    </span>
                  )}
                </div>

                <div className="mt-auto border-t border-gray-200 pt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Established: {org.foundedYear || 'N/A'}
                  </div>
                  <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded text-sm transition">
                    Apply to Organization
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
            <p className="text-gray-600">Try adjusting your search or location filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
