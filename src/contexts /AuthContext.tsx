import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '@/types';

interface AuthContextType {
  usuario: Usuario | null;
  login: (legajo: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const login = async (legajo: string, password: string): Promise<boolean> => {
    try {
      // Buscar credenciales en localStorage
      const credencialesGuardadas = localStorage.getItem(`user_${legajo}`);
      
      if (credencialesGuardadas) {
        const { password: storedPassword, usuario: storedUsuario } = JSON.parse(credencialesGuardadas);
        
        if (password === storedPassword) {
          setUsuario(storedUsuario);
          localStorage.setItem('usuario', JSON.stringify(storedUsuario));
          return true;
        }
      }
      
      // Si no hay credenciales guardadas, permitir login de prueba
      // (para demostración, en producción esto no existiría)
      if (legajo && password) {
        const usuarioDemo: Usuario = {
          id: Date.now().toString(),
          legajo,
          nombre: 'Usuario',
          apellido: 'Demo',
          email: `${legajo.toLowerCase()}@aerolineas.com.ar`,
          fechaIngreso: '2020-03-15',
          estadoCivil: 'soltero',
          esJerarquico: false,
          esJubilado: false,
          enLicencia: false,
        };
        setUsuario(usuarioDemo);
        localStorage.setItem('usuario', JSON.stringify(usuarioDemo));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        isAuthenticated: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
