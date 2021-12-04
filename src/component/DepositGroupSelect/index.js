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
 * 預金項目グループ 選択コントロール
 * 
 * 
 * Select は下記オブジェクトでないとダメなんじゃないか？
 * { value : XXX, labe : XXXX}
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


let depositGroup = [
  { value : "1",
    label : "test1"
  },
  { value : "2",
    label : "test2"
  },
];
const space_data = { 
  value : "0"
  ,label : "　"
}

export default function DepositGroupSelect() {
  const classes = useStyles();
  const [depositGroups, setDepositGroup] = useState([space_data]);
  const [selectedAccountId, setSelectedAccountId] = useState(-1);
  //const [age, setAge] = React.useState('');
  //const [selectedValue, setSelectedValue ] = useState({value : 0});
  const handleChange = (event) => {
    console.log(event.target.value);    
    //setSelectedValue({value : event.target.value});
    //setData(event.target.value);
    //setDepositGroup(event.target.value);

    setSelectedAccountId(Number(event.target.value))
  };

  useEffect(() => {
    async function fetchData(){
      let result = await axios.get(prj_const.ServerUrl + "/api/deposit_group/");        console.log(result.data);
      /*
      // 空白データ先頭に追加
      depositGroup = [];
      //depositGroup.push(space_data);
      result.data.results.map(result =>(
        depositGroup.push({ 
          value: result.deposit_group_key.toString(),
          label: result.deposit_group_name
        })
      ));*/
      //setDepositGroup(depositGroup);
      console.log(depositGroup);    
      setDepositGroup(depositGroup);
    }
    fetchData();
  },[]);
  /*
  useEffect(async() =>{
    let result = await axios.get(prj_const.ServerUrl + "/api/deposit_group/");
    //console.log(result);
    // 空白データ先頭に追加
    const space_data = { deposit_group_key : 0
                        ,deposit_group_name : "　"
                      }
    //setData(space_data);
    result.data.results.unshift(space_data);
    setData(result.data);
  },[]);
  */
  return (
      <FormControl className={classes.formControl}>
        <InputLabel id="depositGroup-select-label">貯金グループ</InputLabel>
        <Select
          labelId="depositGroup-select-label"
          id="depositGroup-select"
          label="貯金グループ"
          options = {space_data.value}
          value={selectedAccountId === -1 ? "" : selectedAccountId}
          onChange={handleChange}
        >
        {
          Array.isArray(depositGroups) && depositGroups.length > 0 ?
            depositGroups.map((depositGroup) => (
              <MenuItem key={depositGroup.value} value={depositGroup.value}>
                {depositGroup.label}
              </MenuItem> )) :
            <MenuItem disable={true} value="">""</MenuItem>
        }
        </Select>
      </FormControl>
  );
}
