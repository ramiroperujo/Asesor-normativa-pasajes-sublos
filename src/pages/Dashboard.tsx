import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Search, BookOpen, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { PasajesRulesService } from '@/services/pasajesRules';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Dashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  if (!usuario) return null;

  const antiguedad = PasajesRulesService.calcularAntiguedad(usuario.fechaIngreso);
  const antiguedadAnios = Math.floor(antiguedad / 12);
  const antiguedadMeses = antiguedad % 12;

  const vedaInfo = PasajesRulesService.estaEnPeriodoVeda();

  const menuItems = [
    {
      title: 'Mis Beneficiarios',
      description: 'Gestionar grupo familiar y beneficiarios',
      icon: Users,
      path: '/beneficiarios',
      color: 'bg-blue-500',
    },
    {
      title: 'Consultar Pasajes',
      description: 'Ver pasajes disponibles y restricciones',
      icon: Search,
      path: '/consulta',
      color: 'bg-green-500',
    },
    {
      title: 'Normativa',
      description: 'Información sobre reglas y procedimientos',
      icon: BookOpen,
      path: '/normativa',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">
          Bienvenido, {usuario.nombre} {usuario.apellido}
        </h1>
        <p className="text-gray-600 mt-2">
          Legajo: {usuario.legajo} | Antigüedad: {antiguedadAnios} años {antiguedadMeses} meses
        </p>
      </div>

      {vedaInfo.enVeda && vedaInfo.periodo && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Período de Veda Activo:</strong> {vedaInfo.periodo.nombre}
            <br />
            Los pasajes con plaza confirmada se otorgan sujetos a espacio durante este período.
          </AlertDescription>
        </Alert>
      )}

      {usuario.enLicencia && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atención:</strong> Está en situación de licencia ({usuario.tipoLicencia}).
            {(usuario.tipoLicencia === 'medica' || usuario.tipoLicencia === 'accidente') && (
              <> No puede hacer uso del beneficio de pasajes.</>
            )}
            {usuario.tipoLicencia === 'embarazo' && (
              <> Requiere certificado médico para viajar.</>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-[#00A650]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-[#00A650]" />
              Estado del Beneficio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Antigüedad:</span>
              <span className="font-semibold">{antiguedadAnios} años {antiguedadMeses} meses</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado Civil:</span>
              <span className="font-semibold capitalize">{usuario.estadoCivil.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de Personal:</span>
              <span className="font-semibold">
                {usuario.esJerarquico ? 'Jerárquico' : usuario.esJubilado ? 'Jubilado' : 'Activo'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pasajes Porcentuales:</span>
              <span className="font-semibold text-[#00A650]">
                {antiguedad >= 6 ? 'Disponibles' : 'No disponibles'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pasajes Vacacionales:</span>
              <span className="font-semibold text-[#00A650]">
                {antiguedad >= 12 ? 'Disponibles' : 'No disponibles'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#0066CC]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-[#0066CC]" />
              Destinos Habilitados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cabotaje:</span>
              <span className={`font-semibold ${antiguedad >= 12 ? 'text-[#00A650]' : 'text-gray-400'}`}>
                {antiguedad >= 12 ? '✓ Habilitado' : '✗ Requiere 1 año'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Regional:</span>
              <span className={`font-semibold ${antiguedad >= 24 ? 'text-[#00A650]' : 'text-gray-400'}`}>
                {antiguedad >= 24 ? '✓ Habilitado' : '✗ Requiere 2 años'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Internacional:</span>
              <span className={`font-semibold ${antiguedad >= 36 ? 'text-[#00A650]' : 'text-gray-400'}`}>
                {antiguedad >= 36 ? '✓ Habilitado' : '✗ Requiere 3 años'}
              </span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">
                Los destinos se habilitan según antigüedad para pasajes vacacionales
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(item.path)}
            >
              <CardHeader>
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-3`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Acceder →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-[#F5F7FA]">
        <CardHeader>
          <CardTitle className="text-lg">Recordatorios Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Debe presentar documentación que avale el parentesco de cada beneficiario</p>
          <p>• Los pasajes vacacionales deben iniciar y finalizar en su base habitual</p>
          <p>• Máximo 4 tramos por ticket (incluido el regreso)</p>
          <p>• Los pasajes No Name caducan las franquicias sin cargo del grupo básico</p>
          <p>• Después del 5° viaje internacional o 12° cabotaje al mismo destino requiere autorización</p>
        </CardContent>
      </Card>
    </div>
  );
}
