import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { getMyPrescriptions } from '../../api/prescriptionApi'
import { FaPills, FaUserMd } from 'react-icons/fa'
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

  const printPrescription = (p) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${p.patientName}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: 0 auto; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #1e3a5f; margin-bottom: 24px; }
          .logo { font-size: 22px; font-weight: 800; color: #1e3a5f; }
          .logo span { color: #2563eb; }
          .date { font-size: 13px; color: #64748b; }
          .doctor-info { background: #e8f1fb; padding: 16px 20px; border-radius: 10px; margin-bottom: 20px; }
          .doctor-name { font-size: 18px; font-weight: 700; color: #1e3a5f; }
          .doctor-spec { color: #64748b; font-size: 13px; margin-top: 4px; }
          .patient-info { border: 1px solid #e5e7eb; padding: 14px 20px; border-radius: 10px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 8px; }
          .section-content { font-size: 15px; line-height: 1.7; }
          .medicines { background: #f8fafc; padding: 16px 20px; border-radius: 10px; white-space: pre-line; line-height: 2; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: flex-end; }
          .signature { text-align: center; }
          .sig-line { width: 160px; border-top: 1px solid #1e293b; padding-top: 8px; font-size: 13px; color: #64748b; }
          .disclaimer { background: #fff3e0; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #92400e; margin-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">We<span>.</span>Care</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px">Digital Prescription</div>
          </div>
          <div class="date">
            <div style="font-size:13px;color:#64748b">Date: ${new Date(p.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
            <div style="font-size:13px;color:#64748b;margin-top:4px">Rx #${p.id}</div>
          </div>
        </div>

        <div class="doctor-info">
          <div class="doctor-name">Dr. ${p.doctorName}</div>
          <div class="doctor-spec">${p.doctorSpecialization || ''}</div>
        </div>

        <div class="patient-info">
          <div style="font-size:12px;color:#64748b;margin-bottom:4px">PATIENT</div>
          <div style="font-size:16px;font-weight:600">${p.patientName}</div>
        </div>

        ${p.diagnosis ? `
        <div class="section">
          <div class="section-title">Diagnosis</div>
          <div class="section-content">${p.diagnosis}</div>
        </div>` : ''}

        ${p.medicines ? `
        <div class="section">
          <div class="section-title">Medicines Prescribed</div>
          <div class="medicines">${p.medicines}</div>
        </div>` : ''}

        ${p.instructions ? `
        <div class="section">
          <div class="section-title">Instructions</div>
          <div class="section-content">${p.instructions}</div>
        </div>` : ''}

        ${p.notes ? `
        <div class="section">
          <div class="section-title">Additional Notes</div>
          <div class="section-content">${p.notes}</div>
        </div>` : ''}

        <div class="footer">
          <div style="font-size:12px;color:#64748b">
            <div>We.Care</div>
            <div style="margin-top:2px">Smart Health Platform</div>
          </div>
          <div class="signature">
            <div class="sig-line">Dr. ${p.doctorName}</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px">${p.doctorSpecialization || 'Doctor'}</div>
          </div>
        </div>

        <div class="disclaimer">
          ⚠️ This is a digitally generated prescription. Valid only when verified by the prescribing doctor.
        </div>

        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ marginBottom:24 }}>
          <h1 className="section-title" style={{ fontSize:28 }}>My Prescriptions</h1>
          <p className="section-sub">All prescriptions from your doctors</p>
        </div>
        {loading ? <div style={{ textAlign:'center', padding:60 }}><div style={{ width:36, height:36, border:'3px solid #e5e7eb', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }}/></div>
        : prescriptions.length === 0 ? (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>💊</div>
            <p style={{ color:'var(--text-mid)' }}>No prescriptions yet</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {prescriptions.map(p => (
              <div key={p.id} className="card" style={{ padding:26 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                  <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <FaUserMd size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:16, color:'var(--primary)' }}>Dr. {p.doctorName}</div>
                      <div style={{ color:'var(--accent)', fontSize:13, fontWeight:700 }}>{p.doctorSpecialization}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ fontSize:12, color:'var(--text-light)', background:'var(--bg-soft)', padding:'5px 12px', borderRadius:20 }}>
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </div>
                    <button onClick={() => printPrescription(p)} className="btn btn-outline btn-sm">🖨️ Print</button>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 }}>
                  {p.diagnosis && (
                    <div style={{ background:'#fff7ed', borderRadius:12, padding:'14px 16px' }}>
                      <div style={{ fontSize:11, fontWeight:800, color:'#c2410c', textTransform:'uppercase', marginBottom:6 }}>Diagnosis</div>
                      <div style={{ fontSize:14, color:'var(--text-dark)' }}>{p.diagnosis}</div>
                    </div>
                  )}
                  {p.medicines && (
                    <div style={{ background:'var(--primary-light)', borderRadius:12, padding:'14px 16px' }}>
                      <div style={{ fontSize:11, fontWeight:800, color:'var(--primary)', textTransform:'uppercase', marginBottom:6, display:'flex', alignItems:'center', gap:6 }}><FaPills size={11}/> Medicines</div>
                      <div style={{ fontSize:13, color:'var(--text-dark)', whiteSpace:'pre-line', lineHeight:1.7 }}>{p.medicines}</div>
                    </div>
                  )}
                  {p.instructions && (
                    <div style={{ background:'#f3e8ff', borderRadius:12, padding:'14px 16px' }}>
                      <div style={{ fontSize:11, fontWeight:800, color:'#7e22ce', textTransform:'uppercase', marginBottom:6 }}>Instructions</div>
                      <div style={{ fontSize:13, color:'var(--text-dark)', lineHeight:1.6 }}>{p.instructions}</div>
                    </div>
                  )}
                </div>
                {p.notes && <div style={{ marginTop:14, padding:'12px 16px', background:'var(--bg-soft)', borderRadius:10, fontSize:13, color:'var(--text-mid)', borderLeft:'3px solid var(--border)' }}>📝 {p.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default MyPrescriptions