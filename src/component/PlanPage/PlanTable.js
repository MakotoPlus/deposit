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

function createObj(record, index, rowPage, page ){
  return {
    id : (index + 1) + (rowPage * page),
    savings_key : record.savings_key,
    deposit_group_name : record.depositItem_key.deposit_group_name, 
    depositItem_name : record.depositItem_key.depositItem_name, 
    deposit_type : record.deposit_type, 
    deposit_type_str : record.deposit_type === prj_const.TYPE_DEPOSIT ?
      prj_const.TYPE_DEPOSIT_STR : prj_const.TYPE_EXPENSES_STR, 
    deposit_value : record.deposit_value.toLocaleString(),
    delete_flag : record.delete_flag,
    deposit_item_obj : record.depositItem_key,
  };
}
/*
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
*/
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
async function getSavingsList(user, urlParameters, urlPath){
  //
  // parameters : URLパラメータ (未設定の場合はURLを有効にする)
  // url: アクセスURLパス
  let path ="";
  if (!urlParameters){
    path = urlPath;
  }else{
    path = prj_const.ServerUrl + "/api/savings_list/?" + urlParameters;
  }
  let headers = {
    headers : user.Authorization
  };
  return await axios.get(path, headers);
}

export default function PlanTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);  // 現在のページ位置（開始0）
  const {user} = useUserContext();
  const {plan, setPlan, planAllCount, setPlanAllCount} = usePlanContext();  
  const [rowsPerPage, setRowsPerPage] = React.useState(10);  //現在のクライアント1ページ表示件数
  //const [serverPage, setServerPage] = React.useState(1);

  const [prevUrl, setPrevUrl] = React.useState("");   // 前ページURL
  const [nextUrl, setNextUrl] = React.useState("");   // 次ページURL
  const [maxData, setMaxData] = React.useState(0);    // 全データ件数
  const [thisUrl, setThisUrl] = React.useState("");   // 今回アクセスすべきURL

  useEffect(()=>{
    console.debug('PlanTable');
    //
    // 検索パラメータURL再構築
    let paramLimit = "limit=" + rowsPerPage;
    let paramOffset = "offset=0";
    let searchParameters = paramLimit + "&" + paramOffset;
    setThisUrl(searchParameters);
    getSavingsList(user, searchParameters, undefined).then(result =>{
      console.debug(result);
      //前ページURL・次ページURL・データ件数設定
      const data = result.data;
      setPrevUrl(data.previous);
      setNextUrl(data.next);
      setMaxData(data.count);
      setPlanAllCount(data.count);
      let rowsObj = data.results.map((record, index) => createObj(record, index, rowsPerPage, page));
      setPage(0);
      setPlan(rowsObj);
    }).catch(error=>console.error(error))
  },[rowsPerPage]);

/*
  useEffect(()=>{
    function fetchData(){
      let nRunApiCount = Math.ceil(rowsPerPage / prj_const.DATA_GET_COUNT);
      console.debug(`${plan.length} データ取得回数nRunApiCount=${nRunApiCount} Page=${serverPage}`);
      getList(user, nRunApiCount, serverPage, page, true);
    }
    fetchData();
  },[user]);

  useEffect(()=>{


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
**/
  //次ページ・前ページ移動
  const handleChangePage = (event, newPage) => {
    console.debug( `handleChangePage newPage=${newPage}`);
    //現在のページから次ページなのか、前ページなのか判定する
    let url = "";
    if ( newPage > page ){
      url = nextUrl;
    }else{
      url = prevUrl;
    }
    getSavingsList(user, undefined, url).then(result=>{
      //前ページURL・次ページURL・データ件数設定
      const data = result.data;
      setPrevUrl(data.previous);
      setNextUrl(data.next);
      setMaxData(data.count);
      setPlanAllCount(data.count);
      let rowsObj = data.results.map((record, index) => 
        createObj(record, index, rowsPerPage, newPage));
      setPlan(rowsObj);
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
              plan.slice(0 * rowsPerPage, 0 * rowsPerPage + rowsPerPage).map((row) => {
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
        count={planAllCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}