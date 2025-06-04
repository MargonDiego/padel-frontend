import apiClient from './apiClient';
import type { User, ApiResponse, PaginatedResponse } from '../types/models';

const userService = {
  // Obtener lista de usuarios públicos (para selección de compañeros)
  getPublicUsers: async (page = 1, limit = 20, search = '') => {
    try {
      // Construir la URL con parámetros de consulta
      let url = `/public-users?page=${page}&limit=${limit}`;
      
      // Si hay un término de búsqueda, añadirlo a la URL
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      // Usar apiClient para mantener la consistencia con otros servicios
      const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(url);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching public users:', error);
      return {
        success: false,
        error: 'Error de conexión al obtener usuarios',
        data: { data: [], meta: { current_page: page, last_page: 1, total: 0, per_page: limit } }
      };
    }
  },

  // Buscar usuarios por nombre (para autocompletar)
  searchUsers: async (query: string) => {
    try {
      const url = `/users/search?query=${encodeURIComponent(query)}`;
      
      const response = await apiClient.get<ApiResponse<User[]>>(url);
      
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        error: 'Error de conexión al buscar usuarios',
        data: []
      };
    }
  },

  // Obtener un usuario por ID
  getUser: async (id: number) => {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        error: 'Error al obtener el usuario',
        data: null as any
      };
    }
  }
};

export default userService;
