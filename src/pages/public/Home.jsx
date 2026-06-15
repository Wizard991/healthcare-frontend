import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import Navbar from '../../components/layout/Navbar'
import { filterDoctors } from '../../api/doctorApi'
import { FaSearch, FaMapMarkerAlt, FaStethoscope } from 'react-icons/fa'

const specialties = [
  { name:'Cardiology', icon:'❤️', color:'#fee2e2' },
  { name:'Dermatology', icon:'🧴', color:'#fce7f3' },
  { name:'Neurology', icon:'🧠', color:'#e0e7ff' },
  { name:'General Medicine', icon:'➕', color:'#fee2e2' },
  { name:'Dentistry', icon:'🦷', color:'#d1fae5' },
  { name:'ENT', icon:'👂', color:'#ccfbf1' },
]

const searchTags = ['Family Medicine','Pediatrics','Top Hospital','Telehealth','AI Symptom Checker','Orthopedic Surgery']

const Home = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    gsap.fromTo('.hero-content', { opacity:0, y:30 }, { opacity:1, y:0, duration:0.7, ease:'power3.out' })
    gsap.fromTo('.spec-circle', { opacity:0, y:20 }, { opacity:1, y:0, duration:0.4, stagger:0.06, delay:0.3 })
    filterDoctors({}).then(r => setDoctors(r.data.data?.slice(0,3) || [])).catch(()=>{})
  }, [])

  const handleSearch = () => navigate(`/patient/find-doctors${search ? `?spec=${search}` : ''}`)

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background:'var(--primary-light)' }}>
        <div style={{ maxWidth:1240, margin:'0 auto', padding:'56px 24px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }}>
          <div className="hero-content">
            <h1 style={{ fontSize:'clamp(34px,5vw,52px)', fontWeight:800, color:'var(--primary)', lineHeight:1.15, letterSpacing:'-0.02em', marginBottom:18 }}>
              Feel better about<br/>finding healthcare
            </h1>
            <p style={{ fontSize:16, color:'var(--text-mid)', maxWidth:440, marginBottom:28, lineHeight:1.7 }}>
              We take the guesswork out of finding the right doctors, hospitals, and care for you and your family.
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <div style={{ background:'var(--primary)', color:'white', borderRadius:12, padding:'14px 20px', display:'flex', alignItems:'center', gap:12, flex:1, minWidth:220 }}>
                <span style={{ fontSize:22 }}>👨‍⚕️</span>
                <span style={{ fontSize:13, fontWeight:600, lineHeight:1.4 }}>Profiles for every doctor across India</span>
              </div>
              <div style={{ background:'var(--primary)', color:'white', borderRadius:12, padding:'14px 20px', display:'flex', alignItems:'center', gap:12, flex:1, minWidth:220 }}>
                <span style={{ fontSize:22 }}>⭐</span>
                <span style={{ fontSize:13, fontWeight:600, lineHeight:1.4 }}>Thousands of verified patient ratings</span>
              </div>
            </div>
          </div>
          <div className="hero-content" style={{ textAlign:'center', fontSize:160 }}>
            🩺
          </div>
        </div>

        {/* Search bar */}
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'40px 24px 56px' }}>
          <div className="card hero-content" style={{ padding:24 }}>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:2, minWidth:240 }}>
                <FaSearch style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }} />
                <input placeholder="Search doctor, conditions or specialities" style={{ paddingLeft:42, height:48 }}
                  value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
              <div style={{ position:'relative', flex:1, minWidth:180 }}>
                <FaMapMarkerAlt style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--text-light)' }} />
                <input placeholder="Set your location" style={{ paddingLeft:42, height:48 }} defaultValue="Patna, Bihar" />
              </div>
              <button className="btn btn-accent" style={{ height:48, padding:'0 28px' }} onClick={handleSearch}>
                <FaSearch size={14}/>
              </button>
            </div>
            <div style={{ marginTop:18 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--text-light)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>You may be looking for</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {searchTags.map(t => (
                  <div key={t} className="search-tag" onClick={() => navigate(`/patient/find-doctors?spec=${t}`)}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular searches / specialties */}
      <div style={{ maxWidth:1240, margin:'0 auto', padding:'56px 24px' }}>
        <h2 className="section-title">Popular Specialties</h2>
        <p className="section-sub">Browse by specialty and find the right doctor for your needs</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:16 }}>
          {specialties.map((s,i) => (
            <div key={i} className="spec-circle" onClick={() => navigate(`/patient/find-doctors?spec=${s.name}`)}>
              <div className="spec-circle-icon" style={{ background:s.color }}>{s.icon}</div>
              <span style={{ fontSize:14, fontWeight:700, color:'var(--text-dark)' }}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top doctors */}
      {doctors.length > 0 && (
        <div style={{ maxWidth:1240, margin:'0 auto', padding:'0 24px 56px' }}>
          <h2 className="section-title">Meet our Specialists</h2>
          <p className="section-sub">Top-rated doctors ready for online consultation</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {doctors.map(d => (
              <div key={d.id} className="card card-hover" style={{ padding:22, cursor:'pointer' }} onClick={() => navigate(`/patient/book/${d.id}`)}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                  <FaStethoscope size={22} color="var(--primary)" />
                </div>
                <div style={{ fontWeight:800, fontSize:16, color:'var(--primary)' }}>Dr. {d.fullName}</div>
                <div style={{ color:'var(--accent)', fontSize:13, fontWeight:700, marginTop:2 }}>{d.specialization || 'General'}</div>
                <div style={{ color:'var(--text-light)', fontSize:12, marginTop:6 }}>{d.experienceYears || 0} yrs experience</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}>
                  <span style={{ fontWeight:800, fontSize:17, color:'var(--primary)' }}>₹{d.consultationFee || 0}</span>
                  <button className="btn btn-primary btn-sm">Book →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dark CTA */}
      <div style={{ background:'var(--primary)', padding:'56px 24px' }}>
        <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(24px,3vw,34px)', fontWeight:800, color:'white', marginBottom:12 }}>
            Subscribe for health updates
          </h2>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:15, marginBottom:28 }}>
            Get the latest health tips, doctor recommendations, and platform updates.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register"><button className="btn btn-accent btn-lg">Create free account →</button></Link>
            <Link to="/login"><button className="btn btn-lg" style={{ background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)' }}>Already have one? Sign in</button></Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background:'white', borderTop:'1px solid var(--border)', padding:'32px 24px', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:14 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'white', fontSize:16 }}>➕</span>
          </div>
          <span style={{ fontWeight:800, fontSize:17, color:'var(--primary)' }}>We<span style={{ color:'var(--accent)' }}>.</span>Care</span>
        </div>
        <div style={{ display:'flex', gap:24, justifyContent:'center', marginBottom:14, fontSize:13, color:'var(--text-light)', fontWeight:600 }}>
          <span>Privacy</span><span>Terms</span><span>Support</span>
        </div>
        <p style={{ color:'var(--text-light)', fontSize:12 }}>© 2026 We.Care — Smart Health Platform</p>
      </footer>
    </div>
  )
}
export default Home