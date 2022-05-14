import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
import Grid from '@mui/material/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import AsettsUpdateDialog from './AsettsUpdateDialog';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import axios from 'axios';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
//const prj_const = require('../common/prj_const.js')

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

const prj_const = require('../common/prj_const.js')

//
//
// 実績テーブル
//
const columns = [
    { id : 'id', field:'id', title: 'No', minWidth: 10 }
    ,{ id : 'yyyymm', field:'yyyymm', title:'年月', minWidth: 20 }
    ,{ id : '01', field:'01', title: 'USJ定期積立', minWidth:100}
    ,{ id : '02', field:'02', title: 'SBI定期積立', minWidth:100}
    ,{ id : '03', field:'03', title: '埼玉りそな', minWidth:100}
    ,{ id : '04', field:'04', title: 'USJ普通口座', minWidth:100}
    ,{ id : '05', field:'05', title: 'SBI自由額', minWidth:100}
    ,{ id : '06', field:'06', title: 'SBIハイブリッド'}
    ,{ id : '07', field:'07', title: '財布AAAAAAA', minWidth:100}
    ,{ id : '08', field:'08', title: '財布BBBBBBB', minWidth:100}
    ,{ id : '09', field:'09', title: '財布CCCCCCCC', minWidth:100}
    ,{ id : '10', field:'10', title: '財布DDDDDDD', minWidth:100}
    //,{ id : 'deposit_key', label: 'Key', minWidth:100 }
]

function getDepositList(){
  return (
    {'data' : {
        'previous' : ''
        ,'next' : ''
        ,'count' : 1
        , 'results' : [
          {
            'id': '1'
            ,'yyyymm': '2021/01'
            ,'01': 3214
            ,'02': 123452
            ,'03': 123435
            ,'04': 123445
            ,'05': 123455
            ,'06': 123456
            ,'07': 123457
            ,'08': 123457
            ,'09': 123457
            ,'10': 123457
          }
        ]
      }
    }
  );
  //
  // parameters : URLパラメータ (未設定の場合はURLを有効にする)
  // url: アクセスURLパス
  /*
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
  */

}

function createRowData(rowsObj) {
  let result = {}
  rowsObj.map(obj =>{
    result[obj.insert_yyyymm] = obj.value.toLocaleString();
  })
  result['id'] = rowsObj[0]['depositItem_name'];
  console.debug("createRowData2");
  console.debug(result);
 return result;
}

function createObj(record, index, rowPage, page ){
  return {
    'id' : (index + 1) + (rowPage * page),
    'yyyymm' : record['yyyymm'],
    '01' : record['01'],
    '02' : record['02'],
    '03' : record['03'],
    '04' : record['04'],
    '05' : record['05'],
    '06' : record['06'],
    '07' : record['07'],
    '08' : record['08'],
    '09' : record['09'],
    '10' : record['10'],
  }
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 450,
  },
});

export default function AssetsTable() {
  const classes = useStyles();
  const {user} = useUserContext();
  //const {graphDatas} = useResultDatasContext();
  //const [columns, setColums] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  useEffect(()=>{
    function fetchData(){

      console.debug('-*----------graphDatas');
      let retdata = getDepositList();
      console.debug(retdata);
      //data = data.results;

      let rowsdata = retdata.data.results.map((r, i ) => createObj(r, i, 5, 0));
      console.debug('-*----------rowsdata');
      console.debug(rowsdata);
      setRows(rowsdata);
      //console.debug(graphDatas);
      //
      // グラフ対応のテーブル情報表示

      //----------------------------------------------------------
      // 列ヘッダ生成
      //----------------------------------------------------------
      // 重複なしの日付を取得する
      /*
      let yyyymms = graphDatas.map(data=>data.insert_yyyymm);
      yyyymms = [...new Set(yyyymms)];
      yyyymms = yyyymms.sort();
      let grafColumns = [{id : 'id', title:'Item', field:'id', width: 200 }]
      let grafDateColums = (yyyymms.map( yyyymm =>{
        return {
          id : yyyymm,
          title : yyyymm,
          field: yyyymm,
          align: 'right',
          width: 150,
          format:(value) => value.toLocaleString(),
        }
      }));
      grafColumns = [...grafColumns, ...grafDateColums];
      console.debug(grafColumns);
      setColums(grafColumns);
      */
      //----------------------------------------------------------
      // 行データ生成
      //----------------------------------------------------------
      // depositItem_key Sort?
      /*
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
      console.debug('-*----------depositItemNames');
      console.debug(depositItemNames);

      //
      // 項目単位に全ての年月データを取得し行データを生成し配列へ格納
      let rows = depositItemNames.map((itemname, index) =>{
        //同じアイテム名を抽出
        let items = rowDataObjs.filter(r => r.depositItem_name === itemname);
        return createRowData(items);
      });
      console.debug('-*----------rows');
      console.debug(rows);
      setRows(rows);
      */
    }
    fetchData();
  },[]);


  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <MaterialTable
          icons={tableIcons}
          title="Table"
          columns={columns}
          data={rows}
          options={{
            fixedColumns: {left: 2, right: 0},
            toolbar : false,
            showTitle : false,
          }}
          localization={{
            pagination: {
              labelRowsSelect: 'linhas',
              labelDisplayedRows: '{count} de {from}-{to}',
              firstTooltip: 'Primeira página',
              previousTooltip: 'Página anterior',
              nextTooltip: 'Próxima página',
              lastTooltip: 'Última página'
            }
          }}
          />
      </TableContainer>
    </Paper>
  );
}