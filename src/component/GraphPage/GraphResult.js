import React, {useEffect} from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@mui/material/styles';
import { Tooltip, CartesianGrid, LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../../dashboard/Title';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
const prj_const = require('../common/prj_const.js')

/*const useStyles = makeStyles((theme) => ({

}));
*/

// 全データ取得
async function getDepositGraph(user, graphSearch){
  let headers = {
    headers : user.Authorization
  };
  let parameters = "";
  
  graphSearch.select_items.map(depositItem_key =>{
    if (parameters !== ""){
      parameters += "&"
    }
    if (depositItem_key !== undefined){
      parameters += `depositItem_key=${depositItem_key}`
    }
  });
  
  const from_date = graphSearch.select_fromto_date[0];
  const to_date = graphSearch.select_fromto_date[1];
  console.debug("from_date");
  console.debug(from_date);
  if ((from_date !== undefined) && (from_date !== '') && (from_date !== null)){
    if (parameters !== ""){
      parameters += "&"
    }
    parameters += `insert_yyyymm_from=${from_date.substr(0,7)}`
  }
  if ((to_date !== undefined) && (to_date !== '') && (to_date !== null)){
    if (parameters !== ""){
      parameters += "&"
    }
    parameters += `insert_yyyymm_to=${to_date.substr(0,7)}`
  }
  let url = "/api/deposit_item_date_sumary_list/?no_page";
  if (parameters !== ""){
    url += "&" + parameters;
  }
  let urlpath = prj_const.ServerUrl + url;
  console.debug(`urlpath=[${urlpath}]`);
  return await axios.get(urlpath, headers);
}

const coloers = [
  "red",
  "#006400",
  "#ffff00",
  "#0000cd",
  "#00ffff",
]

export default function GraphResult() {
  const theme = useTheme();
  //const classes = useStyles();
  const {user} = useUserContext();  
  const {graphSearch, setGraphDatas} = useResultDatasContext();
  const [grafDatas, setGrafDatas] = React.useState([])
  const [lines, setLines] = React.useState([])
  useEffect(()=>{
    function fetchData(){
      getDepositGraph(user, graphSearch).then(result =>{
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
        let outLines = [];
        Object.keys(lineUnique).forEach((line, index)=>{
          let i = coloers.length % index
          outLines.push(
            <Line
            key={index}
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
        console.debug('dateUnique');
        console.debug(dateUnique);
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
        
        setGraphDatas(data);
      }).catch(error=>console.error(error))
    }
    fetchData();
  },[user]);

  /***
  // サーバに機能を移管したため不要となった
  //
  // 受信データを絞込条件に一致したデータのみにして返す  
  function dataFilter(resultData){
    let data = resultData;
    // 絞込選択されている場合はそれだけにする
    if (graphSearch.select_items.length){
      data = graphSearch.select_items.map(item =>
        data.filter( record => record.depositItem_key === item )
      );
      // この結果は二次元配列となってしまうため一次元配列へ変換する
      data = [].concat(...data);
      //console.debug("filter item data");
      //console.debug(data);
    }
    // 日付の絞込みがされている場合は対象外は除去する
    const from_date = graphSearch.select_fromto_date[0];
    const to_date = graphSearch.select_fromto_date[1];
    if (from_date !== '' && from_date !== undefined ){
      data = data.filter( record => record.insert_yyyymm >= from_date );
      //console.debug("filter fromdate data");
      //console.debug(data);
    }
    if (to_date !== '' && to_date !== undefined ){
      data = data.filter( record => record.insert_yyyymm <= to_date );
      //console.debug("filter todate data");
      //console.debug(data);
    }
    return data;
  }
*********/
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