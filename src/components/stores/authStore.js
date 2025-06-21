import { makeAutoObservable } from 'mobx';
import axios from 'axios';

class AuthStore {
  token = null;
  user = null; // Оставим на случай, если захочешь хранить данные пользователя

  constructor() {
    makeAutoObservable(this);
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setAuthHeader(); // Установка заголовка только при наличии токена
    }
  }

  setAuthHeader() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
  }

  async register({ username, password, role, companyName, firstName, lastName }) {
    try {
      const data = {
        username,
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

  async login(username, password) {
    try {
      const response = await axios.post('http://localhost:8080/api/login', { username, password });
      if (response.status === 200) {
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        this.setAuthHeader(); // Устанавливаем заголовок после получения токена
        // Опционально: загрузка данных пользователя
        await this.fetchUserProfile();
        return true;
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data || 'Неверное имя пользователя или пароль');
    }
  }

  async fetchUserProfile() {
    try {
      const response = await axios.get('http://localhost:8080/api/user/profile');
      this.user = response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default new AuthStore();