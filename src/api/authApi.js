import api from './axios'
export const register = d => api.post('/auth/register', d)
export const login    = d => api.post('/auth/login', d)