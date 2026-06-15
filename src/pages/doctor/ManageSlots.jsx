import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { addSlot, getMySlots, deleteSlot } from '../../api/doctorApi'
import { FaPlus, FaTrash, FaClock, FaCalendarAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

const ManageSlots = () => {
  const [slots, setSlots] = useState([])
  const [form, setForm] = useState({ slotDate:'', startTime:'', endTime:'' })
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const fetch = async () => {
    try { const r = await getMySlots(); setSlots(r.data.data || []) }
    catch { toast.error('Failed') } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleAdd = async e => {
    e.preventDefault()
    if (!form.slotDate || !form.startTime || !form.endTime) { toast.error('Fill all fields'); return }
    setAdding(true)
    try { await addSlot(form); toast.success('Slot added!'); setForm({ slotDate:'', startTime:'', endTime:'' }); fetch() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setAdding(false) }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this slot?')) return
    try { await deleteSlot(id); toast.success('Deleted'); fetch() }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot delete a booked slot') }
  }

  const available = slots.filter(s => !s.isBooked)
  const booked = slots.filter(s => s.isBooked)

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ marginBottom:24 }}>
          <h1 className="section-title" style={{ fontSize:28 }}>Manage Availability</h1>
          <p className="section-sub">Add time slots for patients to book appointments</p>
        </div>

        <div className="card" style={{ padding:30, marginBottom:24 }}>
          <h2 style={{ fontSize:16, fontWeight:800, marginBottom:20, display:'flex', alignItems:'center', gap:8, color:'var(--primary)' }}><FaPlus size={14} color="var(--accent)"/> Add New Time Slot</h2>
          <form onSubmit={handleAdd}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:20 }}>
              <div><label>Date</label><input type="date" value={form.slotDate} onChange={e => setForm({...form, slotDate:e.target.value})} min={new Date().toISOString().split('T')[0]} /></div>
              <div><label>Start Time</label><input type="time" value={form.startTime} onChange={e => setForm({...form, startTime:e.target.value})} /></div>
              <div><label>End Time</label><input type="time" value={form.endTime} onChange={e => setForm({...form, endTime:e.target.value})} /></div>
            </div>
            <button type="submit" className="btn btn-accent" disabled={adding}><FaPlus/> {adding ? 'Adding...' : 'Add Slot'}</button>
          </form>
        </div>

        <div className="card" style={{ padding:26, marginBottom:20 }}>
          <h3 style={{ fontWeight:800, fontSize:15, marginBottom:16, color:'var(--primary)' }}>Available Slots ({available.length})</h3>
          {loading ? <p style={{ color:'var(--text-mid)' }}>Loading...</p>
          : available.length === 0 ? <p style={{ color:'var(--text-mid)', fontSize:14 }}>No available slots. Add some above.</p>
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
              {available.map(s => (
                <div key={s.id} style={{ border:'1.5px solid var(--border)', borderRadius:12, padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'white' }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, display:'flex', alignItems:'center', gap:6, color:'var(--primary)' }}><FaCalendarAlt size={12} color="var(--accent)"/> {s.slotDate}</div>
                    <div style={{ fontSize:12, color:'var(--text-mid)', display:'flex', alignItems:'center', gap:5, marginTop:5 }}><FaClock size={10}/> {s.startTime} – {s.endTime}</div>
                  </div>
                  <button onClick={() => handleDelete(s.id)} style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'var(--danger)', padding:'7px 11px', borderRadius:8, cursor:'pointer', fontSize:13 }}><FaTrash size={12}/></button>
                </div>
              ))}
            </div>}
        </div>

        {booked.length > 0 && (
          <div className="card" style={{ padding:26 }}>
            <h3 style={{ fontWeight:800, fontSize:15, marginBottom:16, color:'var(--primary)' }}>Booked Slots ({booked.length})</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
              {booked.map(s => (
                <div key={s.id} style={{ border:'1.5px solid var(--border)', borderRadius:12, padding:'14px 16px', background:'var(--primary-light)' }}>
                  <div style={{ fontWeight:800, fontSize:14, color:'var(--primary)' }}>{s.slotDate}</div>
                  <div style={{ fontSize:12, color:'var(--text-mid)', marginTop:5 }}>{s.startTime} – {s.endTime}</div>
                  <span style={{ fontSize:11, background:'#d1fae5', color:'#065f46', padding:'3px 10px', borderRadius:10, marginTop:8, display:'inline-block', fontWeight:700 }}>BOOKED</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default ManageSlots