import Navbar from './Navbar'
import Sidebar from './Sidebar'

const DashboardLayout = ({ children }) => (
  <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
    <Navbar />
    <div style={{ display:'flex' }}>
      <Sidebar />
      <main style={{ flex:1, padding:28, minHeight:'calc(100vh - 64px)', overflow:'auto' }}>
        {children}
      </main>
    </div>
  </div>
)
export default DashboardLayout