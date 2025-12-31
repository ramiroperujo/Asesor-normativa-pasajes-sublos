import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { PasajesRulesService } from '@/services/pasajesRules'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'


interface Beneficiario {
  id: string
  nombre: string
  apellido: string
  parentesco: string
  fechaNacimiento: string
  usuarioId: string
}

const initialForm = {
  nombre: '',
  apellido: '',
  parentesco: '',
  fechaNacimiento: '',
  esEstudiante: false,
}

export default function Beneficiarios() {
  const { profile } = useAuth()

  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([])
  const [formData, setFormData] = useState(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  /* ===============================
     CARGA DESDE SUPABASE
  ================================ */
  useEffect(() => {
    if (!profile) return

    const loadBeneficiarios = async () => {
      const { data, error } = await supabase
        .from('beneficiarios')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })

      if (!error) {
        setBeneficiarios(
          (data || []).map(b => ({
            id: b.id,
            nombre: b.nombre,
            apellido: b.apellido,
            parentesco: b.parentesco,
            fechaNacimiento: b.fecha_nacimiento,
            usuarioId: b.profile_id,
          }))
        )
      }
    }

    loadBeneficiarios()
  }, [profile])

  /* ===============================
     HANDLERS
  ================================ */
  const resetForm = () => {
    setFormData(initialForm)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    const edad = PasajesRulesService.calcularEdad(
      formData.fechaNacimiento
    )

    PasajesRulesService.determinarGrupoFamiliar(
      formData.parentesco,
      profile.estado_civil,
      edad,
      formData.esEstudiante
    )

    if (editingId) {
      await supabase
        .from('beneficiarios')
        .update({
          nombre: formData.nombre,
          apellido: formData.apellido,
          parentesco: formData.parentesco,
          fecha_nacimiento: formData.fechaNacimiento,
        })
        .eq('id', editingId)
    } else {
      await supabase.from('beneficiarios').insert({
        profile_id: profile.id,
        nombre: formData.nombre,
        apellido: formData.apellido,
        parentesco: formData.parentesco,
        fecha_nacimiento: formData.fechaNacimiento,
      })
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (b: Beneficiario) => {
    setEditingId(b.id)
    setFormData({
      nombre: b.nombre,
      apellido: b.apellido,
      parentesco: b.parentesco,
      fechaNacimiento: b.fechaNacimiento,
      esEstudiante: false,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    await supabase
      .from('beneficiarios')
      .delete()
      .eq('id', id)
  }

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Beneficiarios</h1>

        <Button onClick={() => setIsDialogOpen(true)}>
          Agregar beneficiario
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {beneficiarios.map(b => (
          <Card key={b.id}>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">
                {b.nombre} {b.apellido}
              </div>
              <div className="text-sm text-muted-foreground">
                {b.parentesco}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(b)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(b.id)}
                >
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar beneficiario' : 'Nuevo beneficiario'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={e =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Apellido</Label>
              <Input
                value={formData.apellido}
                onChange={e =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Parentesco</Label>
              <Select
                value={formData.parentesco}
                onValueChange={value =>
                  setFormData({ ...formData, parentesco: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conyuge">Cónyuge</SelectItem>
                  <SelectItem value="hijo">Hijo</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Fecha de nacimiento</Label>
              <Input
                type="date"
                value={formData.fechaNacimiento}
                onChange={e =>
                  setFormData({
                    ...formData,
                    fechaNacimiento: e.target.value,
                  })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

