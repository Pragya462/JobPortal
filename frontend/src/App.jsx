import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Profile from './components/Profile';
import JobDescription from './components/JobDescription';
import Companies from './components/admin/companies';
import CompanyCreate from './components/admin/CompanyCreate';
import CompanySetup from './components/admin/CompanySetup';
import AdminJobs from './components/admin/AdminJobs';
import Applicants from './components/admin/Applicants';
import PostJob from './components/admin/PostJob';
import { ProtectedAdminRoutes } from './components/admin/ProtectedRoutes';
import { ProtectedUserRoutes } from './components/admin/ProtectedRoutes';

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/*student rutes*/}

        <Route path="/" element={<ProtectedUserRoutes><HomePage /></ProtectedUserRoutes>} />
        <Route path="/jobs" element={<ProtectedUserRoutes><Jobs /></ProtectedUserRoutes>} />
        <Route path="/browse" element={<ProtectedUserRoutes><Browse /></ProtectedUserRoutes>} />
        <Route path="/profile" element={<ProtectedUserRoutes><Profile /></ProtectedUserRoutes>} />
        <Route path="/description/:id" element={<ProtectedUserRoutes><JobDescription /></ProtectedUserRoutes>} />

        {/* admin routes */}
        <Route path="/admin/companies" element={<ProtectedAdminRoutes><Companies /></ProtectedAdminRoutes>} />
        <Route path="/admin/companies/create" element={<ProtectedAdminRoutes><CompanyCreate /></ProtectedAdminRoutes>} />
        <Route path="/admin/companies/:id" element={<ProtectedAdminRoutes><CompanySetup /></ProtectedAdminRoutes>} />
        <Route path="/admin/jobs" element={<ProtectedAdminRoutes><AdminJobs /></ProtectedAdminRoutes>} />
        <Route path="/admin/jobs/create" element={<ProtectedAdminRoutes><PostJob /></ProtectedAdminRoutes>} />
        <Route path="/admin/jobs/:id/applicants" element={<ProtectedAdminRoutes><Applicants /></ProtectedAdminRoutes>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
