import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import ResultUpdateDialog from '../ResultUpdateDialog';

//
//
// 実績テーブル
//
const columns = [
    { id : 'id', label: 'No', minWidth: 50 }
    ,{ id : 'insert_yyyymmdd', label: 'Insert Date', minWidth:100 }
    ,{ id : 'deposit_group_name', label: 'Group', minWidth:100 }
    ,{ id : 'depositItem_name', label: 'Name', minWidth:100 }
    ,{ id : 'deposit_type', label: 'Type', minWidth:100 }
    ,{ id : 'deposit_value', label: 'Value', minWidth:100, align: 'right', format:(value) => value.toLocaleString(), }
    //,{ id : 'deposit_key', label: 'Key', minWidth:100 }
]

function createData(id, insert_yyyymmdd, deposit_group_name, depositItem_name, 
    deposit_type, deposit_value, deposit_key) {
    return { 
        id : id,
        insert_yyyymmdd : insert_yyyymmdd, 
        deposit_group_name : deposit_group_name, 
        depositItem_name : depositItem_name, 
        deposit_type : deposit_type, 
        deposit_value : deposit_value, 
        deposit_key : deposit_key
    };
  }
  const rows = [
    createData(
      1,
      '2021/11/01',
      '貯金グループ',
      '住宅',
      '貯金',
      '123,222',
      'KEY_001'
    ),
    createData(
      2,
      '2021/11/02',
      '貯金グループ',
      '車',
      '貯金',
      '23,222',
      'KEY_002'
    ),
    createData(
      3,
      '2021/11/03',
      '貯金グループ',
      '旅行',
      '貯金',
      '123,222',
      'KEY_003'
    ),
    createData(
      4,
      '2021/11/03',
      '貯金グループ',
      '旅行',
      '貯金',
      '123,222',
      'KEY_003'
    ),
    createData(
      5,
      '2021/11/03',
      '貯金グループ',
      '旅行',
      '貯金',
      '123,222',
      'KEY_003'
    ),
    createData(
      6,
      '2021/11/03',
      '貯金グループ',
      '旅行',
      '貯金',
      '123,222',
      'KEY_003'
    ),
    createData(
      7,
      '2021/11/03',
      '貯金グループ',
      '旅行',
      '貯金',
      '123,222',
      'KEY_003'
    ),
    createData(
      8,
      '2021/11/03',
      '貯金グループ',
      '旅行',
      '貯金',
      '123,222',
      'KEY_003'
    ),
    createData(
      9,
      '2021/11/03',
      '貯金グループ',
      '旅行',
      '貯金',
      '123,222',
      'KEY_003'
    ),
    createData(
      10,
      '2021/11/03',
      '貯金グループ',
      '旅行',
      '貯金',
      '123,222',
      'KEY_003'
    ),
    createData(
      11,
      '2021/11/03',
      '貯金グループ',
      '旅行',
      '貯金',
      '123,222',
      'KEY_003'
    ),
  ];

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

  });

export default function ResultTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column, index) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align} className={classes.tableCell}>
                        { (index === 1) ?
                          <ResultUpdateDialog subtitle={value} />
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}