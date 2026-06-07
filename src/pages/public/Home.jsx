import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../../components/layout/Navbar'
import { getSpecializations, filterDoctors } from '../../api/doctorApi'
import { FaUserMd, FaFlask, FaHeartbeat, FaShieldAlt, FaStar, FaArrowRight, FaStethoscope } from 'react-icons/fa'
import { MdLocalPharmacy, MdHealthAndSafety } from 'react-icons/md'
gsap.registerPlugin(ScrollTrigger)

const specialties = [
  { name:'General Physician', icon:'🩺', color:'#e3f2fd' },
  { name:'Dermatology', icon:'🧴', color:'#fce4ec' },
  { name:'Cardiology', icon:'❤️', color:'#ffebee' },
  { name:'Orthopaedics', icon:'🦴', color:'#f3e5f5' },
  { name:'ENT', icon:'👂', color:'#e8f5e9' },
  { name:'Neurology', icon:'🧠', color:'#fff3e0' },
  { name:'Urology', icon:'🫀', color:'#e0f7fa' },
  { name:'Paediatrics', icon:'👶', color:'#fce4ec' },
  { name:'Psychiatry', icon:'🧘', color:'#e8eaf6' },
  { name:'Ophthalmology', icon:'👁️', color:'#e0f2f1' },
  { name:'Gynaecology', icon:'🌸', color:'#fce4ec' },
  { name:'Endocrinology', icon:'⚗️', color:'#f3e5f5' },
]

const quickActions = [
  { icon:<FaUserMd size={28}/>, title:'Doctor Appointment', sub:'Book Now', color:'#e8f3f1', border:'#b2dfdb', to:'/patient/find-doctors' },
  { icon:<FaFlask size={28}/>, title:'Health Records', sub:'View Records', color:'#fff3e0', border:'#ffe0b2', to:'/patient/records' },
  { icon:<FaHeartbeat size={28}/>, title:'My Prescriptions', sub:'View All', color:'#fce4ec', border:'#f8bbd0', to:'/patient/prescriptions' },
  { icon:<MdLocalPharmacy size={28}/>, title:'My Appointments', sub:'Track Status', color:'#e8eaf6', border:'#c5cae9', to:'/patient/appointments' },
]

