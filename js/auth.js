// auth.js

import { apiRequest } from './api.js';

export async function login(username, password) {
    try {
        const response = await apiRequest('/auth/login', 'POST', { username, password });
        localStorage.setItem('token', response.token);
        return true;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
}

export function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

export function isAuthenticated() {
    return !!localStorage.getItem('token');
}

export function requireAuth(page) {
    if (!isAuthenticated()) {
        window.location.href = `/login.html?redirect=${page}`;
    }
}