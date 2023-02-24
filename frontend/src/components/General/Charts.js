// import "./styles.css";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";


function BarChartComp() {

  const { user } = useContext(UserContext);
  
  const [data, setData] = useState([{}, {}, {}, {}, {}, {}, {}])
 

  useEffect(() => {
    let tempData = [];
    let index = 0;
    for (let x = user.dailyProgress.length - 7; x < user.dailyProgress.length; x++) {
      let day = user.dailyProgress[x];
      tempData.push({
        name: `Day ${index + 1}`,
        // score: day.pointsCollected,
        // score: day.pointsCollected,
        score: Math.floor(Math.random() * 10),
        num: day.questionsCompleted

      })
      index += 1;
    }
    setData(tempData)
  }, [])
  return (
    <div className="max-w-[3rem] pt-8">

      <BarChart
        width={600}
        height={150}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <XAxis hide dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="score" fill="#92BA9280" radius={[5, 5, 3, 3]} />
      </BarChart>
    </div>
  );
}

export {
  BarChartComp
}
