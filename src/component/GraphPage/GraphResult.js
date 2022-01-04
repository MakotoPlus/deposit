import React, {useEffect} from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@mui/material/styles';
import { Tooltip, CartesianGrid, LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../../dashboard/Title';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
const prj_const = require('../prj_const.js')

/*const useStyles = makeStyles((theme) => ({

}));
*/

// 全データ取得
async function getDepositDateSumaryList(user){
  let headers = {
    headers : user.Authorization
  };
  let urlpath = prj_const.ServerUrl + "/api/deposit_date_sumary_list/?no_page";
  return await axios.get(urlpath, headers);
}

export default function GraphResult() {
  const coloers = [
    "red",
    "#006400",
    "#ffff00",
    "#0000cd",
    "#00ffff",
  ]
  const theme = useTheme();
  //const classes = useStyles();
  const {user} = useUserContext();  
  const {graphSearch, groupSumaryDatas,} 
    = useResultDatasContext();
  const [grafDatas, setGrafDatas] = React.useState([])
  const [lines, setLines] = React.useState([])
  useEffect(()=>{
    function fetchData(){
      getDepositDateSumaryList(user).then(result =>{
        let data = result.data;
        console.debug("GraphResult");
        // 絞込選択されている場合はそれだけにする
        if (graphSearch.select_items.length){
          data = graphSearch.select_items.map(item =>
            data.filter( record => record.depositItem_key === item )
          );
          // この結果は二次元配列となってしまうため一次元配列へ変換する
          data = [].concat(...data);          
          console.debug("data");
          console.debug(data);
        }
        // 全ての項目名を取得する
        console.debug("全項目名");
        let lineUnique = {}
        console.debug(data);
        data.map(record=>{
          console.debug(`ItemName=${record.depositItem_name}`);
          console.debug(record);
          lineUnique[record.depositItem_name] = record.depositItem_name;
        })
        let outLines = [];
        Object.keys(lineUnique).forEach((line, index)=>{
          let i = coloers.length % index
          outLines.push(
            <Line
            isAnimationActive={false}
            type="monotone"
            dataKey={line}
            stroke={coloers[i]}
            //stroke={theme.palette.primary.light}
            dot={false}
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
        console.debug("graf");
        console.debug(graf);
      }
      ).catch(error=>console.error(error))
    }
    fetchData();
  },[graphSearch, groupSumaryDatas, user]);
    
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
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <XAxis
            dataKey="name"
            /*
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            */
          />
          <YAxis
          /*
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            */
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
              金額
            </Label>
          </YAxis>
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}  
/*  
  return (
    <React.Fragment>
      <Title>実績</Title>
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
            dataKey="time"
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
              Sales ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
*/