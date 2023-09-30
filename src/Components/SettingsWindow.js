import React, { useRef } from 'react'

function SettingsWindow({close, arrayLength, setArrayLength, arrayDepth, setArrayDepth}) {
  
    console.log("close")
    console.log(close)

    const arrayLengthInput = useRef()
    const arrayDepthInput = useRef()
    function updateSettings(){    
        setArrayLength(arrayLengthInput.current.value)
        setArrayDepth(arrayDepthInput.current.value)

    }

    return (
        <div className='window'>
            <div className='closeButton' onClick={close}>x</div>
            <h2>Settings</h2>
            <div className='settingsArea'>
                <div className='settingsRow' title="How many words are in the word array">
                    Word Array Length
                    <input ref={arrayLengthInput} onChange={updateSettings} defaultValue={arrayLength}></input>
                </div>
                <div className='settingsRow' title='How many rows back the game will ask the user to remember'>
                    Array Depth 
                    <input ref={arrayDepthInput} onChange={updateSettings} defaultValue={arrayDepth}></input>
                </div>
            </div>
        </div>
    )
}

export default SettingsWindow