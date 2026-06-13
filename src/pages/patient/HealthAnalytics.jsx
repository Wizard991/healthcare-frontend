import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { getMyRecords } from '../../api/recordsApi'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { FaHeartbeat, FaThermometerHalf, FaWeight, FaTint } from 'react-icons/fa'
import toast from 'react-hot-toast'

const HealthAnalytics = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyRecords()
      .then(r => setRecords(r.data.data || []))
      .catch(() => toast.error('Failed to load records'))
      .finally(() => setLoading(false))
  }, [])

  // Prepare chart data from records
  const chartData = records
    .filter(r => r.pulse || r.temperature || r.weight || r.oxygenLevel)
    .map(r => ({
      date: new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' }),
      pulse: r.pulse || null,
      temperature: r.temperature ? Number(r.temperature) : null,
      weight: r.weight ? Number(r.weight) : null,
      oxygen: r.oxygenLevel ? Number(r.oxygenLevel) : null,
      systolic: r.bloodPressure ? Number(r.bloodPressure.split('/')[0]) : null,
      diastolic: r.bloodPressure ? Number(r.bloodPressure.split('/')[1]) : null,
    }))
    .reverse()

  const latest = records[0]

  const StatBox = ({ icon, label, value, unit, color, normal }) => (
    <div className="card" style={{ padding:20, textAlign:'center' }}>
      <div style={{ color, fontSize:24, marginBottom:8 }}>{icon}</div>
      <div style={{ fontSize:26, fontWeight:800, color:'var(--text-dark)' }}>{value || '—'} <span style={{ fontSize:13, fontWeight:400, color:'var(--text-light)' }}>{value ? unit : ''}</span></div>
      <div style={{ fontSize:12, color:'var(--text-light)', marginTop:4 }}>{label}</div>
      {normal && value && <div style={{ fontSize:11, color:'var(--success)', marginTop:6, fontWeight:600 }}>Normal range: {normal}</div>}
    </div>
  )

  const ChartCard = ({ title, children }) => (
    <div className="card" style={{ padding:24, marginBottom:20 }}>
      <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20, color:'var(--text-dark)' }}>{title}</h3>
      {chartData.length < 2 ? (
        <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text-light)', fontSize:14 }}>
          Need at least 2 records to show trend. Add more medical records to see analytics.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>{children}</ResponsiveContainer>
      )}
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar/>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px 20px' }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:24, fontWeight:800 }}>Health Analytics</h1>
          <p style={{ color:'var(--text-light)', marginTop:4 }}>Track your health metrics over time</p>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:60 }}><div style={{ width:40, height:40, border:'3px solid #e0e0e0', borderTop:'3px solid var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }}/></div>
        ) : records.length === 0 ? (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:56, marginBottom:16 }}>📊</div>
            <h3 style={{ fontWeight:700, marginBottom:8 }}>No health data yet</h3>
            <p style={{ color:'var(--text-light)' }}>Your doctor needs to add medical records with vitals for analytics to appear here.</p>
          </div>
        ) : (
          <>
            {/* Latest vitals */}
            <h2 style={{ fontSize:16, fontWeight:700, marginBottom:14, color:'var(--text-dark)' }}>Latest Vitals</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:28 }}>
              <StatBox icon={<FaHeartbeat/>} label="Pulse" value={latest?.pulse} unit="bpm" color="#ea4335" normal="60-100 bpm" />
              <StatBox icon={<FaThermometerHalf/>} label="Temperature" value={latest?.temperature} unit="°F" color="#f7941d" normal="98-99°F" />
              <StatBox icon={<FaWeight/>} label="Weight" value={latest?.weight} unit="kg" color="#02475e" />
              <StatBox icon={<span style={{ fontSize:20 }}>🫁</span>} label="SpO2" value={latest?.oxygenLevel} unit="%" color="#25a244" normal="95-100%" />
              <StatBox icon={<FaTint/>} label="Blood Pressure" value={latest?.bloodPressure} unit="mmHg" color="#9c27b0" normal="120/80" />
            </div>

            {/* Charts */}
            <ChartCard title="❤️ Pulse Rate Trend (bpm)">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize:12 }} />
                <YAxis domain={['auto','auto']} tick={{ fontSize:12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="pulse" stroke="#ea4335" fill="#ffebee" strokeWidth={2} name="Pulse (bpm)" dot={{ r:4 }} />
              </AreaChart>
            </ChartCard>

            <ChartCard title="⚖️ Weight Trend (kg)">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize:12 }} />
                <YAxis domain={['auto','auto']} tick={{ fontSize:12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="weight" stroke="#02475e" fill="#e8f3f1" strokeWidth={2} name="Weight (kg)" dot={{ r:4 }} />
              </AreaChart>
            </ChartCard>

            <ChartCard title="🌡️ Temperature Trend (°F)">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize:12 }} />
                <YAxis domain={['auto','auto']} tick={{ fontSize:12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="temperature" stroke="#f7941d" fill="#fff3e0" strokeWidth={2} name="Temperature (°F)" dot={{ r:4 }} />
              </AreaChart>
            </ChartCard>

            <ChartCard title="💉 Blood Pressure Trend (mmHg)">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize:12 }} />
                <YAxis domain={['auto','auto']} tick={{ fontSize:12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="systolic" stroke="#9c27b0" strokeWidth={2} name="Systolic" dot={{ r:4 }} />
                <Line type="monotone" dataKey="diastolic" stroke="#e91e63" strokeWidth={2} name="Diastolic" dot={{ r:4 }} />
              </LineChart>
            </ChartCard>

            <ChartCard title="🫁 Oxygen Level Trend (%)">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize:12 }} />
                <YAxis domain={[90,100]} tick={{ fontSize:12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="oxygen" stroke="#25a244" fill="#e8f5e9" strokeWidth={2} name="SpO2 (%)" dot={{ r:4 }} />
              </AreaChart>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  )
}
export default HealthAnalytics