import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import Navbar from '../../components/layout/Navbar'
import { getAllDoctors, getSpecializations, filterDoctors } from '../../api/doctorApi'
import { FaSearch, FaUserMd, FaStar, FaFilter } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md'
import toast from 'react-hot-toast'

const FindDoctors = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [doctors, setDoctors] = useState([])
  const [specs, setSpecs] = useState([])
  const [search, setSearch] = useState(params.get('spec') || '')
  const [selectedSpec, setSelectedSpec] = useState(params.get('spec') || '')
  const [loading, setLoading] = useState(true)

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
    setSelectedSpec(search)
    fetch(search)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background:'linear-gradient(120deg,var(--primary),#00b5c8)', padding:'32px 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <h1 style={{ color:'white', fontSize:28, fontWeight:800, marginBottom:8 }}>Find Doctors</h1>
          <p style={{ color:'rgba(255,255,255,0.85)', marginBottom:20 }}>Search from our network of expert doctors</p>
          <form onSubmit={handleSearch} style={{ display:'flex', gap:12, maxWidth:600 }}>
            <div style={{ position:'relative', flex:1 }}>
              <FaSearch style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }} />
              <input placeholder="Search by specialization, doctor name..." style={{ paddingLeft:46, height:48, borderRadius:10, fontSize:15, border:'none' }} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-orange" style={{ height:48, padding:'0 28px', fontSize:15 }}>Search</button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 20px', display:'grid', gridTemplateColumns:'220px 1fr', gap:24 }}>
        {/* Sidebar filters */}
        <div>
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:14, display:'flex', alignItems:'center', gap:8 }}><FaFilter size={14}/> Filter by Specialty</div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <div onClick={() => handleSpec('')} style={{ padding:'8px 12px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight: !selectedSpec ? 700 : 400, color: !selectedSpec ? 'var(--primary)' : 'var(--text-mid)', background: !selectedSpec ? 'var(--primary-light)' : 'transparent', transition:'all 0.2s' }}>
                All Doctors
              </div>
              {specs.map(s => (
                <div key={s} onClick={() => handleSpec(s)} style={{ padding:'8px 12px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight: selectedSpec===s ? 700 : 400, color: selectedSpec===s ? 'var(--primary)' : 'var(--text-mid)', background: selectedSpec===s ? 'var(--primary-light)' : 'transparent', transition:'all 0.2s' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor grid */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <p style={{ color:'var(--text-light)', fontSize:14 }}>{loading ? 'Loading...' : `${doctors.length} doctors found`}</p>
          </div>
          {loading ? <div style={{ textAlign:'center', padding:60 }}><div style={{ width:40, height:40, border:'3px solid #e0e0e0', borderTop:'3px solid var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }}/></div>
          : doctors.length === 0 ? (
            <div style={{ textAlign:'center', padding:60 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <p style={{ color:'var(--text-light)' }}>No doctors found</p>
              <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setSelectedSpec(''); fetch('') }} style={{ marginTop:12 }}>Clear filters</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {doctors.map(d => (
                <div key={d.id} className="doc-card card" style={{ padding:24, display:'flex', gap:20, alignItems:'flex-start', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow-lg)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow='var(--shadow-sm)'}
                  onClick={() => navigate(`/patient/book/${d.id}`)}>
                  <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <FaUserMd size={30} color="var(--primary)" />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize:17, fontWeight:700, color:'var(--text-dark)' }}>Dr. {d.fullName}</h3>
                        <p style={{ color:'var(--primary)', fontWeight:600, fontSize:14, marginTop:2 }}>{d.specialization || 'General Physician'}</p>
                        <p style={{ color:'var(--text-light)', fontSize:13, marginTop:4 }}>{d.experienceYears || 0} years experience</p>
                        {d.bio && <p style={{ color:'var(--text-mid)', fontSize:13, marginTop:8, lineHeight:1.5, maxWidth:500 }}>{d.bio}</p>}
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:4, color:'#f5a623', fontSize:13, fontWeight:600 }}>
                          <FaStar size={13}/> {d.rating || '4.5'}
                        </div>
                        <div style={{ fontSize:20, fontWeight:800, color:'var(--success)', marginTop:6 }}>₹{d.consultationFee || 0}</div>
                        <div style={{ fontSize:12, color:'var(--text-light)' }}>per consultation</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:10, marginTop:14, flexWrap:'wrap' }}>
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