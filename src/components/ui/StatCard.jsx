import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const StatCard = ({ icon, label, value, color='#1a73e8', delay=0 }) => {
  const ref = useRef(null)
  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity:0, y:30, scale:0.95 },
      { opacity:1, y:0, scale:1, duration:0.5, delay, ease:'back.out(1.4)' }
    )
    const el = ref.current
    const enter = () => gsap.to(el, { y:-5, boxShadow:'0 12px 28px rgba(26,115,232,0.22)', duration:0.2 })
    const leave = () => gsap.to(el, { y:0, boxShadow:'0 2px 8px rgba(26,115,232,0.12)', duration:0.2 })
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave) }
  }, [])

  return (
    <div ref={ref} className="card" style={{ display:'flex', alignItems:'center', gap:16, cursor:'default' }}>
      <div style={{ width:52, height:52, borderRadius:12, background:color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:28, fontWeight:700, color:'#1a1a2e' }}>{value}</div>
        <div style={{ fontSize:13, color:'#5f6368' }}>{label}</div>
      </div>
    </div>
  )
}
export default StatCard