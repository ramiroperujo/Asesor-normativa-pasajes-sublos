import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plane, ArrowLeft } from 'lucide-react';
import { EstadoCivil } from '@/types';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    legajo: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    fechaIngreso: '',
    estadoCivil: '' as EstadoCivil,
    esJerarquico: false,
    esJubilado: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.legajo.match(/^[A-Z]{2}\d{5}$/)) {
      setError('El formato del legajo debe ser: 2 letras mayúsculas seguidas de 5 números (ej: AR12345)');
      return;
    }

    setLoading(true);

    try {
      // Guardar datos del usuario en localStorage
      const usuario = {
        id: Date.now().toString(),
        legajo: formData.legajo,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        fechaIngreso: formData.fechaIngreso,
        estadoCivil: formData.estadoCivil,
        esJerarquico: formData.esJerarquico,
        esJubilado: formData.esJubilado,
        enLicencia: false,
      };

      // Guardar credenciales (en producción esto sería en un backend seguro)
      const credenciales = {
        legajo: formData.legajo,
        password: formData.password,
        usuario,
      };

      localStorage.setItem(`user_${formData.legajo}`, JSON.stringify(credenciales));

      // Auto-login después del registro
      const success = await login(formData.legajo, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Error al iniciar sesión automáticamente');
      }
    } catch (err) {
      setError('Error al registrar el usuario. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const estadoCivilOptions: { value: EstadoCivil; label: string }[] = [
    { value: 'soltero', label: 'Soltero/a' },
    { value: 'casado', label: 'Casado/a' },
    { value: 'union_hecho', label: 'Unión de Hecho' },
    { value: 'viudo', label: 'Viudo/a' },
    { value: 'separado', label: 'Separado/a' },
    { value: 'divorciado', label: 'Divorciado/a' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-4">
          <Button
            variant="ghost"
            className="w-fit -ml-2"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio de sesión
          </Button>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#0066CC] rounded-full flex items-center justify-center">
                <Plane className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#1A1A1A]">
              Registro de Usuario
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Complete sus datos para crear una cuenta
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Datos Personales */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Datos Personales</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    type="text"
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Corporativo *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan.perez@aerolineas.com.ar"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Datos Laborales */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Datos Laborales</h3>
              
              <div className="space-y-2">
                <Label htmlFor="legajo">Número de Legajo *</Label>
                <Input
                  id="legajo"
                  type="text"
                  placeholder="AR12345"
                  value={formData.legajo}
                  onChange={(e) => setFormData({ ...formData, legajo: e.target.value.toUpperCase() })}
                  required
                  maxLength={7}
                />
                <p className="text-xs text-gray-500">
                  Formato: 2 letras mayúsculas + 5 números (ej: AR12345)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaIngreso">Fecha de Ingreso *</Label>
                <Input
                  id="fechaIngreso"
                  type="date"
                  value={formData.fechaIngreso}
                  onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil *</Label>
                <Select
                  value={formData.estadoCivil}
                  onValueChange={(value) => setFormData({ ...formData, estadoCivil: value as EstadoCivil })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadoCivilOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="esJerarquico"
                    checked={formData.esJerarquico}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, esJerarquico: checked as boolean })
                    }
                  />
                  <Label htmlFor="esJerarquico" className="text-sm font-normal">
                    Soy personal jerárquico
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="esJubilado"
                    checked={formData.esJubilado}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, esJubilado: checked as boolean })
                    }
                  />
                  <Label htmlFor="esJubilado" className="text-sm font-normal">
                    Soy personal jubilado
                  </Label>
                </div>
              </div>
            </div>

            {/* Credenciales */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Credenciales de Acceso</h3>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita su contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
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
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>¿Ya tiene una cuenta?</p>
            <Button
              variant="link"
              className="text-[#0066CC] font-semibold"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
