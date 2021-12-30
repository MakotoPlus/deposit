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
import PlunUpdateDialog from './../PlanUpdateDialog';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {usePlanContext} from '../../context/planContext';

const prj_const = require('./../prj_const.js')

//
// 預金設定明細画面
const columns = [
    { id : 'id', label: 'No', minWidth: 50 }
    ,{ id : 'deposit_group_name', label: 'Group', minWidth:100 }
    ,{ id : 'depositItem_name', label: '預金項目', minWidth:100 }
    ,{ id : 'deposit_type_str', label: 'Type', minWidth:100 }
    ,{ id : 'deposit_value', label: 'Value', minWidth:100, align: 'right', format:(value) => value.toLocaleString(), }
]

function createData(id, savings_key, deposit_group_key,
    deposit_group_name, depositItem_name, deposit_type, 
    deposit_type_str, deposit_value, depositItem_key,
    delete_flag) {
    return { 
        id : id,
        savings_key : savings_key,
        deposit_group_name : deposit_group_name, 
        depositItem_name : depositItem_name, 
        deposit_type : deposit_type, 
        deposit_type_str : deposit_type_str, 
        deposit_value : deposit_value,
        delete_flag : delete_flag,
        deposit_item_obj : {
          deposit_group_key : deposit_group_key,
          deposit_group_name : deposit_group_name, 
          depositItem_key : depositItem_key,
          depositItem_name : depositItem_name, 
        }
    };
}
const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 350,
  },
  DelTableRow : {
    backgroundColor : 'silver',
    color : 'whilte',
  },
  TableRow : {
    backgroundColor : 'whilte',
    color : 'black',
  }
});


//
// 複数データ取得時は、datasのみ追加して返す
async function getSavingsList(user, nRunApiCount = 1, page = 1){
  let headers = {
    headers : user.Authorization
  };
  let result;
  let results = [];
  for ( let i = 0; i < nRunApiCount; i++){
    let urlpath = prj_const.ServerUrl + "/api/savings_list/";
    if ( page > 1 ){
      urlpath = urlpath + "?page=" + page;
    }
    result = await axios.get(urlpath, headers);
    results = results.concat(result.data.results);
  }
  result.data.results = results;
  return result;
}

export default function PlanTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [maxData, setMaxData] = React.useState(0);
  const {user} = useUserContext();
  const {plan, setPlan, planAllCount, setPlanAllCount} = usePlanContext();  
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [serverPage, setServerPage] = React.useState(1);

  useEffect(()=>{
    function fetchData(){
      let nRunApiCount = Math.ceil(rowsPerPage / prj_const.DATA_GET_COUNT);
      console.debug(`${plan.length} データ取得回数nRunApiCount=${nRunApiCount} Page=${serverPage}`);
      getList(user, nRunApiCount, serverPage, page, true);
    }
    fetchData();
  },[]);

  useEffect(()=>{
    if (maxData == planAllCount.count){
      return;
    }
    console.debug(planAllCount);
    console.debug("AllCount変更-----------[" + planAllCount.count + "]maxData[" + maxData + "]");
    //初期化
    //serverPage = 1;
    //page = 0;
    let nRunApiCount = Math.ceil(rowsPerPage / prj_const.DATA_GET_COUNT);
    getList(user, nRunApiCount, 1, 0, true);
  },[planAllCount]);

  const getList = (user, nRunApiCount, serverPage, newPage, isClear = false) =>{
    getSavingsList(user, nRunApiCount, serverPage, newPage, isClear).then(result=>{
      let results = result.data.results;
      let planLength = 0;
      if (isClear){
        //plan.split(0);
        console.debug(plan);
      }else{
        planLength = plan.length;
      }
      let rowsObj = results.map(( record, index ) =>       
        createData( planLength + index + 1, 
          record.savings_key,
          record.depositItem_key.deposit_group_key,
          record.depositItem_key.deposit_group_name,
          record.depositItem_key.depositItem_name,
          record.deposit_type,
          record.deposit_type === prj_const.TYPE_DEPOSIT 
          ? prj_const.TYPE_DEPOSIT_STR : prj_const.TYPE_EXPENSES_STR,
          record.deposit_value.toLocaleString(),
          record.depositItem_key.depositItem_key,
          record.delete_flag,
        ))
      let addTotalDatas = [];
      if (isClear){
        addTotalDatas = rowsObj;
      }else{
        addTotalDatas = plan.concat(rowsObj);
      }
      //console.debug(`newPage=${newPage}`);
      //console.debug('addTotalDatas---------------');
      //console.debug(addTotalDatas);
      setPlan(addTotalDatas);
      setPage(newPage);
      //サーバ側の取得ページをカウントアップ
      nRunApiCount = nRunApiCount + serverPage;
      setServerPage(nRunApiCount);
      //setMaxData(result.data.count);
      if (planAllCount.count != result.data.count){
        console.debug("AllCount-----------" + planAllCount.count);
        planAllCount.count = result.data.count
        setPlanAllCount(planAllCount);
        setMaxData(planAllCount.count);
      }
    }).catch((error)=>{
        console.error(error);
    });
  }

  const handleChangePage = (event, newPage) => {
    console.debug( `handleChangePage newPage=${newPage}`);
    //
    // 既に取得件数が最大件数まで来ている場合は何もしない
    let showDataLast = rowsPerPage * (newPage);
    if (showDataLast > planAllCount.count){
      //
      console.debug("データ最終取得済み");
      return;
    }
    //
    // 現在取得済みデータと次ページに表示するデータ件数を比較しもし
    // まだ取得していないデータ範囲を取得する場合は、通信を実行しデータを取得する
    // newPage は初期 0 
    showDataLast = rowsPerPage * (newPage+1);
      if (showDataLast <= plan.length){
      setPage(newPage);
      console.debug("データあり");
      return;
    }else if (plan.length >= planAllCount.count){
      //既に全データ取得済み時
      setPage(newPage);
      console.debug("データあり");
      return;
    }
    // 何回Restapi実行件数 = ((表示件数 * 次のページ) - データ取得済み件数 ) / Restapi１回データ取得件数
    // 小数点切り上げ
    let nRunApiCount = Math.ceil((showDataLast - plan.length) / prj_const.DATA_GET_COUNT);
    console.debug(`${showDataLast}, ${plan.length} データ取得回数nRunApiCount=${nRunApiCount} Page=${serverPage}`);
    getList(user, nRunApiCount, serverPage, newPage);
  }


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    console.debug( `handleChangeRowsPerPage value=${event.target.value}`);
    setPage(0);
  }

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
            {
              plan.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              const rowClassName = (row.delete_flag) ? classes.DelTableRow : classes.TableRow;
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className={rowClassName}>
                  {columns.map((column, index) => {
                    const value = row[column.id];                    
                      return (
                        <TableCell key={column.id} align={column.align}>
                          { (index === 2) ?
                            <PlunUpdateDialog subtitle={value} record={row} />
                            : column.format && typeof value === 'number' ? column.format(value) : value
                          }
                        </TableCell>
                      )
                    })
                  }
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={planAllCount.count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}