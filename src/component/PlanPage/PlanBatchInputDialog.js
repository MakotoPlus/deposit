import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker01 from '../DatePicker01'
//import DepositItemSelectGrouping from '../DepositItemSelectGrouping';
//import DepositItemMultiSelect from './../DepositItemMultiSelect';
//import DepositTypeSelect from '../DepositTypeSelect';
//import DepositValueText from '../DepositValueText';
import { makeStyles } from '@material-ui/core/styles';
//import { TYPE_DEPOSIT } from '../prj_const';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import InputMemoText from '../InputMemoText';
const prj_const = require('./../prj_const.js')

//
// 計画情報一括登録画面


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
    Button:{
        margin : 5,
      },    
}));
  
  
export default function PlanBatchInputDialog(props) {
  const {user} = useUserContext();
  //const {resultDatas, setResultDatas, resultAllCount, setResultAllCount} = useResultDatasContext();  
  //const userid = user.userid;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [fullWidth, ] = React.useState(true);
  let dt = new Date();
  let LocalDate = dt.getFullYear() + "/" + ("00" + (dt.getMonth()+1)).slice(-2) + "/" +  ("00" + dt.getDate()).slice(-2);

  const [insertYyyymmdd, setInsertYyyymmdd] = useState(LocalDate);
  const handleInsertYyyymmdd = value =>{
    console.debug(value);
    setInsertYyyymmdd(value);
  }

  const [memo, setMemo] = React.useState("");
  const handleMemo = (event) =>{
    console.debug('handleMemo');
    console.debug(event.target.value);
    setMemo(event.target.value);
  } 
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleCreate = () => {
    console.log("Create");
    console.log(`PlanBatchInputDialog.insertYyyymmdd[${insertYyyymmdd}]`);
    console.log(`PlanBatchInputDialog.memo[${memo}]`);
    const data ={
      insert_yyyymmdd : insertYyyymmdd,
      insert_yyyymm : insertYyyymmdd.substring(0,7),
      memo: memo,
    };
    //Post実行
    axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
    axios.defaults.baseURL = prj_const.ServerUrl + "/api";
    axios.post(prj_const.ServerUrl + "/api/deposit_batch/", data 
    ).then(response =>{
      console.log(response);
      setOpen(false);
    }).catch( error =>{
      console.error(error);
    });
  }   
  
  return (
    <div>
      <Button className={classes.Button} variant="outlined" color="primary" onClick={handleClickOpen}>
        {props.subtitle}
      </Button>
      <Dialog 
        fullWidth={fullWidth}
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.subtitle}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <DatePicker01 labelName="登録年月日" yyyymmdd={insertYyyymmdd} setYyyymmdd={handleInsertYyyymmdd} />
            <InputMemoText handle={handleMemo} value={memo} />
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
  