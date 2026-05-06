import axios from 'axios';

// Base URL for all API calls - points to our backend
const API = axios.create({
    // baseURL: 'http://localhost:5000/api'
    baseURL: 'https://autocare-mern-production-180d.up.railway.app/api'
});

// Interceptor - automatically adds token to every request
// So we don't have to manually add headers every time
API.interceptors.request.use((req) => {
    const user = localStorage.getItem('user');
    if (user) {
        const parsed = JSON.parse(user);
        req.headers.Authorization = `Bearer ${parsed.token}`;
    }
    return req;
});

export default API;