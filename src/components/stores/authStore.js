import { makeAutoObservable, action } from 'mobx';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

class AuthStore {
  token = null;
  user = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }

  initializeAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      this.setToken(token); // Используем action
      this.setAuthHeader();
      this.setInitialUserFromToken();
      this.fetchUserProfile();
    }
  };

  setToken = action((token) => {
    this.token = token;
  });

  setAuthHeader = () => {
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  setInitialUserFromToken = () => {
    if (this.token && jwtDecode) {
      try {
        const decodedToken = jwtDecode(this.token);
        if (decodedToken && decodedToken.sub && decodedToken.role) {
          this.user = { email: decodedToken.sub, role: decodedToken.role };
          console.log('Initial user from token:', this.user);
        } else {
          this.user = { role: 'UNKNOWN' };
          console.warn('Token lacks required fields');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.user = { role: 'UNKNOWN' };
      }
    } else {
      this.user = { role: 'UNKNOWN' };
      console.warn('jwtDecode or token is not available');
    }
  };

  fetchUserProfile = async () => {
    if (!this.token) {
      console.error('No token available for fetching user profile');
      return;
    }
    try {
      const response = await axios.get('http://localhost:8080/api/user/profile', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      this.user = response.data;
      console.log('User fetched:', this.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.warn('Token might be invalid or expired, consider re-login');
      }
    }
  };

  async register({ email, password, role, companyName, firstName, lastName }) {
    try {
      const data = {
        email,
        password,
        role,
        ...(role === 'COMPANY' ? { companyName } : { firstName, lastName }),
      };
      const response = await axios.post('http://localhost:8080/api/register', data);
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      throw new Error(error.response?.data || 'Ошибка регистрации');
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post('http://localhost:8080/api/login', { email, password });
      if (response.status === 200) {
        this.setToken(response.data.token); // Используем action
        localStorage.setItem('token', this.token);
        this.setAuthHeader();
        this.setInitialUserFromToken();
        await this.fetchUserProfile();
        return true;
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data || 'Неверный email или пароль');
    }
  }

  logout = action(() => {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  });
}

export default new AuthStore();