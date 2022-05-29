import React, {useEffect} from 'react';
import { useTheme } from '@mui/material/styles';
import { Tooltip, Legend, CartesianGrid, LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../../dashboard/Title';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import {ApiGetDepositItemDataSumaryList} from '../common/prj_url';



const coloers = [
  "red",
  "#006400",
  "#ffff00",
  "#0000cd",
  "#00ffff",
]

export default function GraphResult() {
  const theme = useTheme();
  const {user} = useUserContext();  
  const {graphSearch, setGraphDatas} = useResultDatasContext();
  const [grafDatas, setGrafDatas] = React.useState([])
  const [lines, setLines] = React.useState([])
  useEffect(()=>{
    function fetchData(){
      ApiGetDepositItemDataSumaryList(user, graphSearch).then(result =>{
        let data = result.data;
        console.debug("GraphResult----------------");
        //console.debug(data);        
        //data = dataFilter(data);
        // 全ての項目名を取得する
        console.debug("全項目名");
        let lineUnique = {}
        console.debug(data);
        data.map(record=>{
          //console.debug(`ItemName=${record.depositItem_name}`);
          //console.debug(record);
          lineUnique[record.depositItem_name] = record.depositItem_name;
        })
        console.debug(lineUnique);
        let outLines = [];
        Object.keys(lineUnique).forEach((line, index)=>{
          let i = coloers.length % index
          outLines.push(
            <Line
              key={index}
              type="monotone"
              dataKey={line}
              stroke={coloers[i]}
              fill={coloers[i]}
              activeDot={{ r: 8 }}
          />
          )
        });
        setLines(outLines);
        // 全データの全ての日付を取得する
        let dateUnique = {}
        data.map(record=>{
          dateUnique[record.insert_yyyymm] = record.insert_yyyymm;
        })
        console.debug('outLines');
        console.debug(outLines);
        // 日付毎に存在するレコードを抽出する
        let dateDatas = Object.keys(dateUnique).map(key=>
          data.filter( d => d.insert_yyyymm===key))
        //
        // Sort
        dateDatas = dateDatas.sort(( a, b ) =>{
          return a[0].insert_yyyymm < b[0].insert_yyyymm ? -1 : 1
        })
        console.debug("dateDatas");
        console.debug(dateDatas);
        let graf = dateDatas.map(datas => createDatas(datas))
        setGrafDatas(graf)
        console.debug("graf--------------");
        console.debug(graf);
        console.debug("data--------------");
        console.debug(data);
        
        setGraphDatas(data);
      }).catch(error=>console.error(error))
    }
    fetchData();
  },[user, graphSearch]);

  function createDatas(datas){
    let resultObj = {
      name : datas[0].insert_yyyymm
    }
    datas.forEach(data=>{
      resultObj[data.depositItem_name] = data.value;
    })
    return resultObj;
  }

  return (
    <React.Fragment>
      <Title>実績</Title>
      <ResponsiveContainer>
        <LineChart
          data={grafDatas}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}  
