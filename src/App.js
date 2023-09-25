import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import gear from './images/gearicon80px.png'
import WordArrayGame from './Games/WordArrayGame';

function App() {
    
  return (
    <div className="App">
      <div className='appContainer'>
        <WordArrayGame></WordArrayGame>
        <div className='circleButtonHolder'>
          <div className='infoButton'>
            <img src={gear}></img>
            <div className='infoButtonDisplay'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
