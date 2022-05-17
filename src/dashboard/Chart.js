import React, {useEffect} from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import {useUserContext} from '../context/userContext';
import { Link as RouterLink } from "react-router-dom";
import Link from '@mui/material/Link';
import {ApiGetDepositDateSumaryList} from '../component/common/prj_url';


const coloers = [
  "red",
  "#006400",
  "#ffff00",
  "#0000cd",
  "#00ffff",
]

export default function Chart() {

  const theme = useTheme();
 //const classes = useStyles();
  const {user} = useUserContext();
  const [grafDatas, setGrafDatas] = React.useState([])
  const [lines, setLines] = React.useState([])
  useEffect(()=>{
    function fetchData(){
      ApiGetDepositDateSumaryList(user).then(result =>{
        let data = result.data;
        console.debug("GraphResult");
        console.debug(data);
        console.debug("data");

        let outLines = [];
        outLines.push(
          <Line key="1"
          isAnimationActive={false}
          type="monotone"
          dataKey="total"
          stroke={coloers[0]}
          //stroke={theme.palette.primary.light}
          dot={false}
          activeDot={{ r: 8 }}
        />
        )
        setLines(outLines);
        let graf = data.map(datas => createDatas(datas))
        setGrafDatas(graf)
        console.debug("graf");
        console.debug(graf);
      }).catch(error=>console.error(error))
    }
    fetchData();
  },[user]);

  function createDatas(datas){
    let resultObj = {
      name : datas.insert_yyyymm,
      total: datas.value,
    }
    return resultObj;
  }


  return (
    <React.Fragment>
      <Link component={RouterLink} color="primary" to="/graph" >
        Graph
      </Link>
      <ResponsiveContainer>
        <LineChart
          data={grafDatas}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="name"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
            </Label>
          </YAxis>
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
/*
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />

*/