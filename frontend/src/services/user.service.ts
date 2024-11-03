import { User } from '../../types/user';

class UserService {
    private API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    private API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

    private getHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.API_TOKEN,
        });
    }

    async register(user: any): Promise<boolean> {
        try {
            const url = `${this.API_URL}auth/local/register`;
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                throw new Error('Network response was not ok.');
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async loginWithOAuth(provider: string, code: string): Promise<User | null> {
        try {
            const url = `${this.API_URL}auth/${provider}/callback?code=${code}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('OAuth login failed');
            }

            const data = await response.json();
            return this.mapUserData(data.user);
        } catch (error) {
            console.error('OAuth login error:', error);
            return null;
        }
    }

    async getUserProfile(): Promise<User | null> {
        try {
            const url = `${this.API_URL}users/me`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const data = await response.json();
            return this.mapUserData(data);
        } catch (error) {
            console.error('Get user profile error:', error);
            return null;
        }
    }

    private mapUserData(data: any): User {
        return {
            id: data.id,
            name: data.username,
            email: data.email,
        };
    }
}

export default new UserService();