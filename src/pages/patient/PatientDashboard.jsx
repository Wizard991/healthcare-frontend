import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { getSummary } from '../../api/patientApi'
import { getMyAppointmentsPatient } from '../../api/appointmentApi'
import { getMyPrescriptions } from '../../api/prescriptionApi'
import { useAuth } from '../../context/AuthContext'
import { FaCalendarAlt, FaFileMedical, FaUserMd, FaClipboard, FaArrowRight, FaStethoscope } from 'react-icons/fa'
import toast from 'react-hot-toast'
import AppointmentReminder from '../../components/ui/AppointmentReminder'

const StatCard = ({ icon, value, label, color, delay }) => {
  const ref = React.useRef(null)
  useEffect(() => {
    gsap.fromTo(ref.current, { opacity:0, y:24, scale:0.96 }, { opacity:1, y:0, scale:1, duration:0.5, delay, ease:'back.out(1.4)' })
    const el = ref.current
    const enter = () => gsap.to(el, { y:-4, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', duration:0.2 })
    const leave = () => gsap.to(el, { y:0, boxShadow:'0 1px 4px rgba(0,0,0,0.08)', duration:0.2 })
    el.addEventListener('mouseenter', enter); el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave) }
  }, [])
  return (
    <div ref={ref} className="card" style={{ padding:20, display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ width:52, height:52, borderRadius:12, background:color+'22', display:'flex', alignItems:'center', justifyContent:'center', color, fontSize:22 }}>{icon}</div>
      <div><div style={{ fontSize:28, fontWeight:800, color:'var(--text-dark)' }}>{value}</div><div style={{ fontSize:13, color:'var(--text-light)', marginTop:2 }}>{label}</div></div>
    </div>
  )
}

import React from 'react'
const PatientDashboard = () => {
  const { user } = useAuth()
  const [summary, setSummary] = useState({})
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSummary(), getMyAppointmentsPatient(), getMyPrescriptions()])
      .then(([s, a, p]) => {
        setSummary(s.data.data || {})
        setAppointments(a.data.data || [])
        setPrescriptions(p.data.data || [])
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = appointments.filter(a => ['PENDING','CONFIRMED'].includes(a.status))

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 20px' }}>

        {/* Welcome */}
        <div style={{ marginBottom:28 }} className="fade-in">
          <AppointmentReminder appointments={appointments} />
          <h1 style={{ fontSize:24, fontWeight:800, color:'var(--text-dark)' }}>Good morning, {summary.patientName || 'there'} 👋</h1>
          <p style={{ color:'var(--text-light)', marginTop:4 }}>Here's your health overview for today</p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
          <StatCard icon={<FaCalendarAlt/>} value={summary.totalAppointments||0} label="Total Appointments" color="#02475e" delay={0} />
          <StatCard icon={<FaCalendarAlt/>} value={summary.upcomingAppointments||0} label="Upcoming" color="#00b5c8" delay={0.1} />
          <StatCard icon={<FaFileMedical/>} value={prescriptions.length} label="Prescriptions" color="#25a244" delay={0.2} />
          <StatCard icon={<FaClipboard/>} value={summary.completedAppointments||0} label="Completed Visits" color="#f7941d" delay={0.3} />
        </div>

        {/* Quick actions */}
        <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap' }}>
          <Link to="/patient/find-doctors"><button className="btn btn-primary"><FaUserMd/> Find a Doctor</button></Link>
          <Link to="/patient/appointments"><button className="btn btn-outline"><FaCalendarAlt/> My Appointments</button></Link>
          <Link to="/patient/records"><button className="btn btn-outline"><FaClipboard/> Health Records</button></Link>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
          {/* Upcoming appointments */}
          <div className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontSize:17, fontWeight:700 }}>Upcoming Appointments</h2>
              <Link to="/patient/appointments" style={{ fontSize:13, color:'var(--primary)', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>View all <FaArrowRight size={11}/></Link>
            </div>
            {loading ? <p style={{ color:'var(--text-light)', textAlign:'center', padding:32 }}>Loading...</p>
            : upcoming.length === 0 ? (
              <div style={{ textAlign:'center', padding:'32px 0' }}>
                <div style={{ fontSize:44, marginBottom:12 }}>📅</div>
                <p style={{ color:'var(--text-light)', marginBottom:16 }}>No upcoming appointments</p>
                <Link to="/patient/find-doctors"><button className="btn btn-primary btn-sm">Book Now</button></Link>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {upcoming.slice(0,4).map(a => (
                  <div key={a.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px', background:'#f7f8fa', borderRadius:10, border:'1px solid var(--border)' }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <FaStethoscope color="var(--primary)" size={18}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>Dr. {a.doctorName}</div>
                      <div style={{ fontSize:12, color:'var(--text-light)' }}>{a.specialization} • {a.slotDate} {a.startTime}</div>
                    </div>
                    <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Health info */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:20 }}>
              <h3 style={{ fontWeight:700, marginBottom:14, fontSize:15 }}>Health Info</h3>
              {[
                ['Blood Group', summary.bloodGroup || 'Not set', '🩸'],
                ['Allergies', summary.allergies || 'None', '⚠️'],
              ].map(([l,v,e]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f0f0f0', fontSize:14 }}>
                  <span style={{ color:'var(--text-light)', display:'flex', gap:6, alignItems:'center' }}>{e} {l}</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
              <Link to="/patient/profile" style={{ display:'block', marginTop:14 }}>
                <button className="btn btn-outline btn-sm" style={{ width:'100%', justifyContent:'center' }}>Update Profile</button>
              </Link>
            </div>

            {/* Recent prescription */}
            {prescriptions[0] && (
              <div className="card" style={{ padding:20 }}>
                <h3 style={{ fontWeight:700, marginBottom:14, fontSize:15 }}>Latest Prescription</h3>
                <div style={{ fontSize:13, color:'var(--text-mid)' }}>
                  <div style={{ fontWeight:600 }}>Dr. {prescriptions[0].doctorName}</div>
                  <div style={{ color:'var(--text-light)', fontSize:12, marginTop:2 }}>{prescriptions[0].doctorSpecialization}</div>
                  <div style={{ marginTop:8, color:'var(--text-dark)' }}>{prescriptions[0].diagnosis}</div>
                </div>
                <Link to="/patient/prescriptions"><button className="btn btn-outline btn-sm" style={{ marginTop:12, width:'100%', justifyContent:'center' }}>View All</button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default PatientDashboard