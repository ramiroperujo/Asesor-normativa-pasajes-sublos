import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Beneficiarios from '@/pages/Beneficiarios';
import ConsultaPasajes from '@/pages/ConsultaPasajes';
import Normativa from '@/pages/Normativa';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/beneficiarios"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Beneficiarios />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consulta"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ConsultaPasajes />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/normativa"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Normativa />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
