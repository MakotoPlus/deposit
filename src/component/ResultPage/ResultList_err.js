/*
import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


import Title from './../../dashboard/Title';

import { DataGrid } from '@mui/x-data-grid';
*/

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'firstName') || ''} ${
        params.getValue(params.id, 'lastName') || ''
      }`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

//export default function DataTable() {
export default function ResultList(){
    return (
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
  );
}

/*
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'insert_yyyymmdd', headerName: 'insert_yyyymmdd', width: 130 },
    { field: 'deposit_group_name', headerName: 'deposit_group_name', width: 130 },
    { field: 'depositItem_name', headerName: 'depositItem_name', width: 130 },
    { field: 'deposit_type', headerName: 'deposit_type', width: 130 },
    { field: 'deposit_value', headerName: 'deposit_value', width: 130 },
    { field: 'deposit_key', headerName: 'deposit_key', width: 130 },
];

// Generate Order Data
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
];

function preventDefault(event) {
    event.preventDefault();
  }

export default function ResultList(){
    return (

        <React.Fragment>
            <Title>実績リスト</Title>
            <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </div>

            <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                See more orders
            </Link>
        </React.Fragment>
    );
}
*/