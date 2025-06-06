import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosError } from 'axios';

// Creamos una instancia de axios con la URL base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api', // URL de la API desde .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las peticiones
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores en las respuestas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Si el error es 401 (no autorizado), redirigir al login SOLO si no estamos ya en la página de login
    if (error.response && error.response.status === 401) {
      // Verificar si la URL actual NO es la página de login antes de redirigir
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        // Limpiar datos de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Mostrar mensaje
        console.log('Sesión expirada. Redirigiendo al login...');
        
        // Redirigir al login (usando window.location porque los interceptores están fuera del contexto de React Router)
        const returnUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?returnUrl=${returnUrl}`;
        
        // Evitar mostrar errores adicionales al usuario después de decidir redirigir
        return Promise.reject({
          ...error,
          handled: true // Marcamos que este error ya ha sido manejado
        });
      }
    }
    
    // Solo registrar información detallada del error si no es un 401 ya manejado
    if (!(error.response?.status === 401 && (error as any).handled)) {
      console.error('Error en la petición:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        isLoginPage: window.location.pathname.includes('/login')
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
