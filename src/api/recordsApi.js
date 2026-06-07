import api from './axios'
export const addRecord    = d  => api.post('/records', d)
export const getMyRecords = () => api.get('/records/my')