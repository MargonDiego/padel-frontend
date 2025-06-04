import apiClient from './apiClient';
import type { ApiResponse, User } from '../types/models';
import { jwtDecode } from 'jwt-decode';

// Definición de respuesta de error para mejor manejo de tipos
interface ErrorResponse {
  success: false;
  error: any;
}

// Unión de tipos para respuestas
type ServiceResponse<T> = ApiResponse<T> | ErrorResponse;

interface LoginCredentials {
  username: string;
  password: string;
  identity: string; // Requerido según la memoria del proyecto
}

// Interfaz que coincide exactamente con la estructura que espera la API
interface RegistrationData {
  username: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  email: string;
  phone: string;
  playerLevel: string;
  dominantHand: string;
  // Campos opcionales
  experienceYears?: number;
  heightCm?: number;
  weightKg?: number;
  city?: string;
  country?: string;
  playingPosition?: string;
  favoriteRacket?: string;
}

// Definición de los datos para actualización de perfil - coincide con el formato de la API
interface UpdateProfileData {
  name?: string;
  phone?: string;
  level?: string;           // Corresponde a playerLevel en el frontend
  playing_hand?: string;    // Corresponde a dominantHand en el frontend
  experience_years?: number;
  height_cm?: number;
  weight_kg?: number;
  city?: string;
  country?: string;
  playing_position?: string;
  favorite_racket?: string;
  email?: string;
}

// Respuesta de la API al actualizar el perfil
interface ProfileApiResponse {
  id: number;
  userRoleId: number;
  userStatusId: number;
  username: string;
  name: string;
  email: string;
  level?: string;
  playing_hand?: string;
  // Campos opcionales según lo que devuelva la API
  [key: string]: any;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface JwtPayload {
  sub: string;
  name: string;
  exp: number;
  // Otros campos del token
}

interface LoginResponse {
  user: User;
  user_token: {
    type: string;
    token: string;
    expires_at: string;
  };
}

export const authService = {
  // Iniciar sesión
  login: async (credentials: { username: string, password: string }): Promise<ServiceResponse<LoginResponse>> => {
    try {
      // Agregamos el parámetro identity como 'postman' según la memoria del proyecto
      const loginData: LoginCredentials = {
        ...credentials,
        identity: 'postman',
      };

      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth', loginData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.user_token.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión',
      };
    }
  },

  // Registrar nuevo usuario
  register: async (userData: Partial<RegistrationData>) => {
    try {
      // Los datos ya deberían tener el formato correcto porque hemos actualizado el formulario
      // Pero realizamos una verificación adicional para asegurarnos
      console.log('Datos de registro a enviar:', userData);
      
      const response = await apiClient.post<ApiResponse<User>>('/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Error en registro:', error);
      // Mostrar detalles específicos del error para depuración
      if (error.response && error.response.data) {
        console.error('Detalles del error:', error.response.data);
      }
      return {
        success: false,
        error: error.message || 'Error al registrar el usuario',
      };
    }
  },

  // Obtener usuario actual
  getCurrentUser: async (): Promise<ServiceResponse<User>> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/user');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener usuario actual:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener información del usuario',
      };
    }
  },

  // Actualizar usuario actual
  updateUser: async (userData: UpdateProfileData): Promise<ServiceResponse<User>> => {
    try {
      console.log('Datos enviados a la API:', userData);
      // Usar el endpoint /profile para actualizar el perfil
      const response = await apiClient.put<ApiResponse<ProfileApiResponse>>('/profile', userData);
      if (response.data.success) {
        // Obtener el usuario actual del localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}') as User;
        
        // Mapear todos los campos de la respuesta de la API a nuestro formato de usuario en el frontend
        const updatedUser: User = {
          ...currentUser,
          name: response.data.data.name,
          // Traducir los nombres de la API a nuestros nombres de propiedades (camelCase <-> snake_case)
          playerLevel: response.data.data.level || currentUser.playerLevel,
          dominantHand: response.data.data.playing_hand || currentUser.dominantHand,
          playingPosition: response.data.data.playing_position || currentUser.playingPosition,
          favoriteRacket: response.data.data.favorite_racket || currentUser.favoriteRacket,
          experienceYears: response.data.data.experience_years || currentUser.experienceYears,
          heightCm: response.data.data.height_cm || currentUser.heightCm,
          weightKg: response.data.data.weight_kg || currentUser.weightKg,
          city: response.data.data.city || currentUser.city,
          country: response.data.data.country || currentUser.country
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return {
          success: true,
          data: updatedUser,
          message: 'Perfil actualizado correctamente'
        };
      }
      return response.data as unknown as ApiResponse<User>;
    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar la información del usuario',
      };
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData: ChangePasswordData) => {
    try {
      const response = await apiClient.put<ApiResponse<User>>('/auth/change-password', passwordData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al cambiar la contraseña',
      };
    }
  },

  // Refrescar token
  refreshToken: async () => {
    try {
      const response = await apiClient.get<ApiResponse<LoginResponse>>('/auth/refresh-token');
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.user_token.token);
      }
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al refrescar el token',
      };
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error en logout:', error);
      return {
        success: false,
        error: error.message || 'Error al cerrar sesión',
      };
    }
  },

  // Comprobar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener el usuario del almacenamiento local
  getUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isTokenValid: (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
