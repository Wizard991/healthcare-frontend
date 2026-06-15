import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { getDoctorById, getAvailableSlots } from '../../api/doctorApi'
import { bookAppointment } from '../../api/appointmentApi'
import { FaUserMd, FaClock, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa'
import toast from 'react-hot-toast'

const BookAppointment = () => {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    Promise.all([getDoctorById(doctorId), getAvailableSlots(doctorId)])
      .then(([d, s]) => { setDoctor(d.data.data); setSlots(s.data.data || []) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [doctorId])

  const grouped = slots.reduce((acc, s) => {
    if (!acc[s.slotDate]) acc[s.slotDate] = []
    acc[s.slotDate].push(s)
    return acc
  }, {})

  const handleBook = async () => {
    if (!selectedSlot) { toast.error('Please select a time slot'); return }
    setBooking(true)
    try {
      await bookAppointment({ slotId: selectedSlot, notes })
      toast.success('Appointment booked successfully!')
      navigate('/patient/appointments')
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed') }
    finally { setBooking(false) }
  }

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div style={{ width:40, height:40, border:'3px solid #e5e7eb', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/></div>

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 24px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom:20 }}>
          <FaArrowLeft/> Back
        </button>

        {doctor && (
          <div className="card" style={{ padding:30, marginBottom:24, display:'flex', gap:22, alignItems:'flex-start', background:'var(--primary-light)', border:'none' }}>
            <div style={{ width:84, height:84, borderRadius:18, background:'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <FaUserMd size={34} color="var(--primary)" />
            </div>
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:24, fontWeight:800, color:'var(--primary)' }}>Dr. {doctor.fullName}</h2>
              <p style={{ color:'var(--accent)', fontWeight:700, marginTop:4 }}>{doctor.specialization}</p>
              <div style={{ display:'flex', gap:20, marginTop:10, flexWrap:'wrap' }}>
                <span style={{ fontSize:13, color:'var(--text-mid)' }}>🎓 {doctor.experienceYears || 0} yrs experience</span>
                <span style={{ fontSize:13, color:'var(--text-mid)' }}>⭐ {doctor.rating || '4.5'} rating</span>
                <span style={{ fontSize:15, fontWeight:800, color:'var(--primary)' }}>₹{doctor.consultationFee || 0} consultation</span>
              </div>
              {doctor.bio && <p style={{ marginTop:10, color:'var(--text-mid)', fontSize:14, lineHeight:1.6 }}>{doctor.bio}</p>}
            </div>
          </div>
        )}

        <div className="card" style={{ padding:30, marginBottom:20 }}>
          <h3 style={{ fontSize:18, fontWeight:800, marginBottom:20, display:'flex', alignItems:'center', gap:8, color:'var(--primary)' }}>
            <FaCalendarAlt color="var(--accent)"/> Select Appointment Slot
          </h3>
          {Object.keys(grouped).length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'var(--text-mid)' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📅</div>
              No available slots. Please check back later.
            </div>
          ) : (
            Object.entries(grouped).map(([date, dateSlots]) => (
              <div key={date} style={{ marginBottom:20 }}>
                <div style={{ fontSize:14, fontWeight:800, color:'var(--primary)', marginBottom:10, padding:'7px 14px', background:'var(--bg-soft)', borderRadius:8, display:'inline-block' }}>
                  📅 {new Date(date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                  {dateSlots.map(s => (
                    <div key={s.id} onClick={() => setSelectedSlot(s.id)} style={{
                      padding:'11px 18px', borderRadius:10, cursor:'pointer', fontSize:13, fontWeight:700,
                      border: selectedSlot===s.id ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                      background: selectedSlot===s.id ? 'var(--primary-light)' : 'white',
                      color: selectedSlot===s.id ? 'var(--primary)' : 'var(--text-dark)',
                      transition:'all 0.2s', display:'flex', alignItems:'center', gap:6
                    }}>
                      <FaClock size={11}/> {s.startTime} – {s.endTime}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card" style={{ padding:30 }}>
          <div style={{ marginBottom:16 }}>
            <label>Reason for visit / Symptoms <span style={{ color:'var(--text-light)', fontWeight:400 }}>(optional)</span></label>
            <textarea rows={3} placeholder="Describe your symptoms or reason for the appointment..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          {selectedSlot && (
            <div style={{ background:'var(--primary-light)', borderRadius:10, padding:'14px 18px', marginBottom:16, fontSize:14, color:'var(--primary)', fontWeight:700 }}>
              ✓ Slot selected — {doctor && `Dr. ${doctor.fullName}`} — Fee: ₹{doctor?.consultationFee || 0}
            </div>
          )}
          <button className="btn btn-accent btn-lg" onClick={handleBook} disabled={booking || !selectedSlot} style={{ width:'100%', justifyContent:'center' }}>
            {booking ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default BookAppointment