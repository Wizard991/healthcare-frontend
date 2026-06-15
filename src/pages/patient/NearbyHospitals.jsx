import { useEffect, useRef, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { FaHospital, FaMapMarkerAlt } from 'react-icons/fa'
import { MdMyLocation, MdDirections } from 'react-icons/md'
import toast from 'react-hot-toast'

const NearbyHospitals = () => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [radius, setRadius] = useState(5000)
  const [leafletReady, setLeafletReady] = useState(false)

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if (window.L) { setLeafletReady(true); return }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => setLeafletReady(true)
    script.onerror = () => toast.error('Failed to load map library')
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstanceRef.current) return
    const L = window.L

    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    const map = L.map(mapRef.current).setView([25.5941, 85.1376], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map
  }, [leafletReady])

  const getUserLocation = () => {
    setLocationLoading(true)
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      setLocationLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setUserLocation([lat, lng])
        setLocationLoading(false)

        if (mapInstanceRef.current && window.L) {
          const L = window.L
          mapInstanceRef.current.setView([lat, lng], 14)

          const userIcon = L.divIcon({
            html: `<div style="width:16px;height:16px;border-radius:50%;background:#1e3a5f;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
            iconSize: [16, 16], iconAnchor: [8, 8], className: ''
          })
          L.marker([lat, lng], { icon: userIcon }).addTo(mapInstanceRef.current).bindPopup('<strong>📍 Your Location</strong>')

          L.circle([lat, lng], {
            radius, color:'#1e3a5f', fillColor:'#1e3a5f', fillOpacity:0.05, weight:1.5, dashArray:'6'
          }).addTo(mapInstanceRef.current)
        }
        fetchHospitals(lat, lng)
      },
      () => { toast.error('Could not get location. Please allow location access.'); setLocationLoading(false) }
    )
  }

  const fetchHospitals = async (lat, lng) => {
    setLoading(true)
    try {
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          node["amenity"="clinic"](around:${radius},${lat},${lng});
          node["healthcare"="hospital"](around:${radius},${lat},${lng});
        );
        out center;
      `
      const res = await fetch('https://overpass-api.de/api/interpreter', { method:'POST', body: query })
      const data = await res.json()

      const results = data.elements
        .filter(el => el.tags?.name)
        .map(el => ({
          id: el.id,
          name: el.tags.name,
          lat: el.lat || el.center?.lat,
          lng: el.lon || el.center?.lon,
          phone: el.tags?.phone || el.tags?.['contact:phone'],
          address: [el.tags?.['addr:street'], el.tags?.['addr:city']].filter(Boolean).join(', '),
          emergency: el.tags?.emergency,
          beds: el.tags?.beds,
          type: el.tags?.amenity || el.tags?.healthcare,
        }))
        .filter(h => h.lat && h.lng)

      setHospitals(results)
      plotMarkers(results)

      if (results.length === 0) toast('No hospitals found. Try increasing radius.', { icon:'ℹ️' })
      else toast.success(`Found ${results.length} hospitals!`)
    } catch { toast.error('Failed to fetch hospitals') }
    finally { setLoading(false) }
  }

  const plotMarkers = (results) => {
    if (!mapInstanceRef.current || !window.L) return
    const L = window.L

    const redIcon = L.divIcon({
      html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#2563eb;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);transform:rotate(-45deg)"></div>`,
      iconSize:[28,28], iconAnchor:[14,28], className:''
    })

    results.forEach(h => {
      L.marker([h.lat, h.lng], { icon: redIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="font-family:Inter,Segoe UI,sans-serif;min-width:180px">
            <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#1e3a5f">🏥 ${h.name}</div>
            ${h.address ? `<div style="font-size:12px;color:#64748b;margin-bottom:6px">📍 ${h.address}</div>` : ''}
            ${h.emergency === 'yes' ? `<div style="font-size:12px;color:#ef4444;font-weight:600;margin-bottom:6px">🚨 Emergency Available</div>` : ''}
            ${h.phone ? `<div style="font-size:12px;margin-bottom:8px">📞 ${h.phone}</div>` : ''}
            <a href="https://www.openstreetmap.org/directions?to=${h.lat},${h.lng}" target="_blank"
              style="display:block;background:#1e3a5f;color:white;text-align:center;padding:8px;border-radius:8px;font-size:12px;text-decoration:none;font-weight:700">
              Get Directions →
            </a>
          </div>
        `)
    })
  }

  const getDirections = (h) => {
    const from = userLocation ? `${userLocation[0]},${userLocation[1]}` : ''
    window.open(`https://www.openstreetmap.org/directions?from=${from}&to=${h.lat},${h.lng}`, '_blank')
  }

  const focusHospital = (h) => {
    setSelectedHospital(h)
    if (mapInstanceRef.current) mapInstanceRef.current.flyTo([h.lat, h.lng], 16, { duration: 1 })
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1240, margin:'0 auto', padding:'32px 24px' }}>

        <div style={{ marginBottom:20 }}>
          <h1 className="section-title" style={{ fontSize:28, display:'flex', alignItems:'center', gap:10 }}>
            <FaHospital color="var(--accent)"/> Nearby Hospitals
          </h1>
          <p className="section-sub">Find hospitals and clinics near you — powered by OpenStreetMap</p>
        </div>

        <div className="card" style={{ padding:'18px 22px', marginBottom:16, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <button className="btn btn-accent" onClick={getUserLocation} disabled={locationLoading || !leafletReady}>
            <MdMyLocation size={18}/>
            {!leafletReady ? 'Loading map...' : locationLoading ? 'Getting location...' : 'Use My Location'}
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <label style={{ fontSize:13, fontWeight:700, margin:0 }}>Radius:</label>
            <select value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ width:'auto', padding:'10px 14px' }}>
              <option value={1000}>1 km</option>
              <option value={2000}>2 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
              <option value={20000}>20 km</option>
            </select>
          </div>

          {hospitals.length > 0 && (
            <span style={{ fontSize:13, color:'var(--text-mid)', marginLeft:'auto' }}>
              Found <strong style={{ color:'var(--primary)' }}>{hospitals.length}</strong> hospitals
            </span>
          )}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'380px 1fr', gap:16, height:'calc(100vh - 320px)', minHeight:520 }}>

          <div style={{ overflowY:'auto', display:'flex', flexDirection:'column', gap:10, paddingRight:4 }}>
            {!userLocation && !loading && (
              <div className="card" style={{ padding:40, textAlign:'center' }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🏥</div>
                <h3 style={{ fontWeight:800, marginBottom:8, color:'var(--primary)' }}>Find Hospitals Near You</h3>
                <p style={{ color:'var(--text-mid)', fontSize:14, marginBottom:20, lineHeight:1.7 }}>
                  Click the button above to detect your location and find hospitals, clinics and medical centers nearby.
                </p>
                <button className="btn btn-accent" onClick={getUserLocation} disabled={locationLoading}>
                  <MdMyLocation/> Detect My Location
                </button>
              </div>
            )}

            {loading && (
              <div className="card" style={{ padding:40, textAlign:'center' }}>
                <div style={{ width:40, height:40, border:'3px solid #e5e7eb', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }}/>
                <p style={{ color:'var(--text-mid)', fontWeight:600 }}>Searching for hospitals...</p>
                <p style={{ color:'var(--text-light)', fontSize:12, marginTop:6 }}>This may take a few seconds</p>
              </div>
            )}

            {!loading && hospitals.map((h, i) => (
              <div key={h.id} onClick={() => focusHospital(h)} className="card"
                style={{
                  padding:16, cursor:'pointer', transition:'all 0.2s',
                  border: selectedHospital?.id === h.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: selectedHospital?.id === h.id ? 'var(--primary-light)' : 'white'
                }}>
                <div style={{ display:'flex', gap:12 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:800, color:'#ef4444', fontSize:13 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, fontSize:14, color:'var(--primary)', marginBottom:4 }}>{h.name}</div>
                    {h.address && (
                      <div style={{ fontSize:12, color:'var(--text-light)', display:'flex', gap:4, marginBottom:6 }}>
                        <FaMapMarkerAlt size={11} style={{ marginTop:2, flexShrink:0 }}/> {h.address}
                      </div>
                    )}
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                      {h.type && <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:10, background:'var(--primary-light)', color:'var(--primary)' }}>{h.type}</span>}
                      {h.emergency === 'yes' && <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:10, background:'#fef2f2', color:'#ef4444' }}>🚨 Emergency</span>}
                      {h.beds && <span style={{ fontSize:11, padding:'3px 10px', borderRadius:10, background:'var(--bg-soft)', color:'var(--text-mid)' }}>🛏 {h.beds} beds</span>}
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button className="btn btn-sm" onClick={e => { e.stopPropagation(); getDirections(h) }} style={{ background:'var(--primary)', color:'white', border:'none', display:'flex', alignItems:'center', gap:5, fontSize:12 }}>
                        <MdDirections size={14}/> Directions
                      </button>
                      {h.phone && (
                        <a href={`tel:${h.phone}`} onClick={e => e.stopPropagation()}>
                          <button className="btn btn-sm btn-outline" style={{ fontSize:12 }}>📞 Call</button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderRadius:18, overflow:'hidden', border:'1px solid var(--border)' }}>
            <div ref={mapRef} style={{ width:'100%', height:'100%' }} />
            {!leafletReady && (
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-soft)', flexDirection:'column', gap:12 }}>
                <div style={{ width:40, height:40, border:'3px solid #e5e7eb', borderTop:'3px solid var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                <p style={{ color:'var(--text-mid)', fontSize:14 }}>Loading map...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default NearbyHospitals

