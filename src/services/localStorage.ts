import { Beneficiario, Cesion, Usuario } from '@/types';

const KEYS = {
  USUARIO: 'usuario',
  BENEFICIARIOS: 'beneficiarios',
  CESIONES: 'cesiones',
};

export const localStorageService = {
  // Usuario
  getUsuario: (): Usuario | null => {
    const data = localStorage.getItem(KEYS.USUARIO);
    return data ? JSON.parse(data) : null;
  },

  setUsuario: (usuario: Usuario): void => {
    localStorage.setItem(KEYS.USUARIO, JSON.stringify(usuario));
  },

  removeUsuario: (): void => {
    localStorage.removeItem(KEYS.USUARIO);
  },

  // Beneficiarios
  getBeneficiarios: (usuarioId: string): Beneficiario[] => {
    const data = localStorage.getItem(KEYS.BENEFICIARIOS);
    const todos: Beneficiario[] = data ? JSON.parse(data) : [];
    return todos.filter(b => b.usuarioId === usuarioId && b.activo);
  },

  addBeneficiario: (beneficiario: Beneficiario): void => {
    const data = localStorage.getItem(KEYS.BENEFICIARIOS);
    const beneficiarios: Beneficiario[] = data ? JSON.parse(data) : [];
    beneficiarios.push(beneficiario);
    localStorage.setItem(KEYS.BENEFICIARIOS, JSON.stringify(beneficiarios));
  },

  updateBeneficiario: (id: string, beneficiario: Partial<Beneficiario>): void => {
    const data = localStorage.getItem(KEYS.BENEFICIARIOS);
    const beneficiarios: Beneficiario[] = data ? JSON.parse(data) : [];
    const index = beneficiarios.findIndex(b => b.id === id);
    if (index !== -1) {
      beneficiarios[index] = { ...beneficiarios[index], ...beneficiario };
      localStorage.setItem(KEYS.BENEFICIARIOS, JSON.stringify(beneficiarios));
    }
  },

  deleteBeneficiario: (id: string): void => {
    const data = localStorage.getItem(KEYS.BENEFICIARIOS);
    const beneficiarios: Beneficiario[] = data ? JSON.parse(data) : [];
    const index = beneficiarios.findIndex(b => b.id === id);
    if (index !== -1) {
      beneficiarios[index].activo = false;
      localStorage.setItem(KEYS.BENEFICIARIOS, JSON.stringify(beneficiarios));
    }
  },

  // Cesiones
  getCesiones: (usuarioId: string): Cesion[] => {
    const data = localStorage.getItem(KEYS.CESIONES);
    const todas: Cesion[] = data ? JSON.parse(data) : [];
    return todas.filter(c => c.usuarioId === usuarioId && c.activa);
  },

  addCesion: (cesion: Cesion): void => {
    const data = localStorage.getItem(KEYS.CESIONES);
    const cesiones: Cesion[] = data ? JSON.parse(data) : [];
    cesiones.push(cesion);
    localStorage.setItem(KEYS.CESIONES, JSON.stringify(cesiones));
  },
};
