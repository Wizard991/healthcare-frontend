import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../../context/AuthContext'
import { FaTachometerAlt, FaCalendarAlt, FaFileMedical, FaClipboardList, FaSearch, FaClock, FaEdit } from 'react-icons/fa'

const Sidebar = () => {
  const { user } = useAuth()

  const patientLinks = [
    { to:'/patient/dashboard',     icon:<FaTachometerAlt />, label:'Dashboard' },
    { to:'/patient/find-doctors',  icon:<FaSearch />,        label:'Find Doctors' },
    { to:'/patient/appointments',  icon:<FaCalendarAlt />,   label:'Appointments' },
    { to:'/patient/prescriptions', icon:<FaFileMedical />,   label:'Prescriptions' },
    { to:'/patient/records',       icon:<FaClipboardList />,  label:'Medical Records' },
  ]

  const doctorLinks = [
    { to:'/doctor/dashboard',     icon:<FaTachometerAlt />, label:'Dashboard' },
    { to:'/doctor/appointments',  icon:<FaCalendarAlt />,   label:'Appointments' },
    { to:'/doctor/slots',         icon:<FaClock />,         label:'Manage Slots' },
    { to:'/doctor/prescription',  icon:<FaEdit />,          label:'Write Prescription' },
  ]

  const links = user?.role === 'DOCTOR' ? doctorLinks : patientLinks

  useEffect(() => {
    gsap.fromTo('.sidebar-link',
      { x:-30, opacity:0 },
      { x:0, opacity:1, duration:0.4, stagger:0.07, ease:'power2.out', delay:0.2 }
    )
  }, [])

  return (
    <aside style={{
      width:240, background:'white',
      height:'calc(100vh - 64px)', position:'sticky', top:64,
      borderRight:'1px solid #e0e0e0', padding:'20px 12px',
      display:'flex', flexDirection:'column', gap:4, overflowY:'auto'
    }}>
      <div style={{ fontSize:11, fontWeight:600, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8, paddingLeft:12 }}>
        {user?.role === 'DOCTOR' ? 'Doctor Portal' : 'Patient Portal'}
      </div>
      {links.map(link => (
        <NavLink key={link.to} to={link.to} className="sidebar-link"
          style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:12,
            padding:'10px 12px', borderRadius:8,
            textDecoration:'none', fontSize:14,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? '#1a73e8' : '#5f6368',
            background: isActive ? '#e8f0fe' : 'transparent',
            transition:'all 0.2s'
          })}
        >
          {link.icon} {link.label}
        </NavLink>
      ))}
    </aside>
  )
}
export default Sidebar