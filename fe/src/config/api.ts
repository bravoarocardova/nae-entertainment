import axios from 'axios';

// Centralizing the Backend URL Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const API_KEY = import.meta.env.VITE_API_KEY || '';

export const getApiUrl = (endpoint: string) => {
    // If endpoint starts with a slash, just append it. Otherwise add a slash.
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${path}`;
};

/** Pre-configured axios instance — automatically sends x-api-key on every request to the backend */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'x-api-key': API_KEY,
    },
});

/** Helper for fetching secure assets (images/audio) as blobs using the API key in headers */
export const fetchBlob = async (url: string) => {
    const response = await apiClient.get(url, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
};
