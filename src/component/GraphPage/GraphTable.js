import React, {useEffect} from 'react';
import { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import MaterialTable from 'material-table';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
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




function createRowData(rowsObj) {
    let result = {}
    rowsObj.map(obj =>{
      result[obj.insert_yyyymm] = obj.value
    })
    result['id'] = rowsObj[0]['depositItem_name'];
    console.debug("createRowData2");
    console.debug(result);
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
  const [columns, setColums] = React.useState([]);
  const [rows, setRows] = React.useState([]);

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
        let items = rowDataObjs.filter(r => r.depositItem_name === itemname);
        return createRowData(items);
      });
      console.log('-*----------rows');
      console.log(rows);
      setRows(rows);
    }
    fetchData();
  },[graphDatas, user]);


  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <MaterialTable
          icons={tableIcons}
          title="Table"
          columns={columns}
          data={rows}
          options={{
            fixedColumns: {left: 1, right: 0},
            toolbar : false,
            showTitle : true,
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
