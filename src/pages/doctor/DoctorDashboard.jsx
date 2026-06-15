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
  }, [])
  return (
    <div ref={ref} className="card card-hover" style={{ padding:22, display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ width:52, height:52, borderRadius:14, background:color+'15', display:'flex', alignItems:'center', justifyContent:'center', color, fontSize:22 }}>{icon}</div>
      <div><div style={{ fontSize:28, fontWeight:800, color:'var(--primary)' }}>{value}</div><div style={{ fontSize:13, color:'var(--text-mid)', marginTop:2 }}>{label}</div></div>
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
      <div style={{ maxWidth:1240, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ marginBottom:24 }} className="fade-in">
          <h1 className="section-title" style={{ fontSize:28 }}>Doctor Dashboard 👨‍⚕️</h1>
          <p className="section-sub">Manage your patients and schedule</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
          <StatCard icon={<FaCalendarAlt/>} value={todayAppts.length} label="Today's Appointments" color="#2563eb" delay={0} />
          <StatCard icon={<FaUserInjured/>} value={pending.length} label="Pending Confirmations" color="#ef4444" delay={0.1} />
          <StatCard icon={<FaClock/>} value={available.length} label="Available Slots" color="#25a244" delay={0.2} />
          <StatCard icon={<FaFileMedical/>} value={prescriptions.length} label="Prescriptions Written" color="#f7941d" delay={0.3} />
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap' }}>
          <Link to="/doctor/slots"><button className="btn btn-primary"><FaClock/> Manage Slots</button></Link>
          <Link to="/doctor/appointments"><button className="btn btn-outline"><FaCalendarAlt/> All Appointments</button></Link>
          <Link to="/doctor/prescription"><button className="btn btn-outline-accent"><FaFileMedical/> Write Prescription</button></Link>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:20 }}>
          <div className="card" style={{ padding:28 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:'var(--primary)' }}>Today's Schedule</h2>
              <span style={{ fontSize:12, color:'var(--text-light)', background:'var(--bg-soft)', padding:'5px 12px', borderRadius:20 }}>
                {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
              </span>
            </div>
            {loading ? <p style={{ color:'var(--text-mid)', textAlign:'center', padding:32 }}>Loading...</p>
            : todayAppts.length === 0 ? (
              <div style={{ textAlign:'center', padding:32 }}>
                <div style={{ fontSize:40, marginBottom:10 }}>✅</div>
                <p style={{ color:'var(--text-mid)' }}>No appointments scheduled for today</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {todayAppts.map(a => (
                  <div key={a.id} className="appt-row" style={{ display:'flex', alignItems:'center', gap:14, padding:'16px', background:'var(--bg-soft)', borderRadius:12, border:'1px solid var(--border)' }}>
                    <div style={{ width:42, height:42, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'var(--primary)', flexShrink:0 }}>
                      {a.patientName?.charAt(0)}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:14, color:'var(--primary)' }}>{a.patientName}</div>
                      <div style={{ fontSize:12, color:'var(--text-mid)' }}>{a.startTime} – {a.endTime} {a.notes && `• ${a.notes}`}</div>
                    </div>
                    <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                <h3 style={{ fontWeight:800, fontSize:15, color:'var(--primary)' }}>Pending Confirmations</h3>
                <Link to="/doctor/appointments" style={{ fontSize:13, color:'var(--accent)', fontWeight:700 }}>View all</Link>
              </div>
              {pending.slice(0,3).map(a => (
                <div key={a.id} style={{ padding:'11px 0', borderBottom:'1px solid #f1f3f5', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
                  <div>
                    <div style={{ fontWeight:700 }}>{a.patientName}</div>
                    <div style={{ color:'var(--text-light)', fontSize:12 }}>{a.slotDate} • {a.startTime}</div>
                  </div>
                  <span className="badge badge-pending">PENDING</span>
                </div>
              ))}
              {pending.length === 0 && <p style={{ fontSize:13, color:'var(--text-mid)', textAlign:'center', padding:'8px 0' }}>No pending confirmations</p>}
            </div>

            <div className="card" style={{ padding:22 }}>
              <h3 style={{ fontWeight:800, fontSize:15, marginBottom:14, color:'var(--primary)' }}>Available Slots</h3>
              <div style={{ fontSize:28, fontWeight:800, color:'#25a244' }}>{available.length}</div>
              <p style={{ fontSize:13, color:'var(--text-mid)', marginTop:4 }}>slots open for booking</p>
              <Link to="/doctor/slots"><button className="btn btn-outline btn-sm" style={{ marginTop:12, width:'100%', justifyContent:'center' }}>Manage Slots <FaArrowRight size={11}/></button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default DoctorDashboard