import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plane, ArrowLeft } from 'lucide-react'
import { EstadoCivil } from '@/types'

const estadoCivilOptions = [
  { value: 'soltero', label: 'Soltero/a' },
  { value: 'casado', label: 'Casado/a' },
  { value: 'conviviente', label: 'Conviviente' },
  { value: 'divorciado', label: 'Divorciado/a' },
  { value: 'viudo', label: 'Viudo/a' },
]

export default function Register() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    legajo: '',
    nombre: '',
    apellido: '',
    email: '',
    fechaIngreso: '',
    estadoCivil: '' as EstadoCivil,
    esJerarquico: false,
    esJubilado: false,
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (!formData.legajo.match(/^[A-Z]{2}\d{5}$/)) {
      setError(
        'El formato del legajo debe ser: 2 letras mayúsculas seguidas de 5 números (ej: AR12345)'
      )
      return
    }

    setLoading(true)

    try {
      // 1️⃣ Crear usuario en Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Error al crear el usuario')
      }

      // 2️⃣ Crear perfil del usuario
      const { error: profileError } = await supabase
  .from('profiles')
  .insert({
    id: authData.user.id,
    legajo: formData.legajo,
    nombre: formData.nombre,
    apellido: formData.apellido,
    fecha_ingreso: formData.fechaIngreso,
    estado_civil: formData.estadoCivil,
    es_jerarquico: formData.esJerarquico,
    es_jubilado: formData.esJubilado,
    en_licencia: false,
  })

      if (profileError) {
        throw new Error('Error al guardar el perfil')
      }

      // 3️⃣ Login automático
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (loginError) {
        throw new Error('Error al iniciar sesión')
      }

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al registrar el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Button
            variant="ghost"
            className="w-fit"
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
            {/* Datos personales */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre *</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Apellido *</Label>
                <Input
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Legajo *</Label>
              <Input
                value={formData.legajo}
                maxLength={7}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    legajo: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Fecha de ingreso *</Label>
              <Input
                type="date"
                value={formData.fechaIngreso}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fechaIngreso: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Estado civil *</Label>
              <Select
                value={formData.estadoCivil}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    estadoCivil: value as EstadoCivil,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  {estadoCivilOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.esJerarquico}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, esJerarquico: Boolean(v) })
                }
              />
              <Label>Soy personal jerárquico</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.esJubilado}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, esJubilado: Boolean(v) })
                }
              />
              <Label>Soy personal jubilado</Label>
            </div>

            <div>
              <Label>Contraseña *</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Confirmar contraseña *</Label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-[#0066CC]"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            ¿Ya tiene una cuenta?{' '}
            <Button variant="link" onClick={() => navigate('/login')}>
              Iniciar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
