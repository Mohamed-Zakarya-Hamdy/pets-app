import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'bless_pets_auth_token';
const USER_KEY = 'bless_pets_user';

export interface User {
  id: string;
  email: string;
  name: string;
}

export class AuthService {
  // Login user
  static login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@blesspets.com' && password === 'admin123') {
          const user: User = {
            id: '1',
            email: email,
            name: 'Admin User'
          };
          
          Cookies.set(AUTH_TOKEN_KEY, 'mock-jwt-token', { expires: 7 });
          Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 });
          
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  static logout(): void {
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!Cookies.get(AUTH_TOKEN_KEY);
  }

  static getCurrentUser(): User | null {
    const userStr = Cookies.get(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  static getAuthToken(): string | null {
    return Cookies.get(AUTH_TOKEN_KEY) || null;
  }
}
