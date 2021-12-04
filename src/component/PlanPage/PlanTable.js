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
import PlunUpdateDialog from './../PlanUpdateDialog';

//
// 預金設定明細画面
const columns = [
    { id : 'order_dsp', label: 'No', minWidth: 50 }
    ,{ id : 'deposit_group_name', label: 'Group', minWidth:100 }
    ,{ id : 'depositItem_name', label: 'Name', minWidth:100 }
    ,{ id : 'deposit_type', label: 'Type', minWidth:100 }
    ,{ id : 'deposit_value', label: 'Value', minWidth:100, align: 'right', format:(value) => value.toLocaleString(), }
]

function createData(id, deposit_group_name, depositItem_name, 
    deposit_type, deposit_value) {
    return { 
        order_dsp : id,
        deposit_group_name : deposit_group_name, 
        depositItem_name : depositItem_name, 
        deposit_type : deposit_type, 
        deposit_value : deposit_value
    };
  }
  const rows = [
    createData(
        1,
        '貯金グループ',
        '住宅',
        '貯金',
        '123,222',
    ),
    createData(
        2,
        '車グループ',
        '時期車代',
        '貯金',
        '23,222',
    ),
    createData(
        3,
        '車グループ',
        'ガソリン代',
        '貯金',
        '123,222',
    ),
    createData(
      4,
      '家修繕費',
      '家税金',
      '貯金',
      '123,222',
    ),
    createData(
      5,
      '家修繕費',
      '修繕費',
      '貯金',
      '123,222',
    ),
    createData(
      6,
      'レジャー',
      '旅行',
      '貯金',
      '123,222',
    ),
    createData(
      7,
      'レジャー',
      'その他',
      '貯金',
      '123,222',
      'KEY_003'
    ),
  ];

  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 250,
    },
  });

export default function PlanTable() {
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
                <TableRow hover role="checkbox" tabIndex={-1} key={row.order_dsp}>
                  {columns.map((column, index) => {
                    const value = row[column.id];                    
                      return (
                        <TableCell key={column.id} align={column.align}>
                          { (index === 2) ?                             
                            <PlunUpdateDialog subtitle={value} />
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