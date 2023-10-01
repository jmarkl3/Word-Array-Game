import React, { useEffect, useState } from 'react'

function HintWindow({wordArrays, close, hintCount}) {

    const [stringArray, setStringArray] = useState([])

    useEffect(()=>{
        createStrings()
    },[])

    // turns the array of array into an array of strings
    function createStrings(){
        if(typeof wordArrays !== "object"){
            console.log("invalid word arrays: ")    
            console.log(wordArrays)
            return
        }
        // console.log(wordArrays)
        // return

        // The array that will hold all of the strings
        let tempStringArray = []
        // Look at each array of words
        wordArrays.forEach(wordArray => {
            // Add each word in the array to a string with a space between them
            let tempString = ""
            wordArray.forEach(word => {
                tempString += word + " "
            })
            // Add this string of words to the array
            tempStringArray.push(tempString)
        })
        // Put it in state to be displayed
        setStringArray(tempStringArray)
    }
return (
    <div className='window'>    
        <div className='closeButton' onClick={close}>x</div>   
        <div className='hintMenuInner'>
            <div className='hintMenuLine'>{"There are "+hintCount+" hints remaining."}</div>
            {hintCount > 0 && stringArray.map(wordsString => (
                <div className='hintMenuLine'>{wordsString}</div>
            ))}
        </div>                          
    </div>
  )
}

export default HintWindow