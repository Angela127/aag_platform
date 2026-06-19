import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AgentDashboard from './pages/AgentDashboard.jsx';
import CustomerPortal from './pages/CustomerPortal.jsx';
import ClientManagement from './pages/ClientManagement.jsx';
import ClientDetail from './pages/ClientDetail.jsx';

function ProtectedRoute({ children, allowedRole }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="page-container" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><LoadingSpinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" replace />;
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
      {user && (role === 'agent' || role === 'customer') && <ChatWidget />}
    </>
  );
}

function AppRoutes() {
  const { user, role } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={
          user
            ? <Navigate to={role === 'customer' ? '/customer-portal' : '/dashboard'} replace />
            : <Navigate to="/login" replace />
        }
      />
      <Route path="/login" element={
        user
          ? <Navigate to={role === 'customer' ? '/customer-portal' : '/dashboard'} replace />
          : <LoginPage />
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="agent">
          <AppLayout><AgentDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute allowedRole="agent">
          <AppLayout><ClientManagement /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/clients/:id" element={
        <ProtectedRoute allowedRole="agent">
          <AppLayout><ClientDetail /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/customer-portal" element={
        <ProtectedRoute allowedRole="customer">
          <AppLayout><CustomerPortal /></AppLayout>
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
