import React, { useState, useEffect } from 'react';
import { Users, BookOpen, UserCheck, AlertCircle, Search, Eye, User, TrendingUp, Target, Award, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const UniversityDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('accepted');
  const [showAddSupervisorModal, setShowAddSupervisorModal] = useState(false);
  const [newSupervisor, setNewSupervisor] = useState({
    name: '',
    email: '',
    department: '',
    maxStudents: 10
  });

  useEffect(() => {
    fetchUniversityData();
  }, []);

  const fetchUniversityData = async () => {
    try {
      const [studentsRes, supervisorsRes, uniRes, acceptedRes] = await Promise.all([
        fetch(`http://localhost:8080/api/students/university/${user.universityId}`),
        fetch(`http://localhost:8080/api/supervisors/university/${user.universityId}`),
        fetch(`http://localhost:8080/api/universities/${user.universityId}`),
        fetch(`http://localhost:8080/api/students/university/${user.universityId}/accepted`)
      ]);

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }

      if (acceptedRes.ok) {
        const acceptedData = await acceptedRes.json();
        setAcceptedStudents(acceptedData);
      }

      if (supervisorsRes.ok) {
        const supervisorsData = await supervisorsRes.json();
        setSupervisors(supervisorsData);
      }

      if (uniRes.ok) {
        const uniData = await uniRes.json();
        setUniversity(uniData);
      }
    } catch (error) {
      console.error('Error fetching university data:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignSupervisor = async (studentId, supervisorId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/students/${studentId}/assign-supervisor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supervisorId }),
      });

      if (response.ok) {
        fetchUniversityData();
      }
    } catch (error) {
      console.error('Error assigning supervisor:', error);
    }
  };

  const handleAddSupervisor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/supervisors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSupervisor,
          universityId: user.universityId
        }),
      });

      if (response.ok) {
        setShowAddSupervisorModal(false);
        setNewSupervisor({
          name: '',
          email: '',
          department: '',
          maxStudents: 10
        });
        fetchUniversityData();
      }
    } catch (error) {
      console.error('Error adding supervisor:', error);
    }
  };

  const filteredAcceptedStudents = acceptedStudents.filter(student =>
    `${student.user.firstName} ${student.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout title="University Dashboard" subtitle="Manage your students and their internship progress">
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
      name: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Accepted Students',
      value: acceptedStudents.length,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'With Supervisors',
      value: acceptedStudents.filter(student => student.supervisorId).length,
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      name: 'Need Supervisors',
      value: acceptedStudents.filter(student => !student.supervisorId).length,
      icon: AlertCircle,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <DashboardLayout title={`${university?.name || 'University'} Dashboard`} subtitle="Manage accepted students and assign supervisors">
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

      <div className="bg-primary-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('accepted')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'accepted'
                  ? 'border-primary-red text-primary-red'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Accepted Students ({acceptedStudents.length})
            </button>
            <button
              onClick={() => setSelectedTab('supervisors')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'supervisors'
                  ? 'border-primary-red text-primary-red'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Supervisors ({supervisors.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'accepted' && (
            <>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search accepted students..."
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredAcceptedStudents.map((student) => (
                  <div key={student.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-red to-accent-pink rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-primary-black">
                            {student.user.firstName} {student.user.lastName}
                          </h3>
                          <p className="text-sm text-neutral-600">{student.user.email}</p>
                          <p className="text-sm text-neutral-500">ID: {student.studentId}</p>
                          <p className="text-sm text-neutral-500">Field: {student.fieldOfStudy}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary-black">
                            Supervisor: {student.supervisor ? `${student.supervisor.user.firstName} ${student.supervisor.user.lastName}` : 'Not assigned'}
                          </p>
                          <p className="text-sm text-neutral-500">
                            Status: Accepted by Organization
                          </p>
                        </div>
                        
                        {!student.supervisorId && supervisors.length > 0 && (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                assignSupervisor(student.id, e.target.value);
                              }
                            }}
                            className="text-sm border border-neutral-300 rounded-md px-3 py-1"
                          >
                            <option value="">Assign Supervisor</option>
                            {supervisors.map(supervisor => (
                              <option key={supervisor.id} value={supervisor.id}>
                                {supervisor.user.firstName} {supervisor.user.lastName}
                              </option>
                            ))}
                          </select>
                        )}
                        
                        <button className="p-2 text-neutral-400 hover:text-primary-red transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">
                          Internship Status: Accepted
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.supervisorId 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.supervisorId ? 'Supervised' : 'Needs Supervisor'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAcceptedStudents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-black mb-2">No accepted students found</h3>
                  <p className="text-neutral-600">Students who are accepted by organizations will appear here.</p>
                </div>
              )}
            </>
          )}

          {selectedTab === 'supervisors' && (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-primary-black">Supervisors</h3>
                <button
                  onClick={() => setShowAddSupervisorModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-lg hover:from-accent-dark-red hover:to-primary-red transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supervisor
                </button>
              </div>

              <div className="space-y-4">
                {supervisors.map((supervisor) => (
                  <div key={supervisor.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent-pink to-primary-red rounded-full flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-primary-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-primary-black">
                            {supervisor.user.firstName} {supervisor.user.lastName}
                          </h3>
                          <p className="text-sm text-neutral-600">{supervisor.user.email}</p>
                          <p className="text-sm text-neutral-500">{supervisor.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary-black">
                          {acceptedStudents.filter(s => s.supervisorId === supervisor.id).length} / {supervisor.maxStudents} students
                        </p>
                        <p className="text-sm text-neutral-500">Capacity</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {supervisors.length === 0 && (
                <div className="text-center py-12">
                  <UserCheck className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-black mb-2">No supervisors registered</h3>
                  <p className="text-neutral-600 mb-6">Add supervisors to assign them to accepted students.</p>
                  <button
                    onClick={() => setShowAddSupervisorModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-lg hover:from-accent-dark-red hover:to-primary-red transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Supervisor
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showAddSupervisorModal && (
        <div className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-primary-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-black">Add New Supervisor</h2>
              <button
                onClick={() => setShowAddSupervisorModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddSupervisor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newSupervisor.name}
                  onChange={(e) => setNewSupervisor({...newSupervisor, name: e.target.value})}
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newSupervisor.email}
                  onChange={(e) => setNewSupervisor({...newSupervisor, email: e.target.value})}
                  placeholder="supervisor@university.ac.tz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Department</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newSupervisor.department}
                  onChange={(e) => setNewSupervisor({...newSupervisor, department: e.target.value})}
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">Maximum Students</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-red focus:border-primary-red"
                  value={newSupervisor.maxStudents}
                  onChange={(e) => setNewSupervisor({...newSupervisor, maxStudents: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSupervisorModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary-red to-accent-pink text-primary-white rounded-md text-sm font-medium hover:from-accent-dark-red hover:to-primary-red transition-all duration-300"
                >
                  Add Supervisor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UniversityDashboard;