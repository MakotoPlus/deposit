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


function createRowData(rowsObj) {
    let result = {}
    rowsObj.map(obj =>{
      result[obj.insert_yyyymm] = obj.value
    })
    result['id'] = rowsObj[0]['depositItem_name'];
   return result;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 450,
  },
});


export default function GraphTable() {
  const classes = useStyles();
  const {user} = useUserContext();
  const {graphDatas} = useResultDatasContext();
  const [page, setPage] = React.useState(0);
  const [maxData, setMaxData] = React.useState(0);
  const [columns, setColums] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(1000);
  const [rows, setRows] = React.useState([]);
  const [serverPage, setServerPage] = React.useState(1);

  useEffect(()=>{
    function fetchData(){

      console.log('-*----------graphDatas');
      console.log(graphDatas);
      //
      // グラフ対応のテーブル情報表示

      //----------------------------------------------------------
      // 列ヘッダ生成
      //----------------------------------------------------------
      // 重複なしの日付を取得する
      let yyyymms = graphDatas.map(data=>data.insert_yyyymm);
      yyyymms = [...new Set(yyyymms)];
      yyyymms = yyyymms.sort();
      let grafColumns = [{id : 'id', label: 'Item', minWidth: 100 }]
      let grafDateColums = (yyyymms.map( yyyymm =>{
        return {
          id : yyyymm,
          label : yyyymm,
          align: 'right',
          format:(value) => value.toLocaleString(),
        }
      }));
      grafColumns = [...grafColumns, ...grafDateColums];
      console.log(grafColumns);
      setColums(grafColumns);

      //----------------------------------------------------------
      // 行データ生成
      //----------------------------------------------------------
      // depositItem_key Sort?
      let rowDataObjs = graphDatas.sort((a, b)=>{
        if ( a.depositItem_key < b.depositItem_key){
          return -1;
        }else{
          return 1;
        }
      })
      //
      //項目名の一覧を生成
      let depositItemNames = rowDataObjs.map(data=>data.depositItem_name);
      depositItemNames = [...new Set(depositItemNames)];
      console.log('-*----------depositItemNames');
      console.log(depositItemNames);

      //
      // 項目単位に全ての年月データを取得し行データを生成し配列へ格納
      let rows = depositItemNames.map((itemname, index) =>{
        //同じアイテム名を抽出
        let items = rowDataObjs.filter(r => r.depositItem_name == itemname);
        return createRowData(items);
      });
      console.log('-*----------rows');
      console.log(rows);
      setRows(rows);
      setMaxData(1);
    }
    fetchData();
  },[graphDatas, user]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
            {rows.map((row) => {
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
        rowsPerPageOptions={[]}
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