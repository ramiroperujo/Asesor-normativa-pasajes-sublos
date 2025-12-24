import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plane, Home, Users, Search, BookOpen, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard' },
    { icon: Users, label: 'Beneficiarios', path: '/beneficiarios' },
    { icon: Search, label: 'Consultar Pasajes', path: '/consulta' },
    { icon: BookOpen, label: 'Normativa', path: '/normativa' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0066CC] rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[#1A1A1A]">Pasajes Sublo</h1>
              <p className="text-xs text-gray-500">Aerolíneas Argentinas</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {usuario && (
          <div className="p-4 border-b border-gray-200 bg-[#F5F7FA]">
            <p className="text-sm font-semibold text-[#1A1A1A]">
              {usuario.nombre} {usuario.apellido}
            </p>
            <p className="text-xs text-gray-600">Legajo: {usuario.legajo}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#0066CC] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
