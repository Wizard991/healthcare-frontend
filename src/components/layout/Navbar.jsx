import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../../context/AuthContext'
import { FaUserCircle, FaSignOutAlt, FaChevronDown, FaHospital } from 'react-icons/fa'
import { MdLocalHospital } from 'react-icons/md'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const ref = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    gsap.fromTo(ref.current, { y:-64, opacity:0 }, { y:0, opacity:1, duration:0.5, ease:'power2.out' })
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = user?.role === 'DOCTOR'
    ? [
        { to:'/doctor/dashboard', label:'Dashboard' },
        { to:'/doctor/appointments', label:'Appointments' },
        { to:'/doctor/slots', label:'Manage Slots' },
        { to:'/doctor/prescription', label:'Prescriptions' },
      ]
    : [
        { to:'/patient/find-doctors', label:'Find Doctors' },
        { to:'/patient/appointments', label:'My Appointments' },
        { to:'/patient/records', label:'Health Records' },
        { to:'/patient/prescriptions', label:'Prescriptions' },
        { to:'/patient/symptoms', label:'AI Symptom Checker' },
      ]

  return (
    <nav ref={ref} style={{ background:'white', borderBottom:'1px solid #e0e0e0', position:'sticky', top:0, zIndex:1000, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
      {/* Top bar */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ background:'var(--primary)', padding:'6px 10px', borderRadius:8, display:'flex', alignItems:'center', gap:6 }}>
            <MdLocalHospital size={22} color="white" />
            <span style={{ color:'white', fontWeight:800, fontSize:16 }}>Health</span>
            <span style={{ color:'var(--orange)', fontWeight:800, fontSize:16 }}>Care</span>
          </div>
        </Link>

        {/* Search bar — only for patients */}
        {user?.role !== 'DOCTOR' && (
          <div style={{ flex:1, maxWidth:500, margin:'0 24px', position:'relative' }}>
            <input
              placeholder="Search doctors, specialities, conditions..."
              style={{ paddingLeft:40, background:'#f7f8fa' }}
              onKeyDown={e => { if (e.key === 'Enter') navigate('/patient/find-doctors') }}
            />
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#767676', fontSize:16 }}>🔍</span>
          </div>
        )}

        {/* Auth */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {user ? (
            <div style={{ position:'relative' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'1.5px solid var(--border)', padding:'7px 14px', borderRadius:8, cursor:'pointer', fontWeight:500 }}>
                <FaUserCircle size={20} color="var(--primary)" />
                <span style={{ fontSize:13, color:'var(--text-dark)', maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email?.split('@')[0]}</span>
                <span style={{ fontSize:11, background:'var(--primary-light)', color:'var(--primary)', padding:'2px 7px', borderRadius:10, fontWeight:700 }}>{user.role}</span>
                <FaChevronDown size={11} color="var(--text-light)" />
              </button>
              {menuOpen && (
                <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', background:'white', border:'1px solid var(--border)', borderRadius:'12px', boxShadow:'0 8px 32px rgba(0,0,0,0.13)', minWidth:180, zIndex:100, overflow:'hidden' }}>
                  <Link to={user.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard'} onClick={() => setMenuOpen(false)}>
                    <div style={{ padding:'12px 16px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'background 0.15s' }} onMouseEnter={e => e.target.style.background='#f7f8fa'} onMouseLeave={e => e.target.style.background='white'}>
                      Dashboard
                    </div>
                  </Link>
                  <div style={{ height:1, background:'var(--border)' }} />
                  <div onClick={handleLogout} style={{ padding:'12px 16px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:10, color:'var(--danger)' }} onMouseEnter={e => e.currentTarget.style.background='#fff5f5'} onMouseLeave={e => e.currentTarget.style.background='white'}>
                    <FaSignOutAlt /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:'flex', gap:10 }}>
              <Link to="/login"><button className="btn btn-outline btn-sm">Login</button></Link>
              <Link to="/register"><button className="btn btn-orange btn-sm">Register Free</button></Link>
            </div>
          )}
        </div>
      </div>

      {/* Secondary nav — links */}
      {user && (
        <div style={{ borderTop:'1px solid #f0f0f0', background:'white' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 20px', display:'flex', gap:4 }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                padding:'10px 16px', fontSize:14, fontWeight:500, display:'block',
                borderBottom: location.pathname === link.to ? '2px solid var(--primary)' : '2px solid transparent',
                color: location.pathname === link.to ? 'var(--primary)' : 'var(--text-mid)',
                transition:'all 0.2s'
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
export default Navbar