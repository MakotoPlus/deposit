import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@mui/material/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import ResultUpdateDialog from '../ResultUpdateDialog';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import axios from 'axios';

const prj_const = require('./../prj_const.js')

//
//
// 実績テーブル
//
const columns = [
    { id : 'id', label: 'No', minWidth: 50 }
    ,{ id : 'insert_yyyymmdd', label: 'Insert Date', minWidth:100 }
    ,{ id : 'deposit_group_name', label: 'Group', minWidth:100 }
    ,{ id : 'depositItem_name', label: 'Name', minWidth:100 }
    ,{ id : 'moneyType_name', label: '種', minWidth:100 }
    ,{ id : 'deposit_type_str', label: 'Type', minWidth:100 }
    ,{ id : 'deposit_value', label: 'Value', minWidth:100, align: 'right', format:(value) => value.toLocaleString()}
    ,{ id : 'memo', label : 'Memo', minWidth:100 }
    //,{ id : 'deposit_key', label: 'Key', minWidth:100 }
]

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

export default function ResultTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);  // 現在のページ位置（開始0）
  const [rowsPerPage, setRowsPerPage] = React.useState(10);  //現在のクライアント1ページ表示件数
  const {user} = useUserContext();
  const {resultDatas, setResultDatas, 
      resultAllCount, setResultAllCount,
      resultSearch, setResultSearch,} = useResultDatasContext();
  //const [serverPage, setServerPage] = React.useState(1);  //現在のサーバ側ページ位置
  const [prevUrl, setPrevUrl] = React.useState("");   // 前ページURL
  const [nextUrl, setNextUrl] = React.useState("");   // 次ページURL
  const [maxData, setMaxData] = React.useState(0);    // 全データ件数
  const [thisUrl, setThisUrl] = React.useState("");   // 今回アクセスすべきURL
    /*
  useEffect(()=>{
    // 検索条件からURL生成
    //resultSearch
  }*/

  //次ページ・前ページ移動
  const handleChangePage = (event, newPage) => {
    console.debug(`handleChangePage::newPage=${newPage}`);
    //現在のページから次ページなのか、前ページなのか判定する
    let url = "";
    if ( newPage > page ){
      url = nextUrl;
    }else{
      url = prevUrl;
    }
    getDepositList(user, undefined, url).then(result=>{
      //console.debug(result);
      //前ページURL・次ページURL・データ件数設定
      const data = result.data;
      setPrevUrl(data.previous);
      setNextUrl(data.next);
      setMaxData(data.count);
      setResultAllCount(data.count);
      let rowsObj = data.results.map((record, index) => createObj(record, index, rowsPerPage, newPage));
      setResultDatas(rowsObj);
      setPage(newPage);
    }).catch(error => console.error(error))
  };

  // 1ページの表示件数変更イベント
  // 先頭ページでデータ取得しなおし
  const handleChangeRowsPerPage = (event) => {
    let newPage = +event.target.value;
    console.debug(`handleChangeRowsPerPage::newPage=${newPage}`);
    setRowsPerPage(newPage);
    setPage(0);
  }

  useEffect(()=>{
    //
    // 検索条件変更時 -> 検索実行
    console.debug('ResultTable::ResultTable');
    console.debug(resultSearch);
    //
    // 検索パラメータURL再構築
    let paramDepositItemKeys = "";
    // 預金項目
    let depositItemkeys = resultSearch.select_items;
    depositItemkeys.forEach(keys=>{
      if (keys){
        const value = "depositItem_key=" + keys;
        console.log(value);
        if (paramDepositItemKeys){
          paramDepositItemKeys = paramDepositItemKeys + "&";
        }
        paramDepositItemKeys = paramDepositItemKeys + value;
      }
    });
    //削除フラグ
    let paramIsDelete = "delete_flag=false";
    if (resultSearch.select_delete){
      //paramIsDelete = "delete_flag=true&delete_flag=false";
      paramIsDelete = "";
    }
    console.log(paramIsDelete);
    //日付(gte=以上 lte=以下)
    let paramTodate = "";
    if (resultSearch.select_fromto_date[0]){
      paramTodate = "insert_yyyymmdd__gte=" + resultSearch.select_fromto_date[0];
    }
    let paramFromdate = "";
    if (resultSearch.select_fromto_date[1]){
      paramFromdate = "insert_yyyymmdd__lte=" + (resultSearch.select_fromto_date[1]);
    }
    let paramLimit = "limit=" + rowsPerPage;
    let paramOffset = "offset=0";
    console.log(paramTodate);
    console.log(paramFromdate);
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
    setThisUrl(searchParameters);
    getDepositList(user, searchParameters, undefined).then(result =>{
      console.debug(result);
      //前ページURL・次ページURL・データ件数設定
      const data = result.data;
      let rowsObj = data.results.map((record, index) => createObj(record, index, rowsPerPage, page));
      setResultDatas(rowsObj);
      setPage(0);
      setPrevUrl(data.previous);
      setNextUrl(data.next);
      setMaxData(data.count);
      setResultAllCount(data.count);
    }).catch(error=>console.error(error))

  },[resultSearch,rowsPerPage]);

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
            {resultDatas.slice(0 * rowsPerPage, 0 * rowsPerPage + rowsPerPage).map((row) => {
              const rowClassName = (row.delete_flag) ? classes.DelTableRow : classes.TableRow;
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className={rowClassName}>
                  {columns.map((column, index) => {
                    const value = row[column.id];
                    const paperClass = row.deposit_type === prj_const.TYPE_DEPOSIT ?
                      classes.DepositPaper : classes.ExpensesPaper;
                    return (
                      <TableCell key={column.id} align={column.align} className={classes.tableCell}>
                        { (index === 1) ?
                          <ResultUpdateDialog subtitle={value} record={row} />
                          : (index === 5) ? 
                          <Grid container spacing={1}
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="stretch"
                          >
                            <Grid item xs className={classes.grid}><Paper elevation={2} className={paperClass}>{value}</Paper>
                            </Grid>
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
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={maxData}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}