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
import {usePlanContext} from '../../context/planContext';

const prj_const = require('../common/prj_const.js')

//
// PlanGroupSumary
// 契約グループ単位サマリー情報
const columns = [
    { id : 'id', label: 'No', minWidth: 50 }
    ,{ id : 'deposit_group_name', label: 'Group', minWidth:100 }
    ,{ id : 'sum_value', label: 'Value', minWidth:100, align: 'right', format:(value) => value.toLocaleString(), }
]

//
// 全データ取得
async function getSavingSumaryList(user){
  let headers = {
    headers : user.Authorization
  };
  let urlpath = prj_const.ServerUrl + "/api/saving_sumary_list/?no_page";
  let result = await axios.get(urlpath, headers);
  console.log(result);
  return result;
}

function createData(id, deposit_group_name, sum_value) {
    return { 
        id : id,
        deposit_group_name : deposit_group_name, 
        sum_value : sum_value
    };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 235,
  },
});



export default function PlanGroupSumary() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [maxData, setMaxData] = React.useState(0);
  const {user} = useUserContext();  
  const {plan} = usePlanContext();  
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);

  useEffect(()=>{
    function fetchData(){
      getSavingSumaryList(user).then(result=>{
        let results = result.data;
        let rowsObj = results.map(( record, index ) => 
          createData( index + 1, 
            record.deposit_group_name,
            record.sum_value.toLocaleString()
        ))
        //console.debug(result.data.count);
        //setMaxData(result.data.count);
        console.debug(results.length);
        setMaxData(results.length);
        setRows(rowsObj);
      })
    }
    fetchData();
  },[plan,user]);


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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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