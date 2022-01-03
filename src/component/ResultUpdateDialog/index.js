import React from 'react';
import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker01 from '../DatePicker01'
//import DepositGroupSelect from '../DepositGroupSelect';
//import DepositItemSelect from '../DepositItemSelect';
import DepositItemSelectGrouping from '../DepositItemSelectGrouping'
import DepositTypeSelect from '../DepositTypeSelect';
import DepositValueText from '../DepositValueText';
import InputMemoText from '../InputMemoText';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@mui/material/Link';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
const prj_const = require('./../prj_const.js');


async function apiUpdateDeposit(deposit_key, data, user){
  console.debug("/api/deposit/--------------------------");
  axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
  axios.defaults.baseURL = prj_const.ServerUrl + "/api";
  return await axios.patch(prj_const.ServerUrl + "/api/deposit/" + deposit_key + "/", data);
}


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


export default function ResultUpdateDialog(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [fullWidth, ] = React.useState(true);
  const [record, setRecord] = React.useState(props.record);
  const {user} = useUserContext();
  //const [deposit_key, ] = React.useState(props.record.deposit_key);
  const deposit_key = props.record.deposit_key;
  const {resultDatas, setResultDatas, } = useResultDatasContext();

  //console.debug(`ResultUpdateDialog--props`);
  //console.debug(props);
  //console.debug(`ResultUpdateDialog--props-yyyymmdd=${props.record.insert_yyyymmdd}`);
  //
  //登録日
  const [insert_yyyymmdd, setInsert_yyyymmdd] = React.useState(props.record.insert_yyyymmdd);
  const handleInsertYyyymmdd = value =>{
    console.debug(value);
    setInsert_yyyymmdd(value);
  }


  //
  // 預金項目Select
  // DepositItemSelectGrouping
  const [depositItemObj, setDepositItemObj] = React.useState(record.depositItem_key);
  const [depositItemkey, setDepositItemkey] = React.useState(record.depositItem_key.depositItem_key);
  //const [depositItemkey, setDepositItemkey] = React.useState(record.depositItem_key);
  //depositItem_key
  const handleDepositItemObj = value => {
    console.debug("handleDepositItemObj");
    console.debug(value);
    setDepositItemObj(value);
    setDepositItemkey(value.depositItem_key);
  }
  //
  // 預金/支出
  const [depositType, setDepositType] = React.useState(props.record.deposit_type);
  const handleDepositType = value => setDepositType(value);
  //
  // 金額入力Text
  const [depositValue, setDepositValue] = React.useState(()=>{
      let value = props.record.deposit_value;
      if ('string' === typeof(value)){
        value = value.replace(/,/g, '');
      }
      return value;
    }
  )
  const handleDepositUpdate = value => setDepositValue(value);

  const [memo, setMemo] = React.useState(props.record.memo);
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

  const handleUpdate = () => {
    console.debug("Update");
    //登録日
    console.debug(`insert_yyyymmdd=${insert_yyyymmdd}`);
    //預金項目
    console.debug(`depositItem_key=${depositItemkey}`);
    //預金/支出
    console.debug(`depositType=${depositType}`);
    //金額
    console.debug(`depositValue=${depositValue}`);
    //メモ
    console.debug(`memo=${memo}`);
    console.debug(`DepositItemObj`);
    console.debug(depositItemObj);
    function fetchData() {
      const data = {
        depositItem_key : depositItemkey,
        deposit_type : depositType,
        deposit_value : depositValue,
        insert_yyyymmdd : insert_yyyymmdd,
        insert_yyyymm: insert_yyyymmdd.substr(0, 7),
        memo : memo,
        delete_flag : false,
        u_user : user.userid,
        update_date : new Date().toISOString(),
      }

      apiUpdateDeposit(deposit_key, data, user).then(response =>{
        //
        // 親の一覧データ更新処理
        console.log(response);
        let newRows = [...resultDatas];
        let newRow = newRows.find( r => r.deposit_key === deposit_key);
        newRow.delete_flag = false;
        newRow.deposit_type = depositType;
        newRow.deposit_type_str = (depositType === prj_const.TYPE_DEPOSIT)
        ? prj_const.TYPE_DEPOSIT_STR : prj_const.TYPE_EXPENSES_STR;
        newRow.deposit_value = Number(depositValue).toLocaleString();
        newRow.memo = memo;
        newRow.insert_yyyymmdd = insert_yyyymmdd;
        newRow.depositItem_key = depositItemObj;
        newRow.depositItem_name = depositItemObj.depositItem_name;
        newRow.deposit_group_name = depositItemObj.deposit_group_name;
        newRow.moneyType_name = depositItemObj.moneyType_name;
        console.debug('update row----------------');
        console.debug(newRow);
        setResultDatas(newRows);
        setRecord(newRow);
        setOpen(false);
      }).catch(error => console.error(error));
    }
    fetchData();
  }

  const handleDelete = () => {
    console.log("Delete");
    function fetchData(){
      const data = {
        delete_flag : true,
        u_user : user.userid,
        update_date : new Date().toISOString()
      }
      apiUpdateDeposit(deposit_key, data, user).then(response =>{
        // 親の一覧データ更新処理
        //
        console.log(response);
        let newRows = [...resultDatas];
        let newRow = newRows.find( r => r.deposit_key === deposit_key );
        newRow.delete_flag = true;
        console.debug('new row----------------');
        setResultDatas(newRows);
        setRecord(newRow);
        setOpen(false);
      }).catch(error => console.error(error));
    }
    fetchData();
  }

  return (
    <div>
      <Link component="button" onClick={handleClickOpen}>
        {props.subtitle}
      </Link>
      <Dialog 
        fullWidth={fullWidth}
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.subtitle}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <DatePicker01 labelName="登録年月日" yyyymmdd={insert_yyyymmdd} setYyyymmdd={handleInsertYyyymmdd} />
            <DepositItemSelectGrouping handle={handleDepositItemObj} depositItem_key={depositItemkey}/>
            <DepositTypeSelect handle={handleDepositType} value={depositType} />
            <DepositValueText handle={handleDepositUpdate} value={depositValue} />
            <InputMemoText handle={handleMemo} value={memo} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
