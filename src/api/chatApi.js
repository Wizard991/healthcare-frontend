import api from './axios'
export const sendChatMessage = (data) => api.post('/chat', data)