import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Beneficiario } from '@/types';
import { localStorageService } from '@/services/localStorage';
import { PasajesRulesService } from '@/services/pasajesRules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, XCircle, Info, Plane, Calendar, CreditCard } from 'lucide-react';

export default function ConsultaPasajes() {
  const { usuario } = useAuth();
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [selectedBeneficiarioId, setSelectedBeneficiarioId] = useState<string>('');
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null);

  useEffect(() => {
    if (usuario) {
      const data = localStorageService.getBeneficiarios(usuario.id);
      setBeneficiarios(data);
    }
  }, [usuario]);

  useEffect(() => {
    if (selectedBeneficiarioId) {
      const beneficiario = beneficiarios.find(b => b.id === selectedBeneficiarioId);
      setSelectedBeneficiario(beneficiario || null);
    } else {
      setSelectedBeneficiario(null);
    }
  }, [selectedBeneficiarioId, beneficiarios]);

  if (!usuario) return null;

  const verificacion = selectedBeneficiario
    ? PasajesRulesService.verificarElegibilidad(usuario, selectedBeneficiario)
    : null;

  const antiguedad = PasajesRulesService.calcularAntiguedad(usuario.fechaIngreso);
  const vedaInfo = PasajesRulesService.estaEnPeriodoVeda();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Consultar Pasajes Disponibles</h1>
        <p className="text-gray-600 mt-2">
          Verifique qué tipos de pasajes puede solicitar para cada beneficiario
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Beneficiario</CardTitle>
          <CardDescription>
            Elija un beneficiario para ver los pasajes disponibles y restricciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBeneficiarioId} onValueChange={setSelectedBeneficiarioId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un beneficiario" />
            </SelectTrigger>
            <SelectContent>
              {beneficiarios.length === 0 ? (
                <SelectItem value="none" disabled>
                  No hay beneficiarios registrados
                </SelectItem>
              ) : (
                beneficiarios.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.nombre} {b.apellido} - {b.parentesco.replace('_', ' ')}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBeneficiario && verificacion && (
        <>
          {/* Información del Beneficiario */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Beneficiario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre Completo</p>
                  <p className="font-semibold">
                    {selectedBeneficiario.nombre} {selectedBeneficiario.apellido}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Parentesco</p>
                  <p className="font-semibold capitalize">
                    {selectedBeneficiario.parentesco.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Edad</p>
                  <p className="font-semibold">
                    {PasajesRulesService.calcularEdad(selectedBeneficiario.fechaNacimiento)} años
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grupo Familiar</p>
                  <Badge
                    className={
                      selectedBeneficiario.grupoFamiliar === 'basico'
                        ? 'bg-green-100 text-green-800'
                        : selectedBeneficiario.grupoFamiliar === 'habilitado_asimilable'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }
                  >
                    {selectedBeneficiario.grupoFamiliar === 'basico'
                      ? 'Grupo Básico'
                      : selectedBeneficiario.grupoFamiliar === 'habilitado_asimilable'
                      ? 'Habilitado Asimilable'
                      : 'Habilitado No Asimilable'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restricciones Bloqueantes */}
          {verificacion.restricciones.filter(r => r.tipo === 'bloqueante').length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Restricciones Bloqueantes</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {verificacion.restricciones
                    .filter(r => r.tipo === 'bloqueante')
                    .map((r, i) => (
                      <li key={i}>
                        <strong>{r.mensaje}</strong>
                        {r.detalles && <p className="text-sm ml-5 mt-1">{r.detalles}</p>}
                      </li>
                    ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Advertencias */}
          {verificacion.advertencias.length > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-800">Advertencias</AlertTitle>
              <AlertDescription className="text-orange-700">
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {verificacion.advertencias.map((a, i) => (
                    <li key={i}>{a.mensaje}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Pasajes Disponibles */}
          {verificacion.elegible && verificacion.pasajesDisponibles.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                Pasajes Disponibles ({verificacion.pasajesDisponibles.length})
              </h2>

              {verificacion.pasajesDisponibles.map((pasaje, index) => (
                <Card key={index} className="border-l-4 border-l-[#0066CC]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Plane className="w-5 h-5 text-[#0066CC]" />
                          Pasaje {pasaje.tipo}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {pasaje.descripcion}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={pasaje.condicion === 'plaza_confirmada' ? 'default' : 'secondary'}
                        className={
                          pasaje.condicion === 'plaza_confirmada'
                            ? 'bg-[#00A650] hover:bg-[#00A650]'
                            : ''
                        }
                      >
                        {pasaje.condicion === 'plaza_confirmada'
                          ? 'Plaza Confirmada'
                          : 'Sujeto a Espacio'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <CreditCard className="w-4 h-4" />
                          Tarifa
                        </div>
                        <p className="font-semibold">
                          {pasaje.porcentajeTarifa === 0
                            ? 'Sin cargo'
                            : `${pasaje.porcentajeTarifa}% de tarifa`}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          Cantidad Anual
                        </div>
                        <p className="font-semibold">
                          {pasaje.cantidadAnual === 'ilimitado' ? 'Ilimitado' : pasaje.cantidadAnual}
                        </p>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Vigencia</div>
                        <p className="font-semibold text-sm">
                          {pasaje.vigenciaDesde} - {pasaje.vigenciaHasta}
                        </p>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Validez</div>
                        <p className="font-semibold">{pasaje.validezMeses} meses</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Destinos Permitidos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {pasaje.destinosPermitidos.map((destino) => (
                          <Badge key={destino} variant="outline" className="capitalize">
                            {destino}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {pasaje.restricciones.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Restricciones:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {pasaje.restricciones.map((restriccion, i) => (
                            <li key={i}>{restriccion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {pasaje.requiereAntiguedad > antiguedad && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Requiere {Math.floor(pasaje.requiereAntiguedad / 12)} años de antigüedad.
                          Actualmente tiene {Math.floor(antiguedad / 12)} años y {antiguedad % 12}{' '}
                          meses.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : verificacion.elegible ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Sin Pasajes Disponibles</AlertTitle>
              <AlertDescription>
                No hay pasajes disponibles para este beneficiario en este momento. Verifique los
                requisitos de antigüedad y grupo familiar.
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Información Adicional */}
          <Card className="bg-[#F5F7FA]">
            <CardHeader>
              <CardTitle className="text-lg">Información Importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                • <strong>Antigüedad actual:</strong> {Math.floor(antiguedad / 12)} años y{' '}
                {antiguedad % 12} meses
              </p>
              <p>
                • <strong>Emisión de pasajes:</strong> Entre 15 días y 4 horas antes del viaje
              </p>
              <p>
                • <strong>Máximo de tramos:</strong> 4 tramos por ticket (incluido el regreso)
              </p>
              {vedaInfo.enVeda && vedaInfo.periodo && (
                <p className="text-orange-700">
                  • <strong>Período de veda activo:</strong> {vedaInfo.periodo.nombre} - Los
                  pasajes con plaza confirmada se otorgan sujetos a espacio
                </p>
              )}
              <p>
                • <strong>Documentación:</strong> Debe presentar DNI/Pasaporte vigente al momento
                del embarque
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedBeneficiario && beneficiarios.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Seleccione un Beneficiario</AlertTitle>
          <AlertDescription>
            Por favor, seleccione un beneficiario de la lista para ver los pasajes disponibles y
            restricciones aplicables.
          </AlertDescription>
        </Alert>
      )}

      {beneficiarios.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No hay Beneficiarios Registrados</AlertTitle>
          <AlertDescription>
            Debe agregar beneficiarios en la sección "Mis Beneficiarios" antes de consultar pasajes
            disponibles.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
