import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker01 from '../DatePicker01'
import DepositGroupSelect from '../DepositGroupSelect';
import DepositItemSelect from '../DepositItemSelect';
import DepositTypeSelect from '../DepositTypeSelect';
import DepositValueText from '../DepositValueText';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@mui/material/Link';

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


export default function PlunUpdateDialog({subtitle}) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  //const [fullWidth, setFullWidth] = React.useState(true);
  //const [maxWidth, setMaxWidth] = React.useState('sm');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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
        fullWidth="true"
        maxWidth="xs"
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{subtitle}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
              <DepositGroupSelect />
              <DepositItemSelect />
              <div className={classes.inilineBlock}>
                <DepositTypeSelect />
                <DepositValueText />
              </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Update
          </Button>
          <Button onClick={handleClose} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}