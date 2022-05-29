//
// 資産 項目別グラフ
//
import React, {useEffect} from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@mui/material/styles';
import { Tooltip, CartesianGrid, LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
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


//
// 配列中の全てのオブジェクトを1つのオブジェクトに格納する
//
function ObjectMerge(objes){
  let merged = objes.reduce((acc, obj, index)=>{
    for (let key in obj){
      acc[key] = obj[key];
    }
    return acc;
  },{});
  return merged;
}

export default function AssetsGraph() {
  const theme = useTheme();
  const {assetSearch, assetsRecords, assetSearchEvent} = useResultDatasContext();
  const [graphDatas, setGraphDatas] = React.useState([])
  const [lines, setLines] = React.useState([])

  const IS_DEBUG = false;
  const debuglog = (message) =>{
    if (IS_DEBUG){
      console.debug(message);
    }
  }

  useEffect(()=>{
    function fetchData(){
      debuglog("AssetsGraph");
      debuglog(assetsRecords);

      //graphDatas.map((grafData, index)=>{
      // データ行から項目名のデータを抽出し設定する
      let dataRecords = assetsRecords.data.map((dataRecord, dataRecodeIndex)=>{
        // dataRecord 内容: { データ項目キー1: 値, データ項目キー2:値 ...}        
        // 1. ColumsのIDキーと一致するCloumsの名称にキー値を変更する。
        //    値はValueを設定する
        // 2. 日付を設定する
        let grafRecords = assetsRecords.columns.map(column=>{
          return {
              [column.title] : dataRecord[column.id],
              name : assetsRecords.insert_yyyymms[dataRecodeIndex]
            }
        });
        return grafRecords;
      });
      //
      // Object[行分]
      //   |----Object[項目分]
      // と二次元配列になっているため、
      //　1次元に変換する
      // 
      let GrafAllRecords = dataRecords.map(records=> ObjectMerge(records));
      debuglog("GrafAllRecords");
      debuglog(GrafAllRecords);
      // 日付以外の値を数値型変換
      GrafAllRecords = GrafAllRecords.map(records=>{
        debuglog(records);
        let keys = Object.keys(records);
        for (let key of keys){
          if (key !== 'name'){
            debuglog(key);
            debuglog(records[key]);
            records[key] = Number(records[key].replace(/,/g, ''));
          }
        }
        return records;  
      })
      debuglog("GrafAllRecords-2");
      debuglog(GrafAllRecords);
      // データを昇順にソート
      GrafAllRecords = GrafAllRecords.sort((a, b)=>{
        if (a.name < b.name){
          return -1;
        }
        return 1;
      });
      let outLines = assetsRecords.columns.map((column, index)=>{
        let i = coloers.length % index
        return(
          <Line
          key={index}
          isAnimationActive={false}
          type="monotone"
          dataKey={column.title}
          stroke={coloers[i]}
          //stroke={theme.palette.primary.light}
          dot={false}
          activeDot={{ r: 8 }}
          />
      )});
      setLines(outLines);
      setGraphDatas(GrafAllRecords);
    }
    fetchData();
  },[assetsRecords, assetSearchEvent]);

  //
  // Graphデータを生成する
  //
  // [
  //    name :  yyyy/mm,
  //    項目名1 : 金額,
  //    項目名2 : 金額,
  //    項目名3 : 金額,
  //    項目名4 : 金額,
  // ]


  return(
    <React.Fragment>
      <Title>項目別グラフ</Title>
      <ResponsiveContainer>
        <LineChart
          data={graphDatas}
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