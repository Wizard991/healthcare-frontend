import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { login as loginApi } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import { MdHealthAndSafety } from 'react-icons/md'
import { FaEnvelope, FaLock, FaUserMd, FaUser } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity:0, x:-40 }, { opacity:1, x:0, duration:0.6, ease:'power2.out' })
  }, [])

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await loginApi(form)
      const { token, ...u } = res.data.data
      login(token, u)
      toast.success('Welcome back!')
      navigate(u.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr' }}>
      {/* Left — Illustration */}
      <div style={{ background:'linear-gradient(135deg, var(--primary) 0%, #00b5c8 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:48 }}>
        <MdHealthAndSafety size={64} color="var(--orange)" />
        <h1 style={{ color:'white', fontSize:36, fontWeight:800, marginTop:20, textAlign:'center' }}>HealthCare System</h1>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:16, marginTop:12, textAlign:'center', maxWidth:300, lineHeight:1.7 }}>Your trusted platform for booking appointments, managing health records and more.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:40, width:'100%', maxWidth:320 }}>
          {[['500+','Doctors'],['50k+','Patients'],['98%','Satisfaction'],['24/7','Support']].map(([n,l]) => (
            <div key={l} style={{ background:'rgba(255,255,255,0.15)', borderRadius:12, padding:'16px', textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:800, color:'var(--orange)' }}>{n}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:48, background:'white' }}>
        <div ref={ref} style={{ width:'100%', maxWidth:400 }}>
          <h2 style={{ fontSize:28, fontWeight:800, color:'var(--text-dark)', marginBottom:6 }}>Welcome back</h2>
          <p style={{ color:'var(--text-light)', marginBottom:32 }}>Sign in to your account</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:18 }}>
              <label>Email address</label>
              <div style={{ position:'relative' }}>
                <FaEnvelope style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }} />
                <input type="email" placeholder="you@example.com" style={{ paddingLeft:42 }} value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
              </div>
            </div>
            <div style={{ marginBottom:28 }}>
              <label>Password</label>
              <div style={{ position:'relative' }}>
                <FaLock style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }} />
                <input type="password" placeholder="••••••••" style={{ paddingLeft:42 }} value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--text-light)' }}>
            Don't have an account? <Link to="/register" style={{ color:'var(--primary)', fontWeight:700 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Login