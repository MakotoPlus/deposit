import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
const prj_const = require('./../prj_const.js')

/**
 * 預金項目グルーピングモード 選択コントロール
 * 
 */
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function SelectOptionItems(props){
  if (undefined === props.depositItems){
    return (
      <React.Fragment>
      </React.Fragment>
    )
  }
  //console.log("htmlOptions defined");
  //console.log(props.depositItems);
  return (
    <React.Fragment>
      {
      props.depositItems.map((items)=>(
        (items.group_id === props.group_id) 
        ? <option value={items.key}>{items.name}</option>
        : ""
      ))
      }
    </React.Fragment>
  )
}

export default function DepositItemSelectGrouping() {
  const classes = useStyles();

  /**
   * depositItems = { "1111" : 
   *                   { 
   *                      group_name : "XXXX" ,
   *                      group_id : "1111",
   *                      items : [{
   *                          key :  "123",
   *                          name : "XXX"
   *                          },
   *                          {
   *                          key : "234",
   *                          name : "xxx"
   *                           }
   *                       ]
   *                   }
   *                  }]
   */
  const [depositGroups, setDepositGroups] = useState([]);
  const [depositItems, setDepositItems] = useState([]);

  useEffect(()=>{
    async function fetchData(){
      let result = await axios.get(prj_const.ServerUrl + "/api/deposit_item/");
      console.debug(result);
      let groups = {}; // 全てのgropid, groupname を格納(重複なし)
      let items = [];
      result.data.results.map((result)=>{
        items.push({
          key: result.depositItem_key.toString(),
          name: result.depositItem_name,
          group_id : result.deposit_group_key.deposit_group_key.toString()
        });
        if (false === (result.deposit_group_key.deposit_group_key.toString() in groups )){
          // group keyが存在しなかったら新規なので追加する
          groups[result.deposit_group_key.deposit_group_key.toString()] = {
            group_id : result.deposit_group_key.deposit_group_key.toString(),
            group_name : result.deposit_group_key.deposit_group_name,
          }
        }
      });
      //console.log(groups);
      // groups は object なので 配列に変える。そうしないとSelectで表示されなかったから・・
      let grouplist = [];
      Object.keys(groups).forEach((key)=>{
        let groupItem = {
          group_id : groups[key].group_id,
          group_name : groups[key].group_name
        }
        grouplist.push(groupItem);
      });
      setDepositGroups(grouplist);
      setDepositItems(items);
      //console.log(grouplist);
      //console.log(items);
    }
    fetchData();
  },[]);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="deposit-grouped-native-select">預金項目</InputLabel>
      <Select native defaultValue="" id="deposit-grouped-native-select">
      {
        depositGroups.map((depositGroup)=>(
          <optgroup key={depositGroup.group_id} label={depositGroup.group_name} >
            <SelectOptionItems depositItems={depositItems} group_id={depositGroup.group_id}/>
          </optgroup>
        ))
      }
      </Select>
    </FormControl>
  );
}
