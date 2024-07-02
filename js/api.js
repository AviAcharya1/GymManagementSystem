// api.js

const API_BASE_URL = 'https://api.gymmanagement.com/v1'; // Replace with your actual API base URL

export async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data ? JSON.stringify(data) : null
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

export async function login(username, password) {
    const response = await apiRequest('/auth/login', 'POST', { username, password });
    if (response.token) {
        localStorage.setItem('token', response.token);
        return true;
    }
    return false;
}

export function logout() {
    localStorage.removeItem('token');
}

export function isAuthenticated() {
    return !!localStorage.getItem('token');
}