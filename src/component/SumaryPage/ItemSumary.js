import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';

const prj_const = require('../common/prj_const.js')

//
// ItemSumary
// 契約アイテム単位預金サマリー情報
const columns = [
    { id : 'id', label: 'No', minWidth: 50 }
    ,{ id : 'deposit_group_name', label: 'Group', minWidth:100 }
    ,{ id : 'depositItem_name', label: '項目名', minWidth:100 }
    ,{ id : 'sum_value', label: 'Value', minWidth:100, align: 'right', format:(value) => value.toLocaleString(), }
]

//
// 全データ取得
async function getItemSumaryList(user, urlParameters, urlPath){
  let path ="";
  if (!urlParameters){
    path = urlPath;
  }else{
    path = prj_const.ServerUrl + "/api/deposit_sumary_list/?" + urlParameters;
  }
  let headers = {
    headers : user.Authorization
  };
  return await axios.get(path, headers);
}

function createObj(record, index, rowPage, page ){
  return {
    id : (index + 1) + (rowPage * page),
    depositItem_key : record.depositItem_key,
    depositItem_name : record.depositItem_name,
    deposit_group_key : record.deposit_group_key.deposit_group_key, 
    deposit_group_name : record.deposit_group_key.deposit_group_name,
    deposit_group_obj : record.deposit_group_key,
    sum_value : record.sum_value.toLocaleString(),
  };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 360,
  },
});



export default function ItemSumary() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);  // 現在のページ位置（開始0）
  const [rowsPerPage, setRowsPerPage] = React.useState(10);  //現在のクライアント1ページ表示件数
  const {user} = useUserContext();
  const {resultDatas, setResultDatas, setResultAllCount,} = useResultDatasContext();
  //const [serverPage, setServerPage] = React.useState(1);  //現在のサーバ側ページ位置
  const [prevUrl, setPrevUrl] = React.useState("");   // 前ページURL
  const [nextUrl, setNextUrl] = React.useState("");   // 次ページURL
  const [maxData, setMaxData] = React.useState(0);    // 全データ件数
  //const [thisUrl, setThisUrl] = React.useState("");   // 今回アクセスすべきURL

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
    getItemSumaryList(user, undefined, url).then(result=>{
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
    // 検索パラメータURL再構築
    let paramLimit = "limit=" + rowsPerPage;
    let paramOffset = "offset=0";
    const params = [paramLimit, paramOffset];
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
    getItemSumaryList(user, searchParameters, undefined).then(result =>{
      console.debug(result);
      //前ページURL・次ページURL・データ件数設定
      const data = result.data;
      setPrevUrl(data.previous);
      setNextUrl(data.next);
      setMaxData(data.count);
      setResultAllCount(data.count);
      let rowsObj = data.results.map((record, index) => createObj(record, index, rowsPerPage, page));
      setPage(0);
      setResultDatas(rowsObj);      
    }).catch(error=>console.error(error))

  },[rowsPerPage]);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
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
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
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