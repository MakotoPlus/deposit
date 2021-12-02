import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
const prj_const = require('./../prj_const.js')



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
  const [data, setData] = useState({ results: [] });
  //const [age, setAge] = React.useState('');
  //const handleChange = (event) => {
  //  setAge(event.target.value);
  //};

  useEffect(async() =>{
    const result = await axios.get(prj_const.ServerUrl + "/api/deposit_group/");
    console.log(result);
    setData(result.data);
    //setData(result.data.results);
  },[]);


  return (
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">貯金グループ</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          //onChange={handleChange}
        >
        {
          data.results.map((item => (
              <MenuItem value={item.deposit_group_key}>
                {item.deposit_group_name}
              </MenuItem>
          )))
        }
        </Select>
      </FormControl>
  );
}
