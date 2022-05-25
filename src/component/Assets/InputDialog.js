import React,{useState} from 'react';
import {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import DatePickerYearMonth from '../common/DatePickerYearMonth';
import {TYPE_DEPOSIT, TYPE_DEPOSIT_STR, TYPE_EXPENSES_STR} from '../common/prj_const';
import {ApiGetDepositItemList, ApiPostAssets} from '../common/prj_url';
import {date2StringYyyymmdd} from '../common/prj_func';
import Alert from '@material-ui/lab/Alert';

//
// 資産データ登録ダイアログ
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '20ch',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));


export default function InputDialog({subtitle}) {
  const classes = useStyles();
  const {user} = useUserContext();
  const [open, setOpen] = React.useState(false);
  const [fullWidth, ] = React.useState(true);
  const [columnRecords, setColumRecords] = React.useState([]);
  const [message, setMessage] = React.useState("");
  //let LocalDate = dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2) + "/" +  ("00" + dt.getDate()).slice(-2);
  const [insertYyyymmdd, setInsertYyyymmdd] = useState(new Date());

  useEffect(()=>{
    ApiGetDepositItemList(user, false).then(result=>{
      console.debug("Assets InputDialog--ApiGetDepositItemList");
      console.debug(result);
      setColumRecords(result.data.map(record=>{
        return {
          id : record.depositItem_key,
          field : record.depositItem_key, 
          title : record.depositItem_name,
          value : 0,
          minWidth : 100,
        }
      }));
    }).catch( error =>{
      console.error(error);
    });
  },[]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handelValueChange = (index, event) =>{
    console.debug(event.target.value);
    console.debug(index);
    // 入力された値に更新
    columnRecords[index].value = event.target.value;
    setColumRecords(columnRecords);
  }
  
  const handleCreate = () => {
    console.debug("Create");
    console.debug(`ResultInputDialog.insertYyyymmdd[${insertYyyymmdd}]`);
    let dt = new Date();
    let yyyymmdd = date2StringYyyymmdd(insertYyyymmdd, 1);
    let records = columnRecords.map(record=>{
      return ({
        depositItem_key : record.id,
        deposit_type : TYPE_DEPOSIT,
        deposit_value : record.value,
        insert_yyyymmdd : yyyymmdd,
        insert_yyyymm : yyyymmdd.slice(0,7),
        delete_flag: false,
        update_date : dt,
      });
    });
    console.debug(records);
    ApiPostAssets(user, records).then(result=>{
      console.debug("ApiPostAssets Success");
      console.debug(result);
      setMessage("");
      setOpen(false);
    }).catch(error =>{
      console.debug(error);
      setMessage("登録エラーが発生しました。もしかしたら既に登録されている年月の可能性がありますよ？");
    });    
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        New Data
      </Button>
      <Dialog 
        fullWidth={fullWidth}
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
        maxWidth={'xl'}
      >
        <DialogTitle id="form-dialog-title">{subtitle}</DialogTitle>
        <DialogContent>
          {
            (message) ?<Alert severity="error">{message}</Alert> : ""
          }
          <form className={classes.root} noValidate autoComplete="off">
            <Paper elevation={3} >
              <DatePickerYearMonth labelName={"登録年月"} yyyymmdd={insertYyyymmdd} setYyyymmdd={setInsertYyyymmdd} />              
            </Paper>
            <Paper elevation={3} >
            {
              columnRecords.map((column, index)=>{
                return(
                  <TextField
                    required
                    key={index}
                    label={column.title}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    defaultValue={column.value}
                    onChange={(event) => handelValueChange(index, event)}
                  />
                )})
            }
            </Paper>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
