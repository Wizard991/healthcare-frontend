import { useEffect, useState, useRef } from 'react'
import Navbar from '../../components/layout/Navbar'
import { getMyProfile, updateMyProfile } from '../../api/doctorApi'
import { gsap } from 'gsap'
import { FaUserMd, FaStethoscope, FaMoneyBill, FaClock, FaEdit, FaSave, FaTimes, FaPhone, FaInfoCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

const specializations = ['Cardiology','Dermatology','ENT','General Physician','Gynaecology','Neurology','Ophthalmology','Orthopaedics','Paediatrics','Psychiatry','Urology','Endocrinology','Gastroenterology','Nephrology','Pulmonology']

const DoctorProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity:0, y:20 }, { opacity:1, y:0, duration:0.5 })
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile()
      const d = res.data.data
      setProfile(d)
      setForm({
        fullName: d.fullName||'', phone: d.phone||'',
        specialization: d.specialization||'',
        experienceYears: d.experienceYears||'',
        consultationFee: d.consultationFee||'',
        bio: d.bio||''
      })
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await updateMyProfile(form)
      setProfile(res.data.data)
      setEditing(false)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  const Field = ({ icon, label, field, type='text', options, textarea }) => (
    <div style={{ display:'flex', gap:14, padding:'15px 0', borderBottom:'1px solid #f1f3f5', alignItems:'flex-start' }}>
      <div style={{ width:36, height:36, borderRadius:10, background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)', flexShrink:0, marginTop:2 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:11, color:'var(--text-light)', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>{label}</div>
        {editing ? (
          options ? (
            <select value={form[field]||''} onChange={e => setForm({...form,[field]:e.target.value})} style={{ maxWidth:280 }}>
              <option value="">Select {label}</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : textarea ? (
            <textarea rows={3} value={form[field]||''} onChange={e => setForm({...form,[field]:e.target.value})} placeholder={`Enter ${label}`} style={{ maxWidth:480 }} />
          ) : (
            <input type={type} value={form[field]||''} onChange={e => setForm({...form,[field]:e.target.value})} placeholder={`Enter ${label}`} style={{ maxWidth:380 }} />
          )
        ) : (
          <div style={{ fontSize:15, fontWeight:600, color: profile?.[field] ? 'var(--text-dark)' : 'var(--text-light)', lineHeight:1.6 }}>
            {profile?.[field] || 'Not set'}
          </div>
        )}
      </div>
    </div>
  )

  if (loading) return <div style={{ minHeight:'100vh', background:'var(--bg)' }}><Navbar/><div style={{ display:'flex', justifyContent:'center', padding:60 }}><div style={{ width:40, height:40, border:'3px solid #e5e7eb', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/></div></div>

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar/>
      <div ref={ref} style={{ maxWidth:900, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div>
            <h1 className="section-title" style={{ fontSize:28, marginBottom:4 }}>Doctor Profile</h1>
            <p className="section-sub" style={{ marginBottom:0 }}>Manage your professional information</p>
          </div>
          {!editing
            ? <button className="btn btn-primary" onClick={() => setEditing(true)}><FaEdit/> Edit Profile</button>
            : <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-outline" onClick={() => setEditing(false)}><FaTimes/> Cancel</button>
                <button className="btn btn-accent" onClick={handleSave} disabled={saving}><FaSave/> {saving?'Saving...':'Save'}</button>
              </div>
          }
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:20 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:26, textAlign:'center' }}>
              <div style={{ width:84, height:84, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:32, color:'white', fontWeight:800 }}>
                {profile?.fullName?.charAt(0)?.toUpperCase() || 'D'}
              </div>
              <div style={{ fontWeight:800, fontSize:17, marginBottom:4, color:'var(--primary)' }}>Dr. {profile?.fullName || 'Your Name'}</div>
              <div style={{ color:'var(--accent)', fontSize:13, fontWeight:700, marginBottom:10 }}>{profile?.specialization || 'Specialist'}</div>
              <span style={{ background:'var(--primary-light)', color:'var(--primary)', padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:800 }}>DOCTOR</span>
            </div>

            <div className="card" style={{ padding:22, textAlign:'center', background:'var(--primary-light)' }}>
              <div style={{ fontSize:26, fontWeight:800, color:'var(--primary)' }}>₹{profile?.consultationFee || '0'}</div>
              <div style={{ fontSize:12, color:'var(--text-mid)', marginTop:2 }}>Consultation Fee</div>
            </div>

            <div className="card" style={{ padding:22, textAlign:'center', background:'#fff7ed' }}>
              <div style={{ fontSize:26, fontWeight:800, color:'var(--orange)' }}>{profile?.experienceYears || '0'}</div>
              <div style={{ fontSize:12, color:'var(--text-mid)', marginTop:2 }}>Years Experience</div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:'4px 26px 14px' }}>
              <div style={{ fontSize:15, fontWeight:800, padding:'16px 0 4px', color:'var(--primary)' }}>👨‍⚕️ Professional Information</div>
              <Field icon={<FaUserMd size={14}/>} label="Full Name" field="fullName" />
              <Field icon={<FaPhone size={14}/>} label="Phone" field="phone" type="tel" />
              <Field icon={<FaStethoscope size={14}/>} label="Specialization" field="specialization" options={specializations} />
              <Field icon={<FaClock size={14}/>} label="Years of Experience" field="experienceYears" type="number" />
              <Field icon={<FaMoneyBill size={14}/>} label="Consultation Fee (₹)" field="consultationFee" type="number" />
              <Field icon={<FaInfoCircle size={14}/>} label="Bio / About" field="bio" textarea />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default DoctorProfile