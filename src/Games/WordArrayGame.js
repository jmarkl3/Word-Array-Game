import { useState, useEffect, useRef } from 'react'
import gear from '../images/gearicon80px.png'
import Charts from '../Components/Charts'
import wordFile from "../Files/1000.txt"
import HintWindow from '../Components/HintWindow'
import { ZAxis } from 'recharts'
import SettingsWindow from '../Components/SettingsWindow'
import podcast from "../Files/podcast.txt"
import tapSound from "../Files/TapSound.mp3"
import bellSound from "../Files/BellSounds.mp3"
import keyboardSound from "../Files/KeyboardClickSound.mp3"
import { type } from '@testing-library/user-event/dist/type'
import DescriptionWindow from '../Components/DescriptionWindow'
import { dateString } from '../functions'

/*

  1) useEffect setUpKeyPress is called 
      listens for spacebar which calls next

  2) when button is pressed start is called
      sets initial time and started flag
      calls startReading

  3) startReading
      creates an array and adds it to the top of the array of arrays with createArray
      sets the index to the top
      sets keyInput flag to false so the input is hidden and the words (first word because index is 0) are shown

  4) on spacebar push 
      next is called

  5) next
      if all words have shown calls startInput to start input mode
      else speaks the word
      and increments wordIndex so the next word is shown

  6) startInput
      setKeyInput(true) so the keyboard shows
      clears and focuses on the input bar

  7) input onChange: checkInputInprocess2
      checks the input words to the expected words
      plays sounds if there is a correct word or the whold array of words is correct
      if input is complete calls a position movement function: oneDepper, oneUp or toReadingMode

  8) toReadingMode
      sets movement flag and adds to itteration cound
      calls startReading (3)

*/

