import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../../api/chatApi'
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa'

const HealthChatWidget = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI health assistant. Ask me about general health, wellness, nutrition, or fitness questions. 🩺" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.slice(1).slice(-10) // last 10 exchanges, skip greeting
      const res = await sendChatMessage({
        message: userMsg.content,
        history: history.slice(0, -1) // exclude the message we just sent (sent separately)
      })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions = [
    'What foods boost immunity?',
    'How much sleep do I need?',
    'Tips for managing stress',
    'Benefits of drinking water'
  ]

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 24, right: 24, width: 56, height: 56,
            borderRadius: '50%', background: 'var(--primary)', color: 'white',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 4px 16px rgba(2,71,94,0.35)',
            zIndex: 1000, fontSize: 22, transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FaRobot />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, width: 360, height: 480,
          background: 'white', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(120deg,var(--primary),#00b5c8)', padding: '14px 18px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaRobot size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>AI Health Assistant</div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>Powered by OpenAI</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 16 }}>
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.role === 'user' ? 'var(--primary)' : '#f0f2f5',
                color: m.role === 'user' ? 'white' : 'var(--text-dark)',
                padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                fontSize: 13, lineHeight: 1.6
              }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#f0f2f5', padding: '10px 14px', borderRadius: '14px 14px 14px 4px', display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-light)', animation: `bounce 1.4s ${i*0.2}s infinite` }} />
                ))}
              </div>
            )}

            {/* Quick questions - show only at start */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600, marginBottom: 2 }}>TRY ASKING:</div>
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => { setInput(q); }}
                    style={{ textAlign: 'left', background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, cursor: 'pointer', color: 'var(--primary)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid var(--border)', padding: 10, display: 'flex', gap: 8 }}>
            <input
              placeholder="Ask a health question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, fontSize: 13 }}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: loading || !input.trim() ? 0.5 : 1 }}>
              <FaPaperPlane size={13} />
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{ fontSize: 10, color: 'var(--text-light)', textAlign: 'center', padding: '4px 0 8px' }}>
            For informational purposes only — not medical advice
          </div>
        </div>
      )}

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  )
}
export default HealthChatWidget