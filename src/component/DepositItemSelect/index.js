import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {useUserContext} from '../../context/userContext';

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


const space_data = { 
  value : "0"
  ,label : "　"
}


export default function DepositItemSelect() {
  const classes = useStyles();
  const {user} = useUserContext();
  const [depositItems, setDepositItems] = useState([space_data]);
  const [selectedAccountId, setSelectedAccountId] = useState(-1);
  const handleChange = (event) => {
    console.debug(`DepositItemSelect Select: ${event.target.value}`);
    setSelectedAccountId(Number(event.target.value))
  };

  useEffect(()=>{
    async function fetchData(){
      let headers = {
        headers : user.Authorization
      };
      let result = await axios.get(prj_const.ServerUrl + "/api/deposit_item/", headers);
      //console.log(result);
      // 空白データ先頭に追加
      let data = [space_data];
      result.data.results.map(result =>(
        data.push({ 
          value: result.depositItem_key.toString(),
          label: result.depositItem_name
        })
      ));
      setDepositItems(data);
    }
    fetchData();
  },[]);

  return (
      <FormControl className={classes.formControl}>
        <InputLabel id="depositItem-select-label">貯金項目</InputLabel>
        <Select
          labelId="depositItem-select-label"
          id="depositItem-select"
          label="貯金項目"
          value={selectedAccountId === -1 ? "" : selectedAccountId}
          onChange={handleChange}
        >
        {
          Array.isArray(depositItems) && depositItems.length > 0 ?
          depositItems.map((item)=> (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>)) 
          : <MenuItem disable={true} value="">""</MenuItem>
        }
        </Select>
      </FormControl>
  );
}
