import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { getMyRecords } from '../../api/recordsApi'
import toast from 'react-hot-toast'

const Vital = ({ label, value, unit, icon }) => value ? (
  <div style={{ background:'var(--bg-soft)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, minWidth:130 }}>
    <span style={{ fontSize:20 }}>{icon}</span>
    <div><div style={{ fontSize:11, color:'var(--text-light)', fontWeight:700, textTransform:'uppercase' }}>{label}</div><div style={{ fontWeight:800, fontSize:16, color:'var(--primary)' }}>{value} <span style={{ fontSize:11, fontWeight:400, color:'var(--text-light)' }}>{unit}</span></div></div>
  </div>
) : null

const MyRecords = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyRecords().then(r => setRecords(r.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ marginBottom:24 }}>
          <h1 className="section-title" style={{ fontSize:28 }}>Health Records</h1>
          <p className="section-sub">Your complete medical history</p>
        </div>
        {loading ? <div style={{ textAlign:'center', padding:60 }}><div style={{ width:36, height:36, border:'3px solid #e5e7eb', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }}/></div>
        : records.length === 0 ? (
          <div style={{ textAlign:'center', padding:60 }}><div style={{ fontSize:48, marginBottom:12 }}>📋</div><p style={{ color:'var(--text-mid)' }}>No records yet</p></div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {records.map(r => (
              <div key={r.id} className="card" style={{ padding:26 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                  <div>
                    <h3 style={{ fontWeight:800, fontSize:17, color:'var(--primary)' }}>{r.title}</h3>
                    <p style={{ fontSize:13, color:'var(--text-light)', marginTop:2 }}>Dr. {r.doctorName} • {new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  {r.recordType && <span style={{ background:'var(--primary-light)', color:'var(--primary)', padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:800, alignSelf:'flex-start' }}>{r.recordType}</span>}
                </div>
                {(r.bloodPressure || r.temperature || r.weight || r.pulse || r.oxygenLevel || r.height) && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:14 }}>
                    <Vital label="BP" value={r.bloodPressure} unit="mmHg" icon="❤️" />
                    <Vital label="Temp" value={r.temperature} unit="°F" icon="🌡️" />
                    <Vital label="Weight" value={r.weight} unit="kg" icon="⚖️" />
                    <Vital label="Pulse" value={r.pulse} unit="bpm" icon="💓" />
                    <Vital label="SpO2" value={r.oxygenLevel} unit="%" icon="🫁" />
                    <Vital label="Height" value={r.height} unit="cm" icon="📏" />
                  </div>
                )}
                {r.doctorNotes && <div style={{ background:'var(--primary-light)', borderRadius:10, padding:'12px 16px', fontSize:13, marginBottom:8, color:'var(--text-dark)' }}><strong>Doctor Notes:</strong> {r.doctorNotes}</div>}
                {r.allergies && <div style={{ background:'#fef2f2', borderRadius:10, padding:'12px 16px', fontSize:13, marginBottom:8, color:'var(--danger)' }}><strong>⚠️ Allergies:</strong> {r.allergies}</div>}
                {r.symptoms && <div style={{ background:'#fff7ed', borderRadius:10, padding:'12px 16px', fontSize:13, color:'var(--text-dark)' }}><strong>Symptoms:</strong> {r.symptoms}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default MyRecords