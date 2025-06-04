import apiClient from './apiClient';
import type { ApiResponse, PlayerStat, TeamStat } from '../types/models';

export const statsService = {
  // Obtener estadísticas de un jugador
  getPlayerStats: async (playerId: number) => {
    try {
      const response = await apiClient.get<ApiResponse<PlayerStat>>(`/stats/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del jugador:', error);
      return {
        success: false,
        message: 'Error al obtener estadísticas',
        data: null as any
      };
    }
  },

  // Obtener estadísticas de un equipo
  getTeamStats: async (teamId: number) => {
    const response = await apiClient.get<ApiResponse<TeamStat>>(`/stats/teams/${teamId}`);
    return response.data;
  },

  // Obtener ranking de jugadores
  getPlayerRanking: async (limit = 10) => {
    const response = await apiClient.get<ApiResponse<PlayerStat[]>>(`/rankings/players?limit=${limit}`);
    return response.data;
  },

  // Obtener ranking de equipos
  getTeamRanking: async (limit = 10) => {
    const response = await apiClient.get<ApiResponse<TeamStat[]>>(`/rankings/teams?limit=${limit}`);
    return response.data;
  }
};

export default statsService;
