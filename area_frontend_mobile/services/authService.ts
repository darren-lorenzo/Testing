import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    name: string;

}

export interface ServiceAction {
    id: string;
    name: string;
    description: string;
}

export interface ServiceReaction {
    id: string;
    name: string;
    description: string;
}

export interface Service {
    id: number;
    name: string;
    service: string;
    description: string;
    logo: string;
    color: string;
    Is_connected?: boolean;
    actions?: ServiceAction[];
    reactions?: ServiceReaction[];
}

interface AuthResponse {
    success: boolean;
    data?: any;
    error?: {
        message: string;
        status?: number;
        errors?: any;
    };
}

const PUBLIC_SERVICES = ['timer', 'weather', 'clock'];

class AuthService {
    needsAuth(serviceName: string): boolean {
        if (!serviceName) return true;
        return !PUBLIC_SERVICES.includes(serviceName.toLowerCase());
    }

    async login(credentials: { email: string; password: string }): Promise<AuthResponse> {


        try {
            const response = await api.post('/login', credentials);

            if (response.data.token) {
                await this.setAuthData(response.data.token, response.data.userID);
            }

            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async register(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
        try {
            const response = await api.post('/register', userData);
            if (response.data.token) {
                await this.setAuthData(response.data.token, response.data.userID);
            }
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async logout() {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userID');
    }

    async getToken() {
        return await AsyncStorage.getItem('token');
    }

    async getUserID() {
        return await AsyncStorage.getItem('userID');
    }

    async setAuthData(token: string, userID: string | number) {
        if (token && userID !== undefined && userID !== null) {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userID', String(userID));
        }
    }

    async getUserInfo(userID: string) {
        try {
            const response = await api.get(`/user/${userID}`);
            return response.data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getServices() {
        try {
            const response = await api.get('/service');
            if (Array.isArray(response.data)) {
                return response.data;
            }
            return response.data || [];
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getServiceById(id: number | string) {
        try {
            const response = await api.get(`/service/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async getActionByName(actionName: string) {
        try {
            const response = await api.get(`/action/name/${actionName}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async getReactionByName(reactionName: string) {
        try {
            const response = await api.get(`/reaction/name/${reactionName}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async createWorkflow(workflowData: any) {
        try {
            const response = await api.post('/area', workflowData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async getWorkflows() {
        try {
            const response = await api.get('/area');
            return { success: true, data: response.data || [] };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async updateWorkflow(id: number | string, workflowData: any) {
        try {
            const response = await api.put(`/area/${id}`, workflowData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async deleteWorkflow(id: number | string) {
        try {
            const response = await api.delete(`/area/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async getActions() {
        try {
            const response = await api.get('/action');
            return { success: true, data: response.data || [] };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async getReactions() {
        try {
            const response = await api.get('/reaction');
            return { success: true, data: response.data || [] };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async getTemplates() {
        try {
            const response = await api.get('/templates');
            return { success: true, data: response.data || [] };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async getTemplateById(id: number | string) {
        try {
            const response = await api.get(`/templates/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async disconnectService(serviceName: string) {
        try {
            const response = await api.delete(`/auth/${serviceName.toLowerCase()}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: this.handleError(error) };
        }
    }

    async connectService(serviceName: string): Promise<string | null> {
        // Map service names to backend auth endpoints
        const name = serviceName.toLowerCase();
        let endpoint = '';

        if (name.includes('gmail') || name.includes('google')) {
            endpoint = '/auth/google';
        } else if (name.includes('github')) {
            endpoint = '/auth/github';
        } else if (name.includes('linkedin')) {
            endpoint = '/auth/linkedin';
        } else if (name.includes('discord')) {
            endpoint = '/auth/discord';
        } else if (name.includes('microsoft') || name.includes('outlook')) {
            endpoint = '/auth/microsoft';
        } else if (name.includes('x') || name.includes('twitter')) {
            endpoint = '/auth/x';
        } else if (name.includes('twitch')) {
            endpoint = '/auth/twitch';
        } else {
            return null;
        }

        return endpoint;
    }

    private handleError(error: any) {
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

export default new AuthService();
