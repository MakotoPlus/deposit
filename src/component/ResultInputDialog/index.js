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
import DepositTypeSelect from '../DepositTypeSelect';
import DepositValueText from '../DepositValueText';
import { makeStyles } from '@material-ui/core/styles';
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


export default function ResultInputDialog({subtitle}) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [fullWidth, ] = React.useState(true);

  let dt = new Date();
  let LocalDate = dt.getFullYear + "/" + ("00" + (dt.getMonth()+1)).slice(-2) + "/" +  ("00" + dt.getDate()).slice(-2);

  const [insertYyyymmdd, setInsertYyyymmdd] = useState(LocalDate);
  const [depositValue, setDepositValue] = useState(0);  //金額
  const [depositType, setDepositType] = useState(prj_const.TYPE_DEPOSIT);  //貯金
  const [depositItemKey, setDepositItemKey] = useState("");

  //const [maxWidth, setMaxWidth] = React.useState('sm');

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleCreate = () => {
    console.log(`insertYyyymmdd[${insertYyyymmdd}]`);
    console.log(`depositItemKey[${depositItemKey}]`);
    console.log(`depositValue[${depositValue}]`);
    console.log(`depositType[${depositType}]`);
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
            <DatePicker01 labelName="登録年月日" yyyymmdd={insertYyyymmdd} setYyyymmdd={setInsertYyyymmdd} />
            <DepositItemSelectGrouping setDepositItemKey={setDepositItemKey}/>
            <DepositTypeSelect setDepositType={setDepositType}/>
            <DepositValueText value={depositValue} handle={setDepositValue}/>
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
