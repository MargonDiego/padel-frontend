import apiClient from './apiClient';
import type { ApiResponse, Team, PaginatedResponse } from '../types/models';

interface TeamCreateData {
  name: string;
  description?: string;
  player2Id: number;
}

interface TeamUpdateData {
  name?: string;
  description?: string;
}

export const teamService = {
  // Obtener todos los equipos (paginados)
  getTeams: async (page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Team>>>(`/teams?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Obtener equipos del usuario actual
  getMyTeams: async (page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Team>>>(`/my-teams?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Obtener equipos de un usuario específico
  // NOTA: Según la documentación de la API, no existe un endpoint directo para obtener los equipos de un usuario
  // En lugar de usar /users/{id}/teams, obtenemos todos los equipos y filtramos por el usuario
  getUserTeams: async (userId: number) => {
    try {
      // Obtenemos todos los equipos
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Team>>>(`/teams?limit=100`);
      
      // Si la respuesta es exitosa, filtramos manualmente los equipos donde el usuario es jugador
      if (response.data.success) {
        const userTeams = response.data.data.data.filter(team => 
          team.player1Id === userId || team.player2Id === userId
        );
        
        return {
          success: true,
          message: 'Equipos del usuario obtenidos correctamente',
          data: userTeams
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener equipos del usuario:', error);
      return {
        success: false,
        message: 'Error al obtener equipos del usuario',
        data: []
      };
    }
  },

  // Obtener un equipo específico
  getTeam: async (id: number) => {
    const response = await apiClient.get<ApiResponse<{team: Team, recentMatches: any[]}>>(`/teams/${id}`);
    return response.data;
  },

  // Crear un nuevo equipo
  createTeam: async (teamData: TeamCreateData) => {
    const response = await apiClient.post<ApiResponse<Team>>('/teams', teamData);
    return response.data;
  },

  // Actualizar un equipo
  updateTeam: async (id: number, teamData: TeamUpdateData) => {
    const response = await apiClient.put<ApiResponse<Team>>(`/teams/${id}`, teamData);
    return response.data;
  },

  // Eliminar un equipo
  deleteTeam: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/teams/${id}`);
    return response.data;
  }
};

export default teamService;
