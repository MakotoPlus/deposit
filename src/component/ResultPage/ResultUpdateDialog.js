import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker from '../common/DatePicker'
//import DepositGroupSelect from '../DepositGroupSelect';
//import DepositItemSelect from '../DepositItemSelect';
import DepositItemSelectGrouping from '../common/DepositItemSelectGrouping'
import DepositTypeSelect from '../common/DepositTypeSelect';
import DepositValueText from '../common/DepositValueText';
import InputMemoText from '../common/InputMemoText';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@mui/material/Link';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import {ApiUpdateDeposit} from '../common/prj_url';
import {TYPE_DEPOSIT, TYPE_DEPOSIT_STR, TYPE_EXPENSES_STR} from '../common/prj_const';

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
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const {user} = useUserContext();
  const {resultDatas, setResultDatas, } = useResultDatasContext();
  const [fullWidth, ] = React.useState(true);
  const [record, setRecord] = React.useState(props.record);
  const [deposit_key, setDeposit_key] = React.useState(props.record.deposit_key);
  //
  // 預金項目Select
  // DepositItemSelectGrouping
  const [depositItemObj, setDepositItemObj] = React.useState(props.record.depositItem_key);
  const [depositItemkey, setDepositItemkey] = React.useState(props.record.depositItem_key.depositItem_key);
  //
  //登録日
  const [insert_yyyymmdd, setInsert_yyyymmdd] = React.useState(props.record.insert_yyyymmdd);
  //
  // 預金/支出
  const [depositType, setDepositType] = React.useState(props.record.deposit_type);
  //
  // 金額入力Text
  //const [depositValue, setDepositValue] = React.useState(props.record.deposit_value);
  const [depositValue, setDepositValue] = React.useState(
    ('string' === typeof(props.record.deposit_value) ?
      props.record.deposit_value.replace(/,/g, '')
      : props.record.deposit_value
    )
  );
  //
  // メモ
  const [memo, setMemo] = React.useState(props.record.memo);


  // 登録日設定
  const handleInsertYyyymmdd = value =>{
    console.debug(value);
    setInsert_yyyymmdd(value);
  }

  useEffect(()=>{
    console.debug('-------------------------ResultUpdateDialog');
    console.debug(props.record);
    setRecord(props.record);
    setDeposit_key(props.record.deposit_key);
    //
    // 預金項目Select
    // DepositItemSelectGrouping
    setDepositItemObj(props.record.depositItem_key);
    setDepositItemkey(props.record.depositItem_key.depositItem_key);
    //
    //登録日
    setInsert_yyyymmdd(props.record.insert_yyyymmdd);
    //
    // 預金/支出
    setDepositType(props.record.deposit_type);
    //
    // 金額入力Text
    setDepositValue(
      ('string' === typeof(props.record.deposit_value) ?
        props.record.deposit_value.replace(/,/g, '')
        : props.record.deposit_value
      )
    );
    //
    // メモ
    setMemo(props.record.memo);
  },[props.record]);

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
  const handleDepositType = value => setDepositType(value);
  const handleDepositUpdate = value => setDepositValue(value);

  const handleMemo = (event) =>{
    console.debug('handleMemo');
    console.debug(event.target.value);
    setMemo(event.target.value);
  } 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    //
    // 値を変更した場合、オブジェクトが更新されてしまっているので元に戻す
    //
    // あいにく record オブジェクトの値は変更されていないのでそれを利用する

    // 登録日
    setInsert_yyyymmdd(record.insert_yyyymmdd);
    //
    // 預金項目Select
    setDepositItemObj(record.depositItem_key);
    setDepositItemkey(record.depositItem_key.depositItem_key);
    //
    // 預金/支出
    setDepositType(record.deposit_type);
    //
    // 金額入力Text
    setDepositValue(('string' === typeof(record.deposit_value) ?
        record.deposit_value.replace(/,/g, '') : record.deposit_value));
    //
    // MemoText
    setMemo(record.memo);
    console.debug(record);
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

      ApiUpdateDeposit(deposit_key, data, user).then(response =>{
        //
        // 親の一覧データ更新処理
        console.debug(response);
        let newRows = [...resultDatas];
        let newRow = newRows.find( r => r.deposit_key === deposit_key);
        if (newRow){
          newRow.delete_flag = false;
          newRow.deposit_type = depositType;
          newRow.deposit_type_str = (depositType === TYPE_DEPOSIT)
          ? TYPE_DEPOSIT_STR : TYPE_EXPENSES_STR;
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
        }else{
          console.error('----------')
          console.error(`deposit_key:${deposit_key}がデータ一覧に存在しません。`);
          console.error('更新実行情報------')
          console.error(data)
          console.error('一覧情報------')
          console.error(newRows)
        }
      }).catch(error => console.error(error));
    }
    fetchData();
  }

  const handleDelete = () => {
    console.debug("Delete");
    function fetchData(){
      const data = {
        delete_flag : true,
        u_user : user.userid,
        update_date : new Date().toISOString()
      }
      ApiUpdateDeposit(deposit_key, data, user).then(response =>{
        // 親の一覧データ更新処理
        //
        console.debug(response);
        let newRows = [...resultDatas];
        let newRow = newRows.find( r => r.deposit_key === deposit_key );
        if (newRow){
          newRow.delete_flag = true;
          console.debug('new row----------------');
          setResultDatas(newRows);
          setRecord(newRow);
          setOpen(false);
        }
        else{
          console.error('----------')
          console.error(`deposit_key:${deposit_key}がデータ一覧に存在しません。`);
          console.error('更新実行情報------')
          console.error(data)
          console.error('一覧情報------')
          console.error(newRows)
        }
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
            <DatePicker labelName="登録年月日" yyyymmdd={insert_yyyymmdd} setYyyymmdd={handleInsertYyyymmdd} />
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
