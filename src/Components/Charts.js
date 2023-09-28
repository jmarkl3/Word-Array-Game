import React from 'react'
import { BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function Charts({name, dataArray, close}) {
    console.log("dataArray")
    console.log(dataArray)
  return (
    <>
    <div className='window chartWindow'>
        <div className='closeButton' onClick={close}>x</div>
        <h3>{name}</h3>
        <div className='chartContainer'>
        {/* <ResponsiveContainer width={"auto"} height={"auto"}> */}
            <LineChart
                width={800}
                height={400}
                data={dataArray}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                <XAxis dataKey="date" />
                <YAxis></YAxis>
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="points" stroke="#ff7300" yAxisId={0} />
                {/* <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} /> */}
            </LineChart>
        {/* </ResponsiveContainer> */}
        </div>
    </div>
    </>
  )
}

export default Charts