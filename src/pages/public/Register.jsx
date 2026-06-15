import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { register as registerApi } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import { FaEnvelope, FaLock, FaUserMd, FaUser, FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Register = () => {
  const [form, setForm] = useState({ email:'', password:'', role:'PATIENT' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity:0, y:20 }, { opacity:1, y:0, duration:0.6, ease:'power2.out' })
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await registerApi(form)
      const { token, ...u } = res.data.data
      login(token, u)
      toast.success('Account created!')
      navigate(u.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div ref={ref} style={{ width:'100%', maxWidth:460 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:32 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FaPlus size={16} color="white" />
          </div>
          <span style={{ fontSize:20, fontWeight:800, color:'var(--primary)' }}>We<span style={{ color:'var(--accent)' }}>.</span>Care</span>
        </Link>

        <div className="card" style={{ padding:36 }}>
          <h2 style={{ fontSize:26, fontWeight:800, color:'var(--primary)', marginBottom:6 }}>Create your account</h2>
          <p style={{ color:'var(--text-mid)', marginBottom:24 }}>Join thousands of patients and doctors</p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
            {[['PATIENT', <FaUser/>, 'I am a Patient'],['DOCTOR', <FaUserMd/>, 'I am a Doctor']].map(([r, icon, label]) => (
              <button key={r} type="button" onClick={() => setForm({...form, role:r})} style={{
                padding:'16px', borderRadius:12, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                border: form.role===r ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                background: form.role===r ? 'var(--primary-light)' : 'white',
                color: form.role===r ? 'var(--primary)' : 'var(--text-mid)',
                fontWeight: form.role===r ? 700 : 500, transition:'all 0.2s', fontSize:14
              }}>
                <span style={{ fontSize:22 }}>{icon}</span> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label>Email address</label>
              <div style={{ position:'relative' }}>
                <FaEnvelope style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }} />
                <input type="email" placeholder="you@example.com" style={{ paddingLeft:42 }} value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
              </div>
            </div>
            <div style={{ marginBottom:24 }}>
              <label>Password <span style={{ color:'var(--text-light)', fontWeight:400 }}>(min 6 characters)</span></label>
              <div style={{ position:'relative' }}>
                <FaLock style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }} />
                <input type="password" placeholder="Create a strong password" style={{ paddingLeft:42 }} value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-accent btn-lg" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--text-mid)' }}>
            Already have an account? <Link to="/login" style={{ color:'var(--accent)', fontWeight:700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Register