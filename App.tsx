
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/public/HomePage';
import ExplorePage from './pages/public/ExplorePage';
import ExperienceDetailPage from './pages/public/ExperienceDetailPage';
import TechDemosPage from './pages/public/TechDemosPage';
import CreatorGuidePage from './pages/public/CreatorGuidePage';
import PricingPage from './pages/public/PricingPage';
import ViewerSpecPage from './pages/public/ViewerSpecPage';
import CreatorDashboardPage from './pages/creator/CreatorDashboardPage';
import NewProjectPage from './pages/creator/NewProjectPage';
import ProcessingMonitorPage from './pages/creator/ProcessingMonitorPage';
import AdminPage from './pages/admin/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/experience/:id" element={<ExperienceDetailPage />} />
        <Route path="/tech-demos" element={<TechDemosPage />} />
        <Route path="/creator-guide" element={<CreatorGuidePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/viewer-spec" element={<ViewerSpecPage />} />

        {/* Creator Portal Routes */}
        <Route 
          path="/creator/dashboard" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.Creator, UserRole.Admin]}>
              <CreatorDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/creator/new" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.Creator, UserRole.Admin]}>
              <NewProjectPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/creator/job/:id" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.Creator, UserRole.Admin]}>
              <ProcessingMonitorPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Console Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.Admin]}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
