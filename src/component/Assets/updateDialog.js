import React,{useState} from 'react';
import {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Link from '@mui/material/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import {useUserContext} from '../../context/userContext';
import {TYPE_DEPOSIT, TYPE_DEPOSIT_STR, TYPE_EXPENSES_STR} from '../common/prj_const';
import {ApiGetDepositItemList, ApiPutAssetsBulkUpdate} from '../common/prj_url';
import {date2StringYyyymmdd} from '../common/prj_func';
import Alert from '@material-ui/lab/Alert';
import {useResultDatasContext} from '../../context/resultDatasContext';

//
// 資産データ更新・削除ダイアログ
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


export default function UpdateDialog(props) {
  const [datas, setDatas] = React.useState(0);
  const [headers] = React.useState(props.headers);
  const [assetRecordIndex] = React.useState(props.id);
  const [insert_yyyymm, setInsert_yyyymm] = React.useState("");
  const classes = useStyles();
  const {user} = useUserContext();
  const [open, setOpen] = React.useState(false);
  const [fullWidth, ] = React.useState(true);
  const [textRecords, setTextRecords] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [insertYyyymmdd, setInsertYyyymmdd] = useState();
  const {assetSearchEvent, setAssetSearchEvent, assetsRecords, setAssetsRecords} = useResultDatasContext();

  useEffect(()=>{
    console.debug(assetsRecords);
    console.debug(assetRecordIndex);
    //
    let data = assetsRecords.data;
    let insert_yyyymms = assetsRecords.insert_yyyymms;
    // 存在しない場合があるのでチェックを追加
    if ( data.length <= assetRecordIndex ){
      console.debug("Noset setTextRecords");
      return ;
    }
    let record = data[assetRecordIndex];
    let texts = headers.map(header=>{
      //header['value'] = Number(datas[header.id].replace(/,/g, ''));
      header['value'] = Number(record[header.id].replace(/,/g, ''));
      return header;
    });
    console.debug("insert_yyyymm");
    console.debug(insert_yyyymms);
    console.debug("setTextRecords");
    console.debug(texts);
    setInsert_yyyymm(insert_yyyymms[assetRecordIndex]);
    setInsertYyyymmdd( new Date(insert_yyyymms[assetRecordIndex] + "/01"));
    setTextRecords(texts);
  },[open, assetsRecords]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handelValueChange = (index, event) =>{
    // 入力された値に更新
    textRecords[index].value = event.target.value;
    setTextRecords(textRecords);
  }

  const handleDelete = () => {
    console.debug("handleDelete");
    console.debug(`handleDelete.insertYyyymmdd[${insertYyyymmdd}]`);
  }
  
  const handleUpdate = () => {
    console.debug("handleUpdate---------------");
    console.debug("textRecords");
    console.debug(textRecords);
    console.debug("insert_yyyymm");
    console.debug(insert_yyyymm);
    let yyyymmdd = date2StringYyyymmdd(insertYyyymmdd, 1);
    let dt = new Date();
    let updateDatas = textRecords.map(record=>{
      return(
        {
          depositItem_key : record.id,
          deposit_type : TYPE_DEPOSIT,
          deposit_value : record.value,
          insert_yyyymmdd : yyyymmdd,
          insert_yyyymm : yyyymmdd.slice(0, 7),
          delete_flag : false,
          update_date : dt,
        }
      )
    });
    console.debug("updateDatas");
    console.debug(updateDatas);
    ApiPutAssetsBulkUpdate(user, updateDatas).then(result=>{
      console.debug("ApiPostAssetsBulkUpdate-success!!");
      // 戻ってきた結果から1行分の情報を再構築
      // assetSearchEventをカウントアップすることで呼出し元画面で
      // 再検索するようにしたため、ここはコメントアウト
      // 
      /*
      //console.debug(result);
      result = result.data;
      let tableRecord = {};
      tableRecord['insert_yyyymm'] = result[0]['insert_yyyymm'];
      result.map((record, index) =>{
        tableRecord[record.depositItem_key] = record.deposit_value.toLocaleString();
      });
      tableRecord['insert_yyyymm'] = 
        <UpdateDialog 
          id={assetRecordIndex} 
          insert_yyyymm={result[0]['insert_yyyymm']}
          headers={headers} 
        />;
      console.debug("updateTableRecord");
      console.debug(tableRecord);
      assetsRecords[assetRecordIndex] = tableRecord;
      let newAssetsRecords = assetsRecords;
      setAssetsRecords(newAssetsRecords);
      */
      setAssetSearchEvent(assetSearchEvent+1);
      setOpen(false);
    }).catch( error=>{
      console.error(error);
    })
  };

  return (
    <div>
      <Link component="button" onClick={handleClickOpen}>
        {insert_yyyymm}
      </Link>
      <Dialog 
        fullWidth={fullWidth}
        open={open} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
        maxWidth={'xl'}
      >
        <DialogTitle id="form-dialog-title">Update {insert_yyyymm}</DialogTitle>
        <DialogContent>
          {
            (message) ?<Alert severity="error">{message}</Alert> : ""
          }
          <form className={classes.root} noValidate autoComplete="off">
            <Paper elevation={3} >
            {
              textRecords.map((column, index)=>{
                return(
                  <TextField
                    required
                    key={column.id}
                    label={column.title}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    defaultValue={column.value}
                    onChange={(event) => handelValueChange(index, event)}
                  />
                )})
            }
            </Paper>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
