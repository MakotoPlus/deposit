import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@mui/material/Grid';
//import Title from './Title';
//import { Link as RouterLink } from "react-router-dom";
//import ResultUpdateDialog from './../component/ResultPage/ResultUpdateDialog';
import {useUserContext} from './../context/userContext';
//import {useResultDatasContext} from './../context/resultDatasContext';
import TableContainer from '@material-ui/core/TableContainer';
import axios from 'axios';

const prj_const = require('../component/common/prj_const');

const useStyles = makeStyles({
  root: {
    width: '100%',
    // color: 'red',
  },
  container: {
    maxHeight: 495,
    // color: 'blue',
  },
  table: {
    width: '100%',
    //maxHeight: 500,
    // color: 'red',
  },
  tableCell: {
    // color: 'red',
  },
  DelTableRow : {
    backgroundColor : 'silver',
    color : 'whilte',
  },
  TableRow : {
    backgroundColor : 'whilte',
    color : 'black',
  },
  DepositPaper : {
    backgroundColor : '#98fb98',
    color : 'black',
    height : '30px',
    textAlign : 'center',
    paddingTop: 5,
    
  },
  ExpensesPaper : {
    backgroundColor : '#fa8072',
    color : 'white',
    height : '30px',
    textAlign : 'center',
    paddingTop: 5,
  },
  grid : {
    backgroundColor : '#0000',
  },
});

//
//
// 実績テーブル
//
const columns = [
  { id : 'id', label: 'No', minWidth: 50 }
  ,{ id : 'insert_yyyymmdd', label: 'Insert Date', minWidth:100 }
  ,{ id : 'deposit_group_name', label: 'Group', minWidth:100 }
  ,{ id : 'depositItem_name', label: 'Name', minWidth:100 }
  ,{ id : 'deposit_type_str', label: 'Type', minWidth:100 }
  ,{ id : 'deposit_value', label: 'Value', minWidth:100, align: 'right', format:(value) => value.toLocaleString()}
  ,{ id : 'moneyType_name', label: '種', minWidth:100 }
  ,{ id : 'memo', label : 'Memo', minWidth:100 }
  //,{ id : 'deposit_key', label: 'Key', minWidth:100 }
]

//function preventDefault(event) {
//  event.preventDefault();
//}

async function getDepositList(user, urlParameters, urlPath){
  //
  // parameters : URLパラメータ (未設定の場合はURLを有効にする)
  // url: アクセスURLパス
  let path ="";
  if (!urlParameters){
    path = urlPath;
  }else{
    path = prj_const.ServerUrl + "/api/deposit_list/?" + urlParameters;
  }
  let headers = {
    headers : user.Authorization
  };
  return await axios.get(path, headers);
}


function createObj(record, index, rowPage, page ){
  return {
    id : (index + 1) + (rowPage * page),
    deposit_key : record.deposit_key,
    delete_flag : record.delete_flag,
    deposit_type : record.deposit_type,
    deposit_type_str : (record.deposit_type === prj_const.TYPE_DEPOSIT) 
    ? prj_const.TYPE_DEPOSIT_STR : prj_const.TYPE_EXPENSES_STR,
    deposit_value : record.deposit_value.toLocaleString(),
    memo : record.memo,    
    insert_yyyymmdd : record.insert_yyyymmdd,
    depositItem_key : record.depositItem_key,
    depositItem_name : record.depositItem_key.depositItem_name,
    deposit_group_name : record.depositItem_key.deposit_group_name,
    moneyType_name : record.depositItem_key.moneyType_name,
  }
}


export default function Orders() {
  const classes = useStyles();
  const page=0;  // 現在のページ位置（開始0）
  const rowsPerPage=3;  //現在のクライアント1ページ表示件数
  const {user} = useUserContext();
  const [resultDatas, setResultDatas] = React.useState([]);
  //const [serverPage, setServerPage] = React.useState(1);  //現在のサーバ側ページ位置
  //const [prevUrl, setPrevUrl] = React.useState("");   // 前ページURL
  //const [nextUrl, setNextUrl] = React.useState("");   // 次ページURL
  //const [maxData, setMaxData] = React.useState(0);    // 全データ件数
  //const [thisUrl, setThisUrl] = React.useState("");   // 今回アクセスすべきURL

  useEffect(()=>{
    //
    // 検索条件変更時 -> 検索実行
    console.debug('ResultTable::ResultTable');
    //
    // 検索パラメータURL再構築
    let paramDepositItemKeys = "";
    // 預金項目
    //let depositItemkeys = "depositItem_key=";
    //削除フラグ
    let paramIsDelete = "delete_flag=false";
    console.debug(paramIsDelete);
    //日付(gte=以上 lte=以下)
    let paramTodate = "";
    let paramFromdate = "";
    let paramLimit = "limit=" + rowsPerPage;
    let paramOffset = "offset=0";
    console.debug(paramTodate);
    console.debug(paramFromdate);
    const params = [
      paramDepositItemKeys
      , paramIsDelete
      , paramFromdate
      , paramTodate
      , paramLimit
      , paramOffset
    ];
    let searchParameters = "";
    params.forEach( p =>{
      if ((searchParameters) && (p)){
        searchParameters = searchParameters + "&";
      }
      if (p){
        searchParameters = searchParameters + p;
      }
    });
    //setThisUrl(searchParameters);
    getDepositList(user, searchParameters, undefined).then(result =>{
      console.debug(result);
      const data = result.data;
      let rowsObj = data.results.map((record, index) => createObj(record, index, rowsPerPage, page));
      setResultDatas(rowsObj);
    }).catch(error=>console.error(error))
  },[user]);


  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell className={classes.tableCell}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {resultDatas.map((row) => {
              const rowClassName = (row.delete_flag) ? classes.DelTableRow : classes.TableRow;
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className={rowClassName}>
                  {columns.map((column, index) => {
                    const value = row[column.id];
                    const paperClass = row.deposit_type === prj_const.TYPE_DEPOSIT ?
                      classes.DepositPaper : classes.ExpensesPaper;
                    return (
                      <TableCell key={column.id} align={column.align} className={classes.tableCell}>
                        { (index === 4) ? 
                          <Grid container spacing={1}
                            direction="row"
                            justifyContent="center"
                            alignItems="stretch"
                          >
                            <Grid item xs className={classes.grid}><Paper elevation={2} className={paperClass}>{value}</Paper></Grid>
                          </Grid>
                           : column.format && typeof value === 'number' ? column.format(value) : value
                        }
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
