import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
//import DepositGroupSelect from '../DepositGroupSelect';
//import DepositItemSelect from '../DepositItemSelect';
import DepositItemSelectGrouping from '../common/DepositItemSelectGrouping'
import DepositTypeSelect from '../common/DepositTypeSelect';
import DepositValueText from '../common/DepositValueText';
import { makeStyles } from '@material-ui/core/styles';
import {useUserContext} from '../../context/userContext';
import {usePlanContext} from '../../context/planContext';
import {ApiPostSavings} from '../common/prj_url';
import {TYPE_DEPOSIT, TYPE_DEPOSIT_STR, TYPE_EXPENSES_STR} from '../common/prj_const';


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
  Button:{
    margin : 5,
  },
  
}));


export default function PlanInputDialog({subtitle}) {
  const {user} = useUserContext();
  const {plan, setPlan, planAllCount, setPlanAllCount} = usePlanContext();  
  //const token = user.token;
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
  const [depositItemObj, setDepositItemObj] = React.useState({});
  const [depositItemkey, setDepositItemkey] = React.useState(0);
  const handleDepositItemkey = value => {
    setDepositItemkey(value.depositItem_key);
    setDepositItemObj(value);
  }

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
    console.debug("Create");
    console.debug(`PlaninputDialog.depositValue=[${depositValue}]`);
    console.debug(`DepositItemSelectGrouping.depositItemkey=[${depositItemkey}]`);
    console.debug(`PlaninputDialog.depositType=[${depositType}]`);
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
    ApiPostSavings(user, data).then(response=>{
      console.debug(response);
      let newRow = {
        savings_key: response.data.savings_key,
        deposit_group_name: depositItemObj.deposit_group_name,
        deposit_type: response.data.deposit_type,
        depositItem_name: depositItemObj.depositItem_name,
        deposit_type_str: response.data.deposit_type === TYPE_DEPOSIT 
          ? TYPE_DEPOSIT_STR : TYPE_EXPENSES_STR,
        deposit_value: Number(response.data.deposit_value).toLocaleString(),
        deposit_item_obj : depositItemObj
      }
      //
      // データ追加は行わないがトータル金額などの更新のためにデータを再設定する
      //
      // ここにデータ件数追加された事によりPlanTableの最大件数を1件増やすイベントを追加する
      //
      //
      console.debug(newRow);
      let newRows = [...plan];
      setPlan(newRows);
      setPlanAllCount(planAllCount+1);
      setOpen(false);
    }).catch( error =>{
      console.error(error);
    });
  };

  return (
    <div>
      <Button className={classes.Button} variant="outlined" color="primary" onClick={handleClickOpen}>
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
                  <DepositTypeSelect handle={handleDepositType} value={TYPE_DEPOSIT}/>
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
