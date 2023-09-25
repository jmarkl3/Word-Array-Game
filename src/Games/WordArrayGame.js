import { useState, useEffect } from 'react'

function WordArrayGame() {
    
  // The 2d array or word arrays
  const [array, setArray] = useState([])  

  // The current position in the 2d array
  const [count, setCount] = useState(0)
  const [indexCount, setIndexCount] = useState(0)    

  // Settings
  const [arrayLength, setArrayLength] = useState(4)
  const [arrayDepth, setArrayDepth] = useState(4)

  // The game mode
  const [started, setStarted] = useState(false)
  const [keyInput, setKeyInput] = useState(false)  
  
  // The display values
  const [correct, setCorrect] = useState({correct:0, total:0})
  const [time, setTime] = useState({start:"minutes:seconds", end:"minutes:seconds"})

  // Keeping track of things
  const [accuracyLog, setAccuracyLog] = useState(["Accuracy Log", "____________________"])
  const [itteration, setItteration] = useState(0)
  const [startSeconds, setStartSeconds] = useState(0)
  const [movingShallow,setmovingShallow] = useState(false)

  const [rsw, setRsw] = useState(false)

  var infoString = 
  `
    Picture each word, then picture it performing an action on the next word creating a story. 
    The more rediculous the pictures and actions are the better.
    Take your time. Sometimes going fast is going slow.
    Grouping a few words into scenes and putting them into a grid can help. 
    Remembering the first scene of each grid and chaining it together with 
    the first scene of other grids can help you remember more.
    The F11 key will enter or exit full screen.
  `

  // Setup
  useEffect(()=>{
    //createArray()    
  }, [])  
  function createArray(){

    // This is the list of words that the array will select from
    var words = `time year people way day man thing woman life child world school family student hand part place palace week company system program question work number night point home water room mother area money story fact month lot right study book eye job word business side kind head house service friend father hour game line member car city community Name team minute idea kid body information parent others level office door health person art history party result change morning reason research girl guy moment air teacher education car value gold baby food plant blue sun moon cloud trees plants electricity computer keyboard mouse book page word symbol hair ability time house water council market city land sea lake ocean sand rocks animals crab goat deer alligator bull team town nature bank paper pen marker club king voice light music field forest mountain valley peak project base love letter capital model machine fire son space plan energy hotel parkingLot meet cup box summer village park garden science picture fish bird oil film addition station window door sound glass software earth fiver sale equipment radio peace teacher culture context weight sex transport cash library phone stone dog cat memory railroad train plane sky wood granite marble winter snow rain hill wind bank museum farm cabinet fridge coffee tea bridge connection air dinner lunch breakfast fruit cantelope watermelon potato bright clear happy reach up climb progress grow accept accomplish achieved active`    
    
    
    words += 
    `
    atom
    bear
    cockroach
    dog
    elephant
    fire
    goat
    hose
    igloo
    journal
    kangaroo
    lizard
    monkey
    neon
    octapus
    pussyCat
    queen
    riot
    snake
    tea
    up
    vacuum
    walrus
    egg
    sperm
    zygote
    `
    words += 
    `
    gum
    shoe
    tree
    door
    hive
    kicks
    snow
    ate
    vine
    `

    words = words.replaceAll('\n'," ")
    words = words.replaceAll("  "," ")
    words = words.replaceAll("  "," ")
    words = words.replaceAll("  "," ")


    var allWords = words.split(" ")
    allWords = allWords.filter(word => word.replaceAll(" ", "") !== "")

    // Create a new array and put 10 random words in it
    var newWordsArray = []
    for(var i=0; i<arrayLength; i++)
      newWordsArray.push(allWords[Math.floor(Math.random() * allWords.length)])

    // Adds the new word array at the head of the 2d array that holds word arrays
    addAtHead(newWordsArray)
  }  
  function debug(){
    console.log("________________________________________")
    console.log("array")
    console.log(array)
    console.log("counter states:")
    console.log("counter "+count+" index count "+indexCount)
  }
  setUpKeyPress()
  function setUpKeyPress(){
    window.onkeydown=(e)=>{
      //console.log("pressed "+e.keyCode)
      switch(e.keyCode){        
        case 39:
          next()
          break
        case 32:
          next()
          break    
        case 68:
          //debug()
          break        
      }
    }
  }

  // Called on key or button press
  function start(){
    setStarted(true)    
    startReading()
    setStartSeconds(getSeconds())
  }
  function next(){
    
    // If the game is not started or user is typing return
    if(!started || keyInput)
      return

    // Increment the count to see the next word
    setCount(count+1)          

    // If all words have shown start input mode
    if(count+1 == array[indexCount].length)
      startInput(0)    
    

  }
  function inputChange(){        

    // Only check if the game has been started and user is typing
    if(!started || !keyInput)
      return    

    // Get the input string
    var input = document.getElementById("inputField").value

    // If there is a space at the beginning ignore it
    if(input.charAt(0) === ' ')
      input = input.slice(1, input.length)    
     
    // Check the input to see if it is complete and display number correct
    checkInputInprocess2(input, array)


  }
  function saveSettings(){
    
    // Get input values
    var arrayDepthInputValue = document.getElementById("arrayDepthInput").value
    var arrayLengthInputValue = document.getElementById("arrayLengthInput").value
    
    // Get current values
    var arrayDepthTemp = arrayDepth
    var arrayLengthTemp = arrayLength
    
    // Try to make numbers from the inputs
    try{arrayDepthTemp =  Number(arrayLengthInputValue)}catch{}
    try{arrayLengthTemp =  Number(arrayLengthInputValue)}catch{}

    // Save values in state
    setArrayDepth(arrayDepthTemp)
    setArrayLength(arrayLengthTemp)
  }

  // Helper functions
  function addAtHead(wordArray){
    
    // Create an array of the appropriate length and a counter
    var newArray = new Array(array.length+1)    
    var c = 0

    // Add the new word array to the beginning
    newArray[c++] = wordArray

    // Add all of the previous word arrays after it
    array.forEach(wordArray =>{
      newArray[c++] = wordArray
    })

    // Put it in the state variable
    setArray(newArray)
  }
  function startReading(){    
    // Creates a new word array and adds it to the head of the array of word arrays
    createArray()
    
    // Look at the first word in the top word array
    setCount(0)
    setIndexCount(0)

    // Hide the input display
    setKeyInput(false)

    // Display a message so user knows what to do
    displayMessage("Memorize this list of "+arrayLength+" words. See the next word by pressing the space key.")

    // When user presses spacebar next() will be called from setUpKeyPress
  }
  function startInput(depth){

    // Show the input field and hide the word display
    setKeyInput(true)

    // Clear the input field and set focus on it so user can type
    document.getElementById("inputField").value = ""
    document.getElementById("inputField").focus()
    
    // Display a message so user knows what to do
    displayMessage("type the "+array[indexCount].length+" words in order from the list "+depth+" back")    
    // Now every time input field changes inputChange() will be called

  }
  function checkInputInprocess2(input, array){
    
    console.log("in input inprocess 2")

    // Create an array from the input words and compare it to the state array
    var inputWordsArray = input.split(' ')    
    var count = 0, correctCount = 0
    inputWordsArray.forEach(word=>{
      if(array[indexCount][count++] === word)
      correctCount++          
    })
    
    // Display the current number of correctly entered words and total entered words every time a letter is input
    setCorrect({correct:correctCount, total:array[indexCount].length})    

    // When we get to the furthest depth set a flag variable that says were on our way back
    //  then start decrementing counter. If flag is set and we get back to top, create new array and reset flag

    // if(!goingUp && inputWordsArray.length > array[indexCount].length) (if nedt depth is within bounds of array)         
      // if in bounds
        // go deeper
      // else
        // set flag and go one more shallow      
    // else
      // if depth != 0
        // set flag so we know not to go into section above this
        // go one level more shallow
      // if depth is 0 create a new array and start reading mode
      

    // If the number of words input is greater than the number of words in the array, input is complete
    if(inputWordsArray.length > array[indexCount].length){
      console.log("checked array length")
      // If (still moving deeper) and (next depth is within bounds of array and the max depth setting) we want to ask for the next deeper
      if(!movingShallow && (indexCount+1 < array.length) && (indexCount+1 < arrayDepth))
        // Sets the depth one deeper and starts input
        oneDeeper()
      // Else sart going more shallow
      else{
        
        // set flag
        setmovingShallow(true)

        // If back at start, make a new array and start reading
        if(indexCount<=0)
          toReadingMode()
        // Else read one more shallow
        else
          oneUp()
      }                  
    }            
  }
  function checkInputInprocess(input, array){

    // Create an array from the input words and compare it to the state array
    var inputWordsArray = input.split(' ')    
    var count = 0, correct = 0
    inputWordsArray.forEach(word=>{
      if(array[indexCount][count++] === word)
        correct++          
      })
      
      // When we get to the furthest depth set a flag variable that says were on our way back
      //  then start decrementing counter. If flag is set and we get back to top, create new array and reset flag

      // if(!goingUp && inputWordsArray.length > array[indexCount].length) (if nedt depth is within bounds of array)         
        // if in bounds
          // go deeper
        // else
          // set flag and go one more shallow      
      // else
        // if depth != 0
          // set flag so we know not to go into section above this
          // go one level more shallow
        // if depth is 0 create a new array and start reading mode
        

      // If the number of words input is greater than the number of words in the array, input is complete
      if(inputWordsArray.length > array[indexCount].length)
        
        // If then next depth is within bounds of array and set max depth we want to ask about it
        if((indexCount+1 < array.length) && indexCount+1 < arrayDepth){
          
          // Add the current to the log          
          var tempAL = accuracyLog
          tempAL.push("input "+correct.correct+" of "+array[indexCount].length+" correctly at depth "+indexCount)                                      
          setAccuracyLog(tempAL)

          // Doing this before the set state because it will probably call before state is updated if put after, but not always
          startInput(indexCount+1)

          // Go to the next depth level, then start input
          setIndexCount(indexCount + 1)
        }
        // If all arrays have been input start reading next array
        else{
          
          // Add the current accuracy record to the log then denote the end of this section with a line          
          var tempAL = accuracyLog
          tempAL.push("input "+correct.correct+" of "+array[indexCount].length+" correctly at depth "+indexCount)                            
          // Pushing onto array with itteration+1 then updating state after
          tempAL.push("itteration "+(itteration+1)+" complete")     
          tempAL.push(" "+(getSeconds()-startSeconds)+" seconds since game start")
          tempAL.push("( "+((getSeconds()-startSeconds)/(itteration+1))+" seconds per itteration)")                     
          tempAL.push("____________________")  
          setAccuracyLog(tempAL)
          
          // Update the itteration state (keeps track of how many cycles have been completed)
          setItteration(itteration+1)

          // Go to the next
          startReading()
        }      

    // Display the current number of correctly entered words and total entered words
    setCorrect({correct:correct, total:array[indexCount].length})
  }
  function oneDeeper(){

    console.log("going one deeper")

    // Add the current to the log          
    var tempAL = accuracyLog
    tempAL.push("input "+correct.correct+" of "+array[indexCount].length+" correctly at depth "+indexCount)                                      
    setAccuracyLog(tempAL)

    // Doing this before the set state because it will probably call before state is updated if put after, but not always
    startInput(indexCount+1)

    // Go to the next depth level, then start input
    setIndexCount(indexCount + 1)
  }
  function oneUp(){

    console.log("going one up")

    // Add the current to the log          
    var tempAL = accuracyLog
    tempAL.push("input "+correct.correct+" of "+array[indexCount].length+" correctly at depth "+indexCount)                                      
    setAccuracyLog(tempAL)

    // Doing this before the set state because it will probably call before state is updated if put after, but not always
    startInput(indexCount-1)

    // Go to the next depth level, then start input
    setIndexCount(indexCount - 1)
  }
  function toReadingMode(){

    console.log("going to reading mode")

    // Add the current accuracy record to the log then denote the end of this section with a line          
    var tempAL = accuracyLog
    tempAL.push("input "+correct.correct+" of "+array[indexCount].length+" correctly at depth "+indexCount)                                
    tempAL.push(" ")
    tempAL.push(" "+(getSeconds()-startSeconds)+"seconds since game start:")
    tempAL.push(((getSeconds()-startSeconds)/(itteration+1))+" seconds per itteration: ")     
    tempAL.push(" ")
    tempAL.push("itteration "+(itteration+1)+" complete")         
    tempAL.push("____________________")  
    setAccuracyLog(tempAL)
    
    // Reset the flag variable for the next itteration
    setmovingShallow(false)

    // Update the itteration state (keeps track of how many cycles have been completed)
    setItteration(itteration+1)

    // Go to the next
    startReading()
  }

  function displayResults(){

  }
  function displayMessage(message){
    document.getElementById("messageDisplay").innerHTML = message
  }
  function repeatInput(){
        // Clear input
        document.getElementById("inputField").value = ""

        // Show message
        displayMessage("enter it in again")
  }
  function getMiliseconds(){
    // Returns the miliseconds since the day started
    var current = new Date()
    var milliseconds = current.getMilliseconds()
    var seconds = current.getSeconds()
    var minutes = current.getMinutes()
    var hours = current.getMinutes()
    var totalMs = milliseconds + (seconds*1000)+(minutes*60000)+(hours*3600000)
    return totalMs
  }
  function getSeconds(){
    var current = new Date()    
    var seconds = current.getSeconds()
    var minutes = current.getMinutes()
    var hours = current.getHours()
    var totalSeconds = (seconds)+(minutes*60)+(hours*3600)
    return totalSeconds
  }
  function getTimeString(){
    var current = new Date()    
    // -startSeconds
    return current.getHours() + ":" + current.getMinutes + ":" + current.getSeconds
  }
  //convertString()
  function convertString(){
//     var wordString = 
//     `
//     time year people way day man thing woman life child world school family student hand part place palace week company system program question work number night point home water room mother area money story fact month lot right study book eye job word business side kind head house service friend father hour game line member car city community Name team minute idea kid body information parent others level office door health person art history party result change morning reason research girl guy moment air teacher education

// car
// value
// gold
// baby
// food
// plant
// blue
// sun
// moon
// cloud
// trees
// plants
// electricity
// computer
// keyboard 
// mouse
// book
// page
// word
// symbol
// hair
// ability
// time
// house
// water
// council
// market
// city
// land
// sea
// lake
// ocean 
// sand 
// rocks
// animals
// crab
// goat 
// deer
// aligator
// bull
// team
// town
// nature
// bank
// paper
// pen
// marker
// club
// king
// voice
// light
// music
// field
// forest
// mountain
// valley
// peak
// project
// base
// love
// letter
// capital
// model
// machine
// fire
// son
// space
// plan
// energy
// hotel
// parkingLot
// meet
// cup
// box
// summer
// village
// park
// garden
// science
// picture
// fish
// bird
// oil
// film
// addition
// station
// window
// door
// sound
// glass
// software
// earth 
// fiver
// canyom
// sale
// equiptment
// radio
// peace
// teacher
// culture
// context
// weight
// sex
// transport
// cash
// library
// phone
// stone
// dog
// cat
// memory
// railroad
// train
// plane
// sky
// wood 
// granite
// marble
// winter
// snow
// rain
// hill
// wind
// bank
// museum
// farm
// cabinet
// fridge
// coffee
// tea
// bridge
// connection
// air
// dinner
// lunch
// breakfast
// fruit
// cantelope
// watermelon
// potato



// bright
// clear
// happy


// reach
// up
// climb
// progress
// grow
// accept
// accomplish
// achieved
// active



//     `
    var wordString = 
    `
    atom
    bear
    cockroach
    dog
    elephant
    fire
    goat
    hose
    igloo
    journal
    kangaroo
    lizard
    monkey
    neon
    octapus
    pussyCat
    queen
    riot
    snake
    tea
    up
    vacuum
    walrus
    egg
    sperm
    zygote
    `
    wordString = wordString.replaceAll('\n'," ")
    wordString = wordString.replaceAll("  "," ")
    wordString = wordString.replaceAll("  "," ")
    wordString = wordString.replaceAll("  "," ")
    console.log(wordString)

    // var wordsStringArray = wordString.split(' ')
    // var alternator = false
    // var wordsNoNumbers = ""
    //wordsStringArray.forEach(word =>{
      //if(alternator)
        //wordsNoNumbers+=" "+word
      //alternator = !alternator
    //})
    //console.log(wordsNoNumbers)
  }
  function openRSW(){
    setRsw(true)
  }
  function closeRSW(){
    setRsw(false)
  }
  return (
      <>                  
        {(started && !keyInput) && 
        <div className='wordDisplay'>
          {array[indexCount][count]}
        </div>} 
        {(started && keyInput) && 
          <div>
            <input id='inputField' placeholder='Type Here' className='inputBox' autoComplete="off" onChange={inputChange}></input>
            <br></br>
            <br></br>
            <div className='displayItems'>            
              <div className='currentDisplay'>
                {correct.correct + " of "+correct.total+" entered correctly & in order"}
              </div>

              <div className='lastDisplay'>
                
              </div>              
            </div>
          </div>
        }
        {!started && <div className='button buttonBig' onClick={start}>Start</div>}                                
        {false && <img src={require("./images/gearicon80px.png")} className='messageDisplay' style={{height:"20px", objectFit:"contain"}}></img>}
        <div className='messageDisplay'>
          <div id='messageDisplay'></div>
          
        </div>
        {/* <div className='circleButtonHolder'>
          <div className='infoButton'>
            ?
            <div className='infoButtonDisplay width300'>
              {infoString}
            </div>            
          </div>
          <div className='infoButton'>
            H
            <div className='infoButtonDisplay'>
              {array.length>0 && array[indexCount][0]}
            </div>            
          </div>
          <div className='infoButton'>
            S
            <div className='infoButtonDisplay width300'>
              Settings
              
              <br></br>
              Ask about previous
               arrays
              <input type={"radio"}></input>
              
              <br></br>
              Auto increace array lengths
              <input type={"radio"}></input>

              <br></br>
              Word array length
              <input id='arrayLengthInput'></input>
              
              <br></br>
              Previous array depth
              <input id='arrayDepthInput'></input>
              
              <br></br>
              <button onClick={saveSettings}>Save</button>
            </div>            
          </div>
          <div className='infoButton'>
            A
            <div className='infoButtonDisplay width300'>
              {accuracyLog.map((line, index)=>(
                <div key={"accuracyLine"+index}>
                  {line}
                  <br></br>
                </div>
              ))}
              <br></br>
            </div>            
          </div>
        </div> */}
      </>
  );
}

export default WordArrayGame;
