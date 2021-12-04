import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
const prj_const = require('./../prj_const.js')

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
  const [data, setData] = useState({ results: [] });
  //const [age, setAge] = React.useState('');
  //const handleChange = (event) => {
  //  setAge(event.target.value);
  //};

  useEffect(()=>{
    async function fetchData(){
      let result = await axios.get(prj_const.ServerUrl + "/api/deposit_item/");
      //console.log(result);
      // 空白データ先頭に追加
      let space_data = { depositItem_key : 0
                          ,depositItem_name : "　"
                        }
      result.data.results.unshift(space_data);
      setData(result.data);
    }
    fetchData();
  },[]);

  return (
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">貯金項目</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          //value={age}
          //onChange={handleChange}
        >
        {
          data.results.map((item , index)=> (
              <MenuItem key={index} value={item.deposit_group_key}>
                {item.deposit_group_name}
              </MenuItem>
          ))
        }
        </Select>
      </FormControl>
  );
}