function WordArrayGame() {
    
  // ================================================================================
  // #region variable declarations

  // The 2d array of word arrays
  const [array, setArray] = useState([])  
  // The array with the words to choose from  
  const globalWordArray = useRef(["word"])
  const globalSentenceArray = useRef(["This is a sentence."])

  // Hint window
  const [hintCount, setHintCount ]= useState(3)
  const [showHint, setShowHint] = useState()
  // The current position in the current word array
  const [wordIndex, setWordIndex] = useState(0)
  // The current position in the 2d array
  const [arrayIndex, setArrayIndex] = useState(0)    

  // Dynamic settings
  const [arrayLength, setArrayLength] = useState(4)
  const [arrayDepth, setArrayDepth] = useState(4)
  const [speak, setSpeak] = useState(true)
  const [addWords, setAddWords] = useState(true)
  const [usePrevious, setUsePrevious] = useState(true)
  const [randomPrevious, setRandomPrevious] = useState(true)
  const [confirmationNoise, setConfirmationNoise] = useState(true)

  // Keep track of number in a row for changing difficulty
  const [correctStreak, setCorrectStreak] = useState(0)
  // Number of points earned in this game session
  const [points, setPoints] = useState(0)

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

  // Show or hide windows
  const [showChart, setShowChart] = useState()
  const [showSettings, setShowSettings] = useState()
  const [showDescription, setShowDescriptionWindow] = useState()
  const [rsw, setRsw] = useState(false)


  // ================================================================================
  // Word Lists

  // To add a wordlist: 
  // This File:     string, attribute on wordSourses state, createGlobalWordArray statement, 
  // Settings Page: input checkbox, ref, onChange function
  const [wordSources, setWordSources] = useState({
    miscWords: true,
    file1000: true,
    wordsUp: true,
    wordsDr: true,
    namesDr: false,
    names: false,
    numbers: false,
    digits: false,
    letters: false,
  })
  
  // Word Lists
  let miscWords = "time year people way day man thing woman life child world school family student hand part place palace week company system program question work number night point home water room mother area money story fact month lot right study book eye job word business side kind head house service friend father hour game line member car city community Name team minute idea kid body information parent others level office door health person art history party result change morning reason research girl guy moment air teacher education car value gold baby food plant blue sun moon cloud trees plants electricity computer keyboard mouse book page word symbol hair ability time house water council market city land sea lake ocean sand rocks animals crab goat deer alligator bull team town nature bank paper pen marker club king voice light music field forest mountain valley peak project base love letter capital model machine fire son space plan energy hotel parkingLot meet cup box summer village park garden science picture fish bird oil film addition station window door sound glass software earth fiver sale equipment radio peace teacher culture context weight sex transport cash library phone stone dog cat memory railroad train plane sky wood granite marble winter snow rain hill wind bank museum farm cabinet fridge coffee tea bridge connection air dinner lunch breakfast fruit cantaloupe watermelon potato bright clear happy reach up climb progress grow accept accomplish achieved active "
  // There is a file with 1000 commonn english words
  let wordsUp = "happy climb achieve bright sunny sun shining green travel water gold make create audit clean build meet talk joke laugh plants sky mountains trees rocks open space organize complete system "
  let wordsDr = "blue golden pink pale love pregnant together hold shirt pants dress skirt blanket bed pillow room partner help sit in into insert open egg positive surge disk round plastic fill belly wet drip liquid female woman girl muffin pie shower "
  let namesDr = "Natalie Whittney Tonya Savannah Briana Ashleigh Robbin Bailey Lexi Jodi Kate Melissa Gretchen Summer Pamela Caitlin Summerlyn Venita Tiff Shannon Valeria Kiara Davlin Nichole LeeAndra Sydney Jennifer Erin Ashlyn Kayla Loren Stephanie Jess Elizabeth Kaylee "
  let names = ""
  let letters = "atom bear cockroach dog elephant fire goat hose igloo journal kangaroo lizard monkey neon octopus pussyCat queen riot snake tea up vacuum walrus female male zygote "
  let numbers = "one two three four five six seven eight nine zero "
  let digits = "1 2 3 4 5 6 7 8 9 0 "  


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
  // #endregion variable declarations

  // ================================================================================
  // #region Setup
    useEffect(()=>{    
      loadPoints()
      loadArrays()
    }, [])  

    useEffect(()=>{
      createGlobalWordArray() 
    }, [wordSources])

    async function createGlobalWordArray(){

      var words = ""

      // This one is exclusive, all the others are cumulative
      if(wordSources.podcast){
        await fetch(podcast)
        .then(res => res.text())
        .then(text => {        
          globalSentenceArray.current = stringToSentenceArray(text)
          return          
        })
      }



      if(wordSources.miscWords)
        words += miscWords
      if(wordSources.file1000)
        await fetch(wordFile)
        .then(res => res.text())
        .then(text => {
          words += text+" "
        })      
      if(wordSources.wordsUp)
          words += wordsUp      
      if(wordSources.wordsDr)        
          words += wordsDr      
      if(wordSources.namesDr)        
          words += namesDr
      if(wordSources.names)        
          words += names
      if(wordSources.numbers)        
          words += numbers
      if(wordSources.digits)        
          words += digits
      if(wordSources.letters)        
          words += letters

      // Convert the string to an array 
      globalWordArray.current = wordStringToWordArray(words)

    }

    const loadedLogRef = useRef({})
    const [logObject, setLogObject] = useState({})
    function loadPoints(){

      let loadedPoints = window.localStorage.getItem("Word-Array-Points")

      if(typeof loadedPoints === "string"){
        loadedPoints = JSON.parse(loadedPoints)
        loadedLogRef.current = loadedPoints
        loadPoints = cleanObject(loadedPoints)
        setLogObject(loadedPoints)
      }
      
    }

    // This function is used to correct incorrect log entries
    function cleanObject(pointsObject){
      return pointsObject
      console.log("cleanObject pointsObject: ")
      console.log(pointsObject)

      let tempPointsObject = {}
      Object.entries(pointsObject).forEach(([date, data]) => {
        let tempObject = data
        if(tempObject?.arrayLength == 61)
          tempObject.arrayLength = 7
        tempPointsObject[date] = tempObject
      })

      console.log("cleaned points object")
      console.log(tempPointsObject)

      return tempPointsObject
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
          case 83:
            spellWord()
            break        
        }
      }
    }

    // Used to keep track of the session name based on when the session was started YYYY-MM-DDTHH:MM:SS
    const startTimeRef = useRef()
    // When points are saved this is used as a reference to calculate play time for the session (miliseconds since Jan 1 1970)
    const startMSRef = useRef()
    function setInitialTime(){

      
      let date = new Date()      
      startTimeRef.current = dateString(date)   
      startMSRef.current = date.getTime()       

      // To parse it:
      //let newDate = new Date(startTimeRef.current)

    } 

  // #endregion Setup

  // ================================================================================
  // #region Array Generation

  const sentenceIndex = useRef(0)
  /**
    Called when it starts and also when going back to reading mode after input.

  */  
  function createArray(){
        
    if(wordSources.podcast){

      var newWordsArray = globalSentenceArray.current[sentenceIndex.current].split(" ")
      addAtHead(newWordsArray)
      sentenceIndex.current++
      return
    }

    // The array that will hold the new array of words
    var newWordsArray = []
    // Add from old arrays
    if(usePrevious){
      // console.log("loading previous")
      // look in loaded arrays for an array that has a length that matches arrayLength 
      newWordsArray = loadArrayOfLength(arrayLength)
      if(!newWordsArray)
        newWordsArray = generateRandomWordArray(arrayLength)
    }
    // Create a new array of words
    else{
      // console.log("generating new array")
      // Create a new array and put 10 random words in it
      newWordsArray = generateRandomWordArray(arrayLength)

    }

    if(speak)
      speakWord(newWordsArray[0])  

    // Adds the new word array at the head of the 2d array that holds word arrays
    addAtHead(newWordsArray)
  } 
  function loadArrayOfLength(length){
    let foundArray
    // console.log("loadArrayOfLength length: "+length+" loadedArrays:")
    // console.log(loadedArrays)
    if(loadedArrays && typeof loadedArrays === "object" && Object.entries(loadedArrays).length > 0){
      // console.log("loadArrayOfLength b")
      let randomSkip = Math.floor(Math.random() * Object.entries(loadedArrays).length)
      // console.log("randomSkip: " + randomSkip)
      let c = 0
      Object.entries(loadedArrays).forEach((([date, loadedArrayOfWordArrays]) => {

        // console.log("loadedArrayOfWordArrays")
        // console.log(loadedArrayOfWordArrays)

        // Skip a random number of dates
        if(randomPrevious){
          c++
          if(c < randomSkip) return
        }

        // If an array was found return
        if(foundArray) {
          // console.log("already found an array:")
          // console.log(foundArray)
          return
        }


  
        // Look at each array of words in that data object
        loadedArrayOfWordArrays.forEach(loadedWordArray => {
          // console.log("looking at word array: ")
          // console.log(loadedWordArray)

          // If the length matches what its looking for save it
          if(loadedWordArray.length == length){
            // console.log("found array with matching length:")
            // console.log(loadedWordArray)
            foundArray = [...loadedWordArray]
          }

        })

      }))
      
    }

    // console.log("foundArray")
    // console.log(foundArray)
    // If none was found this will be undefined
    return foundArray

  }
  function generateRandomWordArray(length){
    let newWordsArray = []
    for(var i=0; i<length; i++)
        newWordsArray.push(globalWordArray.current[Math.floor(Math.random() * globalWordArray.current.length)])
    return newWordsArray
  }
  /**
   * Save the array in local storage so it can be used as a starting point later
   */ 
  function saveArray(array){
    // Get them from local storage on startup and put in a variable
    let tempLoadedArrays = {...loadedArrays}
    
    // Add the array to the object and put it in local storage
    tempLoadedArrays[startTimeRef.current] = array

    // console.log("saving arrays:")
    // console.log(tempLoadedArrays)

    window.localStorage.setItem("savedArrays", JSON.stringify(tempLoadedArrays))

  }
  const [loadedArrays, setLoadedArrays] = useState({})
  function loadArrays(){
    let loadedArraysTemp = window.localStorage.getItem("savedArrays")
    if(loadedArraysTemp)
      setLoadedArrays(JSON.parse(loadedArraysTemp))
    
  }

  function wordStringToWordArray(string){
    // Remove new line characters
    let words = string.replaceAll('\n'," ")
    words = words.replaceAll('\r'," ")
    words = words.replaceAll(','," ")
    words = words.replaceAll('.'," ")
    // Remove redundant spaces
    for(let i=0; i<5; i++)
      words = words.replaceAll("  "," ")    
    // Split the string into an array
    var allWords = words.split(" ")

    // allWords.forEach((word, index) => {
    //   if(word.replaceAll(" ", "") === "")
    //     console.log("empty word at index "+index)
    // })

    // Filter out empty string arrays
    allWords = allWords.filter(word => word.replaceAll(" ", "") !== "")
    return allWords
  }
  function stringToSentenceArray(string){
    // remove unwanted substrings from the raw string
    let string2 = string.replaceAll(",", "")    
    string2 = string2.replaceAll("\r", "")
    
    // Split the string into lines
    let lines = string2.split("\n")
    // Filter out the time stamp lines
    lines = lines.filter(line => line[0] !== "[")
    
    // Split each line into sentences and push them to the sentences array
    let sentences = []
    lines.forEach(line => {
      line.split(".").forEach(sentence => {
        sentences.push(sentence)
      })
    })

    // Remove empty sentences
    sentences =  sentences.filter(line => line.replaceAll(" ", "") !== "")

    return sentences

  }

  // #endregion array generation

  // ================================================================================
  // #region Helper functions
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

    // Save the array in local storage for later retrevial
    saveArray(newArray)

    // Put it in the state variable
    setArray(newArray)
  }

  function speakWordFromIndex(index){
    if(!Array.isArray(array[arrayIndex]) || array[arrayIndex].length <= index) return

    // Get the word
    let word = array[arrayIndex][index]

    // Speak it
    speakWord(word)
  }

  function speakWord(word){
    // Make sure there is a word (string or number)
    if(!word) return

    // Create a speech synthesis utterance
    let utterance = new SpeechSynthesisUtterance(word)
    // Use window.speechSynthesis to speak it
    let synth = window.speechSynthesis
    synth.speak(utterance)
  }

  function displayMessage(message){
    document.getElementById("messageDisplay").innerHTML = message
  }
  function getSeconds(){
    var current = new Date()    
    var seconds = current.getSeconds()
    var minutes = current.getMinutes()
    var hours = current.getHours()
    var totalSeconds = (seconds)+(minutes*60)+(hours*3600)
    return totalSeconds
  }
  function showHintFunction(){    

    if(hintCount>0)
      setHintCount(hintCount - 1)

    setShowHint(true)
  }

  const audioRef = useRef()
  function playSound(sound){
    if(!sound) return

    if(!audioRef.current){
      try{
        audioRef.current = new Audio(sound)
      }catch{}
    }
    else
      // If its currently playing try again in a few milliseconds
      if(!audioRef.current.paused){
        setTimeout(() => {
          playSound(sound)
          
        }, 100);
        return
      }
      // If its paused set the new sound
      else
        audioRef.current.setAttribute("src", sound)

    try{
      audioRef.current.play()            
    }catch{}
    
  }

  function spellWord(){
    let wordArray = array[arrayIndex]
    if(!Array.isArray(wordArray)) return

    let word = wordArray[wordIndex]
    if(typeof word !== "string") return

    let letters = word.split("")
    letters.forEach(letter => {
      speakWord(letter)
    })
  }

  // #endregion Helper Functions

  // ================================================================================
  // #region Accuracy Checking: checkInputInprocess2, addPoints, correctStreakAdjuster

  function checkInputInprocess2(input, array){
    

    // Create an array from the input words and compare it to the state array
    let totalWordsInArray = array[arrayIndex].length
    var inputWordsArray = input.split(' ')    
    var wordIndex = 0, correctCount = 0
    inputWordsArray.forEach(word => {
      if(typeof array[arrayIndex][wordIndex] === "string" && typeof word === "string")
        if(array[arrayIndex][wordIndex++].toLowerCase() === word.toLowerCase())
          correctCount++             
    })
    
    // Check to see if there is an additional correct word, if so play the noise
    if(correctCount > correct.correct)
      if(correctCount === totalWordsInArray)
        playSound(bellSound)
      else
        playSound(tapSound)

    // Display the current number of correctly entered words and total entered words every time a letter is input
    setCorrect({correct:correctCount, total:totalWordsInArray})    

    // When we get to the furthest depth set a flag variable that says were on our way back
    //  then start decrementing counter. If flag is set and we get back to top, create new array and reset flag
    // If the number of words input is greater than the number of words in the array, input is complete
    if(inputWordsArray.length > totalWordsInArray){

      addPoints(totalWordsInArray, arrayIndex, correctCount)

      // If the number of correct words equals the number of words in the array it adds to the streak and possibly increaces the difficulty
      if(correctCount == totalWordsInArray)
          correctStreakAdjuster(true)
      else
          correctStreakAdjuster(false)

      // If (still moving deeper) and (next depth is within bounds of array and the max depth setting) we want to ask for the next deeper
      if(!movingShallow && (arrayIndex+1 < array.length) && (arrayIndex+1 < arrayDepth))
        // Sets the depth one deeper and starts input
        oneDeeper()
      // Else sart going more shallow
      else{
        
        // set flag
        setmovingShallow(true)

        // If back at start, make a new array and start reading
        if(arrayIndex<=0){
            toReadingMode()
        }
        // Else read one more shallow
        else
          oneUp()
      }                  
    }            
  }

  function addPoints(words, depth, correctWords){
    let newPoints = (words * (depth + 1)) - (2 * (words - correctWords))
    let currentPoints = points + newPoints
    // Calculate the number of seconds the user has been playing
    let date = new Date()
    let seconds = (date.getTime() - startMSRef.current) / 1000    

    // Save the number of points in the db 
    
    // Get (or create) the log object for this session
    let updatedObject = loadedLogRef.current[startTimeRef.current]
    // If it doesn't yet exist create an empty object
    if(!updatedObject)
      updatedObject = {}
    
    // Update the values
    updatedObject.points = currentPoints
    updatedObject.seconds = seconds
    updatedObject.arrayLength = arrayLength
    
    loadedLogRef.current[startTimeRef.current] = updatedObject
  
    // Set state for display and next save
    setPoints(currentPoints)

    // Put the updated object in local storeage as a string
    window.localStorage.setItem("Word-Array-Points", JSON.stringify(loadedLogRef.current))

  }

  function correctStreakAdjuster(correct){
    if(correct){
        if(correctStreak + 1 >= arrayLength){
            setArrayLength(arrayLength + 1)
            setCorrectStreak(0)
        }else{
            setCorrectStreak(correctStreak + 1) 
        }
    }else{
        setCorrectStreak(0)
    }
  }



  // #endregion 

  // ================================================================================
  // #region Game Position Movement

  function start(){
    setStarted(true)    
    startReading()
    setInitialTime()   
    setStartSeconds(getSeconds())  
  }
  function next(){
    
    // If the game is not started or user is typing return
    if(!started || keyInput)
      return

    // If all words have shown start input mode
    if(wordIndex + 1 == array[arrayIndex].length)
      startInput(0)    
    // If not all of the words have been shown and speak is set to on speak the next word
    else if(speak){
      speakWordFromIndex(wordIndex + 1)
    }
    
    // Increment the wordIndex to see the next word
    setWordIndex(wordIndex + 1)   

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

  function oneDeeper(){

    // Add the current to the log          
    var tempAL = accuracyLog
    tempAL.push("input "+correct.correct+" of "+array[arrayIndex].length+" correctly at depth "+arrayIndex)                                      
    setAccuracyLog(tempAL)

    // Doing this before the set state because it will probably call before state is updated if put after, but not always
    startInput(arrayIndex+1)

    // Go to the next depth level, then start input
    setArrayIndex(arrayIndex + 1)
  }

  function oneUp(){

    // Add the current to the log          
    var tempAL = accuracyLog
    tempAL.push("input "+correct.correct+" of "+array[arrayIndex].length+" correctly at depth "+arrayIndex)                                      
    setAccuracyLog(tempAL)

    // Doing this before the set state because it will probably call before state is updated if put after, but not always
    startInput(arrayIndex-1)

    // Go to the next depth level, then start input
    setArrayIndex(arrayIndex - 1)
  }
  function toReadingMode(){
    
    // Reset the flag variable for the next itteration
    setmovingShallow(false)

    // Update the itteration state (keeps track of how many cycles have been completed)
    setItteration(itteration+1)

    // Go to the next
    startReading()
  }

  function startReading(){    
    // Creates a new word array and adds it to the head of the array of word arrays
    if(addWords)
      createArray()
    
    // Look at the first word in the top word array
    setWordIndex(0)
    setArrayIndex(0)

    // Hide the input display
    setKeyInput(false)

    // Display a message so user knows what to do
    displayMessage("Memorize this list of "+arrayLength+" words. See the next word by pressing the space key.")

    // When user presses spacebar next() will be called from setUpKeyPress
  }
  function startInput(depth){

    // Show the input field and hide the word display
    setKeyInput(true)

    playSound(keyboardSound)

    // Clear the input field and set focus on it so user can type
    document.getElementById("inputField").value = ""
    document.getElementById("inputField").focus()
    
    // Display a message so user knows what to do
    displayMessage("type the "+array[arrayIndex].length+" words in order from the list "+depth+" back")    
    // Now every time input field changes inputChange() will be called

  }



  // #endregion Game Position Movement

  // ================================================================================
  // #region Dev

  function convertLogObject(logObject){
    let convertedLogObject = {}
    Object.entries(logObject).forEach(object => {
      let key = object[0]
      let values = object[1]
      convertedLogObject[key] = values
      if(convertedLogObject[key]?.seconds === convertedLogObject[key]?.points)
        convertedLogObject[key].seconds = (convertedLogObject[key]?.points * 10)

    })
    return convertedLogObject
  }

  function debug(){ 
    console.log("________________________________________")
    console.log("array")
    console.log(array)
    console.log("counter states:")
    console.log("counter "+wordIndex+" index wordIndex "+arrayIndex)
  }
  
  // #endregion

  return (
      <>                  
        {(started && !keyInput) && 
        <div className='wordDisplay'>
          {array[arrayIndex][wordIndex]}
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
          <div id='messageDisplay'>
            
          </div>
        </div>
        <div className='bottomRight'>
            <div className='inlineBlock' title={"Streak: "+correctStreak+". When the streak == the array length, the array length increments."}>
                {correctStreak}
            </div>
            <div className='inlineBlock' title={"Points: "+points+" = sum of Array length * depth - (2 * incorrect)"}>
                {points}
            </div>

        </div>
        {showHint && <HintWindow wordArrays={array} close={()=>setShowHint(false)} hintCount={hintCount}></HintWindow>}        
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
            loadedArrays={loadedArrays}
            setAddWords={setAddWords}
            addWords={addWords}
            usePrevious={usePrevious}
            setUsePrevious={setUsePrevious}
            randomPrevious={randomPrevious}
            setRandomPrevious={setRandomPrevious}
          ></SettingsWindow>
        }
        {showDescription && 
          <DescriptionWindow
            close={()=>setShowDescriptionWindow(false)}
          ></DescriptionWindow>
        }
        <div className='circleButtonHolder'>
          <div className='infoButton'>
            <img src={gear}></img>
            <div className='infoButtonDisplay'>
              <div className='settingsButton' onClick={()=>setShowChart(true)}>Charts</div>
              <div className='settingsButton' onClick={()=>setShowSettings(true)}>Settings</div>
              <div className='settingsButton' onClick={()=>setShowDescriptionWindow(true)}>Description</div>
              <div className='settingsButton' title={hintCount+" hints remaining"} onClick={showHintFunction}>Hint ({hintCount})</div>
            </div>
          </div>
        </div>
      </>
  );
}

export default WordArrayGame;
