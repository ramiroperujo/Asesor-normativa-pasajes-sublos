export type EstadoCivil = 'soltero' | 'casado' | 'viudo' | 'separado' | 'divorciado' | 'union_hecho';

export type TipoParentesco = 
  | 'titular'
  | 'conyuge'
  | 'concubino'
  | 'hijo'
  | 'hijastro'
  | 'menor_cargo'
  | 'padre'
  | 'padrastro'
  | 'hermano'
  | 'hermanastro'
  | 'cunado'
  | 'sobrino'
  | 'nieto'
  | 'suegro'
  | 'yerno_nuera'
  | 'abuelo'
  | 'no_name';

export type GrupoFamiliar = 'basico' | 'habilitado_asimilable' | 'habilitado_no_asimilable' | 'no_name';

export type TipoPasaje = '10P' | '50P' | '25P' | '25V' | '25A' | 'VAC' | 'ADC' | 'EXT';

export type CondicionPasaje = 'sujeto_espacio' | 'plaza_confirmada' | 'pendiente_confirmacion';

export type TipoDestino = 'cabotaje' | 'regional' | 'internacional';

export interface Usuario {
  id: string;
  legajo: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaIngreso: string; // ISO date string
  estadoCivil: EstadoCivil;
  esJerarquico: boolean;
  esJubilado: boolean;
  enLicencia: boolean;
  tipoLicencia?: 'medica' | 'accidente' | 'embarazo' | 'excedencia' | 'sin_goce';
}

export interface Beneficiario {
  id: string;
  usuarioId: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO date string
  parentesco: TipoParentesco;
  grupoFamiliar: GrupoFamiliar;
  esEstudiante?: boolean;
  documentacion: boolean;
  activo: boolean;
}

export interface PasajeDisponible {
  tipo: TipoPasaje;
  descripcion: string;
  condicion: CondicionPasaje;
  porcentajeTarifa: number;
  cantidadAnual: number | 'ilimitado';
  vigenciaDesde: string;
  vigenciaHasta: string;
  validezMeses: number;
  requiereAntiguedad: number; // meses
  destinosPermitidos: TipoDestino[];
  gruposPermitidos: GrupoFamiliar[];
  restricciones: string[];
}

export interface Cesion {
  id: string;
  usuarioId: string;
  beneficiarioOrigenId: string;
  beneficiarioDestinoId: string;
  periodoVacacional: string;
  fecha: string;
  activa: boolean;
}

export interface VerificacionElegibilidad {
  elegible: boolean;
  pasajesDisponibles: PasajeDisponible[];
  restricciones: Restriccion[];
  advertencias: Advertencia[];
}

export interface Restriccion {
  tipo: 'bloqueante' | 'informativa';
  mensaje: string;
  detalles?: string;
}

export interface Advertencia {
  tipo: 'impacto' | 'limite' | 'veda' | 'documentacion';
  mensaje: string;
  afectados?: string[];
}

export interface PeriodoVeda {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  tipo: 'fin_ano' | 'semana_santa' | 'receso_invierno' | 'fin_semana_largo';
}

export interface PrioridadEmbarque {
  codigo: string;
  descripcion: string;
  orden: number;
}
