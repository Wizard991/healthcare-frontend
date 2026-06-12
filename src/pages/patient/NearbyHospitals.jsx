import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import Navbar from '../../components/layout/Navbar'
import { FaHospital, FaMapMarkerAlt, FaStar } from 'react-icons/fa'
import { MdMyLocation, MdDirections } from 'react-icons/md'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import toast from 'react-hot-toast'

// Fix default marker icons broken by webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom hospital icon
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Component to fly map to location
const FlyTo = ({ center, zoom }) => {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 14, { duration: 1.5 })
  }, [center])
  return null
}

const NearbyHospitals = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [radius, setRadius] = useState(5000)
  const [mapCenter, setMapCenter] = useState([25.5941, 85.1376]) // Patna default

  const getUserLocation = () => {
    setLocationLoading(true)
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      setLocationLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(loc)
        setMapCenter(loc)
        setLocationLoading(false)
        fetchHospitals(pos.coords.latitude, pos.coords.longitude)
      },
      () => {
        toast.error('Could not get location. Please allow location access.')
        setLocationLoading(false)
      }
    )
  }

  // Fetch using OpenStreetMap Overpass API — completely free
  const fetchHospitals = async (lat, lng) => {
    setLoading(true)
    try {
      const radiusKm = radius
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radiusKm},${lat},${lng});
          way["amenity"="hospital"](around:${radiusKm},${lat},${lng});
          node["amenity"="clinic"](around:${radiusKm},${lat},${lng});
          node["healthcare"="hospital"](around:${radiusKm},${lat},${lng});
        );
        out center;
      `
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      })
      const data = await res.json()

      const results = data.elements
        .filter(el => el.tags?.name)
        .map(el => ({
          id: el.id,
          name: el.tags.name,
          lat: el.lat || el.center?.lat,
          lng: el.lon || el.center?.lon,
          phone: el.tags?.phone || el.tags?.['contact:phone'],
          website: el.tags?.website || el.tags?.['contact:website'],
          address: [
            el.tags?.['addr:street'],
            el.tags?.['addr:city'],
          ].filter(Boolean).join(', '),
          emergency: el.tags?.emergency,
          beds: el.tags?.beds,
          type: el.tags?.amenity || el.tags?.healthcare,
        }))
        .filter(h => h.lat && h.lng)

      setHospitals(results)

      if (results.length === 0) {
        toast('No hospitals found nearby. Try increasing the radius.', { icon: 'ℹ️' })
      } else {
        toast.success(`Found ${results.length} hospitals nearby!`)
      }
    } catch (err) {
      toast.error('Failed to fetch hospitals. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const getDirections = hospital => {
    window.open(
      `https://www.openstreetmap.org/directions?from=${userLocation?.[0]},${userLocation?.[1]}&to=${hospital.lat},${hospital.lng}`,
      '_blank'
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth:1300, margin:'0 auto', padding:'20px' }}>

        {/* Header */}
        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontSize:24, fontWeight:800, display:'flex', alignItems:'center', gap:10 }}>
            <FaHospital color="var(--primary)"/> Nearby Hospitals
          </h1>
          <p style={{ color:'var(--text-light)', marginTop:4 }}>
            Find hospitals and clinics near you — powered by OpenStreetMap (free)
          </p>
        </div>

        {/* Controls */}
        <div className="card" style={{ padding:'16px 20px', marginBottom:16, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <button className="btn btn-primary" onClick={getUserLocation} disabled={locationLoading}>
            <MdMyLocation size={18}/>
            {locationLoading ? 'Getting location...' : 'Use My Location'}
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <label style={{ fontSize:13, fontWeight:600, margin:0 }}>Radius:</label>
            <select value={radius}
              onChange={e => {
                setRadius(Number(e.target.value))
                if (userLocation) fetchHospitals(userLocation[0], userLocation[1])
              }}
              style={{ width:'auto', padding:'8px 12px' }}>
              <option value={1000}>1 km</option>
              <option value={2000}>2 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
              <option value={20000}>20 km</option>
            </select>
          </div>

          {hospitals.length > 0 && (
            <span style={{ fontSize:13, color:'var(--text-light)', marginLeft:'auto' }}>
              Found <strong style={{ color:'var(--primary)' }}>{hospitals.length}</strong> hospitals
            </span>
          )}
        </div>

        {/* Main layout */}
        <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:16, height:'calc(100vh - 300px)', minHeight:520 }}>

          {/* Hospital list */}
          <div style={{ overflowY:'auto', display:'flex', flexDirection:'column', gap:10, paddingRight:4 }}>

            {/* Empty state */}
            {!userLocation && !loading && (
              <div className="card" style={{ padding:40, textAlign:'center' }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🏥</div>
                <h3 style={{ fontWeight:700, marginBottom:8 }}>Find Hospitals Near You</h3>
                <p style={{ color:'var(--text-light)', fontSize:14, marginBottom:20, lineHeight:1.7 }}>
                  Click the button above to detect your location and find hospitals, clinics and medical centers nearby.
                </p>
                <button className="btn btn-primary" onClick={getUserLocation} disabled={locationLoading}>
                  <MdMyLocation/> Detect My Location
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="card" style={{ padding:40, textAlign:'center' }}>
                <div style={{ width:40, height:40, border:'3px solid #e0e0e0', borderTop:'3px solid var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }}/>
                <p style={{ color:'var(--text-light)', fontWeight:500 }}>Searching for hospitals...</p>
                <p style={{ color:'var(--text-light)', fontSize:12, marginTop:6 }}>This may take a few seconds</p>
              </div>
            )}

            {/* Hospital cards */}
            {!loading && hospitals.map((h, i) => (
              <div key={h.id}
                onClick={() => { setSelectedHospital(h); setMapCenter([h.lat, h.lng]) }}
                className="card"
                style={{
                  padding:16, cursor:'pointer', transition:'all 0.2s',
                  border: selectedHospital?.id === h.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: selectedHospital?.id === h.id ? 'var(--primary-light)' : 'white'
                }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  {/* Number badge */}
                  <div style={{ width:32, height:32, borderRadius:8, background:'#ffebee', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:800, color:'#ea4335', fontSize:13 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--text-dark)', marginBottom:4 }}>
                      {h.name}
                    </div>

                    {h.address && (
                      <div style={{ fontSize:12, color:'var(--text-light)', display:'flex', gap:4, alignItems:'flex-start', marginBottom:6 }}>
                        <FaMapMarkerAlt size={11} style={{ marginTop:2, flexShrink:0 }}/>
                        {h.address}
                      </div>
                    )}

                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
                      {h.type && (
                        <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:10, background:'var(--primary-light)', color:'var(--primary)', textTransform:'capitalize' }}>
                          {h.type}
                        </span>
                      )}
                      {h.emergency === 'yes' && (
                        <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:10, background:'#ffebee', color:'#c62828' }}>
                          🚨 Emergency
                        </span>
                      )}
                      {h.beds && (
                        <span style={{ fontSize:11, color:'var(--text-light)', padding:'2px 8px', borderRadius:10, background:'#f5f5f5' }}>
                          🛏 {h.beds} beds
                        </span>
                      )}
                    </div>

                    <div style={{ display:'flex', gap:8 }}>
                      <button className="btn btn-sm"
                        onClick={e => { e.stopPropagation(); getDirections(h) }}
                        style={{ background:'var(--primary)', color:'white', border:'none', display:'flex', alignItems:'center', gap:5, fontSize:12 }}>
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

          {/* Map */}
          <div style={{ borderRadius:12, overflow:'hidden', border:'1px solid var(--border)' }}>
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height:'100%', width:'100%' }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Fly to new center */}
              <FlyTo center={mapCenter} zoom={userLocation ? 14 : 13} />

              {/* User location marker */}
              {userLocation && (
                <>
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <div style={{ fontWeight:700, color:'var(--primary)' }}>📍 Your Location</div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={userLocation}
                    radius={radius}
                    pathOptions={{ color:'#02475e', fillColor:'#02475e', fillOpacity:0.05, weight:1.5, dashArray:'6' }}
                  />
                </>
              )}

              {/* Hospital markers */}
              {hospitals.map((h, i) => (
                <Marker
                  key={h.id}
                  position={[h.lat, h.lng]}
                  icon={hospitalIcon}
                  eventHandlers={{ click: () => setSelectedHospital(h) }}
                >
                  <Popup minWidth={220}>
                    <div style={{ fontFamily:'Segoe UI, sans-serif' }}>
                      <div style={{ fontWeight:700, fontSize:14, marginBottom:6, color:'#1a1a1a' }}>
                        🏥 {h.name}
                      </div>
                      {h.address && (
                        <div style={{ fontSize:12, color:'#767676', marginBottom:6 }}>
                          📍 {h.address}
                        </div>
                      )}
                      {h.emergency === 'yes' && (
                        <div style={{ fontSize:12, color:'#c62828', fontWeight:600, marginBottom:6 }}>
                          🚨 Emergency Services Available
                        </div>
                      )}
                      {h.phone && (
                        <div style={{ fontSize:12, marginBottom:8 }}>
                          📞 <a href={`tel:${h.phone}`}>{h.phone}</a>
                        </div>
                      )}
                      <button
                        onClick={() => getDirections(h)}
                        style={{ background:'#02475e', color:'white', border:'none', borderRadius:6, padding:'6px 12px', fontSize:12, cursor:'pointer', width:'100%', fontWeight:600 }}>
                        Get Directions →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NearbyHospitals