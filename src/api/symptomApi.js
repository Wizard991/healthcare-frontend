import api from './axios'
export const checkSymptoms = (data) => api.post('/symptoms/check', data)