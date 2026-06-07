import api from './axios'
export const createPrescription       = d  => api.post('/prescriptions', d)
export const getMyPrescriptions       = () => api.get('/prescriptions/my')
export const getPrescriptionsByDoctor = () => api.get('/prescriptions/by-doctor')