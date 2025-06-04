import apiClient from './apiClient';
import type { ApiResponse, Tournament, PaginatedResponse, Team, Match } from '../types/models';

interface TournamentCreateData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  format: 'elimination' | 'round_robin';
  maxTeams?: number;
  location?: string;
}

interface TournamentUpdateData {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  format?: 'elimination' | 'round_robin';
  maxTeams?: number;
  location?: string;
  status?: 'draft' | 'open' | 'in_progress' | 'completed';
}

interface SeedAssignData {
  teamId: number;
  seed: number;
}

export const tournamentService = {
  // Obtener todos los torneos (paginados)
  getTournaments: async (page = 1, limit = 10, status?: string) => {
    let url = `/tournaments?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Tournament>>>(url);
    return response.data;
  },

  // Obtener un torneo específico
  getTournament: async (id: number) => {
    const response = await apiClient.get<ApiResponse<{tournament: Tournament, matches: Match[]}>>(`/tournaments/${id}`);
    return response.data;
  },

  // Obtener los partidos de un torneo específico
  getTournamentMatches: async (id: number, page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<{meta: any, data: Match[]}>>(`/tournaments/${id}/matches?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Crear un nuevo torneo
  createTournament: async (tournamentData: TournamentCreateData) => {
    const response = await apiClient.post<ApiResponse<Tournament>>('/tournaments', tournamentData);
    return response.data;
  },

  // Actualizar un torneo
  updateTournament: async (id: number, tournamentData: TournamentUpdateData) => {
    const response = await apiClient.put<ApiResponse<Tournament>>(`/tournaments/${id}`, tournamentData);
    return response.data;
  },

  // Eliminar un torneo
  deleteTournament: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/tournaments/${id}`);
    return response.data;
  },

  // Abrir inscripciones de un torneo
  openRegistration: async (id: number) => {
    const response = await apiClient.post<ApiResponse<Tournament>>(`/tournaments/${id}/open`);
    return response.data;
  },

  // Generar cuadros de un torneo
  generateBrackets: async (id: number) => {
    const response = await apiClient.post<ApiResponse<{tournament: Tournament, matches: Match[]}>>(`/tournaments/${id}/brackets`);
    return response.data;
  },

  // Inscribir equipo en un torneo
  registerTeam: async (tournamentId: number, teamId: number) => {
    const response = await apiClient.post<ApiResponse<any>>(`/tournaments/${tournamentId}/register`, { teamId });
    return response.data;
  },

  // Eliminar inscripción de un equipo
  unregisterTeam: async (tournamentId: number, teamId: number) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/tournaments/${tournamentId}/teams/${teamId}`);
    return response.data;
  },

  // Listar equipos inscritos en un torneo
  getRegisteredTeams: async (tournamentId: number) => {
    const response = await apiClient.get<ApiResponse<Team[]>>(`/tournaments/${tournamentId}/teams`);
    return response.data;
  },

  // Asignar semilla a un equipo
  assignSeed: async (tournamentId: number, data: SeedAssignData) => {
    const response = await apiClient.post<ApiResponse<any>>(`/tournaments/${tournamentId}/seed`, data);
    return response.data;
  }
};

export default tournamentService;
