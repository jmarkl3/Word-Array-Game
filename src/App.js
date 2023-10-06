import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import gear from './images/gearicon80px.png'
import WordArrayGame from './Games/WordArrayGame';
import ConnectionArrays from './Games/ConnectionArrays';

function App() {
    
  return (
    <div className="App">
      <div className='appContainer'>
        {/* <WordArrayGame></WordArrayGame> */}
        <ConnectionArrays></ConnectionArrays>
      </div>
    </div>
  );
}

export default App;
