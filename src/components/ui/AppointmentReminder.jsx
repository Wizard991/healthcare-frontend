import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaClock, FaCalendarAlt, FaBell } from 'react-icons/fa'

const AppointmentReminder = ({ appointments }) => {
  const [timeLeft, setTimeLeft] = useState({})

  const upcoming = appointments
    ?.filter(a => ['PENDING','CONFIRMED'].includes(a.status))
    ?.sort((a,b) => new Date(`${a.slotDate} ${a.startTime}`) - new Date(`${b.slotDate} ${b.startTime}`))
    ?.slice(0,1)

  const next = upcoming?.[0]

  useEffect(() => {
    if (!next) return
    const calc = () => {
      const apptTime = new Date(`${next.slotDate} ${next.startTime}`)
      const now = new Date()
      const diff = apptTime - now
      if (diff <= 0) { setTimeLeft({ expired: true }); return }
      const days    = Math.floor(diff / (1000*60*60*24))
      const hours   = Math.floor((diff % (1000*60*60*24)) / (1000*60*60))
      const minutes = Math.floor((diff % (1000*60*60)) / (1000*60))
      const seconds = Math.floor((diff % (1000*60)) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [next])

  if (!next) return null

  const isToday = new Date(next.slotDate).toDateString() === new Date().toDateString()
  const isTomorrow = new Date(next.slotDate).toDateString() === new Date(Date.now()+86400000).toDateString()
  const urgency = timeLeft.days === 0 && timeLeft.hours < 2

  return (
    <div style={{
      background: urgency ? 'linear-gradient(135deg,#ffebee,#fff3e0)' : 'linear-gradient(135deg,#e8f3f1,#e8f0fe)',
      border: `1.5px solid ${urgency ? '#ef9a9a' : '#b2dfdb'}`,
      borderRadius: 12, padding:'16px 20px', marginBottom:20,
      display:'flex', alignItems:'center', gap:16
    }}>
      <div style={{ width:44, height:44, borderRadius:12, background: urgency ? '#ffebee' : 'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {urgency ? <FaBell size={20} color="#ea4335"/> : <FaCalendarAlt size={20} color="var(--primary)"/>}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:700, fontSize:14, color:'var(--text-dark)', marginBottom:2 }}>
          {urgency ? '🚨 Appointment soon!' : '📅 Upcoming Appointment'}
        </div>
        <div style={{ fontSize:13, color:'var(--text-mid)' }}>
          Dr. {next.doctorName} — {next.specialization} •{' '}
          {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : next.slotDate} at {next.startTime}
        </div>
      </div>
      {/* Countdown */}
      {!timeLeft.expired && (
        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          {timeLeft.days > 0 && (
            <div style={{ textAlign:'center', background:'white', borderRadius:8, padding:'6px 10px', minWidth:44 }}>
              <div style={{ fontSize:18, fontWeight:800, color:'var(--primary)' }}>{timeLeft.days}</div>
              <div style={{ fontSize:10, color:'var(--text-light)' }}>days</div>
            </div>
          )}
          <div style={{ textAlign:'center', background:'white', borderRadius:8, padding:'6px 10px', minWidth:44 }}>
            <div style={{ fontSize:18, fontWeight:800, color: urgency ? '#ea4335' : 'var(--primary)' }}>{String(timeLeft.hours).padStart(2,'0')}</div>
            <div style={{ fontSize:10, color:'var(--text-light)' }}>hrs</div>
          </div>
          <div style={{ textAlign:'center', background:'white', borderRadius:8, padding:'6px 10px', minWidth:44 }}>
            <div style={{ fontSize:18, fontWeight:800, color: urgency ? '#ea4335' : 'var(--primary)' }}>{String(timeLeft.minutes).padStart(2,'0')}</div>
            <div style={{ fontSize:10, color:'var(--text-light)' }}>min</div>
          </div>
          <div style={{ textAlign:'center', background:'white', borderRadius:8, padding:'6px 10px', minWidth:44 }}>
            <div style={{ fontSize:18, fontWeight:800, color: urgency ? '#ea4335' : 'var(--primary)' }}>{String(timeLeft.seconds).padStart(2,'0')}</div>
            <div style={{ fontSize:10, color:'var(--text-light)' }}>sec</div>
          </div>
        </div>
      )}
      <Link to="/patient/appointments">
        <button className="btn btn-primary btn-sm">View</button>
      </Link>
    </div>
  )
}
export default AppointmentReminder