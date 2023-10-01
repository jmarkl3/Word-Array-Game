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
                <div className='settingsRow'>
                    Game Type 
                    <select>
                        <option>Word Arrays</option>                        
                    </select>
                </div>
                <div className='settingsRow' title='The content that will be loaded into the arrays'>
                    Array Type 
                    <select>
                        <option title="The array will consist of random words">Word Arrays</option>
                        <option title="The array will consist of only numbers">Number Arrays</option>
                        <option title="The array will consist of the words in sentence selected in order from a script">Sentences</option>
                    </select>
                </div>
                <div className='settingsRow' title='The source of array content'>
                    Source 
                    <select>
                        <option>Movie Script 1</option>                        
                        <option>Word Array 1</option>                        
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SettingsWindow