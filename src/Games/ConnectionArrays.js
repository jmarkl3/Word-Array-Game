import React, { useEffect, useRef, useState } from 'react'
import gear from "../images/gearicon80px.png"
import { addAtHead } from '../functions'
/*
    User is presented with a word
    they are asked to type 3 words that relate to it (things that it reminds them of)
    then they choose their favorite and repeat the pattern    
    after the first 2 cycles they are asked to recall all previous 

    first word is put into [0][0]
    3 that the user types are put into [1][0,1,2]
    chosen word put into [2][0]
    3 related put into [3][0,1,2]
    asked to recall all so far going back the forward
    then asked to choose favorite, put into [4][0]
    asked to relate 3, put into [5][0,1,2]
    asked to recall so far
    ...

    maybe it can remember connections and add some in randomly

*/
function ConnectionArrays() {

    // 2D array [["word"], ["word", "word", "word"], ...]
    const [array, setArray] = useState([])
    const [wordIndex, setWordIndex] = useState(0)
    const [arrayIndex, setArrayIndex] = useState(0)
    // The message that will display to tell the user what to do
    const [message, setMessage] = useState("")
    const [started, setStarted] = useState("")
    // The game mode: display or input
    const [keyInput, setKeyInput] = useState(false)
    // notStarted, displayWord, inputConnections, inputSelectedWord, inputMemory
    const [mode, setMode] = useState("notStarted")
    const [direction, setDirection] = useState("deeper")
    // Keeping track of things
    const [correct, setCorrect] = useState(0)
    const [points, setPoints] = useState(0)
    const [correctStreak, setCorrectStreak] = useState(false)
    
    const inputField = useRef()

    // ================================================================================
    // #region Setup
    useEffect(()=>{

    },[])
    setUpKeyPress()
    function setUpKeyPress(){
      window.onkeydown=(e)=>{
        //console.log("pressed "+e.keyCode)
        switch(e.keyCode){   
            // Spacebar
            case 32:
                spacebar()
                break    
        // Arrow Right     
        //   case 39:
        //     console.log("space")
        //     next()
        //     break
          case 68:
            debug()
            break        
        //   case 83:
        //     spellWord()
        //     break        
        }
      }
    }

    // #endregion Setup

    // ================================================================================
    // #region Game Start
    function start(){
        // Push an array with one random word
        setArray(addAtHead([randomWord()],array))        

        // The instruction message
        setMessage("Remember this word and press the space bar")

        // Flag to show the game instead of the start button
        setMode("displayWord")

    }
    // #endregion Game Start

    // ================================================================================
    // #region Game Progress        
    
    // How far back the recall is
    const [depth, setDepth] = useState(0)

    function next(){

        // If its displaying a word go to input connectinos mode
        if(mode === "displayWord")
            inputConnections()
        // If finished inputting connections go to input favorite word 
        else if(mode === "inputConnections")
            // When there have only been so many lines skip the recall section
            if(array.length < 3)
                inputFavoriteWord()        
            // Ask the user to recall the previous lines
            else
                recall()
        // If done inputing the favorite word go to input connectinos mode
        else if(mode === "inputSelectedWord")
            inputConnections()
        else if (mode === "inputRecall"){
            
            // If the direction is going deeper
            if(direction === "deeper"){
                // If the depth reaches the array length reverse to going more shallow
                if((depth + 1) >= array.length)
                    setDirection("lessDeep")
                // Otherwise ask the user to recall one leverl deeper
                else
                    recallDeeper()                
            }
            // If the direction is going more shallow
            else{
                // If the depth has gone back to 0 go to the next thing
                if(depth == 0)
                    inputFavoriteWord()
                // Else recall one level closet to the top level
                else
                    recallShallow()
            }
                
        }

    }
    function spacebar(){
        if(mode.includes("input")) return
        next()
    }
    function inputChange(){
        if(!inputField.current) return
        
        let input = inputField.current.value
        if(input.charAt(0) === ' ')
            input = input.slice(1, input.length) 

        checkInputInprocess(input, array)
    }
    function checkInputInprocess(input, array){        
                        

        // Create an array from the input string of words
        let inputWordArray = input.split(" ")   

        // When inputting connections:
        if(mode === "inputConnections"){
            // If more than 3 are entered call next()
            if(inputWordArray.length > 3){                
                setArray(addAtHead(cleanArray(inputWordArray), array))    
                next()
            }
        }

        // When inputting one word when the user has entered a word and presses the spacebar
        else if(mode === "inputSelectedWord"){

            if(inputWordArray.length > 1){
                if(!array[0].includes(inputWordArray[0]))
                    setMessage("The word entered is not contained in the last 3 you entered")
                else{
                    setArray(addAtHead(cleanArray(inputWordArray), array))    
                    next()
                }
            }else{
                setMessage("Please enter your favorite word from the most recent 3")
            }
        }

        // If they are inputting a recall of previous strings
        else if(mode === "inputRecall"){

            // Get the array of words that the user is expected to input
            let correctWordArray = [...array[depth]]

            let tempCorrect = 0
            // Look through each word they did input
            inputWordArray.forEach((inputWord, index) => {
                console.log("comparing " + inputWord + " " + correctWordArray[index], )
                if(inputWord === correctWordArray[index]){
                    console.log("correct")
                    tempCorrect++
                }
            })

            // If they got one correct with the most recent character play a sound
            if(tempCorrect > correct){
                // play correct sound
                console.log("one more correct")
            }
            
            setCorrect(tempCorrect)         

            // If all words at this depth are entered go to the next thing
            if(inputWordArray.length > correctWordArray.length){
                next()
                addPoints()
            }
        }
       
    }

    function inputConnections(){
        setMode("inputConnections")
        setMessage("Type 3 words that the previous word reminds you of")
        if(inputField.current)
            inputField.current.value = ""
    }
    function inputFavoriteWord(){
        setMode("inputSelectedWord")
        setMessage("Type your favorite of the those words")
        if(inputField.current)
            inputField.current.value = ""
            
    }
    // The user will be asked to recall all of the previous words
    function recall(){
        setMode("inputRecall")
        setDirection("deeper")
        setMessage("Re-type the itteration " + depth + " back")
        if(inputField.current)
            inputField.current.value = ""
    }
    function recallDeeper(){
        setMessage("Re-type the itteration " + (depth + 1) + " back")
        setDepth(depth + 1)
        if(inputField.current)
            inputField.current.value = ""
    }
    function recallShallow(){
        setMessage("Re-type the itteration " + (depth - 1) + " back")
        setDepth(depth - 1)
        if(inputField.current)
            inputField.current.value = ""
    }
    // #endregion Game Progress


    // ================================================================================
    // #region Helper Functions
    function randomWord(){
        const wordString = "this is a test of words"
        let wordArray = wordString.split(" ")
        return wordArray[Math.floor(Math.random() * (wordArray.length - 1))]
    }
    function startInputMode(){

    }
    function startDisplayMode(){

    }
    function startMemoryMode(){

    }    
    function startConnectionMode(){

    }
    function checkInput(){
        
    }
    function debug(){
        console.log("========================================")
        console.log("array: ")
        console.log(array)
        console.log("depth: " + depth)
        console.log("mode: " + mode)
        console.log("correct: " + correct)

    } 
    function cleanArray(_array){
        let tempArray = []
        _array.forEach(element => {
            if(typeof element === "string"){
                // If the string is empty don't add it
                let filteredString = element.replaceAll(" ","")
                if(filteredString !== "")
                    tempArray.push(filteredString)
            }
        });
        // Return the array with no empty string values
        return tempArray
    }
    // Put the points for this game into storage     
    function addPoints(){
        // make a clobal function and call it from both, same with sound
        setPoints(points + (correct * (depth + 1)))
        setCorrect(0)
    }
    function checkNWords(){

    }
    // #endregion Game Start

    

    return (
        <>                  
          {(mode === "displayWord") && 
          <div className='wordDisplay'>
            {array[arrayIndex][wordIndex]}
          </div>} 
          {(mode.includes("input")) && 
            <div>
              <input placeholder='Type Here' className='inputBox' autoFocus onChange={inputChange} ref={inputField}/>
              <br></br>
              <br></br>
              <div className='displayItems'>            
                <div className='currentDisplay'>
                  {mode === "inputRecall" && correct + " of " + array[depth].length + " entered correctly & in order"}
                </div>
  
                <div className='lastDisplay'>
  
                </div>              
              </div>
            </div>
          }
          {(mode === "notStarted") && <div className='button buttonBig' onClick={start}>Start</div>}                                
          <div className='messageDisplay'>
            <div id='messageDisplay'>
              {message}
            </div>
          </div>
          <div className='bottomRight'>
              <div className='inlineBlock' title={"Streak: " + correctStreak + ". When the streak == the array length, the array length increments."}>
                  {correctStreak}
              </div>
              <div className='inlineBlock' title={"Points: " + points + " = sum of Array length * depth - (2 * incorrect)"}>
                  {points}
              </div>
  
          </div>
          {/* {showHint && <HintWindow wordArrays={array} close={()=>setShowHint(false)} hintCount={hintCount}></HintWindow>}        
          {showChart && <Charts name={"Word Array Points"} logObject={logObject} close={()=>setShowChart(false)}></Charts>}
          {showSettings && 
            <SettingsWindow 
              close={()=>setShowSettings(false)}
              arrayLength={arrayLength}
              setArrayLength={setArrayLength}
              arrayDepth={arrayDepth}
              setArrayDepth={setArrayDepth}
              speak={speak}
              setSpeak={setSpeak}
              confirmationNoise={confirmationNoise}
              setConfirmationNoise={setConfirmationNoise}                    
              wordSources={wordSources}
              setWordSources={setWordSources}
            ></SettingsWindow>
          }
          {showDescription && 
            <DescriptionWindow
              close={()=>setShowDescriptionWindow(false)}
            ></DescriptionWindow>
          } */}
          <div className='circleButtonHolder'>
            <div className='infoButton'>
              <img src={gear}></img>
              <div className='infoButtonDisplay'>
                {/* <div className='settingsButton' onClick={()=>setShowChart(true)}>Charts</div>
                <div className='settingsButton' onClick={()=>setShowSettings(true)}>Settings</div>
                <div className='settingsButton' onClick={()=>setShowDescriptionWindow(true)}>Description</div>
                <div className='settingsButton' title={hintCount+" hints remaining"} onClick={showHintFunction}>Hint ({hintCount})</div> */}
              </div>
            </div>
          </div>
        </>
    );
}

export default ConnectionArrays 