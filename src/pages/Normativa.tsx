import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Users, Calendar, AlertTriangle, HelpCircle, List } from 'lucide-react';

export default function Normativa() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Normativa de Pasajes</h1>
        <p className="text-gray-600 mt-2">
          Información completa sobre reglas, procedimientos y restricciones
        </p>
      </div>

      <Tabs defaultValue="grupos" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="grupos">
            <Users className="w-4 h-4 mr-2" />
            Grupos
          </TabsTrigger>
          <TabsTrigger value="tipos">
            <List className="w-4 h-4 mr-2" />
            Tipos
          </TabsTrigger>
          <TabsTrigger value="veda">
            <Calendar className="w-4 h-4 mr-2" />
            Vedas
          </TabsTrigger>
          <TabsTrigger value="restricciones">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Restricciones
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="w-4 h-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Grupos Familiares */}
        <TabsContent value="grupos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Grupo Familiar Básico
              </CardTitle>
              <CardDescription>
                Máximo 4 personas incluyendo al titular
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Titular Soltero/Viudo/Separado/Divorciado:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Padres / Padrastros</li>
                  <li>Hijos e hijastros menores de 21 años</li>
                  <li>Hijos e hijastros de 21 a 25 años (si acreditan cursada de estudios)</li>
                  <li>Menores de 21 años a cargo legalmente</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Titular Casado o en Unión de Hecho:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Cónyuge / Concubino/a (convivencia mínima 2 años)</li>
                  <li>Hijos e hijastros menores de 21 años</li>
                  <li>Hijos e hijastros de 21 a 25 años (si acreditan cursada de estudios)</li>
                  <li>Hijos menores de 21 años del cónyuge o concubino/a</li>
                  <li>Menores de 21 años a cargo legalmente</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Familiares Habilitados Asimilables al Grupo Básico
              </CardTitle>
              <CardDescription>
                Pueden completar el grupo básico si no alcanza 4 personas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-semibold mb-2">Titular Soltero/Viudo/Separado/Divorciado:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Hermanos / Hermanastros</li>
                  <li>Hijos e hijastros mayores de 21 años</li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-semibold mb-2">Titular Casado o en Unión de Hecho:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Padres / Padrastros</li>
                  <li>Hermanos / Hermanastros</li>
                  <li>Hijos e hijastros mayores de 21 años</li>
                  <li>Hijos del cónyuge o concubino/a mayores de 21 años</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                Familiares Habilitados NO Asimilables
              </CardTitle>
              <CardDescription>
                Pueden ocupar lugares restantes hasta completar 4 personas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Cuñados (requiere constancia de matrimonio)</li>
                <li>Sobrinos</li>
                <li>Nietos</li>
                <li>Suegros (requiere constancia de matrimonio)</li>
                <li>Yerno/Nuera (requiere constancia de matrimonio)</li>
                <li>Abuelos</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tipos de Pasajes */}
        <TabsContent value="tipos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pasajes con Pago de Porcentajes</CardTitle>
              <CardDescription>Requieren 6 meses de antigüedad mínima</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">10P - Grupo Básico</h4>
                    <Badge>Sujeto a Espacio</Badge>
                  </div>
                  <p className="text-sm text-gray-700">10% de tarifa | Cantidad ilimitada</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Vigencia: 01/07 - 30/06 | Validez: 12 meses
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">50P - Grupo Básico</h4>
                    <Badge className="bg-[#00A650]">Plaza Confirmada</Badge>
                  </div>
                  <p className="text-sm text-gray-700">50% de tarifa | Cantidad ilimitada</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Vigencia: 01/07 - 30/06 | Validez: 12 meses
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    ⚠️ No puede emitirse ni utilizarse en períodos de veda
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">25P - Habilitado Asimilable</h4>
                    <Badge>Sujeto a Espacio</Badge>
                  </div>
                  <p className="text-sm text-gray-700">25% de tarifa | 1 por persona por año</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Vigencia: 01/07 - 30/06 | Validez: 12 meses
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">25V - Habilitado No Asimilable</h4>
                    <Badge>Según Corresponda</Badge>
                  </div>
                  <p className="text-sm text-gray-700">
                    25% de tarifa | 1 por año vacacional por cesión
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Vigencia: 01/07 - 30/06 (+1 año) | Validez: 12 meses
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">25A - No Name</h4>
                    <Badge>Sujeto a Espacio</Badge>
                  </div>
                  <p className="text-sm text-gray-700">25% de tarifa | Según convenio</p>
                  <p className="text-xs text-orange-600 mt-2">
                    ⚠️ Caduca todas las franquicias sin cargo del grupo básico
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pasajes Vacacionales (Sin Cargo)</CardTitle>
              <CardDescription>Solo se abonan tasas e impuestos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">VAC - Vacacional</h4>
                  <Badge>Según Jerarquía</Badge>
                </div>
                <p className="text-sm text-gray-700">
                  Sin cargo (solo tasas) | 1 por licencia vacacional
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Vigencia: 01/07 - 30/06 (+2 años) | Validez: 24 meses
                </p>
                <div className="mt-3 space-y-1 text-xs">
                  <p>
                    <strong>Cabotaje:</strong> 1 año de antigüedad o 1ra licencia
                  </p>
                  <p>
                    <strong>Regional:</strong> 2 años de antigüedad o 2da licencia
                  </p>
                  <p>
                    <strong>Internacional:</strong> 3 años de antigüedad o 3ra licencia
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Períodos de Veda */}
        <TabsContent value="veda" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Períodos de Veda</CardTitle>
              <CardDescription>
                Durante estos períodos, los pasajes con plaza confirmada se otorgan sujetos a espacio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-orange-50">
                <h4 className="font-semibold mb-2">Fin de Año</h4>
                <p className="text-sm text-gray-700">15 de diciembre - 15 de enero (inclusive)</p>
              </div>

              <div className="p-4 border rounded-lg bg-orange-50">
                <h4 className="font-semibold mb-2">Semana Santa</h4>
                <p className="text-sm text-gray-700">
                  Desde 6 días anteriores al Jueves Santo hasta 2 días posteriores al Domingo Santo
                  (incluyendo primer y último día)
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-orange-50">
                <h4 className="font-semibold mb-2">Receso Escolar de Invierno</h4>
                <p className="text-sm text-gray-700">
                  Desde el jueves anterior hasta el martes posterior al receso (pauta: Capital
                  Federal)
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-orange-50">
                <h4 className="font-semibold mb-2">Fines de Semana Largos</h4>
                <p className="text-sm text-gray-700">
                  Desde el día anterior hasta un día después del último día del fin de semana largo
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Incluye feriados nacionales, puentes turísticos y días no laborables
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#F5F7FA]">
            <CardHeader>
              <CardTitle className="text-lg">Nota Importante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                Los boletos 50P (plaza confirmada con pago del 50%) no podrán ser emitidos ni
                utilizados con fechas dentro del período de veda.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restricciones */}
        <TabsContent value="restricciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restricciones Generales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border-l-4 border-l-red-500 bg-red-50">
                <p className="text-sm font-semibold text-red-800">Máximo de Tramos</p>
                <p className="text-sm text-gray-700 mt-1">
                  Máximo 4 tramos por ticket (incluido el regreso)
                </p>
              </div>

              <div className="p-3 border-l-4 border-l-red-500 bg-red-50">
                <p className="text-sm font-semibold text-red-800">Límite de Viajes</p>
                <p className="text-sm text-gray-700 mt-1">
                  Después del 5° viaje internacional o 12° cabotaje al mismo destino para el mismo
                  pasajero, requiere autorización expresa a sublos@aerolineas.com.ar
                </p>
              </div>

              <div className="p-3 border-l-4 border-l-red-500 bg-red-50">
                <p className="text-sm font-semibold text-red-800">Pasajes No Name</p>
                <p className="text-sm text-gray-700 mt-1">
                  Al usar pasajes No Name, caducan automáticamente todas las franquicias sin cargo
                  del Grupo Familiar Básico para ese período vacacional
                </p>
              </div>

              <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50">
                <p className="text-sm font-semibold text-orange-800">Licencias Médicas</p>
                <p className="text-sm text-gray-700 mt-1">
                  El personal con licencia médica o accidente de trabajo no puede hacer uso del
                  beneficio
                </p>
              </div>

              <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50">
                <p className="text-sm font-semibold text-orange-800">Licencia por Embarazo</p>
                <p className="text-sm text-gray-700 mt-1">
                  Requiere presentar certificado médico que avale condiciones para volar (48hs
                  hábiles antes del vuelo)
                </p>
              </div>

              <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50">
                <p className="text-sm font-semibold text-orange-800">Licencia por Excedencia</p>
                <p className="text-sm text-gray-700 mt-1">
                  No se pueden emitir ni utilizar pasajes durante licencia por excedencia o sin goce
                  de sueldo
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Obligaciones del Beneficiario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Presentar DNI/Pasaporte vigente al momento del embarque</p>
              <p>• Contar con documentación exigida por autoridades para destinos internacionales</p>
              <p>• Presentar constancias legales que avalen el parentesco ante Administración de Personal</p>
              <p>• Cumplir con el código de vestimenta (ropa apropiada y prolija)</p>
              <p>• Los gastos (tasas, impuestos, exceso de equipaje) están a cargo del beneficiario</p>
              <p>• Pasajes vacacionales deben iniciar y finalizar en la base del empleado</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">¿Cuándo puedo emitir mis pasajes?</h4>
                <p className="text-sm text-gray-700">
                  Entre 15 días corridos y hasta 4 horas antes del inicio del viaje.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">¿Puedo cambiar las fechas de mi pasaje?</h4>
                <p className="text-sm text-gray-700">
                  Sí, puede solicitar cambios con 48 horas hábiles de anticipación enviando un email
                  a sublos@aerolineas.com.ar. Los pasajes sujetos a espacio emitidos por web pueden
                  cambiarse mediante autogestión.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">
                  ¿Qué pasa si soy familiar de otro empleado?
                </h4>
                <p className="text-sm text-gray-700">
                  No se contempla la multiplicidad de beneficio. Debe elegir por cada período
                  vacacional la condición que resulte más conveniente, renunciando expresamente a la
                  propia titularidad.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">
                  ¿Puedo ceder mi lugar del grupo básico a un familiar habilitado?
                </h4>
                <p className="text-sm text-gray-700">
                  Sí, se pueden ceder hasta 3 lugares del grupo básico (excluido el titular) a
                  familiares habilitados asimilables o no asimilables. La cesión tiene validez por un
                  período vacacional.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">
                  ¿Qué sucede si uso un pasaje No Name?
                </h4>
                <p className="text-sm text-gray-700">
                  Al hacer uso de pasajes No Name, caducan automáticamente todas las franquicias sin
                  cargo de todos los beneficiarios del Grupo Familiar Básico para ese período
                  vacacional, y no se podrán realizar cesiones a familiares habilitados.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">
                  ¿Puedo viajar si estoy de licencia?
                </h4>
                <p className="text-sm text-gray-700">
                  Depende del tipo de licencia. Las licencias médicas y por accidente de trabajo no
                  permiten viajar. Las licencias por embarazo requieren certificado médico. Las
                  licencias por excedencia no permiten emitir ni utilizar pasajes.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">
                  ¿Cuántos pasajes vacacionales tengo por año?
                </h4>
                <p className="text-sm text-gray-700">
                  Se otorga un pedido de pasajes por año de licencia vacacional. Los pasajes tienen
                  una vigencia de 2 años desde el 01/07 del año correspondiente al devengamiento (21
                  meses para personal de vuelo).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#F5F7FA]">
            <CardHeader>
              <CardTitle className="text-lg">Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                Para consultas adicionales, comuníquese con la oficina de Pasajes al Personal:
              </p>
              <p className="text-sm font-semibold mt-2">
                Email: sublos@aerolineas.com.ar
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
