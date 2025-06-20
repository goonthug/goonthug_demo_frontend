// src/stores/authStore.js
import { makeAutoObservable } from 'mobx';
import axios from 'axios';

class AuthStore {
  token = null;
  user = null;

  constructor() {
    makeAutoObservable(this);
    this.token = localStorage.getItem('token');
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  async register({ username, password, role, companyName, firstName, lastName }) {
    try {
      const data = {
        username,
        password,
        role,
        ...(role === 'COMPANY' ? { companyName } : { firstName, lastName }),
      };
      const response = await axios.post('http://localhost:8080/api/register', data); // Укажи полный URL
      if (response.status === 200) {
        return true; // Успешная регистрация
      }
    } catch (error) {
      throw new Error(error.response?.data || 'Ошибка регистрации');
    }
  }

  async login(username, password) {
    try {
      const response = await axios.post('http://localhost:8080/api/login', { username, password }); // Укажи полный URL
      if (response.status === 200) {
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        return true; // Успешный вход
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Для отладки
      throw new Error(error.response?.data || 'Неверное имя пользователя или пароль');
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