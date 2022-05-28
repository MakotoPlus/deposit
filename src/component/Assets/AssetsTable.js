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
import {useResultDatasContext, assetsRecords, setAssetsRecords} from '../../context/resultDatasContext';
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
import {ApiGetAsstesPandas, ApiGetDepositItemList} from '../common/prj_url';
import UpdateDialog from './updateDialog';

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

//
//
// 資産テーブル
//

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
  //const [rows, setRows] = React.useState([]);
  const {assetSearch, assetsRecords, assetSearchEvent, setAssetsRecords} = useResultDatasContext();
  const [columns, setColumns] = React.useState([]);

  useEffect(()=>{
    /*
    const updateRow = (record, recordindex) =>{
      // UPDATEされた情報を更新する
      console.debug(columns);
      console.debug(rows);
      rows[recordindex]['insert_yyyymm'] = 
        <UpdateDialog id={recordindex} insert_yyyymm={record[0].insert_yyyymm}
        datas={record} headers={columns.slice(2)} updateRow={updateRow} />
      let newRows = [];
      newRows = rows;
      setRows(newRows);
    }
    */

    async function getHeader(){
      console.debug("AssetsTable--getHeader");
      let newHeaderColums = [];
      await ApiGetDepositItemList(user, false).then(result=>{
        let headerColums = [
          {
            id : 'id', 
            field:'id', 
            title:'No', 
            width:80
          }
          ,{
            id : 'insert_yyyymm', 
            field:'insert_yyyymm', 
            title:'年月', width: 100 
          }
        ];
        let headeradds = result.data.map(record=>{
          return{
            id : record.depositItem_key.toString(),
            field: record.depositItem_key.toString(),
            title: record.depositItem_name,
            align: 'right',
            width : 230,
          }}
          );
        newHeaderColums = [...headerColums, ...headeradds];
        console.debug('-*----------ApiGetDepositItemList Success');
        //console.debug(newHeaderColums);  
        return newHeaderColums;
      }).catch(error=>{
        console.error("ApiGetDepositItemList Error");
        console.error(error);
        return;
      });
      console.debug('-*----------ApiGetDepositItemList End');
      return newHeaderColums;
    }

    function createAssetRecord(record){
      let keys = Object.keys(record);      
      let tableRecord = keys.map(key=>{
        //console.debug(`key=${key}`);
        let value = record[key];
        //console.debug(`Value=${value}`);
        if (key.indexOf('deposit_value') >= 0){
          let deposit_key = key.split(",")[1];
          deposit_key = deposit_key.replace(")","");
          deposit_key = deposit_key.replace(" ","");
          //tableRecord[[deposit_key]] = value.toLocaleString();
          return {[deposit_key] : value.toLocaleString()};
        }else if(key.indexOf('insert_yyyymm') >= 0){
          return { insert_yyyymm : record[key]};
        }}
      )

      //
      // 全てのキー値を1つのオブジェクトに格納する
      //
      let merged = tableRecord.reduce((acc, obj, index)=>{
        for (let key in obj){
          acc[key] = obj[key];
          //console.log(obj[key]);
        }
        return acc;
      },{});
      //console.log(merged);  
      return merged;
    }
    // 表示レコード用に、オブジェクトを加工する 
    // キー情報が下記のようになっている
    // @param result.data
    //  [
    //    {
    //        '('deposit_value',28)' : 12322
    //        '('deposit_value',29)' : 12312
    //        '('deposit_value',30)' : 12334
    //        '('deposit_value',31)' : 12344
    //        '('insert_yyyymm','')' : '2022/04'
    //    }
    //  ]
    //
    // @return 
    //  [{
    //       id : index,
    //       insert_yyyymm : 9999/99,
    //       1(deposit_key) : 999(deposit_value),
    //       2(deposit_key) : 1999(deposit_value),
    //       datas : [{
    //         列に投入したresult.data.resultsを格納(更新や削除時に利用予定)
    //       }]
    //   }]
    //
    function apiResult2Rowdata(result){
      //
      // 行単位となる年月を取得する
      let resultDatas = result.data;
      console.debug('-*----------apiResult2Rowdata');
      console.debug(resultDatas);
      // データの変更
      // キー情報が下記のようになっているので整形する
      //
      // キー名: ('deposit_value',27)
      // キー名: ('deposit_value',28)
      // キー名: ('insert_yyyymm','')
      let records = resultDatas.map(record=>createAssetRecord(record));
      //
      // サーバ側のUnpivotライブラリでは出来ないので日付降順でソートをクライアント側で実装
      records = records.sort((a,b)=>{
        if (a.insert_yyyymm < b.insert_yyyymm){
          return 1;
        }else{
          return -1;
        }
      });
      records = records.map((record, index)=>{
        record['id'] = index + 1;
        return record;
      })
      //console.debug("records-----------------");
      //console.debug(records);
      return records;
    }
    function getRowdata(resultColumn){
      console.debug("AssetsTable--getRowdata");
      ApiGetAsstesPandas(user, assetSearch).then(result=>{
        console.debug("AssetsTable--ApiGetAsstesPandas");
        let records = apiResult2Rowdata(result);        
        let insert_yyyymms = records.map(record=>record.insert_yyyymm);
        let rowdatas = records.map((record, index)=>{
          record['insert_yyyymm'] = <UpdateDialog id={index} headers={resultColumn} />
          return record;
        })
        //console.debug(rowdatas);
        console.debug('-*----------setAssetsRecords');
        console.debug(rowdatas);
        setAssetsRecords(
          {
            data : rowdatas
            ,insert_yyyymms : insert_yyyymms
            ,columns : resultColumn
          }
        );
      }).catch(error=>{
        console.error(error);
      });
    }
    getHeader().then(result=>{
      console.debug("AssetsTable--getHeader");
      //console.debug(result);
      let headers = [];
      if (result != undefined && result.length > 2){
        headers = result.slice(2);
      }
      getRowdata(headers);
      setColumns(result);
    }).catch(error=>{
      console.error(error);
    });
  },[assetSearch, assetSearchEvent]);


  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <MaterialTable
          icons={tableIcons}
          title="Table"
          columns={columns}
          data={assetsRecords.data}
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