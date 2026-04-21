import React from "react"
import Map from './components/Map'
import OnlineStatus from './components/OnlineStatus'

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Map />
      <OnlineStatus /> 
    </div>
  )
}

export default App