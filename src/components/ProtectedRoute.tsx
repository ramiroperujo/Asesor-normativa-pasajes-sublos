import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading } = useAuth()

  // ⛔ MUY IMPORTANTE: no renderizar nada hasta terminar loading
  if (loading) {
    return null
  }

  // ❌ No logueado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ❌ Logueado pero sin perfil
  if (!profile) {
    return <Navigate to="/register" replace />
  }

  // ✅ Todo OK
  return <>{children}</>
}
