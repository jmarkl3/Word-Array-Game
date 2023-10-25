import React, { useRef } from 'react'

function SettingsWindow({close, arrayLength, setArrayLength, arrayDepth, setArrayDepth, speak, setSpeak, setAddWords, addWords, wordSource, setWordSource, wordSources, setWordSources}) {

    const arrayLengthInput = useRef()
    const arrayDepthInput = useRef()
    const speakInput = useRef()
    const wordSourceSelect = useRef()
    function updateSettings(){    
        try{
            let newArrayLength = Number.parseInt(arrayLengthInput.current.value)
            let newArrayDepth = Number.parseInt(arrayDepthInput.current.value)

            setArrayLength(newArrayLength)
            setArrayDepth(newArrayDepth)
        
        }catch{
            console.log("invalid settings inputs")
        }
    }

    const miscWords = useRef()
    const file1000 = useRef()
    const wordsUp = useRef()
    const wordsDr = useRef()
    const namesDr = useRef()
    const names = useRef()
    const numbers = useRef()
    const digits = useRef()
    const letters = useRef()      
    function wordListSourceBoxes(){
        let newWordSourses = {
            miscWords: miscWords.current.checked,
            file1000: file1000.current.checked,
            wordsUp: wordsUp.current.checked,
            wordsDr: wordsDr.current.checked,
            namesDr: namesDr.current.checked,
            names: names.current.checked,
            numbers: numbers.current.checked,
            digits: digits.current.checked,
            letters: letters.current.checked,
        }
        setWordSources(newWordSourses)
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
                <div className='settingsRow' title='If new arrays of words will be added'>
                    Add Words
                    {/* https://www.w3schools.com/howto/howto_css_switch.asp */}
                    <input 
                        type='checkbox' 
                        defaultChecked={addWords} 
                        onClick={(e)=>setAddWords(e.target.checked)}
                    ></input>
                </div>
                <div className='sources'>
                    <h2>
                        Sources: 
                    </h2>
                    <div>
                        Misc Words
                        <input 
                            type='checkbox' 
                            ref={miscWords} 
                            onChange={wordListSourceBoxes} 
                            defaultChecked={wordSources?.miscWords}
                        ></input>
                    </div>
                    <div>
                        File
                        <input 
                            type='checkbox' 
                            ref={file1000} 
                            onChange={wordListSourceBoxes} 
                            defaultChecked={wordSources?.file1000}
                        ></input>
                    </div>
                    <div>
                        Up Words
                        <input 
                            type='checkbox' 
                            ref={wordsUp} 
                            onChange={wordListSourceBoxes} 
                            defaultChecked={wordSources?.wordsUp}
                        ></input>
                    </div>
                    <div>
                        Words Dr
                        <input 
                            type='checkbox' 
                            ref={wordsDr} 
                            onChange={wordListSourceBoxes} 
                            defaultChecked={wordSources?.wordsDr}
                        ></input>
                    </div>
                    <div>
                        Names Dr
                        <input type='checkbox' ref={namesDr} onChange={wordListSourceBoxes} defaultChecked={wordSources?.namesDr}></input>
                    </div>
                    <div>
                        Random Names
                        <input type='checkbox' ref={names} onChange={wordListSourceBoxes} defaultChecked={wordSources?.names}></input>
                    </div>
                    <div>
                        Numbers
                        <input type='checkbox' ref={numbers} onChange={wordListSourceBoxes} defaultChecked={wordSources?.numbers}></input>
                    </div>
                    <div>
                        Digits
                        <input type='checkbox' ref={digits} onChange={wordListSourceBoxes} defaultChecked={wordSources?.digits}></input>
                    </div>
                    <div>
                        Letters
                        <input type='checkbox' ref={letters} onChange={wordListSourceBoxes} defaultChecked={wordSources?.letters}></input>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default SettingsWindow