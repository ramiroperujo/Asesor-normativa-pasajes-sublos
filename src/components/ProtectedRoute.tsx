import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    )
  }

  // No logueado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logueado pero sin perfil
  if (!profile) {
    return <Navigate to="/register" replace />
  }

  return children
}
