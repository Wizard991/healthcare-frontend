import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import Navbar from '../../components/layout/Navbar'
import { getAllDoctors, getSpecializations, filterDoctors } from '../../api/doctorApi'
import { FaSearch, FaUserMd, FaStar, FaFilter } from 'react-icons/fa'
import toast from 'react-hot-toast'

const HISTORY_KEY = 'doctor_search_history'
const getHistory = () => JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
const addToHistory = (term) => {
  if (!term.trim()) return
  const h = getHistory().filter(x => x !== term).slice(0, 4)
  localStorage.setItem(HISTORY_KEY, JSON.stringify([term, ...h]))
}
const clearHistory = () => localStorage.removeItem(HISTORY_KEY)

const FindDoctors = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [doctors, setDoctors] = useState([])
  const [specs, setSpecs] = useState([])
  const [search, setSearch] = useState(params.get('spec') || '')
  const [selectedSpec, setSelectedSpec] = useState(params.get('spec') || '')
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState(getHistory())
  const [showHistory, setShowHistory] = useState(false)

  const fetch = async (spec = '') => {
    setLoading(true)
    try {
      const res = spec ? await filterDoctors({ specialization: spec }) : await getAllDoctors()
      setDoctors(res.data.data || [])
      setTimeout(() => gsap.fromTo('.doc-card', { opacity:0, y:20 }, { opacity:1, y:0, duration:0.4, stagger:0.07 }), 50)
    } catch { toast.error('Failed to load doctors') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    getSpecializations().then(r => setSpecs(r.data.data || [])).catch(() => {})
    fetch(params.get('spec') || '')
  }, [])

  const handleSpec = spec => {
    setSelectedSpec(spec === selectedSpec ? '' : spec)
    setSearch(spec === selectedSpec ? '' : spec)
    fetch(spec === selectedSpec ? '' : spec)
  }

  const handleSearch = e => {
    e.preventDefault()
    addToHistory(search)
    setHistory(getHistory())
    setSelectedSpec(search)
    fetch(search)
    setShowHistory(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background:'var(--primary-light)', padding:'40px 24px' }}>
        <div style={{ maxWidth:1240, margin:'0 auto' }}>
          <h1 style={{ color:'var(--primary)', fontSize:32, fontWeight:800, marginBottom:8 }}>Find a Doctor</h1>
          <p style={{ color:'var(--text-mid)', marginBottom:24 }}>Search from our network of expert doctors</p>
          <form onSubmit={handleSearch} style={{ display:'flex', gap:12, maxWidth:600, position:'relative' }}>
            <div style={{ position:'relative', flex:1 }}>
              <FaSearch style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }} />
              <input
                placeholder="Search by specialization, doctor name..."
                style={{ paddingLeft:46, height:50 }}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              />
              {showHistory && history.length > 0 && (
                <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'white', border:'1px solid var(--border)', borderRadius:12, boxShadow:'var(--shadow-lg)', zIndex:100, overflow:'hidden' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 16px', borderBottom:'1px solid #f1f3f5' }}>
                    <span style={{ fontSize:12, color:'var(--text-light)', fontWeight:700 }}>Recent Searches</span>
                    <span onClick={() => { clearHistory(); setHistory([]) }} style={{ fontSize:12, color:'var(--danger)', cursor:'pointer', fontWeight:700 }}>Clear</span>
                  </div>
                  {history.map((h, i) => (
                    <div key={i} onClick={() => { setSearch(h); addToHistory(h); setHistory(getHistory()); setSelectedSpec(h); fetch(h); setShowHistory(false) }}
                      style={{ padding:'11px 16px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #f8f9fa' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg-soft)'}
                      onMouseLeave={e => e.currentTarget.style.background='white'}>
                      🕐 {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-accent" style={{ height:50, padding:'0 30px' }}>Search</button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth:1240, margin:'0 auto', padding:'32px 24px', display:'grid', gridTemplateColumns:'240px 1fr', gap:24 }}>
        {/* Sidebar filters */}
        <div>
          <div className="card" style={{ padding:22 }}>
            <div style={{ fontWeight:800, fontSize:15, marginBottom:16, display:'flex', alignItems:'center', gap:8, color:'var(--primary)' }}><FaFilter size={14}/> Filter by Specialty</div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <div onClick={() => handleSpec('')} style={{ padding:'9px 12px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight: !selectedSpec ? 700 : 500, color: !selectedSpec ? 'var(--accent)' : 'var(--text-mid)', background: !selectedSpec ? 'var(--primary-light)' : 'transparent', transition:'all 0.2s' }}>
                All Doctors
              </div>
              {specs.map(s => (
                <div key={s} onClick={() => handleSpec(s)} style={{ padding:'9px 12px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight: selectedSpec===s ? 700 : 500, color: selectedSpec===s ? 'var(--accent)' : 'var(--text-mid)', background: selectedSpec===s ? 'var(--primary-light)' : 'transparent', transition:'all 0.2s' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor list */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <p style={{ color:'var(--text-mid)', fontSize:14 }}>{loading ? 'Loading...' : `${doctors.length} doctors found`}</p>
          </div>
          {loading ? <div style={{ textAlign:'center', padding:60 }}><div style={{ width:40, height:40, border:'3px solid #e5e7eb', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }}/></div>
          : doctors.length === 0 ? (
            <div style={{ textAlign:'center', padding:60 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <p style={{ color:'var(--text-mid)' }}>No doctors found</p>
              <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setSelectedSpec(''); fetch('') }} style={{ marginTop:12 }}>Clear filters</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {doctors.map(d => (
                <div key={d.id} className="doc-card card card-hover" style={{ padding:26, display:'flex', gap:20, alignItems:'flex-start', cursor:'pointer' }}
                  onClick={() => navigate(`/patient/book/${d.id}`)}>
                  <div style={{ width:64, height:64, borderRadius:16, background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <FaUserMd size={26} color="var(--primary)" />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize:18, fontWeight:800, color:'var(--primary)' }}>Dr. {d.fullName}</h3>
                        <p style={{ color:'var(--accent)', fontWeight:700, fontSize:14, marginTop:2 }}>{d.specialization || 'General Physician'}</p>
                        <p style={{ color:'var(--text-light)', fontSize:13, marginTop:4 }}>{d.experienceYears || 0} years experience</p>
                        {d.bio && <p style={{ color:'var(--text-mid)', fontSize:13, marginTop:8, lineHeight:1.6, maxWidth:500 }}>{d.bio}</p>}
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:4, color:'#f59e0b', fontSize:13, fontWeight:700 }}>
                          <FaStar size={13}/> {d.rating || '4.5'}
                        </div>
                        <div style={{ fontSize:22, fontWeight:800, color:'var(--primary)', marginTop:8 }}>₹{d.consultationFee || 0}</div>
                        <div style={{ fontSize:12, color:'var(--text-light)' }}>per consultation</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:10, marginTop:16 }}>
                      <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/patient/book/${d.id}`) }}>Book Appointment</button>
                      <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); navigate(`/patient/book/${d.id}`) }}>View Profile</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default FindDoctors