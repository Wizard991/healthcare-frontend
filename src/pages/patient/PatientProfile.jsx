import { useEffect, useState, useRef } from 'react'
import Navbar from '../../components/layout/Navbar'
import { getMyProfile, updateMyProfile } from '../../api/patientApi'
import { useAuth } from '../../context/AuthContext'
import { gsap } from 'gsap'
import { FaUser, FaPhone, FaCalendarAlt, FaTint, FaHeartbeat, FaEdit, FaSave, FaTimes, FaAllergies } from 'react-icons/fa'
import toast from 'react-hot-toast'

const bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-']

const PatientProfile = () => {
  const { user } = useAuth()
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
        dob: d.dob||'', gender: d.gender||'',
        bloodGroup: d.bloodGroup||'', allergies: d.allergies||'',
        chronicConditions: d.chronicConditions||'',
        emergencyContact: d.emergencyContact||'',
        emergencyContactName: d.emergencyContactName||'',
      })
    } catch { toast.error('Failed to load profile') }
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

  const Field = ({ icon, label, field, type='text', options }) => (
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
          ) : (
            <input type={type} value={form[field]||''} onChange={e => setForm({...form,[field]:e.target.value})} placeholder={`Enter ${label}`} style={{ maxWidth:380 }} />
          )
        ) : (
          <div style={{ fontSize:15, fontWeight:600, color: profile?.[field] ? 'var(--text-dark)' : 'var(--text-light)' }}>
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
            <h1 className="section-title" style={{ fontSize:28, marginBottom:4 }}>My Profile</h1>
            <p className="section-sub" style={{ marginBottom:0 }}>Manage your personal and health information</p>
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
          {/* Left */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:26, textAlign:'center' }}>
              <div style={{ width:84, height:84, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:32, color:'white', fontWeight:800 }}>
                {profile?.fullName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div style={{ fontWeight:800, fontSize:17, marginBottom:4, color:'var(--primary)' }}>{profile?.fullName || 'Your Name'}</div>
              <div style={{ color:'var(--text-light)', fontSize:12, marginBottom:10 }}>{user?.email}</div>
              <span style={{ background:'var(--primary-light)', color:'var(--primary)', padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:800 }}>PATIENT</span>
            </div>

            <div className="card" style={{ padding:22, textAlign:'center', background:'#fef2f2' }}>
              <FaTint size={22} color="#ef4444" style={{ marginBottom:6 }}/>
              <div style={{ fontSize:26, fontWeight:800, color:'#ef4444' }}>{profile?.bloodGroup || '—'}</div>
              <div style={{ fontSize:12, color:'var(--text-mid)', marginTop:2 }}>Blood Group</div>
            </div>

            {profile?.emergencyContactName && (
              <div className="card" style={{ padding:18, background:'#fff7ed' }}>
                <div style={{ fontSize:11, fontWeight:800, color:'#c2410c', marginBottom:8 }}>🚨 EMERGENCY CONTACT</div>
                <div style={{ fontWeight:700, fontSize:14 }}>{profile.emergencyContactName}</div>
                <div style={{ fontSize:13, color:'var(--text-mid)' }}>{profile.emergencyContact}</div>
              </div>
            )}
          </div>

          {/* Right */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:'4px 26px 14px' }}>
              <div style={{ fontSize:15, fontWeight:800, padding:'16px 0 4px', color:'var(--primary)' }}>👤 Personal Information</div>
              <Field icon={<FaUser size={14}/>} label="Full Name" field="fullName" />
              <Field icon={<FaPhone size={14}/>} label="Phone" field="phone" type="tel" />
              <Field icon={<FaCalendarAlt size={14}/>} label="Date of Birth" field="dob" type="date" />
              <Field icon={<FaUser size={14}/>} label="Gender" field="gender" options={['Male','Female','Other']} />
              <Field icon={<FaTint size={14}/>} label="Blood Group" field="bloodGroup" options={bloodGroups} />
            </div>
            <div className="card" style={{ padding:'4px 26px 14px' }}>
              <div style={{ fontSize:15, fontWeight:800, padding:'16px 0 4px', color:'var(--primary)' }}>❤️ Health Information</div>
              <Field icon={<FaAllergies size={14}/>} label="Allergies" field="allergies" />
              <Field icon={<FaHeartbeat size={14}/>} label="Chronic Conditions" field="chronicConditions" />
            </div>
            <div className="card" style={{ padding:'4px 26px 14px' }}>
              <div style={{ fontSize:15, fontWeight:800, padding:'16px 0 4px', color:'#c2410c' }}>🚨 Emergency Contact</div>
              <Field icon={<FaUser size={14}/>} label="Contact Name" field="emergencyContactName" />
              <Field icon={<FaPhone size={14}/>} label="Contact Phone" field="emergencyContact" type="tel" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PatientProfile