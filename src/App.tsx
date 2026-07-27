import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ToastContainer } from './components/common/Toast';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ToastContainer />
      {isAuthenticated ? <DashboardLayout /> : <LoginPage />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
