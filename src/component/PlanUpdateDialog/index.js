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
  const subtitle = props.subtitle;
  //const savings_key = props.savings_key; 
  const [open, setOpen] = React.useState(false);
  const {user} = useUserContext();
  const classes = useStyles();
  const [fullWidth, ] = React.useState(true);
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
    async function fetchData(){
      let headers = {
        headers : user.Authorization
      };
      console.debug("/api/savings/--------------------------");
      let result = await axios.get(prj_const.ServerUrl + "/api/savings/" + props.record.savings_key, headers);
      console.debug(result);
      //console.debug(result.data.depositItem_key);
      setDepositItemkey(result.data.depositItem_key)
      setDepositValue(result.data.deposit_value);
      setDepositType(result.data.deposit_type);
      setOpen(true);
    }
    fetchData();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    console.log("Update");
  }

  const handleDelete = () => {
    console.log("Delete");
  }

  //console.log(props.record);
  /*
  useEffect(()=>{
    async function fetchData(){
      let headers = {
        headers : user.Authorization
      };
      console.debug("/api/savings/--------------------------");
      let result = await axios.get(prj_const.ServerUrl + "/api/savings/" + props.record.savings_key, headers);
      console.debug(result);
      //console.debug(result.data.depositItem_key);
      setDepositItemkey(result.data.depositItem_key)
      setDepositValue(result.data.deposit_value);
      setDepositType(result.data.deposit_type);
    }
    fetchData();
  },[]);
  */

/**
<Button variant="outlined" color="primary" onClick={handleClickOpen}>
  {subtitle}
</Button>
 */
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
                <DepositItemSelectGrouping handle={handleDepositItemkey} depositItemkey={depositItemkey}/>
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
