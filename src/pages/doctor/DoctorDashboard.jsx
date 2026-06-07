import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import React from 'react'
import Navbar from '../../components/layout/Navbar'
import { getMyAppointmentsDoctor } from '../../api/appointmentApi'
import { getMySlots } from '../../api/doctorApi'
import { getPrescriptionsByDoctor } from '../../api/prescriptionApi'
import { FaCalendarAlt, FaClock, FaFileMedical, FaUserInjured, FaArrowRight } from 'react-icons/fa'
import toast from 'react-hot-toast'

const StatCard = ({ icon, value, label, color, delay }) => {
  const ref = React.useRef(null)
  useEffect(() => {
    gsap.fromTo(ref.current, { opacity:0, y:24 }, { opacity:1, y:0, duration:0.5, delay, ease:'back.out(1.4)' })
    const el = ref.current
    const enter = () => gsap.to(el, { y:-4, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', duration:0.2 })
    const leave = () => gsap.to(el, { y:0, boxShadow:'var(--shadow-sm)', duration:0.2 })
    el.addEventListener('mouseenter', enter); el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave) }
  }, [])
  return (
    <div ref={ref} className="card" style={{ padding:20, display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ width:52, height:52, borderRadius:12, background:color+'22', display:'flex', alignItems:'center', justifyContent:'center', color, fontSize:22 }}>{icon}</div>
      <div><div style={{ fontSize:28, fontWeight:800 }}>{value}</div><div style={{ fontSize:13, color:'var(--text-light)', marginTop:2 }}>{label}</div></div>
    </div>
  )
}

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [slots, setSlots] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyAppointmentsDoctor(), getMySlots(), getPrescriptionsByDoctor()])
      .then(([a,s,p]) => { setAppointments(a.data.data||[]); setSlots(s.data.data||[]); setPrescriptions(p.data.data||[]) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!loading) gsap.fromTo('.appt-row', { opacity:0, x:-16 }, { opacity:1, x:0, duration:0.3, stagger:0.07 })
  }, [loading])

  const today = new Date().toISOString().split('T')[0]
  const todayAppts = appointments.filter(a => a.slotDate === today)
  const pending = appointments.filter(a => a.status === 'PENDING')
  const available = slots.filter(s => !s.isBooked)

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 20px' }}>
        <div style={{ marginBottom:28 }} className="fade-in">
          <h1 style={{ fontSize:24, fontWeight:800 }}>Doctor Dashboard 👨‍⚕️</h1>
          <p style={{ color:'var(--text-light)', marginTop:4 }}>Manage your patients and schedule</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
          <StatCard icon={<FaCalendarAlt/>} value={todayAppts.length} label="Today's Appointments" color="#02475e" delay={0} />
          <StatCard icon={<FaUserInjured/>} value={pending.length} label="Pending Confirmations" color="#d0021b" delay={0.1} />
          <StatCard icon={<FaClock/>} value={available.length} label="Available Slots" color="#25a244" delay={0.2} />
          <StatCard icon={<FaFileMedical/>} value={prescriptions.length} label="Prescriptions Written" color="#f7941d" delay={0.3} />
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:28 }}>
          <Link to="/doctor/slots"><button className="btn btn-primary"><FaClock/> Manage Slots</button></Link>
          <Link to="/doctor/appointments"><button className="btn btn-outline"><FaCalendarAlt/> All Appointments</button></Link>
          <Link to="/doctor/prescription"><button className="btn btn-outline-orange"><FaFileMedical/> Write Prescription</button></Link>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:20 }}>
          {/* Today schedule */}
          <div className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontSize:17, fontWeight:700 }}>Today's Schedule</h2>
              <span style={{ fontSize:12, color:'var(--text-light)', background:'var(--bg)', padding:'4px 10px', borderRadius:20 }}>
                {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
              </span>
            </div>
            {loading ? <p style={{ color:'var(--text-light)', textAlign:'center', padding:32 }}>Loading...</p>
            : todayAppts.length === 0 ? (
              <div style={{ textAlign:'center', padding:32 }}>
                <div style={{ fontSize:40, marginBottom:10 }}>✅</div>
                <p style={{ color:'var(--text-light)' }}>No appointments scheduled for today</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {todayAppts.map(a => (
                  <div key={a.id} className="appt-row" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px', background:'#f7f8fa', borderRadius:10, border:'1px solid var(--border)' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'var(--primary)', flexShrink:0 }}>
                      {a.patientName?.charAt(0)}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{a.patientName}</div>
                      <div style={{ fontSize:12, color:'var(--text-light)' }}>{a.startTime} – {a.endTime} {a.notes && `• ${a.notes}`}</div>
                    </div>
                    <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending + recent */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                <h3 style={{ fontWeight:700, fontSize:15 }}>Pending Confirmations</h3>
                <Link to="/doctor/appointments" style={{ fontSize:13, color:'var(--primary)', fontWeight:600 }}>View all</Link>
              </div>
              {pending.slice(0,3).map(a => (
                <div key={a.id} style={{ padding:'10px 0', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
                  <div>
                    <div style={{ fontWeight:600 }}>{a.patientName}</div>
                    <div style={{ color:'var(--text-light)', fontSize:12 }}>{a.slotDate} • {a.startTime}</div>
                  </div>
                  <span className="badge badge-pending">PENDING</span>
                </div>
              ))}
              {pending.length === 0 && <p style={{ fontSize:13, color:'var(--text-light)', textAlign:'center', padding:'8px 0' }}>No pending confirmations</p>}
            </div>

            <div className="card" style={{ padding:20 }}>
              <h3 style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Available Slots</h3>
              <div style={{ fontSize:28, fontWeight:800, color:'var(--success)' }}>{available.length}</div>
              <p style={{ fontSize:13, color:'var(--text-light)', marginTop:4 }}>slots open for booking</p>
              <Link to="/doctor/slots"><button className="btn btn-outline btn-sm" style={{ marginTop:12, width:'100%', justifyContent:'center' }}>Manage Slots <FaArrowRight size={11}/></button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default DoctorDashboard