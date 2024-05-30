import { useState } from 'react'
import './App.css'

import { Chessboard } from 'react-chessboard'

function App() {
  return (
    <div style={{ height: "300", width: "300px" }}>
      <Chessboard id="BasicBoard" />
    </div>
  );
}

export default App
