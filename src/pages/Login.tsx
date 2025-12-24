import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plane } from 'lucide-react';

export default function Login() {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(legajo, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciales inválidas. Por favor, intente nuevamente.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#0066CC] rounded-full flex items-center justify-center">
              <Plane className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-[#1A1A1A]">
              Asesor de Pasajes Sublo
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Aerolíneas Argentinas
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="legajo" className="font-semibold">
                Número de Legajo
              </Label>
              <Input
                id="legajo"
                type="text"
                placeholder="Ej: AR12345"
                value={legajo}
                onChange={(e) => setLegajo(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-[#0066CC] hover:bg-[#0052A3] text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">¿No tiene una cuenta?</p>
            <Button
              variant="outline"
              className="w-full h-11 border-[#0066CC] text-[#0066CC] hover:bg-[#0066CC] hover:text-white font-semibold"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Sistema de consulta de normativa de pasajes al personal</p>
            <p className="mt-1">Versión 1.0 - 2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
