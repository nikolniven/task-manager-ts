import axios, { AxiosInstance } from 'axios';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_SERVER_URL,
    });

    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        config.headers.set('Authorization', `Bearer ${storedToken}`);
      }
      return config;
    });
  }

  login = (requestBody: { email: string; password: string }) => {
    return this.api.post('/auth/login', requestBody);
  };

  signup = (requestBody: { email: string; password: string }) => {
    return this.api.post('/auth/signup', requestBody);
  };

  verify = () => {
    return this.api.get('/auth/verify');
  };

  changePassword = (requestBody: {
    previousPassword: string;
    newPassword: string;
  }) => {
    return this.api.put('/auth/change-password', requestBody);
  };
}

export const authService = new AuthService();
