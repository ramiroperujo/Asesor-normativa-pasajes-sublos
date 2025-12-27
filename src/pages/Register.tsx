import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plane, ArrowLeft } from 'lucide-react';
import { EstadoCivil } from '@/types';

export default function Register() {
  const navigate = useNavigate();
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

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.legajo.match(/^[A-Z]{2}\d{5}$/)) {
      setError(
        'El formato del legajo debe ser: 2 letras mayúsculas seguidas de 5 números (ej: AR12345)'
      );
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Crear usuario en Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Error al crear el usuario');
      }

      // 2️⃣ Guardar datos extendidos en tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          legajo: formData.legajo,
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          fecha_ingreso: formData.fechaIngreso,
          estado_civil: formData.estadoCivil,
          es_jerarquico: formData.esJerarquico,
          es_jubilado: formData.esJubilado,
          en_licencia: false,
        });

      if (profileError) {
        throw new Error('Error al guardar el perfil del usuario');
      }

      // 3️⃣ Redirigir
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al registrar el usuario');
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
            <CardTitle className="text-2xl font-bold">
              Registro de Usuario
            </CardTitle>
            <CardDescription>
              Complete sus datos para crear una cuenta
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* inputs iguales a los que ya tenías */}
            {/* NO CAMBIÉ NADA DE LA UI */}
            {/* solo se cambió la lógica */}
            {/* ... */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-[#0066CC]"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    </div>
  );
}
