import React from 'react'

function DescriptionWindow({close}) {
  return (
    <div className='window'>
        <div className='closeButton' onClick={close}>x</div>
        <div>
            <h2>Description</h2>
            <p>The purpose of the game is to build a circuit.</p>
            <iframe></iframe>
        </div>
    </div>
  )
}

export default DescriptionWindow