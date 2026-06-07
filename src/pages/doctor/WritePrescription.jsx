import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { createPrescription } from '../../api/prescriptionApi'
import { getMyAppointmentsDoctor } from '../../api/appointmentApi'
import { FaFileMedical } from 'react-icons/fa'
import toast from 'react-hot-toast'

const WritePrescription = () => {
  const [appointments, setAppointments] = useState([])
  const [form, setForm] = useState({ appointmentId:'', diagnosis:'', medicines:'', instructions:'', notes:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getMyAppointmentsDoctor()
      .then(r => setAppointments((r.data.data||[]).filter(a => ['CONFIRMED','COMPLETED'].includes(a.status))))
      .catch(() => toast.error('Failed to load'))
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.appointmentId) { toast.error('Select an appointment'); return }
    setSaving(true)
    try {
      await createPrescription({ ...form, appointmentId: Number(form.appointmentId) })
      toast.success('Prescription created!')
      setForm({ appointmentId:'', diagnosis:'', medicines:'', instructions:'', notes:'' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:800, margin:'0 auto', padding:'28px 20px' }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:800, display:'flex', alignItems:'center', gap:10 }}><FaFileMedical color="var(--primary)"/> Write Prescription</h1>
          <p style={{ color:'var(--text-light)', marginTop:4 }}>Create a prescription for a confirmed appointment</p>
        </div>
        <div className="card" style={{ padding:32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:18 }}>
              <label>Select Appointment *</label>
              <select value={form.appointmentId} onChange={e => setForm({...form, appointmentId:e.target.value})} required>
                <option value="">Choose a confirmed appointment...</option>
                {appointments.map(a => <option key={a.id} value={a.id}>{a.patientName} — {a.slotDate} {a.startTime} ({a.status})</option>)}
              </select>
              {appointments.length === 0 && <p style={{ fontSize:12, color:'var(--text-light)', marginTop:4 }}>No confirmed appointments found</p>}
            </div>
            <div style={{ marginBottom:18 }}><label>Diagnosis</label><input placeholder="e.g. Mild angina, Hypertension" value={form.diagnosis} onChange={e => setForm({...form, diagnosis:e.target.value})} /></div>
            <div style={{ marginBottom:18 }}>
              <label>Medicines <span style={{ color:'var(--text-light)', fontWeight:400 }}>(one per line)</span></label>
              <textarea rows={4} placeholder={"Aspirin 75mg - once daily\nAtorvastatin 10mg - at night"} value={form.medicines} onChange={e => setForm({...form, medicines:e.target.value})} />
            </div>
            <div style={{ marginBottom:18 }}><label>Instructions</label><textarea rows={3} placeholder="Avoid stress. Light walking 30 mins daily." value={form.instructions} onChange={e => setForm({...form, instructions:e.target.value})} /></div>
            <div style={{ marginBottom:24 }}><label>Additional Notes</label><textarea rows={2} placeholder="Follow up in 2 weeks..." value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} /></div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ width:'100%', justifyContent:'center' }}>
              <FaFileMedical/> {saving ? 'Saving...' : 'Create Prescription'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default WritePrescription