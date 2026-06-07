import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { getMyPrescriptions } from '../../api/prescriptionApi'
import { FaFileMedical, FaPills, FaUserMd } from 'react-icons/fa'
import toast from 'react-hot-toast'

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyPrescriptions()
      .then(r => setPrescriptions(r.data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'28px 20px' }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:800 }}>My Prescriptions</h1>
          <p style={{ color:'var(--text-light)', marginTop:4 }}>All prescriptions from your doctors</p>
        </div>
        {loading ? <div style={{ textAlign:'center', padding:60 }}><div style={{ width:36, height:36, border:'3px solid #e0e0e0', borderTop:'3px solid var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }}/></div>
        : prescriptions.length === 0 ? (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>💊</div>
            <p style={{ color:'var(--text-light)' }}>No prescriptions yet</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {prescriptions.map(p => (
              <div key={p.id} className="card" style={{ padding:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                    <div style={{ width:48, height:48, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <FaUserMd size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15 }}>Dr. {p.doctorName}</div>
                      <div style={{ color:'var(--primary)', fontSize:13, fontWeight:600 }}>{p.doctorSpecialization}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-light)', background:'var(--bg)', padding:'4px 10px', borderRadius:20 }}>
                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
                  {p.diagnosis && (
                    <div style={{ background:'#fff3e0', borderRadius:10, padding:'12px 16px' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'#e07a0a', textTransform:'uppercase', marginBottom:4 }}>Diagnosis</div>
                      <div style={{ fontSize:14, color:'var(--text-dark)' }}>{p.diagnosis}</div>
                    </div>
                  )}
                  {p.medicines && (
                    <div style={{ background:'#e8f3f1', borderRadius:10, padding:'12px 16px' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'var(--primary)', textTransform:'uppercase', marginBottom:4, display:'flex', alignItems:'center', gap:6 }}><FaPills size={11}/> Medicines</div>
                      <div style={{ fontSize:13, color:'var(--text-dark)', whiteSpace:'pre-line', lineHeight:1.7 }}>{p.medicines}</div>
                    </div>
                  )}
                  {p.instructions && (
                    <div style={{ background:'#f3e5f5', borderRadius:10, padding:'12px 16px' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'#7b1fa2', textTransform:'uppercase', marginBottom:4 }}>Instructions</div>
                      <div style={{ fontSize:13, color:'var(--text-dark)', lineHeight:1.6 }}>{p.instructions}</div>
                    </div>
                  )}
                </div>
                {p.notes && <div style={{ marginTop:12, padding:'10px 14px', background:'var(--bg)', borderRadius:8, fontSize:13, color:'var(--text-mid)', borderLeft:'3px solid var(--border)' }}>📝 {p.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default MyPrescriptions