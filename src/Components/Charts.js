import React, { useEffect, useState } from 'react'
import { BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dateString } from '../functions'

function Charts({name, close, logObject}) {

    useEffect(()=>{
      createPointsPerDay()
    },[])


    const [dailyValues, setDailyValues] = useState([])
    function createPointsPerDay(){
      if(typeof logObject !== "object") return

      let dailyValuesObject = {}
      Object.entries(logObject).forEach(logObjectEntry => {
        // The date without the time
        let date = logObjectEntry[0].split("T")[0]
  
        // If there is not an object for this date already add an empty object there
        if(!dailyValuesObject[date]){
          dailyValuesObject[date] = {}          
        }

        // The key values pairs in the log entry
        let logValues = logObjectEntry[1] 
        // Look at each key value pair in the log data object entry
        Object.entries(logValues).forEach(pair => {
          let key = pair[0]
          let value = pair[1]

          // For the array length save the largest value
          if(key === "arrayLength"){
            // If there is a value for arrayLength
            if(dailyValuesObject[date]?.arrayLength){
              // And it is larger than the stored value
              if(value > dailyValuesObject[date]?.arrayLength )
                // Save it
                dailyValuesObject[date].arrayLength = value
            }
            // If there is no stored value save it
            else{
              dailyValuesObject[date].arrayLength = value
            }
          }
          // For the other two (points and seconds) add the values to the existing stored values
          else{
            // If there is a value for that key add the new amount into it
            if(dailyValuesObject[date][key])
              dailyValuesObject[date][key] += value          
            // Else set the initial value
            else
              dailyValuesObject[date][key] = value        
          }

        })

        // Calculate the points per second
        if(dailyValuesObject[date]?.points && dailyValuesObject[date]?.seconds){
          dailyValuesObject[date].pointsPerSecond = dailyValuesObject[date].points / dailyValuesObject[date].seconds
        }

      })

      // Convert that object into an array so the chart can display it
      let tempDailyValuesObjectArray = []
      let earliestDate = new Date()
      let latestDate = new Date()
      Object.entries(dailyValuesObject).forEach(dailyEntry => {
        let tempObject = {}
        let date = dailyEntry[0]
        let values = dailyEntry[1]
        
        let dateOfThisEntry = new Date(date)
        // Have to add 1 because its an index by default
        dateOfThisEntry.setDate(dateOfThisEntry.getDate() + 1)

        if(dateOfThisEntry < earliestDate)
          earliestDate = dateOfThisEntry
        if(dateOfThisEntry >= latestDate)
          latestDate = dateOfThisEntry

        tempObject.date = date
        // Add each key value pair (this is better than hard coding because any new pairs will be added automatically)
        Object.entries(values).forEach(kvPair => {          
          let key = kvPair[0]
          let value = kvPair[1]
          tempObject[key] = value
        })
        // Put the object into the array
        tempDailyValuesObjectArray.push(tempObject)
      })      

      // Create an object that has all the dates between the earliest and latest day
      let allDatesArray = []
      let dateCounter = new Date(earliestDate.getTime())

      while(dateCounter <= latestDate){
        // If this date is in the dailyValuesObject add it with those values, else add it with 0s
        if(dailyValuesObject[dateString(dateCounter, true)])
          allDatesArray.push({...dailyValuesObject[dateString(dateCounter, true)], date: dateString(dateCounter, true)})
        else
          allDatesArray.push({
            date: dateString(dateCounter, true),
            points: 0,
            seconds: 1,
            arrayLength: 0,
            pointsPerSecond: 0,
          })

        // Increment the date counter by one day
        dateCounter.setDate(dateCounter.getDate() + 1)
      }

      // Setting this to an array with all of the dates and the values to graph
      setDailyValues(allDatesArray)
      
    }

  return (
    <>
    <div className='window chartWindow'>
        <div className='closeButton' onClick={close}>x</div>
        <h2>{name}</h2>
        <div className='chartContainer'>
        <h3>{"Points per Day"}</h3>
          <LineChart
              width={800}
              height={400}
              data={dailyValues}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
              <XAxis dataKey="date" />
              <YAxis></YAxis>
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              <Line type="monotone" dataKey="points" stroke="#ff7300" yAxisId={0} />
              {/* <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} /> */}
          </LineChart>
        </div>
        <div className='chartContainer'>
          <h3>{"Points Per Second Per Day"}</h3>
          <LineChart
              width={800}
              height={400}
              data={dailyValues}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
              <XAxis dataKey="date" />
              <YAxis></YAxis>
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              <Line type="monotone" dataKey="pointsPerSecond" stroke="#ff7300" yAxisId={0} />
              {/* <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} /> */}
          </LineChart>
        </div>
        <div className='chartContainer'>
          <h3>{"Max Array Length"}</h3>
          <LineChart
              width={800}
              height={400}
              data={dailyValues}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
              <XAxis dataKey="date" />
              <YAxis></YAxis>
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              <Line type="monotone" dataKey="arrayLength" stroke="#ff7300" yAxisId={0} />
              {/* <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} /> */}
          </LineChart>
        </div>
    </div>
    </>
  )
}

export default Charts