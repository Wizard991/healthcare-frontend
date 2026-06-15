import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../../context/AuthContext'
import { FaUserCircle, FaSignOutAlt, FaChevronDown, FaPlus } from 'react-icons/fa'

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
        { to:'/patient/find-doctors', label:'Find a Doctor' },
        { to:'/patient/hospitals', label:'Find a Hospital' },
        { to:'/patient/appointments', label:'My Appointments' },
        { to:'/patient/records', label:'Health Records' },
        { to:'/patient/prescriptions', label:'Prescriptions' },
        { to:'/patient/symptoms', label:'AI Symptom Checker' },
        { to:'/patient/analytics', label:'Health Analytics' },
      ]

  return (
    <nav ref={ref} style={{ background:'white', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:1000 }}>
      <div style={{ maxWidth:1240, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:72 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FaPlus size={16} color="white" />
          </div>
          <span style={{ fontSize:19, fontWeight:800, color:'var(--primary)', letterSpacing:'-0.02em' }}>
            We<span style={{ color:'var(--accent)' }}>.</span>Care
          </span>
        </Link>

        

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {user ? (
            <div style={{ position:'relative' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-soft)', border:'1.5px solid var(--border)', padding:'8px 14px', borderRadius:10, cursor:'pointer', fontWeight:600 }}>
                <FaUserCircle size={20} color="var(--primary)" />
                <span style={{ fontSize:13, color:'var(--text-dark)', maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email?.split('@')[0]}</span>
                <span style={{ fontSize:11, background:'var(--primary-light)', color:'var(--primary)', padding:'2px 8px', borderRadius:10, fontWeight:800 }}>{user.role}</span>
                <FaChevronDown size={11} color="var(--text-light)" />
              </button>
              {menuOpen && (
                <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', background:'white', border:'1px solid var(--border)', borderRadius:'14px', boxShadow:'var(--shadow-lg)', minWidth:190, zIndex:100, overflow:'hidden' }}>
                  <Link to={user.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard'} onClick={() => setMenuOpen(false)}>
                    <div style={{ padding:'13px 18px', fontSize:14, fontWeight:500, cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg-soft)'}
                      onMouseLeave={e => e.currentTarget.style.background='white'}>
                      Dashboard
                    </div>
                  </Link>
                  <Link to={user.role === 'DOCTOR' ? '/doctor/profile' : '/patient/profile'} onClick={() => setMenuOpen(false)}>
                    <div style={{ padding:'13px 18px', fontSize:14, fontWeight:500, cursor:'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg-soft)'}
                      onMouseLeave={e => e.currentTarget.style.background='white'}>
                      My Profile
                    </div>
                  </Link>
                  <div style={{ height:1, background:'var(--border)' }} />
                  <div onClick={handleLogout} style={{ padding:'13px 18px', fontSize:14, fontWeight:500, cursor:'pointer', color:'var(--danger)', display:'flex', alignItems:'center', gap:10 }}
                    onMouseEnter={e => e.currentTarget.style.background='#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background='white'}>
                    <FaSignOutAlt /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:'flex', gap:10 }}>
              <Link to="/login"><button className="btn btn-outline btn-sm">Log in</button></Link>
              <Link to="/register"><button className="btn btn-accent btn-sm">Sign in</button></Link>
            </div>
          )}
        </div>
      </div>

      {user && (
        <div style={{ borderTop:'1px solid var(--bg-soft)', background:'white' }}>
          <div style={{ maxWidth:1240, margin:'0 auto', padding:'0 24px', display:'flex', gap:4, overflowX:'auto' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                padding:'11px 16px', fontSize:13, fontWeight:600, display:'block', whiteSpace:'nowrap',
                borderBottom: location.pathname === link.to ? '2px solid var(--accent)' : '2px solid transparent',
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

