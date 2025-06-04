import apiClient from './apiClient';
import type { ApiResponse, Match, PaginatedResponse } from '../types/models';

interface MatchResultData {
  status: 'completed';
  team1Score: number;
  team2Score: number;
  // Alias para compatibilidad con la interfaz de usuario
  scoreTeam1?: number;
  scoreTeam2?: number;
  setResults: {
    team1: number;
    team2: number;
  }[];
  winnerId: number;
}

interface MatchUpdateData {
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  team1Score?: number;
  team2Score?: number;
  scoreTeam1?: number;
  scoreTeam2?: number;
  setResults?: {
    team1: number;
    team2: number;
  }[];
  winnerId?: number | null;
}

export const matchService = {
  // Obtener todos los partidos (paginados)
  getMatches: async (page = 1, limit = 10, tournamentId?: number, status?: string) => {
    let url = `/matches?page=${page}&limit=${limit}`;
    if (tournamentId) {
      url += `&tournament_id=${tournamentId}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Match>>>(url);
    return response.data;
  },

  // Obtener un partido específico
  getMatch: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Match>>(`/matches/${id}`);
    return response.data;
  },

  // Registrar resultado de un partido (completo con ganador)
  registerResult: async (id: number, resultData: MatchResultData) => {
    const response = await apiClient.post<ApiResponse<Match>>(`/matches/${id}/result`, resultData);
    return response.data;
  },
  
  // Actualizar un partido con datos parciales
  updateMatch: async (id: number, updateData: MatchUpdateData) => {
    const response = await apiClient.put<ApiResponse<Match>>(`/matches/${id}/update`, updateData);
    return response.data;
  }
};

export default matchService;
