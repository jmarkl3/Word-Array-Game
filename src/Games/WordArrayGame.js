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

function WordArrayGame() {
    
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
  const [confirmationNoise, setConfirmationNoise] = useState(true)
  const [wordSource, setWordSource] = useState("words")

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
    loadPoints()
  }, [])  

  useEffect(()=>{
    createGlobalWordArray() 
    console.log("wordSource:")
    console.log(wordSource)
  }, [wordSource])

  // Used to keep track of the session name based on when the session was started YYYY-MM-DDTHH:MM:SS
  const startTimeRef = useRef()
  // When points are saved this is used as a reference to calculate play time for the session (miliseconds since Jan 1 1970)
  const startMSRef = useRef()
  function setInitialTime(){

    
    let date = new Date()
    startTimeRef.current = date.getFullYear() + "-" + 
      (date.getMonth() + 1).toString().padStart(2, "0") + 
      "-" + date.getDate().toString().padStart(2, "0") + 
      "T" + date.getHours().toString().padStart(2, "0") + ":" + 
      date.getMinutes().toString().padStart(2, "0") + ":" + 
      date.getSeconds().toString().padStart(2, "0")    

      startMSRef.current = date.getTime()       

    // To parse it:
    //let newDate = new Date(startTimeRef.current)

  }  
  // Creates an array of objects with date and points to be given to a recharts chart
  const datePointArrayRef = useRef()
  const [datePointArray, setDatePointArray] = useState()
  function createPointsArray(pointsObject){
    if(typeof pointsObject !== "object") return

    // Create an object that has date:points (not including time)
    let datePointsObject = {}
    Object.entries(pointsObject).forEach(entry => {
      // Get just the date string without the time
      let date = entry[0].split("T")[0]
      // If there is already points for that date add the new amount of points
      if(datePointsObject[date])
        datePointsObject[date] += entry[1]
      // If this is the first time this date has been seen set the points value
      else
        datePointsObject[date] = entry[1]
    })

    // Convert the datePointsObject to an array
    let datePointArrayTemp = []
    Object.entries(datePointsObject).forEach(entry => {
      let datePointObject = {
        date: entry[0],
        points: entry[1],
      }
      datePointArrayTemp.push(datePointObject)
    })
    datePointArrayRef.current = datePointArrayTemp
    setDatePointArray(datePointArrayTemp)
    
  }
  const sentenceIndex = useRef(0)
  function createArray(){
        
    if(wordSource === "podcast"){

      var newWordsArray = globalSentenceArray.current[sentenceIndex.current].split(" ")
      addAtHead(newWordsArray)
      sentenceIndex.current++
      return
    }

    // Create a new array and put 10 random words in it
    var newWordsArray = []
    for(var i=0; i<arrayLength; i++)
      newWordsArray.push(globalWordArray.current[Math.floor(Math.random() * globalWordArray.current.length)])

    if(speak)
      speakWord(newWordsArray[0])  

    // Adds the new word array at the head of the 2d array that holds word arrays
    addAtHead(newWordsArray)
  }  
  async function createGlobalWordArray(){

    var words = ""
    if(wordSource === "words"){
      await fetch(wordFile)
      .then(res => res.text())
      .then(text => {
        words = text
        // A few extra words
        words += "happy climb achieve bright pregnant sunny sun shining green travel water blue golden gold make create audit clean close love together hold build"
        globalWordArray.current = wordStringToWordArray(words)
      })
    }
    else if(wordSource === "podcast"){
      await fetch(podcast)
      .then(res => res.text())
      .then(text => {        
        globalSentenceArray.current = stringToSentenceArray(text)
      })
    }
    else if (wordSource === "letters"){
      words = 
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
        octopus
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
        globalWordArray.current = wordStringToWordArray(words)
    }
    else if (wordSource === "numberWords"){
      words = `fun shoe tree door hive kicks snow ate vine hero`
      globalWordArray.current = wordStringToWordArray(words)
    }   
    else if (wordSource === "numbers"){
      words = "1 2 3 4 5 6 7 8 9 0"
      globalWordArray.current = wordStringToWordArray(words)
    }
    // The default is the 1000 words list
    else {
      await fetch(wordFile)
      .then(res => res.text())
      .then(text => {
        words = text
        globalWordArray.current = wordStringToWordArray(words)
      })
    }

    // This is the list of words that the array will select from
    //var words = `time year people way day man thing woman life child world school family student hand part place palace week company system program question work number night point home water room mother area money story fact month lot right study book eye job word business side kind head house service friend father hour game line member car city community Name team minute idea kid body information parent others level office door health person art history party result change morning reason research girl guy moment air teacher education car value gold baby food plant blue sun moon cloud trees plants electricity computer keyboard mouse book page word symbol hair ability time house water council market city land sea lake ocean sand rocks animals crab goat deer alligator bull team town nature bank paper pen marker club king voice light music field forest mountain valley peak project base love letter capital model machine fire son space plan energy hotel parkingLot meet cup box summer village park garden science picture fish bird oil film addition station window door sound glass software earth fiver sale equipment radio peace teacher culture context weight sex transport cash library phone stone dog cat memory railroad train plane sky wood granite marble winter snow rain hill wind bank museum farm cabinet fridge coffee tea bridge connection air dinner lunch breakfast fruit cantaloupe watermelon potato bright clear happy reach up climb progress grow accept accomplish achieved active`    
    
    
    
    // console.log("allWords")
    // console.log(allWords)

    // Put the array in a ref
  }
  function debug(){
    console.log("________________________________________")
    console.log("array")
    console.log(array)
    console.log("counter states:")
    console.log("counter "+wordIndex+" index wordIndex "+arrayIndex)
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

    console.log("sentences")
    console.log(sentences)
    return sentences

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
    setInitialTime()   
    setStartSeconds(getSeconds())  
  }
  function next(){
    
    // If the game is not started or user is typing return
    if(!started || keyInput)
      return

    console.log("in next")   
    console.log("speak: "+speak)   

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

  const arrayDepthInput = useRef()
  const arrayLengthInput = useRef()
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
  function checkInputInprocess2(input, array){
    

    // Create an array from the input words and compare it to the state array
    let totalWordsInArray = array[arrayIndex].length
    var inputWordsArray = input.split(' ')    
    var wordIndex = 0, correctCount = 0
    inputWordsArray.forEach(word=>{
      if(array[arrayIndex][wordIndex++] === word)
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

    // if(!goingUp && inputWordsArray.length > array[arrayIndex].length) (if nedt depth is within bounds of array)         
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
  const audioRef = useRef
  function playSound(sound){
    if(!sound) return

    if(!audioRef.current){
      try{
        audioRef.current = new Audio(sound)
      }catch{}
    }
    else
      audioRef.current.setAttribute("src", sound)

    try{
      audioRef.current.play()            
    }catch{}
    
  }
  function checkInputInprocess(input, array){

    // Create an array from the input words and compare it to the state array
    var inputWordsArray = input.split(' ')    
    var wordIndex = 0, correct = 0
    inputWordsArray.forEach(word=>{
      if(array[arrayIndex][wordIndex++] === word)
        correct++          
      })
      
      // When we get to the furthest depth set a flag variable that says were on our way back
      //  then start decrementing counter. If flag is set and we get back to top, create new array and reset flag

      // if(!goingUp && inputWordsArray.length > array[arrayIndex].length) (if nedt depth is within bounds of array)         
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
      if(inputWordsArray.length > array[arrayIndex].length)
        
        // If then next depth is within bounds of array and set max depth we want to ask about it
        if((arrayIndex+1 < array.length) && arrayIndex+1 < arrayDepth){
          
          // Add the current to the log          
          var tempAL = accuracyLog
          tempAL.push("input "+correct.correct+" of "+array[arrayIndex].length+" correctly at depth "+arrayIndex)                                      
          setAccuracyLog(tempAL)

          // Doing this before the set state because it will probably call before state is updated if put after, but not always
          startInput(arrayIndex+1)

          // Go to the next depth level, then start input
          setArrayIndex(arrayIndex + 1)
        }
        // If all arrays have been input start reading next array
        else{
          
          // Add the current accuracy record to the log then denote the end of this section with a line          
          var tempAL = accuracyLog
          tempAL.push("input "+correct.correct+" of "+array[arrayIndex].length+" correctly at depth "+arrayIndex)                            
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
    setCorrect({correct:correct, total:array[arrayIndex].length})
  }
  function correctStreakAdjuster(correct){
    if(correct){
        if(correctStreak + 1 >= arrayLength){
            console.log("incremented array length to "+(arrayLength + 1))
            setArrayLength(arrayLength + 1)
            setCorrectStreak(0)
        }else{
            setCorrectStreak(correctStreak + 1) 
        }
    }else{
        console.log("incorrect line, resetting")
        setCorrectStreak(0)
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
    
    loadedLogRef.current[startTimeRef.current] = updatedObject
  
    // Set state for display and next save
    setPoints(currentPoints)

    // Put the updated object in local storeage as a string
    window.localStorage.setItem("Word-Array-Points", JSON.stringify(loadedLogRef.current))

  }
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
  const loadedLogRef = useRef({})
  const [logObject, setLogObject] = useState({})
  function loadPoints(){

    let loadedPoints = window.localStorage.getItem("Word-Array-Points")

    if(typeof loadedPoints === "string"){
      loadedPoints = JSON.parse(loadedPoints)
      loadedLogRef.current = loadedPoints
      setLogObject(loadedPoints)
    }
    
  }
  function oneDeeper(){

    console.log("going one deeper")

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

    console.log("going one up")

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

    console.log("going to reading mode")

    // Add the current accuracy record to the log then denote the end of this section with a line          
    var tempAL = accuracyLog
    tempAL.push("input "+correct.correct+" of "+array[arrayIndex].length+" correctly at depth "+arrayIndex)                                
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
    octopus
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
  function showHintFunction(){    

    if(hintCount>0)
      setHintCount(hintCount - 1)

    setShowHint(true)
  }

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
            <div className='inlineBlock' title={"Points: "+correctStreak+" = sum of Array length * depth - (2 * incorrect)"}>
                {points}
            </div>

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
              {array.length>0 && array[arrayIndex][0]}
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
        {showHint && <HintWindow wordArrays={array} close={()=>setShowHint(false)} hintCount={hintCount}></HintWindow>}        
        {showChart && <Charts name={"Word Array Points"} dataArray={datePointArray} logObject={logObject} close={()=>setShowChart(false)}></Charts>}
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
          wordSource={wordSource}
          setWordSource={setWordSource}
        ></SettingsWindow>}
        <div className='circleButtonHolder'>
          <div className='infoButton'>
            <img src={gear}></img>
            <div className='infoButtonDisplay'>
              <div className='settingsButton' onClick={()=>setShowChart(true)}>Points Chart</div>
              <div className='settingsButton' onClick={()=>setShowSettings(true)}>Settings</div>
              <div className='settingsButton'>Description</div>
              <div className='settingsButton' title={hintCount+" hints remaining"} onClick={showHintFunction}>Hint ({hintCount})</div>
            </div>
          </div>
        </div>
      </>
  );
}

export default WordArrayGame;
