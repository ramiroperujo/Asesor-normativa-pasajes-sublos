import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Beneficiario, TipoParentesco, GrupoFamiliar } from '@/types';
import { localStorageService } from '@/services/localStorage';
import { PasajesRulesService } from '@/services/pasajesRules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Edit, AlertCircle, Users } from 'lucide-react';

export default function Beneficiarios() {
  const { usuario } = useAuth();
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    parentesco: '' as TipoParentesco,
    esEstudiante: false,
    documentacion: false,
  });

  useEffect(() => {
    if (usuario) {
      loadBeneficiarios();
    }
  }, [usuario]);

  const loadBeneficiarios = () => {
    if (usuario) {
      const data = localStorageService.getBeneficiarios(usuario.id);
      setBeneficiarios(data);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      parentesco: '' as TipoParentesco,
      esEstudiante: false,
      documentacion: false,
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const edad = PasajesRulesService.calcularEdad(formData.fechaNacimiento);
    const grupoFamiliar = PasajesRulesService.determinarGrupoFamiliar(
      formData.parentesco,
      usuario.estadoCivil,
      edad,
      formData.esEstudiante
    );

    if (editingId) {
      localStorageService.updateBeneficiario(editingId, {
        ...formData,
        grupoFamiliar,
      });
    } else {
      const nuevoBeneficiario: Beneficiario = {
        id: Date.now().toString(),
        usuarioId: usuario.id,
        ...formData,
        grupoFamiliar,
        activo: true,
      };
      localStorageService.addBeneficiario(nuevoBeneficiario);
    }

    loadBeneficiarios();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (beneficiario: Beneficiario) => {
    setFormData({
      nombre: beneficiario.nombre,
      apellido: beneficiario.apellido,
      fechaNacimiento: beneficiario.fechaNacimiento,
      parentesco: beneficiario.parentesco,
      esEstudiante: beneficiario.esEstudiante || false,
      documentacion: beneficiario.documentacion,
    });
    setEditingId(beneficiario.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este beneficiario?')) {
      localStorageService.deleteBeneficiario(id);
      loadBeneficiarios();
    }
  };

  const getGrupoColor = (grupo: GrupoFamiliar) => {
    switch (grupo) {
      case 'basico':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'habilitado_asimilable':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'habilitado_no_asimilable':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'no_name':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGrupoLabel = (grupo: GrupoFamiliar) => {
    switch (grupo) {
      case 'basico':
        return 'Grupo Básico';
      case 'habilitado_asimilable':
        return 'Habilitado Asimilable';
      case 'habilitado_no_asimilable':
        return 'Habilitado No Asimilable';
      case 'no_name':
        return 'No Name';
    }
  };

  const parentescoOptions: { value: TipoParentesco; label: string }[] = [
    { value: 'conyuge', label: 'Cónyuge' },
    { value: 'concubino', label: 'Concubino/a' },
    { value: 'hijo', label: 'Hijo/a' },
    { value: 'hijastro', label: 'Hijastro/a' },
    { value: 'menor_cargo', label: 'Menor a cargo' },
    { value: 'padre', label: 'Padre/Madre' },
    { value: 'padrastro', label: 'Padrastro/Madrastra' },
    { value: 'hermano', label: 'Hermano/a' },
    { value: 'hermanastro', label: 'Hermanastro/a' },
    { value: 'cunado', label: 'Cuñado/a' },
    { value: 'sobrino', label: 'Sobrino/a' },
    { value: 'nieto', label: 'Nieto/a' },
    { value: 'suegro', label: 'Suegro/a' },
    { value: 'yerno_nuera', label: 'Yerno/Nuera' },
    { value: 'abuelo', label: 'Abuelo/a' },
  ];

  const grupoBasico = beneficiarios.filter(b => b.grupoFamiliar === 'basico');
  const grupoHabilitadoAsim = beneficiarios.filter(b => b.grupoFamiliar === 'habilitado_asimilable');
  const grupoHabilitadoNoAsim = beneficiarios.filter(b => b.grupoFamiliar === 'habilitado_no_asimilable');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Mis Beneficiarios</h1>
          <p className="text-gray-600 mt-2">Gestione su grupo familiar y beneficiarios</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#0066CC] hover:bg-[#0052A3]">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Beneficiario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Agregar'} Beneficiario</DialogTitle>
              <DialogDescription>
                Complete los datos del beneficiario. El grupo familiar se asignará automáticamente.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentesco">Parentesco *</Label>
                <Select
                  value={formData.parentesco}
                  onValueChange={(value) => setFormData({ ...formData, parentesco: value as TipoParentesco })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione parentesco" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentescoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {['hijo', 'hijastro'].includes(formData.parentesco) && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="esEstudiante"
                    checked={formData.esEstudiante}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, esEstudiante: checked as boolean })
                    }
                  />
                  <Label htmlFor="esEstudiante" className="text-sm">
                    Es estudiante (21-25 años)
                  </Label>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documentacion"
                  checked={formData.documentacion}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, documentacion: checked as boolean })
                  }
                />
                <Label htmlFor="documentacion" className="text-sm">
                  Documentación presentada
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-[#0066CC] hover:bg-[#0052A3]">
                  {editingId ? 'Actualizar' : 'Agregar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {beneficiarios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay beneficiarios registrados
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Agregue beneficiarios para consultar los pasajes disponibles
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {grupoBasico.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Grupo Familiar Básico
                </CardTitle>
                <CardDescription>
                  Titular + cónyuge/concubino + hijos menores de 21 años (hasta 25 si estudian)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {grupoBasico.map((beneficiario) => (
                    <div
                      key={beneficiario.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {beneficiario.nombre} {beneficiario.apellido}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {beneficiario.parentesco.replace('_', ' ')} • 
                          Edad: {PasajesRulesService.calcularEdad(beneficiario.fechaNacimiento)} años
                        </p>
                        {!beneficiario.documentacion && (
                          <p className="text-xs text-orange-600 mt-1">
                            ⚠️ Falta presentar documentación
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getGrupoColor(beneficiario.grupoFamiliar)}>
                          {getGrupoLabel(beneficiario.grupoFamiliar)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(beneficiario)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(beneficiario.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {grupoHabilitadoAsim.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Familiares Habilitados Asimilables
                </CardTitle>
                <CardDescription>
                  Padres, hermanos, hijos mayores de 21 años
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {grupoHabilitadoAsim.map((beneficiario) => (
                    <div
                      key={beneficiario.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {beneficiario.nombre} {beneficiario.apellido}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {beneficiario.parentesco.replace('_', ' ')} • 
                          Edad: {PasajesRulesService.calcularEdad(beneficiario.fechaNacimiento)} años
                        </p>
                        {!beneficiario.documentacion && (
                          <p className="text-xs text-orange-600 mt-1">
                            ⚠️ Falta presentar documentación
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getGrupoColor(beneficiario.grupoFamiliar)}>
                          {getGrupoLabel(beneficiario.grupoFamiliar)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(beneficiario)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(beneficiario.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {grupoHabilitadoNoAsim.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Familiares Habilitados No Asimilables
                </CardTitle>
                <CardDescription>
                  Cuñados, sobrinos, nietos, suegros, yerno/nuera, abuelos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {grupoHabilitadoNoAsim.map((beneficiario) => (
                    <div
                      key={beneficiario.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {beneficiario.nombre} {beneficiario.apellido}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {beneficiario.parentesco.replace('_', ' ')} • 
                          Edad: {PasajesRulesService.calcularEdad(beneficiario.fechaNacimiento)} años
                        </p>
                        {!beneficiario.documentacion && (
                          <p className="text-xs text-orange-600 mt-1">
                            ⚠️ Falta presentar documentación
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getGrupoColor(beneficiario.grupoFamiliar)}>
                          {getGrupoLabel(beneficiario.grupoFamiliar)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(beneficiario)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(beneficiario.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Debe presentar las constancias legales escritas que avalen el 
              parentesco de cada beneficiario ante la oficina de Administración de Personal correspondiente.
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
}