const Home = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const [search, setSearch] = useState('')
  const [doctors, setDoctors] = useState([])
  const [activeSlide, setActiveSlide] = useState(0)

  const banners = [
    { bg:'linear-gradient(120deg,#02475e 60%,#00b5c8)', title:'Your Full Body Checkup', sub:'Book an appointment with top doctors', cta:'Book Now', to:'/patient/find-doctors' },
    { bg:'linear-gradient(120deg,#f7941d 60%,#f5c67a)', title:'Find the Right Doctor', sub:'500+ specialists available online', cta:'Find Doctors', to:'/patient/find-doctors' },
    { bg:'linear-gradient(120deg,#25a244 60%,#81c784)', title:'Your Health Records', sub:'All your records in one secure place', cta:'View Records', to:'/patient/records' },
  ]

  useEffect(() => {
    gsap.fromTo('.hero-content', { opacity:0, y:40 }, { opacity:1, y:0, duration:0.8, ease:'power3.out' })
    gsap.fromTo('.quick-card', { opacity:0, y:30 }, { opacity:1, y:0, duration:0.5, stagger:0.1, delay:0.3, ease:'power2.out' })
    const interval = setInterval(() => setActiveSlide(s => (s+1)%banners.length), 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    gsap.fromTo('.spec-chip', { opacity:0, scale:0.9 }, {
      opacity:1, scale:1, duration:0.4, stagger:0.05,
      scrollTrigger: { trigger:'.spec-section', start:'top 80%' }
    })
    filterDoctors({}).then(r => setDoctors(r.data.data?.slice(0,4) || [])).catch(()=>{})
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />

      {/* HERO BANNER */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'20px 20px 0' }}>
        <div style={{ borderRadius:16, overflow:'hidden', position:'relative', minHeight:260, background:banners[activeSlide].bg, transition:'background 0.6s', display:'flex', alignItems:'center' }}>
          <div className="hero-content" style={{ padding:'40px 48px', color:'white', flex:1 }}>
            <h1 style={{ fontSize:'clamp(24px,3vw,38px)', fontWeight:800, marginBottom:12, lineHeight:1.2 }}>{banners[activeSlide].title}</h1>
            <p style={{ fontSize:16, opacity:0.9, marginBottom:24 }}>{banners[activeSlide].sub}</p>
            <Link to={banners[activeSlide].to}>
              <button className="btn" style={{ background:'white', color:'var(--primary)', fontWeight:700, fontSize:15, padding:'12px 28px' }}>
                {banners[activeSlide].cta} →
              </button>
            </Link>
          </div>
          <div style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6 }}>
            {banners.map((_,i) => (
              <div key={i} onClick={() => setActiveSlide(i)} style={{ width: i===activeSlide?24:8, height:8, borderRadius:4, background:'rgba(255,255,255,'+( i===activeSlide?'1':'0.5')+')', cursor:'pointer', transition:'all 0.3s' }} />
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
          {quickActions.map((q,i) => (
            <Link key={i} to={q.to}>
              <div className="quick-card card card-hover" style={{ padding:'20px 24px', display:'flex', alignItems:'center', gap:16, cursor:'pointer', borderLeft:`4px solid ${q.border}`, background:q.color }}>
                <div style={{ color:'var(--primary)', flexShrink:0 }}>{q.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:'var(--text-dark)' }}>{q.title}</div>
                  <div style={{ fontSize:13, color:'var(--primary)', fontWeight:600, display:'flex', alignItems:'center', gap:4, marginTop:2 }}>{q.sub} <FaArrowRight size={11}/></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* BROWSE BY SPECIALTY */}
      <div className="spec-section" style={{ maxWidth:1200, margin:'0 auto', padding:'8px 20px 32px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <h2 className="section-title">Browse by Specialties</h2>
            <p className="section-sub">Find the right specialist for your health needs</p>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
          {specialties.map((s,i) => (
            <div key={i} className="spec-chip card card-hover" style={{ background:s.color, border:`1.5px solid ${s.color}`, borderRadius:12, padding:'16px 14px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}
              onClick={() => navigate(`/patient/find-doctors?spec=${s.name}`)}>
              <span style={{ fontSize:24 }}>{s.icon}</span>
              <span style={{ fontWeight:600, fontSize:13, color:'var(--text-dark)' }}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TOP DOCTORS */}
      {doctors.length > 0 && (
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'8px 20px 32px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div>
              <h2 className="section-title">Top Doctors</h2>
              <p className="section-sub">Experienced specialists ready to help you</p>
            </div>
            <Link to="/patient/find-doctors"><button className="btn btn-outline btn-sm">View All</button></Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
            {doctors.map(d => (
              <div key={d.id} className="card card-hover" style={{ padding:20, cursor:'pointer' }} onClick={() => navigate(`/patient/book/${d.id}`)}>
                <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <FaStethoscope size={22} color="var(--primary)" />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:15 }}>Dr. {d.fullName}</div>
                    <div style={{ color:'var(--primary)', fontSize:13, fontWeight:600 }}>{d.specialization || 'General'}</div>
                    <div style={{ color:'var(--text-light)', fontSize:12, marginTop:4 }}>{d.experienceYears || 0} yrs experience</div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
                      <span style={{ color:'var(--success)', fontWeight:700, fontSize:14 }}>₹{d.consultationFee || 0}</span>
                      <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/patient/book/${d.id}`) }}>Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATS */}
      <div style={{ background:'var(--primary)', padding:'48px 20px', marginTop:16 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:32, textAlign:'center' }}>
          {[['500+','Expert Doctors'],['50,000+','Appointments'],['98%','Satisfaction'],['24/7','Available']].map(([n,l],i) => (
            <div key={i}>
              <div style={{ fontSize:36, fontWeight:800, color:'var(--orange)' }}>{n}</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.8)', marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background:'#1a1a2e', padding:'28px 20px', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:8 }}>
          <MdHealthAndSafety size={22} color="var(--orange)" />
          <span style={{ color:'white', fontWeight:700, fontSize:17 }}>HealthCare System</span>
        </div>
        <p style={{ color:'#767676', fontSize:13 }}>© 2026 HealthCare. Your health, our priority.</p>
      </footer>
    </div>
  )
}
export default Home