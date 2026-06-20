import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AgentDashboard from './pages/AgentDashboard.jsx';
import ClientManagement from './pages/ClientManagement.jsx';
import ClientDetail from './pages/ClientDetail.jsx';
import TrainingPage from './pages/TrainingPage.jsx';
import Clients from './pages/Clients.jsx';
import Training from './pages/Training.jsx';
import Partners from './pages/Partners.jsx';
import Reports from './pages/Reports.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import Advisors from './pages/Advisors.jsx';
import Profile from './pages/Profile.jsx';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="page-container" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><LoadingSpinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (allowedRoles && !roles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}

function LoadingSpinner() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 12 }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #ffe4d1',
        borderTopColor: '#870105',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color:'#5a5a5a', fontSize:'0.875rem' }}>Loading…</p>
    </div>
  );
}

import ChatWidget from './components/chat/ChatWidget.jsx';

function AppLayout({ children }) {
  const { user, role } = useAuth();
  return (
    <>
      <Navbar />
      <main className="page-container">
        {children}
      </main>
      {user && role === 'agent' && <ChatWidget />}
    </>
  );
}

function AppRoutes() {
  const { user, role } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={
        user ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['agent', 'manager']}>
          <AppLayout><AgentDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute allowedRoles={['agent', 'manager']}>
          <AppLayout><ClientManagement /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/clients/:id" element={
        <ProtectedRoute allowedRoles={['agent', 'manager']}>
          <AppLayout><ClientDetail /></AppLayout>
          </ProtectedRoute>
      } />
      <Route path="/training" element={
        <ProtectedRoute allowedRoles={['agent', 'manager']}>
          <AppLayout><TrainingPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/training" element={
        <ProtectedRoute allowedRoles={['agent', 'manager']}>
          <AppLayout><Training /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/partners" element={
        <ProtectedRoute allowedRoles={['agent', 'manager']}>
          <AppLayout><Partners /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['agent', 'manager']}>
          <AppLayout><Reports /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/manager-dashboard" element={
        <ProtectedRoute allowedRoles="manager">
          <AppLayout><ManagerDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/advisors" element={
        <ProtectedRoute allowedRoles="manager">
          <AppLayout><Advisors /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['agent', 'manager']}>
          <AppLayout><Profile /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
