import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/public/HomePage';
import ExplorePage from './pages/public/ExplorePage';
import ExperienceDetailPage from './pages/public/ExperienceDetailPage';
import TechDemosPage from './pages/public/TechDemosPage';
import CreatorGuidePage from './pages/public/CreatorGuidePage';
import PricingPage from './pages/public/PricingPage';
import ViewerSpecPage from './pages/public/ViewerSpecPage';
import LibraryPage from './pages/user/LibraryPage';
import CreatorDashboardPage from './pages/creator/CreatorDashboardPage';
import NewProjectPage from './pages/creator/NewProjectPage';
import ProcessingMonitorPage from './pages/creator/ProcessingMonitorPage';
import PublishPage from './pages/creator/PublishPage';
import AdminPage from './pages/admin/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';
import SignInPage from './pages/auth/SignInPage';
import ProfilePage from './pages/user/ProfilePage';

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Auth */}
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={[UserRole.Viewer, UserRole.Creator, UserRole.Admin]}>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/experience/:id" element={<ExperienceDetailPage />} />
        <Route path="/tech-demos" element={<TechDemosPage />} />
        <Route path="/creator-guide" element={<CreatorGuidePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/viewer-spec" element={<ViewerSpecPage />} />

        {/* Authenticated (viewer) */}
        <Route
          path="/library"
          element={
            <ProtectedRoute allowedRoles={[UserRole.Viewer, UserRole.Creator, UserRole.Admin]}>
              <LibraryPage />
            </ProtectedRoute>
          }
        />

        {/* Creator */}
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
        <Route
          path="/creator/publish/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.Creator, UserRole.Admin]}>
              <PublishPage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.Admin]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* HashRouter safety: empty hash -> "/" */}
        <Route path="" element={<Navigate to="/" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}