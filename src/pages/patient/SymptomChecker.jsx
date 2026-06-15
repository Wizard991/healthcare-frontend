import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { checkSymptoms } from '../../api/symptomApi'
import toast from 'react-hot-toast'

const commonSymptoms = ['Headache','Fever','Cough','Chest Pain','Shortness of Breath','Nausea','Fatigue','Dizziness','Back Pain','Stomach Pain','Sore Throat','Joint Pain','Skin Rash','Vomiting','Diarrhea']

const urgencyColors = {
  HIGH:   { bg:'#fef2f2', color:'#b91c1c', border:'#fecaca', label:'⚠️ High — See a doctor immediately' },
  MEDIUM: { bg:'#fff7ed', color:'#c2410c', border:'#fed7aa', label:'⚡ Medium — Consult a doctor soon' },
  LOW:    { bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0', label:'✅ Low — Monitor at home' },
}

const SymptomChecker = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])
  const [description, setDescription] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [customSymptom, setCustomSymptom] = useState('')

  const toggleSymptom = s => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const addCustom = () => {
    if (customSymptom.trim() && !selected.includes(customSymptom.trim())) {
      setSelected(prev => [...prev, customSymptom.trim()])
      setCustomSymptom('')
    }
  }

  const handleCheck = async () => {
    if (selected.length === 0) { toast.error('Please select at least one symptom'); return }
    setLoading(true); setResult(null)
    try {
      const res = await checkSymptoms({ symptoms: selected, description, age: age ? Number(age) : null, gender: gender || null })
      setResult(res.data.data)
    } catch { toast.error('AI analysis failed. Please try again.') }
    finally { setLoading(false) }
  }

  const urgency = result ? urgencyColors[result.urgencyLevel] || urgencyColors.MEDIUM : null

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🤖</div>
            <div>
              <h1 className="section-title" style={{ fontSize:28, marginBottom:2 }}>AI Symptom Checker</h1>
              <p style={{ color:'var(--text-mid)', fontSize:14 }}>Get instant health insights powered by AI</p>
            </div>
          </div>
          <div style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:12, padding:'14px 18px', fontSize:13, color:'#c2410c' }}>
            ⚠️ <strong>Disclaimer:</strong> This AI tool provides general health information only and is not a substitute for professional medical advice.
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="card" style={{ padding:22 }}>
              <h3 style={{ fontWeight:800, fontSize:15, marginBottom:14, color:'var(--primary)' }}>Patient Info (optional)</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label>Age</label><input type="number" placeholder="e.g. 25" value={age} onChange={e => setAge(e.target.value)} min={1} max={120} /></div>
                <div><label>Gender</label><select value={gender} onChange={e => setGender(e.target.value)}><option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
              </div>
            </div>

            <div className="card" style={{ padding:22 }}>
              <h3 style={{ fontWeight:800, fontSize:15, marginBottom:14, color:'var(--primary)' }}>Select Symptoms</h3>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
                {commonSymptoms.map(s => (
                  <button key={s} onClick={() => toggleSymptom(s)} style={{
                    padding:'8px 16px', borderRadius:20, fontSize:13, cursor:'pointer', fontWeight:600,
                    border: selected.includes(s) ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                    background: selected.includes(s) ? 'var(--primary)' : 'white',
                    color: selected.includes(s) ? 'white' : 'var(--text-mid)',
                    transition:'all 0.2s'
                  }}>{s}</button>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <input placeholder="Add custom symptom..." value={customSymptom} onChange={e => setCustomSymptom(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustom()} />
                <button className="btn btn-outline btn-sm" onClick={addCustom} style={{ whiteSpace:'nowrap' }}>+ Add</button>
              </div>
            </div>

            {selected.length > 0 && (
              <div className="card" style={{ padding:18 }}>
                <div style={{ fontSize:12, fontWeight:800, marginBottom:10, color:'var(--text-light)' }}>SELECTED ({selected.length})</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {selected.map(s => (
                    <span key={s} style={{ padding:'5px 14px', background:'var(--primary)', color:'white', borderRadius:20, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                      {s}<span onClick={() => toggleSymptom(s)} style={{ cursor:'pointer', opacity:0.8, fontSize:14, lineHeight:1 }}>×</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="card" style={{ padding:22 }}>
              <label>Additional Description (optional)</label>
              <textarea rows={3} placeholder="Describe when symptoms started, severity, or any other relevant information..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <button className="btn btn-accent btn-lg" onClick={handleCheck} disabled={loading || selected.length === 0} style={{ justifyContent:'center' }}>
              {loading ? (
                <span style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                  Analyzing with AI...
                </span>
              ) : '🤖 Analyze Symptoms'}
            </button>
          </div>

          <div>
            {!result && !loading && (
              <div className="card" style={{ padding:34, textAlign:'center', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
                <div style={{ fontSize:64 }}>🩺</div>
                <h3 style={{ fontWeight:800, color:'var(--primary)' }}>Select your symptoms</h3>
                <p style={{ color:'var(--text-mid)', fontSize:14, lineHeight:1.7 }}>Choose your symptoms and our AI will analyze them and suggest possible conditions and the right specialist to see.</p>
              </div>
            )}

            {loading && (
              <div className="card" style={{ padding:34, textAlign:'center', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
                <div style={{ width:56, height:56, border:'4px solid var(--primary-light)', borderTop:'4px solid var(--accent)', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
                <h3 style={{ fontWeight:800, color:'var(--primary)' }}>Analyzing symptoms...</h3>
                <p style={{ color:'var(--text-mid)', fontSize:14 }}>Our AI is reviewing your symptoms</p>
              </div>
            )}

            {result && (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ background:urgency.bg, border:`1.5px solid ${urgency.border}`, borderRadius:12, padding:'16px 20px' }}>
                  <div style={{ fontSize:16, fontWeight:800, color:urgency.color }}>{urgency.label}</div>
                </div>

                <div className="card" style={{ padding:22 }}>
                  <h3 style={{ fontWeight:800, fontSize:15, marginBottom:14, color:'var(--primary)' }}>🔍 Possible Conditions</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {result.possibleConditions?.map((c, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'var(--bg-soft)', borderRadius:10, fontSize:14 }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--primary)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 }}>{i+1}</div>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding:22 }}>
                  <h3 style={{ fontWeight:800, fontSize:15, marginBottom:12, color:'var(--primary)' }}>👨‍⚕️ Recommended Specialist</h3>
                  <div style={{ fontSize:18, fontWeight:800, color:'var(--primary)', padding:'14px 18px', background:'var(--primary-light)', borderRadius:12 }}>
                    {result.recommendedSpecialist}
                  </div>
                  <button className="btn btn-accent btn-sm" style={{ marginTop:12, width:'100%', justifyContent:'center' }} onClick={() => navigate(`/patient/find-doctors?spec=${result.recommendedSpecialist}`)}>
                    Find {result.recommendedSpecialist} Doctors →
                  </button>
                </div>

                {result.advice && (
                  <div className="card" style={{ padding:22 }}>
                    <h3 style={{ fontWeight:800, fontSize:15, marginBottom:10, color:'var(--primary)' }}>💡 Health Advice</h3>
                    <p style={{ fontSize:14, color:'var(--text-mid)', lineHeight:1.7 }}>{result.advice}</p>
                  </div>
                )}

                <div style={{ background:'var(--bg-soft)', borderRadius:10, padding:'12px 16px', fontSize:12, color:'var(--text-mid)', lineHeight:1.6 }}>
                  ℹ️ {result.disclaimer}
                </div>

                <button className="btn btn-outline" style={{ justifyContent:'center' }} onClick={() => { setResult(null); setSelected([]); setDescription('') }}>
                  Check Different Symptoms
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default SymptomChecker