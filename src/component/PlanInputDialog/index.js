import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
//import DepositGroupSelect from '../DepositGroupSelect';
//import DepositItemSelect from '../DepositItemSelect';
import DepositItemSelectGrouping from '../DepositItemSelectGrouping'
import DepositTypeSelect from '../DepositTypeSelect';
import DepositValueText from '../DepositValueText';
import { makeStyles } from '@material-ui/core/styles';
import { TYPE_EXPENSES, TYPE_DEPOSIT } from '../prj_const';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
const prj_const = require('./../prj_const.js')

//
// 貯金計画データ登録ダイアログ
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
  inilineBlock: {
      display: "inline-block",
  },
  
}));


export default function PlanInputDialog({subtitle}) {
  const {user} = useUserContext();
  const token = user.token;
  const userid = user.userid;
  const classes = useStyles();
  const [fullWidth, ] = React.useState(true);
  //const [maxWidth, setMaxWidth] = React.useState('sm');

  const [open, setOpen] = React.useState(false);
  //
  // 金額入力Text
  const [depositValue, setDepositValue] = React.useState(0);
  const handleDepositUpdate = value => setDepositValue(value);

  //
  // 預金項目Select
  // DepositItemSelectGrouping
  const [depositItemkey, setDepositItemkey] = React.useState(0);
  const handleDepositItemkey = value => setDepositItemkey(value);

  //
  // 預金/支出
  const [depositType, setDepositType] = React.useState(TYPE_DEPOSIT);
  const handleDepositType = value => setDepositType(value);

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    console.log("Create");
    console.log(`PlaninputDialog.depositValue=[${depositValue}]`);
    console.log(`DepositItemSelectGrouping.depositItemkey=[${depositItemkey}]`);
    console.log(`PlaninputDialog.depositType=[${depositType}]`);
    const data ={
        depositItem_key : depositItemkey,
        deposit_type : depositType,
        deposit_value : depositValue,
        delete_flag : false,
        u_user : userid,
        update_date : new Date().toISOString()
    }
    // Post実行
    //
    //console.log(user);
    //console.log(`JWT ${token}`);
    axios.defaults.headers.common["Authorization"] = `JWT ${token}`;
    axios.defaults.baseURL = prj_const.ServerUrl + "/api";
    axios.post(prj_const.ServerUrl + "/api/savings/", data 
      ).then(response =>{
        console.log(response);
      }, error =>{
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
        maxWidth="sm"
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{subtitle}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <div className={classes.inilineBlock}>
                  <DepositItemSelectGrouping handle={handleDepositItemkey} />
                  <DepositTypeSelect handle={handleDepositType} />
                  <DepositValueText handle={handleDepositUpdate} value={0} />
            </div>
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
