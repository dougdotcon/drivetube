interface User {
  id: string;
  name: string;
  email: string;
  subscription?: {
    status: string;
    planId: string;
  };
}

interface AuthResponse {
  token: string;
  user: User;
}

export class AuthService {
  private static readonly API_URL = 'http://localhost:3333/api';

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao fazer login');
      }

      const data = await response.json();
      await this.saveAuthData(data);
      return data;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  static async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar conta');
      }

      const data = await response.json();
      await this.saveAuthData(data);
      return data;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  static async validateToken(): Promise<User | null> {
    try {
      const token = await this.getToken();
      if (!token) return null;

      const response = await fetch(`${this.API_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        await this.logout();
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Erro na validação do token:', error);
      await this.logout();
      return null;
    }
  }

  static async logout(): Promise<void> {
    await chrome.storage.local.remove(['token', 'user']);
  }

  private static async saveAuthData(data: AuthResponse): Promise<void> {
    await chrome.storage.local.set({
      token: data.token,
      user: data.user
    });
  }

  static async getToken(): Promise<string | null> {
    const data = await chrome.storage.local.get('token');
    return data.token || null;
  }

  static async getUser(): Promise<User | null> {
    const data = await chrome.storage.local.get('user');
    return data.user || null;
  }
} 