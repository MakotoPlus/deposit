import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

/**
 * 預金項目 選択コントロール
 * 
 */
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function DepositItemSelect() {
  const classes = useStyles();
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">貯金項目</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value="">　</MenuItem>
          <MenuItem value={10}>住宅</MenuItem>
          <MenuItem value={20}>車保険</MenuItem>
          <MenuItem value={30}>車税金</MenuItem>
          <MenuItem value={40}>新車台</MenuItem>
          <MenuItem value={50}>車車検</MenuItem>
          <MenuItem value={60}>ガソリン</MenuItem>
          <MenuItem value={70}>家税金</MenuItem>
          <MenuItem value={80}>修繕費</MenuItem>
          <MenuItem value={90}>老後</MenuItem>
          <MenuItem value={100}>旅行積立</MenuItem>
          <MenuItem value={110}>その他</MenuItem>
          <MenuItem value={120}>Xcat株</MenuItem>
        </Select>
      </FormControl>
  );
}
