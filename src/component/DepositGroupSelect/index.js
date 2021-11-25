import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

/**
 * 預金項目グループ 選択コントロール
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

export default function DepositGroupSelect() {
  const classes = useStyles();
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">貯金グループ</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value={0}>　</MenuItem>
          <MenuItem value={10}>ローン</MenuItem>
          <MenuItem value={20}>車</MenuItem>
          <MenuItem value={30}>住宅</MenuItem>
          <MenuItem value={40}>レジャー</MenuItem>
          <MenuItem value={50}>株</MenuItem>
        </Select>
      </FormControl>
  );
}
