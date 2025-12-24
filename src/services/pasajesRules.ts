import {
  Usuario,
  Beneficiario,
  PasajeDisponible,
  VerificacionElegibilidad,
  Restriccion,
  Advertencia,
  TipoDestino,
  GrupoFamiliar,
  PeriodoVeda,
} from '@/types';

export class PasajesRulesService {
  // Calcular antigüedad en meses
  static calcularAntiguedad(fechaIngreso: string): number {
    const inicio = new Date(fechaIngreso);
    const ahora = new Date();
    const diffTime = Math.abs(ahora.getTime() - inicio.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  }

  // Calcular edad
  static calcularEdad(fechaNacimiento: string): number {
    const nacimiento = new Date(fechaNacimiento);
    const ahora = new Date();
    let edad = ahora.getFullYear() - nacimiento.getFullYear();
    const mes = ahora.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && ahora.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  // Verificar si está en período de veda
  static estaEnPeriodoVeda(fecha: Date = new Date()): { enVeda: boolean; periodo?: PeriodoVeda } {
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();

    // Fin de año: 15 dic - 15 ene
    if ((mes === 12 && dia >= 15) || (mes === 1 && dia <= 15)) {
      return {
        enVeda: true,
        periodo: {
          nombre: 'Fin de Año',
          descripcion: 'Período de veda de fin de año',
          fechaInicio: `${fecha.getFullYear()}-12-15`,
          fechaFin: `${fecha.getFullYear() + 1}-01-15`,
          tipo: 'fin_ano',
        },
      };
    }

    // Receso de invierno (aproximado: 15-31 julio)
    if (mes === 7 && dia >= 15) {
      return {
        enVeda: true,
        periodo: {
          nombre: 'Receso de Invierno',
          descripcion: 'Período de veda de receso escolar de invierno',
          fechaInicio: `${fecha.getFullYear()}-07-15`,
          fechaFin: `${fecha.getFullYear()}-07-31`,
          tipo: 'receso_invierno',
        },
      };
    }

    return { enVeda: false };
  }

  // Determinar grupo familiar según parentesco
  static determinarGrupoFamiliar(
    parentesco: string,
    estadoCivilTitular: string,
    edad?: number,
    esEstudiante?: boolean
  ): GrupoFamiliar {
    // Grupo Básico
    const grupoBasicoSoltero = ['padre', 'padrastro', 'hijo', 'hijastro', 'menor_cargo'];
    const grupoBasicoCasado = ['conyuge', 'concubino', 'hijo', 'hijastro', 'menor_cargo'];

    if (parentesco === 'no_name') return 'no_name';

    // Para hijos, verificar edad
    if (['hijo', 'hijastro'].includes(parentesco)) {
      if (edad !== undefined) {
        if (edad < 21) return 'basico';
        if (edad < 25 && esEstudiante) return 'basico';
        return 'habilitado_asimilable';
      }
      return 'basico'; // Por defecto si no hay edad
    }

    if (estadoCivilTitular === 'soltero' || estadoCivilTitular === 'viudo' || 
        estadoCivilTitular === 'separado' || estadoCivilTitular === 'divorciado') {
      if (grupoBasicoSoltero.includes(parentesco)) return 'basico';
    }

    if (estadoCivilTitular === 'casado' || estadoCivilTitular === 'union_hecho') {
      if (grupoBasicoCasado.includes(parentesco)) return 'basico';
    }

    // Habilitado Asimilable
    const habilitadoAsimilable = ['padre', 'padrastro', 'hermano', 'hermanastro'];
    if (habilitadoAsimilable.includes(parentesco)) return 'habilitado_asimilable';

    // Habilitado No Asimilable
    return 'habilitado_no_asimilable';
  }

  // Obtener pasajes disponibles según grupo familiar y antigüedad
  static obtenerPasajesDisponibles(
    usuario: Usuario,
    grupoFamiliar: GrupoFamiliar
  ): PasajeDisponible[] {
    const antiguedad = this.calcularAntiguedad(usuario.fechaIngreso);
    const pasajes: PasajeDisponible[] = [];

    // Pasajes porcentuales (requieren 6 meses de antigüedad)
    if (antiguedad >= 6) {
      if (grupoFamiliar === 'basico') {
        pasajes.push({
          tipo: '10P',
          descripcion: '10% de tarifa, sujeto a espacio',
          condicion: 'sujeto_espacio',
          porcentajeTarifa: 10,
          cantidadAnual: 'ilimitado',
          vigenciaDesde: '01/07',
          vigenciaHasta: '30/06',
          validezMeses: 12,
          requiereAntiguedad: 6,
          destinosPermitidos: ['cabotaje', 'regional', 'internacional'],
          gruposPermitidos: ['basico'],
          restricciones: [
            'Después del 5° viaje internacional o 12° cabotaje al mismo destino requiere autorización',
          ],
        });

        pasajes.push({
          tipo: '50P',
          descripcion: '50% de tarifa, plaza confirmada',
          condicion: 'plaza_confirmada',
          porcentajeTarifa: 50,
          cantidadAnual: 'ilimitado',
          vigenciaDesde: '01/07',
          vigenciaHasta: '30/06',
          validezMeses: 12,
          requiereAntiguedad: 6,
          destinosPermitidos: ['cabotaje', 'regional', 'internacional'],
          gruposPermitidos: ['basico'],
          restricciones: [
            'No puede emitirse ni utilizarse en períodos de veda',
            'Pierde condición de plaza confirmada si genera No Show',
          ],
        });
      }

      if (grupoFamiliar === 'habilitado_asimilable') {
        pasajes.push({
          tipo: '25P',
          descripcion: '25% de tarifa, sujeto a espacio',
          condicion: 'sujeto_espacio',
          porcentajeTarifa: 25,
          cantidadAnual: 1,
          vigenciaDesde: '01/07',
          vigenciaHasta: '30/06',
          validezMeses: 12,
          requiereAntiguedad: 6,
          destinosPermitidos: ['cabotaje', 'regional', 'internacional'],
          gruposPermitidos: ['habilitado_asimilable'],
          restricciones: ['1 pasaje por persona por año desde el 1 de julio'],
        });
      }
    }

    // Pasajes vacacionales
    if (antiguedad >= 12 && !usuario.esJubilado) {
      const destinos: TipoDestino[] = [];
      let requiereAnt = 12;

      if (antiguedad >= 12) {
        destinos.push('cabotaje');
        requiereAnt = 12;
      }
      if (antiguedad >= 24) {
        destinos.push('regional');
        requiereAnt = 24;
      }
      if (antiguedad >= 36) {
        destinos.push('internacional');
        requiereAnt = 36;
      }

      if (grupoFamiliar === 'basico' || grupoFamiliar === 'habilitado_asimilable') {
        pasajes.push({
          tipo: 'VAC',
          descripcion: 'Sin cargo (solo tasas e impuestos)',
          condicion: usuario.esJerarquico ? 'plaza_confirmada' : 'sujeto_espacio',
          porcentajeTarifa: 0,
          cantidadAnual: 1,
          vigenciaDesde: '01/07',
          vigenciaHasta: '30/06 (+2 años)',
          validezMeses: 24,
          requiereAntiguedad: requiereAnt,
          destinosPermitidos: destinos,
          gruposPermitidos: ['basico', 'habilitado_asimilable'],
          restricciones: [
            'Un pasaje por licencia vacacional',
            'Debe iniciar y finalizar en la base del empleado',
            'Máximo 4 tramos incluido el regreso',
          ],
        });
      }

      if (grupoFamiliar === 'habilitado_no_asimilable') {
        pasajes.push({
          tipo: '25V',
          descripcion: '25% de tarifa, condición según corresponda',
          condicion: 'sujeto_espacio',
          porcentajeTarifa: 25,
          cantidadAnual: 1,
          vigenciaDesde: '01/07',
          vigenciaHasta: '30/06 (+1 año)',
          validezMeses: 12,
          requiereAntiguedad: requiereAnt,
          destinosPermitidos: destinos,
          gruposPermitidos: ['habilitado_no_asimilable'],
          restricciones: [
            'Uno por año vacacional por cada cesión',
            'Se rige bajo las mismas condiciones que un pasaje vacacional',
          ],
        });
      }
    }

    return pasajes;
  }

  // Verificar elegibilidad completa
  static verificarElegibilidad(
    usuario: Usuario,
    beneficiario: Beneficiario
  ): VerificacionElegibilidad {
    const restricciones: Restriccion[] = [];
    const advertencias: Advertencia[] = [];

    // Verificar si el usuario está en licencia
    if (usuario.enLicencia) {
      if (usuario.tipoLicencia === 'medica' || usuario.tipoLicencia === 'accidente') {
        restricciones.push({
          tipo: 'bloqueante',
          mensaje: 'No puede viajar durante licencia médica o por accidente de trabajo',
          detalles: 'El personal con licencia médica o accidente de trabajo no puede hacer uso del beneficio',
        });
      }

      if (usuario.tipoLicencia === 'excedencia') {
        restricciones.push({
          tipo: 'bloqueante',
          mensaje: 'No puede emitir ni utilizar pasajes durante licencia por excedencia',
          detalles: 'Las licencias por excedencia o sin goce de sueldo no permiten el uso del beneficio',
        });
      }

      if (usuario.tipoLicencia === 'embarazo') {
        advertencias.push({
          tipo: 'documentacion',
          mensaje: 'Requiere certificado médico para viajar durante licencia por embarazo',
          afectados: [beneficiario.id],
        });
      }
    }

    // Verificar documentación
    if (!beneficiario.documentacion) {
      advertencias.push({
        tipo: 'documentacion',
        mensaje: 'Debe presentar documentación que avale el parentesco',
        afectados: [beneficiario.id],
      });
    }

    // Verificar período de veda
    const vedaInfo = this.estaEnPeriodoVeda();
    if (vedaInfo.enVeda && vedaInfo.periodo) {
      advertencias.push({
        tipo: 'veda',
        mensaje: `Período de veda: ${vedaInfo.periodo.nombre}`,
        afectados: ['plaza_confirmada'],
      });
    }

    // Obtener pasajes disponibles
    const pasajesDisponibles = this.obtenerPasajesDisponibles(usuario, beneficiario.grupoFamiliar);

    return {
      elegible: restricciones.filter(r => r.tipo === 'bloqueante').length === 0,
      pasajesDisponibles,
      restricciones,
      advertencias,
    };
  }

  // Verificar impacto de pasajes No Name
  static verificarImpactoNoName(usuario: Usuario): Advertencia[] {
    const advertencias: Advertencia[] = [];

    advertencias.push({
      tipo: 'impacto',
      mensaje: 'Al usar pasajes No Name, caducan todas las franquicias sin cargo del Grupo Familiar Básico',
      afectados: ['grupo_basico'],
    });

    advertencias.push({
      tipo: 'impacto',
      mensaje: 'No se podrán realizar cesiones a familiares habilitados en este período vacacional',
      afectados: ['cesiones'],
    });

    advertencias.push({
      tipo: 'impacto',
      mensaje: 'El pasajero No Name debe viajar con el titular en la totalidad de la ruta',
      afectados: ['no_name'],
    });

    return advertencias;
  }
}
