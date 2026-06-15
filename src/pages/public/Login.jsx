import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { login as loginApi } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import { FaEnvelope, FaLock, FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity:0, y:20 }, { opacity:1, y:0, duration:0.6, ease:'power2.out' })
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
    <div style={{ minHeight:'100vh', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div ref={ref} style={{ width:'100%', maxWidth:420 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:32 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FaPlus size={16} color="white" />
          </div>
          <span style={{ fontSize:20, fontWeight:800, color:'var(--primary)' }}>We<span style={{ color:'var(--accent)' }}>.</span>Care</span>
        </Link>

        <div className="card" style={{ padding:36 }}>
          <h2 style={{ fontSize:26, fontWeight:800, color:'var(--primary)', marginBottom:6 }}>Welcome back</h2>
          <p style={{ color:'var(--text-mid)', marginBottom:28 }}>Sign in to your account</p>
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
            <button type="submit" className="btn btn-accent btn-lg" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--text-mid)' }}>
            Don't have an account? <Link to="/register" style={{ color:'var(--accent)', fontWeight:700 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Login