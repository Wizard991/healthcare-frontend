import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { getMyAppointmentsDoctor, confirmAppointment, completeAppointment, cancelAppointment } from '../../api/appointmentApi'
import toast from 'react-hot-toast'

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const fetch = async () => {
    try { const r = await getMyAppointmentsDoctor(); setAppointments(r.data.data || []) }
    catch { toast.error('Failed') } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const action = async (fn, id, msg) => {
    try { await fn(id); toast.success(msg); fetch() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ marginBottom:24 }}>
          <h1 className="section-title" style={{ fontSize:28 }}>Patient Appointments</h1>
          <p className="section-sub">Manage all your patient appointments</p>
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {['ALL','PENDING','CONFIRMED','COMPLETED','CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className="btn btn-sm" style={{ background:filter===s?'var(--primary)':'white', color:filter===s?'white':'var(--text-mid)', border:filter===s?'1.5px solid var(--primary)':'1.5px solid var(--border)', borderRadius:20 }}>{s}</button>
          ))}
        </div>
        <div className="card">
          {loading ? <div style={{ textAlign:'center', padding:60 }}><div style={{ width:36, height:36, border:'3px solid #e5e7eb', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }}/></div>
          : filtered.length === 0 ? <div style={{ textAlign:'center', padding:60 }}><div style={{ fontSize:48, marginBottom:12 }}>📅</div><p style={{ color:'var(--text-mid)' }}>No appointments found</p></div>
          : <div style={{ overflowX:'auto' }}>
              <table>
                <thead><tr>{['Patient','Date','Time','Notes','Status','Actions'].map(h => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight:700, color:'var(--primary)' }}>{a.patientName}</td>
                      <td>{a.slotDate}</td>
                      <td>{a.startTime}</td>
                      <td style={{ color:'var(--text-mid)', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.notes || '—'}</td>
                      <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                      <td><div style={{ display:'flex', gap:6 }}>
                        {a.status==='PENDING' && <button className="btn btn-sm" style={{ background:'#d1fae5', color:'#065f46', border:'none' }} onClick={() => action(confirmAppointment, a.id, 'Confirmed!')}>Confirm</button>}
                        {a.status==='CONFIRMED' && <button className="btn btn-accent btn-sm" onClick={() => action(completeAppointment, a.id, 'Completed!')}>Complete</button>}
                        {['PENDING','CONFIRMED'].includes(a.status) && <button className="btn btn-sm" style={{ background:'#fef2f2', color:'var(--danger)', border:'1px solid #fecaca' }} onClick={() => action(cancelAppointment, a.id, 'Cancelled')}>Cancel</button>}
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
        </div>
      </div>
    </div>
  )
}
export default DoctorAppointments