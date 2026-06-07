import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const CountUp = ({ end, suffix = '', duration = 2 }) => {
  const ref = useRef(null)
  useEffect(() => {
    const obj = { val: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: end, duration, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        onUpdate: () => { if (ref.current) ref.current.textContent = Math.floor(obj.val) + suffix }
      })
    }, ref)
    return () => ctx.revert()
  }, [end])
  return <span ref={ref}>0{suffix}</span>
}

export default CountUp