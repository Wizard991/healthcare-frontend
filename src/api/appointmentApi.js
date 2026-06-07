import api from './axios'
export const bookAppointment          = d  => api.post('/appointments/book', d)
export const getMyAppointmentsPatient = () => api.get('/appointments/my/patient')
export const getMyAppointmentsDoctor  = () => api.get('/appointments/my/doctor')
export const cancelAppointment        = id => api.put(`/appointments/${id}/cancel`)
export const confirmAppointment       = id => api.put(`/appointments/${id}/confirm`)
export const completeAppointment      = id => api.put(`/appointments/${id}/complete`)