import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

/**
 * 
 * メモ入力フィールド
 * @param {value : string, handle : event(value)}
 * 
 */

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(0),
      width: '350px',
    },
  },
}));

export default function InputMemoText(props) {
  const classes = useStyles();

  let value = props.value;
  const handle = props.handle;
  return (
    <TextField className={classes.root} id="outlined-basic" label="memo"  variant="outlined" onChange={handle} value={value} />
  )
}
