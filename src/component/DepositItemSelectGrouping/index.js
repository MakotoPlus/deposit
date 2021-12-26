import React, { useState, useEffect }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';

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
  return (
      props.depositItems.map((items)=>(
        (items.group_id === props.group_id) 
        ? <MenuItem key={items.depositItem_key} value={items.depositItem_key}>{items.depositItem_name}</MenuItem>
        : <React.Fragment></React.Fragment>
      ))
  )
}
/*
      props.depositItems.map((items)=>(
        (items.group_id === props.group_id) 
        ? <option key={items.depositItem_key} value={items.depositItem_key}>{items.depositItem_name}</option>
        : ""
      ))

*/
export default function DepositItemSelectGrouping(props) {
  const classes = useStyles();
  const {user} = useUserContext();  
  const handle = props.handle;
  const depositItemkey = props.depositItemkey;
  const [selectMenuItems, setSelectMenuItems] = useState([]);
  console.debug(`funcstart depositItemkey=${depositItemkey}`);
  console.debug(props);
  useEffect(()=>{
    async function fetchData(){
      let headers = {
        headers : user.Authorization
      };
      let groups = {}; // 全てのgropid, groupname を格納(重複なし)
      let items = [];
      let result = await axios.get(prj_const.ServerUrl + "/api/deposit_item_list/?no_page", headers);

      //
      // 1. 一度、表示すべきグループと項目をリストに別々に格納する
      // 2. １の情報を利用しリストボックス出力用のXSLTを生成する
      // 3. useStateに設定する
      //
      console.debug(result);
      result.data.map((result)=>{
        items.push({
          depositItem_key: result.depositItem_key.toString(),
          depositItem_name: result.depositItem_name,
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
      // groups は object なので 配列に変える。
      let grouplist = [];
      Object.keys(groups).forEach((key)=>{
        let groupItem = {
          group_id : groups[key].group_id,
          group_name : groups[key].group_name
        }
        grouplist.push(groupItem);
      });

      //
      // 2. １の情報を利用しリストボックス出力用のXSLTを生成する
      //    全てのItemをここで格納する・・
      let menuItems = [];
      //
      // 空白は不要なため生成しない
      //menuItems.push(
      //  <MenuItem value="">
      //    <em>None</em>
      //  </MenuItem>
      //);
      Object.keys(groups).forEach((key, i)=>{
        menuItems.push(
          <ListSubheader key={groups[key].group_id}>{groups[key].group_name}</ListSubheader>
        )
        // 同一のGroup_idのみ追加して抽出
        const additems = items.filter(item => item.group_id === groups[key].group_id );
        additems.map((item) =>{
          menuItems.push(
            <MenuItem key={item.depositItem_key} value={item.depositItem_key}>{item.depositItem_name}</MenuItem>
          );
        });
      });
      //
      // 3. useStateに設定する
      //    console.log(menuItems);
      setSelectMenuItems(menuItems);
    }
    fetchData();
  },[]);

  const handleChange = (event) =>{
    console.debug(event.target.value);
    handle(event.target.value);
  }

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="deposit-grouped-native-select" required>預金項目</InputLabel>
      <Select defaultValue="" id="deposit-grouped-native-select"
        onChange={handleChange} value={depositItemkey}
        >
        {selectMenuItems}
      </Select>
    </FormControl>
  );
}
