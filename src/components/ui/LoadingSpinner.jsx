const LoadingSpinner = ({ size=40, fullPage=false }) => {
  const spinner = (
    <div style={{
      width:size, height:size,
      border:`3px solid #e0e0e0`,
      borderTop:`3px solid #1a73e8`,
      borderRadius:'50%',
      animation:'spin 0.8s linear infinite'
    }} />
  )
  if (fullPage) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
      {spinner}
    </div>
  )
  return <div style={{ display:'flex', justifyContent:'center', padding:40 }}>{spinner}</div>
}
export default LoadingSpinner