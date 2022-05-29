//
// 資産 グループ別グラフ
//
import React, {useEffect} from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@mui/material/styles';
import { Tooltip, CartesianGrid, LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../../dashboard/Title';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import {ApiGetAssetsGroupSumaryList} from '../common/prj_url';

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
  //console.log("ObjectMerg START");
  let merged = objes.reduce((acc, obj, index)=>{
    for (let key in obj){
      acc[key] = obj[key];
      //console.log(obj[key]);
    }
    return acc;
  },{});
  //console.log(merged);  
  //console.log("ObjectMerg END");
  return merged;
}

export default function AssetsGroupGraph() {
  const theme = useTheme();
  const {user} = useUserContext();  
  const {assetSearch, assetsRecords, assetSearchEvent} = useResultDatasContext();
  const [graphDatas, setGraphDatas] = React.useState([])
  const [lines, setLines] = React.useState([])

  const IS_DEBUG = true;
  const debuglog = (message) =>{
    if (IS_DEBUG){
      console.debug(message);
    }
  }

  useEffect(()=>{
    function fetchData(){
      console.log("AssetsGroupGraph");
      ApiGetAssetsGroupSumaryList(user, assetSearch).then(result=>{
        debuglog(result);
        // 下記内容に整形する
        //
        // name : 2022/12
        // 項目名1 : 金額
        // 項目名2 : 金額
        // 項目名3 : 金額
        //
        // 1. insert_yyyymmを取得しuniqueデータを作成する
        // 2. insert_yyyymm が一致する全オブジェクトを取得し
        //    1つのオブジェクトに集約し、項目名 : 金額にする
        //

        // 1. insert_yyyymmを取得しuniqueデータを作成する
        let datas = result.data;
        let wunique_dates = [];
        datas.map(data=>{
          return wunique_dates[data.insert_yyyymm] = data.insert_yyyymm;
        })
        // 2. insert_yyyymm が一致する全オブジェクトを取得し
        //    1つのオブジェクトに集約し、項目名 : 金額にする
        const unique_dates = Object.keys(wunique_dates);
        let records = unique_dates.map(unique_date=>{
          //debuglog("unique_date-----------------------");
          //debuglog(unique_date);
          let records = datas.filter(data=>data.insert_yyyymm === unique_date);
          // 同一日付のオブジェクトを１つのオブジェクトに格納
          let graphRecords = records.map(record=>{
              //debuglog("record-----------------------");
              //debuglog(record);
              return({
                [record.deposit_group_name] : record.value,
                name : record.insert_yyyymm
            });
          });
          return ObjectMerge(graphRecords);
        })
        //
        // データソート
        records = records.sort((a, b)=>{
          if (a.name < b.name){
            return -1;
          }
          return 0;
        });
        debuglog("ObjectMerge-----------------------");
        debuglog(records);

        //
        // Lineタグ生成

        // グループ名を設定する
        let GroupNames = [];
        records.map(record=>{
          let keys = Object.keys(record);
          debuglog("keys-----------------------");
          debuglog(keys);
            for(let key of keys){
            if (key !== "name"){
              GroupNames[key] = record[key];
            }
          }
        })
        debuglog("GroupNames-----------------------");
        debuglog(GroupNames);
        GroupNames = Object.keys(GroupNames);
        let outLines = GroupNames.map((name, index)=>{
          let i = coloers.length % index;
          return(
            <Line
            key={index}
            isAnimationActive={false}
            type="monotone"
            dataKey={name}
            stroke={coloers[i]}
            //stroke={theme.palette.primary.light}
            dot={false}
            activeDot={{ r: 8 }}
            />
        )});
        setLines(outLines);
        setGraphDatas(records);
      }).catch(error=>{
        console.error(error);
      })
    }
    fetchData();
  },[assetSearch, assetSearchEvent]);

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
      <Title>Group別グラフ</Title>
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