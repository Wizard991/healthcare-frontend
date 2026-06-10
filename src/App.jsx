import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ui/ProtectedRoute'
import Home               from './pages/public/Home'
import Login              from './pages/public/Login'
import Register           from './pages/public/Register'
import PatientDashboard   from './pages/patient/PatientDashboard'
import FindDoctors        from './pages/patient/FindDoctors'
import BookAppointment    from './pages/patient/BookAppointment'
import MyAppointments     from './pages/patient/MyAppointments'
import MyPrescriptions    from './pages/patient/MyPrescriptions'
import MyRecords          from './pages/patient/MyRecords'
import DoctorDashboard    from './pages/doctor/DoctorDashboard'
import ManageSlots        from './pages/doctor/ManageSlots'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import WritePrescription  from './pages/doctor/WritePrescription'
import SymptomChecker from './pages/patient/SymptomChecker'

const App = () => {
  const { user } = useAuth()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient/dashboard"    element={<ProtectedRoute role="PATIENT"><PatientDashboard/></ProtectedRoute>} />
        <Route path="/patient/find-doctors" element={<ProtectedRoute role="PATIENT"><FindDoctors/></ProtectedRoute>} />
        <Route path="/patient/book/:doctorId" element={<ProtectedRoute role="PATIENT"><BookAppointment/></ProtectedRoute>} />
        <Route path="/patient/appointments" element={<ProtectedRoute role="PATIENT"><MyAppointments/></ProtectedRoute>} />
        <Route path="/patient/prescriptions" element={<ProtectedRoute role="PATIENT"><MyPrescriptions/></ProtectedRoute>} />
        <Route path="/patient/records"      element={<ProtectedRoute role="PATIENT"><MyRecords/></ProtectedRoute>} />
        <Route path="/doctor/dashboard"    element={<ProtectedRoute role="DOCTOR"><DoctorDashboard/></ProtectedRoute>} />
        <Route path="/doctor/slots"        element={<ProtectedRoute role="DOCTOR"><ManageSlots/></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute role="DOCTOR"><DoctorAppointments/></ProtectedRoute>} />
        <Route path="/doctor/prescription" element={<ProtectedRoute role="DOCTOR"><WritePrescription/></ProtectedRoute>} />
        <Route path="/patient/symptoms" element={<ProtectedRoute role="PATIENT"><SymptomChecker/></ProtectedRoute>} />
        <Route path="*" element={
          user?.role==='DOCTOR'  ? <Navigate to="/doctor/dashboard"/> :
          user?.role==='PATIENT' ? <Navigate to="/patient/dashboard"/> :
          <Navigate to="/login"/>
        }/>
      </Routes>
    </BrowserRouter>
  )
}
export default App