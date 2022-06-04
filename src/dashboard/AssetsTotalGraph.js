//
// 資産 グループ別グラフ
//
import React, {useEffect} from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@mui/material/styles';
import { Tooltip, CartesianGrid, LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import {useUserContext} from '../context/userContext';
import {useResultDatasContext} from '../context/resultDatasContext';
import {ApiGetAssetsGroupSumaryList, ApiGetAssetsSumaryList} from '../component/common/prj_url';

const coloers = [
  "red",
  "#006400",
  "#ff00ff",
  "#0f00cd",
  "#00ff00",
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

export default function AssetsTotalGroupGraph() {
  const theme = useTheme();
  const {user} = useUserContext();  
  const {assetSearch, assetsRecords, assetSearchEvent} = useResultDatasContext();
  const [graphDatas, setGraphDatas] = React.useState([])
  const [totalGraphlDatas, setTotalGraphDatas] = React.useState([])
  const [lines, setLines] = React.useState([])
  const [groupNames, setGroupNames] = React.useState([])
  const IS_DEBUG = false;
  const debuglog = (message) =>{
    if (IS_DEBUG){
      console.debug(message);
    }
  }

  useEffect(()=>{
    function fetchAll(){
      fetchTotalData().then(totalDatas=>{
        fetchData(totalDatas);
      })
    }
    /**
     * 資産合計データ取得
     * 
     * 
     * @returns 資産合計Object
     *            {
     *              name : '2022/01'
     *              合計 : 12348
     *            },
     *            {
     *              name : '2022/02'
     *              合計 : 12348
     *            },
     */
    async function fetchTotalData(){
      debuglog("ApiGetAssetsSumaryList-------");
      return await ApiGetAssetsSumaryList(user, assetSearch).then(result=>{
        debuglog(result);
        let records = result.data.map(data=>{
            return({
              name : data.insert_yyyymm,
              '合計' : data.value
            });
        });
        debuglog(records);
        debuglog("setTotalGraphDatas-----------------------99");
        setTotalGraphDatas(records);
        return records;
      });
    }

    function fetchData(totalDatas){
      debuglog("AssetsGroupGraph");
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
        debuglog("totalDatas-----------------------02");
        debuglog(totalDatas);
        //
        // 取得したデータに、同月の合計結果オブジェクトを追加する
        records = records.map((record=>{
          let totaldata = totalDatas.find(data=>data.name===record.name);
          record['合計'] = totaldata['合計'];
          return record;
        }));
        debuglog("records-----------------------03");
        debuglog(records);
        setGraphDatas(records);
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
        GroupNames = Object.keys(GroupNames);
        debuglog("setGroupNames-----------------------");
        setGroupNames(GroupNames);
        setLinsData(GroupNames);
      }).catch(error=>{
        console.error(error);
      })
    }

    function setLinsData(groupName){
      debuglog("GroupNames-----------------------");
      debuglog(groupName);
      let outLines = groupName.map((name, index)=>{
        let i = coloers.length % index;
        //
        // Lineタグ生成
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
    }

    fetchAll();
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