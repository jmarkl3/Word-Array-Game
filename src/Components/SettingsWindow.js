import React, { useRef } from 'react'

function SettingsWindow({close, arrayLength, setArrayLength, arrayDepth, setArrayDepth, speak, setSpeak, wordSource, setWordSource}) {

    const arrayLengthInput = useRef()
    const arrayDepthInput = useRef()
    const speakInput = useRef()
    const wordSourceSelect = useRef()
    function updateSettings(){    
        setArrayLength(arrayLengthInput.current.value)
        setArrayDepth(arrayDepthInput.current.value)
    }
    function checkboxFunction(){
        console.log(speakInput.current.checked)
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
                {/* <div className='settingsRow' title='The content that will be loaded into the arrays'>
                    Array Type 
                    <select>
                        <option title="The array will consist of random words">Word Arrays</option>
                        <option title="The array will consist of only numbers">Number Arrays</option>
                        <option title="The array will consist of the words in sentence selected in order from a script">Sentences</option>
                    </select>
                </div> */}
                <div className='settingsRow' title='The source of array content'>
                    Source 
                    <select ref={wordSourceSelect} defaultValue={wordSource} onChange={()=>setWordSource(wordSourceSelect.current.value)}>
                        <option value={"words"}>Words</option>                        
                        <option value={"podcast"}>Podcast</option>                        
                        <option value={"numberWords"} title="Words that represent numbers like fun (for 1) shoe (for 2) and tree (for 3)">Number Words</option>                        
                        <option value={"numbers"} title="Digits like 1 2 3">Numbers</option>                        
                        <option value={"namesDR"} title="Names from the thing">Names DR</option>                        
                        <option value={"namesR"} title="RandomNames">Names R</option>                        
                        {/* https://stackoverflow.com/questions/33614492/wikipedia-api-get-random-pages                */}
                        {/* <option>Random Wikipedia</option>                         */}
                        {/* <option>Movie Script 1</option>                        
                        <option>Word List 1</option>          
                        <option>From Notes App</option>                        
                        <option>Book</option>                         */}
                    </select>
                </div>
                <div className='settingsRow' title='If the words will be spoken'>
                    Speak Words
                    {/* https://www.w3schools.com/howto/howto_css_switch.asp */}
                    <input 
                        type='checkbox' 
                        defaultChecked={speak} 
                        ref={speakInput} 
                        onClick={()=>setSpeak(speakInput.current.checked)}
                    ></input>
                </div>
            </div>
        </div>
    )
}

export default SettingsWindow