import React, { useEffect, useState } from 'react'
import { BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function Charts({name, close, logObject}) {

    useEffect(()=>{
      createPointsPerDay()
      console.log(logObject)
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
          // If there is a value for that key add the new amount into it
          if(dailyValuesObject[date][key])
            dailyValuesObject[date][key] += value          
          // Else set the initial value
          else
            dailyValuesObject[date][key] = value          
        })
        
        // Calculate the points per second
        if(dailyValuesObject[date]?.points && dailyValuesObject[date]?.seconds){
          dailyValuesObject[date].pointsPerSecond = dailyValuesObject[date].points / dailyValuesObject[date].seconds
        }

      })

      // Convert that object into an array so the chart can display it
      let tempDailyValuesObjectArray = []
      Object.entries(dailyValuesObject).forEach(dailyEntry => {
        let tempObject = {}
        let date = dailyEntry[0]
        let values = dailyEntry[1]
        
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
      setDailyValues(tempDailyValuesObjectArray)
      
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
          <h3>{"Points Per Second Over Time"}</h3>
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
    </div>
    </>
  )
}

export default Charts