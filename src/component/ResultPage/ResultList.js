import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Title from '../../dashboard/Title';


const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);


// Generate Order Data
function createData(no, insert_yyyymmdd, deposit_group_name, depositItem_name, 
    deposit_type, deposit_value, deposit_key) {
    return { no, insert_yyyymmdd, deposit_group_name, depositItem_name, 
        deposit_type, deposit_value, deposit_key };
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
];

function preventDefault(event) {
    event.preventDefault();
  }

export default function ResultList(){
    return (
        <React.Fragment>
            <Title>実績リスト</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>登録年月日</TableCell>
                        <TableCell>預金項目グループ</TableCell>
                        <TableCell>預金項目</TableCell>
                        <TableCell>貯金/支出</TableCell>
                        <TableCell align="right">金額</TableCell>
                        <TableCell>預金ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                    <TableRow key={row.no}>
                        <StyledTableCell component="th" scope="row">
                        {row.insert_yyyymmdd}
                        </StyledTableCell>
                        <TableCell>{row.deposit_group_name}</TableCell>
                        <TableCell>{row.depositItem_name}</TableCell>
                        <TableCell>{row.deposit_type}</TableCell>
                        <TableCell align="right" >{row.deposit_value}</TableCell>
                        <TableCell>{row.deposit_key}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                See more orders
            </Link>
        </React.Fragment>
    );
}
