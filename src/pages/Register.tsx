import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
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

    setLoading(true);

    try {
      // 1️⃣ Crear usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError || !data.user) {
        throw authError;
      }

      // 2️⃣ Crear perfil en tabla profiles
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
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
        throw profileError;
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const estadoCivilOptions = [
    { value: 'soltero', label: 'Soltero/a' },
    { value: 'casado', label: 'Casado/a' },
    { value: 'union_hecho', label: 'Unión de Hecho' },
    { value: 'viudo', label: 'Viudo/a' },
    { value: 'separado', label: 'Separado/a' },
    { value: 'divorciado', label: 'Divorciado/a' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="text-center">
            <Plane className="mx-auto mb-4" />
            <CardTitle>Registro de Usuario</CardTitle>
            <CardDescription>Complete sus datos</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Nombre" onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
            <Input placeholder="Apellido" onChange={e => setFormData({ ...formData, apellido: e.target.value })} required />
            <Input placeholder="Email" type="email" onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            <Input placeholder="Legajo" onChange={e => setFormData({ ...formData, legajo: e.target.value.toUpperCase() })} required />
            <Input type="date" onChange={e => setFormData({ ...formData, fechaIngreso: e.target.value })} required />

            <Select onValueChange={v => setFormData({ ...formData, estadoCivil: v as EstadoCivil })}>
              <SelectTrigger>
                <SelectValue placeholder="Estado civil" />
              </SelectTrigger>
              <SelectContent>
                {estadoCivilOptions.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Checkbox onCheckedChange={v => setFormData({ ...formData, esJerarquico: v as boolean })}>
              Jerárquico
            </Checkbox>

            <Checkbox onCheckedChange={v => setFormData({ ...formData, esJubilado: v as boolean })}>
              Jubilado
            </Checkbox>

            <Input type="password" placeholder="Contraseña" onChange={e => setFormData({ ...formData, password: e.target.value })} required />
            <Input type="password" placeholder="Confirmar contraseña" onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required />

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
