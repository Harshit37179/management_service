// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Service Providers
  async getServiceProviders() {
    return this.request('/service-providers');
  }

  async createServiceProvider(data: any) {
    return this.request('/service-providers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServiceProvider(id: string, data: any) {
    return this.request(`/service-providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteServiceProvider(id: string) {
    return this.request(`/service-providers/${id}`, {
      method: 'DELETE',
    });
  }

  // Appliances
  async getAppliances() {
    return this.request('/appliances');
  }

  async createAppliance(data: any) {
    return this.request('/appliances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAppliance(id: string, data: any) {
    return this.request(`/appliances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAppliance(id: string) {
    return this.request(`/appliances/${id}`, {
      method: 'DELETE',
    });
  }

  // Issues
  async getIssues() {
    return this.request('/issues');
  }

  async createIssue(data: any) {
    return this.request('/issues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateIssue(id: string, data: any) {
    return this.request(`/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Email notifications
  async sendIssueNotification(issueId: string) {
    return this.request(`/issues/${issueId}/notify`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();