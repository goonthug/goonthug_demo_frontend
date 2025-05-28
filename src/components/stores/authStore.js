import { makeAutoObservable } from 'mobx';

class AuthStore {
  userData = null;
  isLoading = false;
  error = null;
  token = localStorage.getItem('jwtToken') || null;

  constructor() {
    makeAutoObservable(this);
  }

  async login(username, password) {
    this.isLoading = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.token = 'fake-token';
    localStorage.setItem('jwtToken', this.token);
    this.isLoading = false;
  }

  async register(username, password, role) {
    this.isLoading = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.isLoading = false;
  }

  async fetchUserData() {
    this.isLoading = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.userData = [
      { id: 1, name: 'Game 1', status: 'Active' },
      { id: 2, name: 'Game 2', status: 'Inactive' },
    ];
    this.isLoading = false;
  }

  logout() {
    this.token = null;
    this.userData = null;
    localStorage.removeItem('jwtToken');
  }
}

export default new AuthStore();