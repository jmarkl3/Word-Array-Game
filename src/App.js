import './App.css';
import { useState, useEffect } from 'react'
import WordArrayGame from './Games/WordArrayGame';
import ConnectionArrays from './Games/ConnectionArrays';

function App() {
    
  return (
    <div className="App">
      <div className='appContainer'>
        <WordArrayGame></WordArrayGame>
        {/* <ConnectionArrays></ConnectionArrays> */}
      </div>
    </div>
  );
}

export default App;
