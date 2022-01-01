import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker01 from '../DatePicker01'
import DepositItemSelectGrouping from '../DepositItemSelectGrouping';
//import DepositItemMultiSelect from './../DepositItemMultiSelect';
import DepositTypeSelect from '../DepositTypeSelect';
import DepositValueText from '../DepositValueText';
import { makeStyles } from '@material-ui/core/styles';
import { TYPE_DEPOSIT } from '../prj_const';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import InputMemoText from '../InputMemoText';
const prj_const = require('./../prj_const.js')

//
// 実績データ登録ダイアログ
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


export default function ResultInputDialog({subtitle}) {
  const {user} = useUserContext();
  const {resultDatas, setResultDatas, resultAllCount, setResultAllCount} = useResultDatasContext();  
  const userid = user.userid;
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
  //
  // 金額入力Text
  const [depositValue, setDepositValue] = React.useState(0);
  const handleDepositUpdate = value => setDepositValue(value);

  //
  // 預金/支出
  const [depositType, setDepositType] = React.useState(TYPE_DEPOSIT);
  const handleDepositType = value => {    
    console.debug('ResultInputDialog');
    console.debug(value);
    setDepositType(value);
  }

  const [memo, setMemo] = React.useState("");
  const handleMemo = (event) =>{
    console.debug('handleMemo');
    console.debug(event.target.value);
    setMemo(event.target.value);
  } 
  

  //
  // 預金項目Select
  const [depositItemObj, setDepositItemObj] = React.useState({});
  const [depositItemkey, setDepositItemkey] = React.useState(0);
  const handleDepositItemkey = value => {
    console.debug(value);
    setDepositItemkey(value.depositItem_key);
    setDepositItemObj(value);
  }
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleCreate = () => {
    console.log("Create");
    console.log(`ResultInputDialog.depositValue=[${depositValue}]`);
    console.log(`ResultInputDialog.depositItemkey=[${depositItemkey}]`);
    console.log(`ResultInputDialog.depositType=[${depositType}]`);
    console.log(`ResultInputDialog.insertYyyymmdd[${insertYyyymmdd}]`);
    const data ={
      depositItem_key : depositItemkey,
      deposit_type : depositType,
      deposit_value : depositValue,
      insert_yyyymmdd : insertYyyymmdd,
      memo: memo,
      delete_flag : false,
      u_user : userid,
      update_date : new Date().toISOString(),
    };

    //Post実行
    axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
    axios.defaults.baseURL = prj_const.ServerUrl + "/api";
    axios.post(prj_const.ServerUrl + "/api/deposit/", data 
    ).then(response =>{
      console.log(response);
      let newRow = {
        deposit_key: response.data.deposit_key,
        deposit_group_name: depositItemObj.deposit_group_name,
        deposit_type: response.data.deposit_type,
        depositItem_name: depositItemObj.depositItem_name,
        deposit_type_str: response.data.deposit_type === prj_const.TYPE_DEPOSIT 
          ? prj_const.TYPE_DEPOSIT_STR : prj_const.TYPE_EXPENSES_STR,
        deposit_value: Number(response.data.deposit_value).toLocaleString(),
        deposit_item_obj : depositItemObj,
        memo: memo,
        insert_yyyymmdd : response.data.insert_yyyymmdd,
      }
    //
      // データ追加は行わないがトータル金額などの更新のためにデータを再設定する
      //
      // ここにデータ件数追加された事によりPlanTableの最大件数を1件増やすイベントを追加する
      //
      //
      console.log(newRow);
      let newRows = [...resultDatas];
      setResultDatas(newRows);
      setResultAllCount({count: resultAllCount.count+1});
      setOpen(false);
    }).catch( error =>{
      console.error(error);
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
    >
      <DialogTitle id="form-dialog-title">{subtitle}</DialogTitle>
      <DialogContent>
        <form className={classes.root} noValidate autoComplete="off">
          <DatePicker01 labelName="登録年月日" yyyymmdd={insertYyyymmdd} setYyyymmdd={handleInsertYyyymmdd} />
          <DepositItemSelectGrouping handle={handleDepositItemkey} />
          <DepositTypeSelect handle={handleDepositType} value={depositType}/>
          <DepositValueText handle={handleDepositUpdate} value={0} />
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
