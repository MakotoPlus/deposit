
import React,{useEffect} from 'react';
import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//import DatePicker01 from '../DatePicker01'
//import DepositItemSelectGrouping from '../DepositItemSelectGrouping';
//import DepositItemMultiSelect from './../DepositItemMultiSelect';
//import DepositTypeSelect from '../DepositTypeSelect';
import CalcValueText from './CalcValueText';
import { makeStyles } from '@material-ui/core/styles';
//import { TYPE_DEPOSIT } from '../prj_const';
//import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
//import InputMemoText from '../InputMemoText';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import DragHandleOutlinedIcon from '@mui/icons-material/DragHandleOutlined';
import ListItemIcon from '@mui/material/ListItemIcon';
//import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';

//const prj_const = require('../prj_const.js')

/*const columns = [
  { id : 'id', label: 'No', minWidth: 50 }
  ,{ id : 'deposit_group_name', label: 'Group', minWidth:100 }
  ,{ id : 'sum_value', label: 'Value', minWidth:100, align: 'right', format:(value) => value.toLocaleString(), }
]*/

//
// 差額チェックダイアログ
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
  ItemBoxOwner: {
    height: 85,
    width: "800px",
    display: "flex",
    border: "1px solid black",
    backgroundColor: "#C2EEFF",
    padding: 1,
  },
  ItemBox: {
    height: 55,
    width: "300px",
    display: "flex",
    border: "0px solid black",
    padding: 1,
  },
  ItemLabelBox: {
    height: 65,
    width: "300px",
    display: "flex",
    border: "0px solid black",
    padding: 20,
  },
  ValueLabelBox : {
    height: 65,
    width: "200px",
    display: "flex",
    border: "0px solid black",
    padding: 1,
    lineHeight: "65px",
    textAlign: "center",
    justifyContent: "right",
  },
  IconBox: {
    height: 65,
    width: "30px",
    display: "flex",
    border: "0px solid black",
    padding: 20,
  },
  ItemTextBox : {
    height: 56,
    border: "0px solid black",
    backgroundColor: "#FFFFFF",
  },
  ItemText: {
    height: 100,
    width: "400px",
    display: "flex",
    border: "0px solid black",
    paddingTop: 5,
  },
}));


export default function CalcDialog({subtitle}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const {user} = useUserContext();
  const {groupSumaryDatas} = useResultDatasContext();  
  //const userid = user.userid;
  const [fullWidth, ] = React.useState(true);
  //const [rowRecord, setRowRecord] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [dialogRecord, setDialogRecord] = React.useState([]);

  useEffect(()=>{
    console.debug("CalcDialog:useEffect");
    console.debug(items);
    let records = items.map(item =>{
      return(
        <Grid item xs={8}>
        <Box
          className={`${classes.ItemBoxOwner} `}
          component="span"
          m={1} //margin
        >
          <Box
            className={`${classes.ItemLabelBox} `}
            component="span"
            m={1} //margin
          >
            {item.deposit_group_name}
          </Box>
          <Box
            className={`${classes.ValueLabelBox} `}
            component="span"
            m={1} //margin
          >
            {item.sum_value.toLocaleString()} 
          </Box>
          <Box
            className={`${classes.IconBox} `}
            component="span"
            m={1} //margin
          >
            <RemoveOutlinedIcon />
          </Box>
          <Box
            className={`${classes.ItemTextBox} `}
            component="span"
            m={1} //margin
          >
            <CalcValueText className={`${classes.ItemText} `} index={item.id} handle={handleValue} value={item.changeValue} />
          </Box>
          <Box
            className={`${classes.ItemLabelBox} `}
            component="span"
            m={1} //margin
          >
          <ListItemIcon>
            <DragHandleOutlinedIcon />
          </ListItemIcon>

            {item.calValue.toLocaleString()}
          </Box>
        </Box>
      </Grid>      
    )})
    console.debug(records);
    setDialogRecord(records);
  },[items]);


  const handleClickOpen = () => {
    console.debug("CalcDialog:handleClickOpen");
    console.debug(groupSumaryDatas);
    let values = [...groupSumaryDatas];
    setItems(values.map(value=>{
      if ('string' === typeof(value.sum_value)){
          value.sum_value = value.sum_value.replace( /,/g, '');
          value.sum_value = Number(value.sum_value);
      }
      value['changeValue'] = value.sum_value;
      value['calValue'] = 0;
      return value;
    }))
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleValue = (index, value) =>{
    console.debug(`handleValue=${index}`);
    console.debug(value);
    //console.debug(event.target.value);
    let item = items.find( r=> r.id === index);
    item.changeValue = value;
    item.calValue = item.sum_value - item.changeValue;
    setItems( [...items]);
  } 


  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        差額チェック
      </Button>
      <Dialog 
        fullWidth={fullWidth}
        maxWidth={"md"}
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title"><h2>差額計算</h2></DialogTitle>
        <DialogContent>
        <Grid container spacing={1}>
          {dialogRecord}
        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
/*
          <Grid item xs={12}>
            <Box
              className={`${classes.ItemBoxOwner} `}
              component="span"
              m={1} //margin
            >
              <Box
                className={`${classes.ItemBox} `}
                component="span"
                m={1} //margin
              >
                <h2>長期ローン</h2>
              </Box>
              <Box
                className={`${classes.ItemBox} `}
                component="span"
                m={1} //margin
              >
                <h2>999,999 × </h2>
              </Box>
              <Box
                className={`${classes.ItemBox} `}
                component="span"
                m={1} //margin
              >
                <CalcValueText className={`${classes.ItemText} `} index={0} handle={handleValue} value={0} />
              </Box>
              <Box
                className={`${classes.ItemBox} `}
                component="span"
                m={1} //margin
              >
                <h2> = 123,4234</h2>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              className={`${classes.ItemBoxOwner} `}
              component="span"
              m={1} //margin
            >
              <Box
                className={`${classes.ItemBox} `}
                component="span"
                m={1} //margin
              >
                <h2>Car</h2>
              </Box>
              <Box
                className={`${classes.ItemBox} `}
                component="span"
                m={1} //margin
              >
                <h2>999 × </h2>
              </Box>
              <Box
                className={`${classes.ItemBox} `}
                component="span"
                m={1} //margin
              >
                <CalcValueText className={`${classes.ItemText} `} index={1} handle={handleValue} value={0} />
              </Box>
              <Box
                className={`${classes.ItemBox} `}
                component="span"
                m={1} //margin
              >
                <h2> = 123,4234</h2>
              </Box>
            </Box>
          </Grid>
          */