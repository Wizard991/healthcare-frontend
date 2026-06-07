import api from './axios'
export const getMyProfile    = ()  => api.get('/patients/profile')
export const updateMyProfile = d   => api.put('/patients/profile', d)
export const getSummary      = ()  => api.get('/patients/summary')