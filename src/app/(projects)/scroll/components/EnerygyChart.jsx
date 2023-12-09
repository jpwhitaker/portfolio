import { useState, useEffect, useRef } from 'react';
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {createNoise2D} from 'simplex-noise'

const noise2D = createNoise2D();



export const EnergyChart = ({ bladeSpeedRef }) => {
  const [time, setTime] = useState('');
  const [arr, setArr] = useState(Array.from({ length: 30 }, (_, i) => ({ name: (i + 1).toString(), kwh: 1 })));
  const timeoutRef = useRef(null);
  function validate() {
    setArr(prevState => {
      // Keep only the last 29 elements and add the new data at the end
      const speed = bladeSpeedRef.current;

      // Generate simplex noise and add it to speed
      const rawNoise = noise2D(new Date().getTime() * 0.0001, 0); // Using scaled current time as x-coordinate
      const noise = rawNoise * 0.05;
      const noisySpeed = speed + noise;
  

      const updatedData = [...prevState.slice(Math.max(prevState.length - 29, 0)), { X: noisySpeed }];
      return updatedData;
    });

  }

  useEffect(() => {
    // Clear any existing interval when the component unmounts or before setting a new interval
    const clearExistingInterval = () => {
      if (timeoutRef.current !== null) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    clearExistingInterval();

    // Set up the interval
    timeoutRef.current = setInterval(() => {
      validate(); // Call the validate function every 500 ms
    }, 1000); // 500 ms interval

    // Clean up the interval when the component unmounts
    return () => clearExistingInterval();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={730} height={250} data={arr}
        margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}

        <YAxis hide domain={[0, 10]} tickCount={100} />
        {/* <Tooltip /> */}
        <Legend />
        <Line type="linear" isAnimationActive={false} dataKey="X" stroke="#8884d8" />

      </LineChart>

    </ResponsiveContainer>
  );
}







