import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//import DatePicker01 from '../DatePicker01'
//import DepositGroupSelect from '../DepositGroupSelect';
//import DepositItemSelect from '../DepositItemSelect';
import DepositItemSelectGrouping from '../DepositItemSelectGrouping'
import DepositTypeSelect from '../DepositTypeSelect';
import DepositValueText from '../DepositValueText';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@mui/material/Link';
import { TYPE_DEPOSIT } from '../prj_const';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
const prj_const = require('./../prj_const.js')


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


export default function PlunUpdateDialog(props) {
  const [subtitle, setSubtitle] = React.useState(props.subtitle);
  const [record, setRecord] = React.useState(props.record);
  const rows = props.rows;
  const setRows = props.setRows;
  const savings_key = record.savings_key;
  const [open, setOpen] = React.useState(false);
  const {user} = useUserContext();
  const classes = useStyles();
  const [fullWidth, ] = React.useState(true);
  //
  // 金額入力Text
  const [depositValue, setDepositValue] = React.useState(props.record.deposit_value.replace(/,/g, ''));
  const handleDepositUpdate = value => setDepositValue(value);

  //
  // 預金項目Select
  // DepositItemSelectGrouping
  const [depositItemObj, setDepositItemObj] = React.useState(record.deposit_item_obj);
  const [depositItemkey, setDepositItemkey] = React.useState(record.deposit_item_obj.depositItem_key);
  const handleDepositItemObj = value => {
    console.log("handleDepositItemObj");
    console.log(value);
    setDepositItemObj(value);
    setDepositItemkey(value.depositItem_key);
  }

  //
  // 預金/支出
  const [depositType, setDepositType] = React.useState(props.record.deposit_type);
  const handleDepositType = value => setDepositType(value);
  /*
  useEffect(()=>{
    function fetchData(){
      console.debug("record");
      console.debug(record);
    }
    fetchData();
  },[]);
  */

  const handleClickOpen = () => {
    /*
    async function fetchData(){
      let headers = {
        headers : user.Authorization
      };
      console.debug("record");
      console.debug(record);
      console.debug("/api/savings/--------------------------");
      let result = await axios.get(prj_const.ServerUrl + "/api/savings/" + savings_key, headers);
      console.debug(result);
      //console.debug(result.data.depositItem_key);
      setDepositItemkey(result.data.depositItem_key)
      setDepositValue(result.data.deposit_value);
      setDepositType(result.data.deposit_type);      
      setOpen(true);
    }
    fetchData();
    */
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    console.log("Update");
    async function fetchData(){
      console.debug(`savings_key=${savings_key}`);
      console.debug(`depositValue=${depositValue}`);
      console.debug(`depositItemkey=${depositItemkey}`);
      console.debug(`depositType=${depositType}`);
      const data = {
        depositItem_key : depositItemkey,
        deposit_type : depositType,
        deposit_value : depositValue,
        delete_flag : false,
        u_user : user.userid,
        update_date : new Date().toISOString()
      }
      console.debug("before----------------");
      console.debug(record);
      console.debug("after----------------");
      console.debug(data);
      console.debug("/api/savings/--------------------------");
      axios.defaults.headers.common["Authorization"] = user.Authorization.Authorization;
      axios.defaults.baseURL = prj_const.ServerUrl + "/api";
      await axios.patch(prj_const.ServerUrl + "/api/savings/" + savings_key + "/", data).then(response =>{
        console.debug('update success');
        console.debug(response);

        // 親の一覧データ更新処理
        //
        //
        //更新対象の元ネタデータ取得
        let newRows = [...rows];
        let newRow = newRows.find( r => r.savings_key === savings_key );
        newRow.deposit_item_obj = {...depositItemObj};
        newRow.deposit_group_name = newRow.deposit_item_obj.deposit_group_name;
        newRow.depositItem_name = newRow.deposit_item_obj.depositItem_name;
        newRow.deposit_type = depositType;
        newRow.deposit_type_str = depositType === prj_const.TYPE_DEPOSIT 
          ? prj_const.TYPE_DEPOSIT_STR : prj_const.TYPE_EXPENSES_STR;
        newRow.deposit_value = Number(depositValue).toLocaleString();
        console.debug('new row----------------');
        console.log(newRow);
        setRows(newRows);

        setSubtitle(newRow.depositItem_name);
        setRecord(newRow);
        setOpen(false);
        //setRows([newRow]);
        /*
        let newRecord = {
          deposit_group_name : 'deposit_group_name',
          depositItem_name : 'depositItem_name',
          deposit_value : response.data.deposit_value.toLocaleString(),
          deposit_type : response.data.deposit_type
        }
        setRecord({ ...record, newRecord});  
        setOpen(false);
        */
      }).catch(error=>{
        console.error(error);
      })
    }
    fetchData();
  }

  const handleDelete = () => {
    console.log("Delete");
  }

  return (
    <div>
      <Link component="button" variant="body2" onClick={handleClickOpen}>
        {subtitle}
      </Link>
      <Dialog 
        fullWidth={fullWidth}
        maxWidth="xs"
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{subtitle}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.inilineBlock}>
                <DepositItemSelectGrouping handle={handleDepositItemObj} depositItemObj={record.deposit_item_obj}/>
                <DepositTypeSelect handle={handleDepositType} value={depositType} />
                <DepositValueText handle={handleDepositUpdate} value={depositValue} />
              </div>
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
