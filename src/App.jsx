import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Internships from './pages/Internships';
import Organizations from './pages/Organizations';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StudentDashboard from './pages/StudentDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import UniversityDashboard from './pages/UniversityDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import InternshipDetails from './pages/InternshipDetails';
import ApplicationForm from './pages/ApplicationForm';
import StudentApplications from './pages/StudentApplications';
import OrganizationInternships from './pages/OrganizationInternships';
import OrganizationApplications from './pages/OrganizationApplications';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/internships/:id" element={<InternshipDetails />} />
              <Route path="/apply/:id" element={<ApplicationForm />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
              <Route path="/university-dashboard" element={<UniversityDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/student-applications" element={<StudentApplications />} />
              <Route path="/organization-internships" element={<OrganizationInternships />} />
              <Route path="/organization-applications" element={<OrganizationApplications />} />
              <Route path="/student-settings" element={<Settings />} />
              <Route path="/organization-settings" element={<Settings />} />
              <Route path="/university-settings" element={<Settings />} />
              <Route path="/admin-settings" element={<Settings />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;