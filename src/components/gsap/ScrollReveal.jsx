import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
  const ref = useRef(null)
  useEffect(() => {
    const from = direction === 'up'   ? { opacity:0, y:50 }
               : direction === 'left' ? { opacity:0, x:-50 }
               : direction === 'right'? { opacity:0, x:50 }
               : { opacity:0, scale:0.9 }
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, from, {
        opacity:1, y:0, x:0, scale:1,
        duration:0.7, delay,
        ease:'power2.out',
        scrollTrigger: { trigger: ref.current, start:'top 85%' }
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return <div ref={ref}>{children}</div>
}

export default ScrollReveal