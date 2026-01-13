import axiosInstance from './axios';

const PUBLIC_SERVICES = ['timer', 'weather', 'clock'];

class AuthService {
  needsAuth(serviceName) {
    if (!serviceName) return true;
    return !PUBLIC_SERVICES.includes(serviceName.toLowerCase());
  }
  async register(userData) {
    try {
      const response = await axiosInstance.post('/register', {
        name: userData.username,
        email: userData.email,
        password: userData.password
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async disconnectService(serviceName) {
    try {
      const userId = this.getUserID();
      const response = await axiosInstance.post('/auth/disconnect', {
        userId,
        serviceName
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async login(credentials) {
    try {
      const response = await axiosInstance.post('/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.userID);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userID');
  }

  isAuthenticated() {
    const token = sessionStorage.getItem('token');
    return !!token;
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getUserID() {
    return sessionStorage.getItem('userID');
  }

  setAuthData(token, userID) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userID', userID);
  }

  async getUser(userID) {
    try {
      const response = await axiosInstance.get(`/user/${userID}`);
      console.log(response.data);
      return { success: true, data: response.data || {} };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getServices() {
    try {
      const response = await axiosInstance.get('/service');
      console.log(response.data);
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getServiceById(id) {
    try {
      const response = await axiosInstance.get(`/service/${id}`);
      return { success: true, data: response.data || {} };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getActions() {
    try {
      const response = await axiosInstance.get(`/action`);
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getActionByName(actionName) {
    try {
      const response = await axiosInstance.get(`/action/name/${actionName}`);
      return { success: true, data: response.data || {} };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getReactions() {
    try {
      const response = await axiosInstance.get(`/reaction`);
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getReactionByName(reactionName) {
    try {
      const response = await axiosInstance.get(`/reaction/name/${reactionName}`);
      return { success: true, data: response.data || {} };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async createWorkflow(workflowData) {
    try {
      const response = await axiosInstance.post('/area', workflowData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getWorkflows(userId) {
    try {
      const response = await axiosInstance.get(`/area/user/${userId}`);
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getWorkflowById(id) {
    try {
      const response = await axiosInstance.get(`/area/${id}`);
      return { success: true, data: response.data || {} };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async updateWorkflow(id, workflowData) {
    try {
      const response = await axiosInstance.put(`/area/${id}`, workflowData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async deleteWorkflow(id) {
    try {
      const response = await axiosInstance.delete(`/area/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getTemplate() {
    try {
      const response = await axiosInstance.get(`/templates`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async updateTemplate(id, templateData) {
    try {
      const response = await axiosInstance.get(`/templates/${id}`, templateData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return {
            message: data.message || 'Données invalides. Veuillez vérifier vos informations.',
            status: 400
          };
        case 401:
          return {
            message: 'Email ou mot de passe incorrect.',
            status: 401
          };
        case 409:
          return {
            message: 'Cet email est déjà utilisé.',
            status: 409
          };
        case 422:
          return {
            message: data.message || 'Erreur de validation.',
            status: 422,
            errors: data.errors || {}
          };
        case 500:
          return {
            message: 'Erreur serveur. Veuillez réessayer plus tard.',
            status: 500
          };
        default:
          return {
            message: data.message || 'Une erreur est survenue. Veuillez réessayer.',
            status: status
          };
      }
    } else if (error.request) {
      return {
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
        status: 0
      };
    } else {
      return {
        message: 'Une erreur inattendue est survenue.',
        status: -1
      };
    }
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;