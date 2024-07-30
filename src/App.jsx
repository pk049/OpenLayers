import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OpenLayersMap from './components/map'
import TextPredictor from './components/text_predictor'


function App() {


  return (
    <>
      <div className='main'>
       <div className='map'><OpenLayersMap/></div>
      </div>
    </>
  )
}

export default App
