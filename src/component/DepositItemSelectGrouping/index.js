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

export default function DepositItemSelectGrouping(props) {
  const classes = useStyles();
  const {user} = useUserContext();  
  const parentHandle = props.handle;
  //const props_depositItemkey = props.depositItemkey;
  const [selectMenuItems, setSelectMenuItems] = useState([]);
  const [defaultDepositItem, setDefaultDepositItem] = useState(props.depositItemObj);
  const [depositItem_key, setDepositItem_key] = useState(props.depositItemObj.depositItem_key);
  const [selectItems, setSelectItems] = useState([]);
  //console.debug(`funcstart depositItemkey=${props_depositItemkey}`);
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
      console.debug("DepositItemSelectGrouping.userEfect");
      console.debug(result);
      result.data.map((result)=>{
        let deposit_item_obj = {
          deposit_group_key : result.deposit_group_key.deposit_group_key,
          deposit_group_name: result.deposit_group_key.deposit_group_name,
          depositItem_key : result.depositItem_key,
          depositItem_name: result.depositItem_name,
        }
        items.push({
          group_id : result.deposit_group_key.deposit_group_key.toString(),
          deposit_item_obj : deposit_item_obj,
        });
        if (false === (result.deposit_group_key.deposit_group_key.toString() in groups )){
          let menu_group_value = result.deposit_group_key.deposit_group_key.toString() + "," +
          result.deposit_group_key.deposit_group_name;
          // group keyが存在しなかったら新規なので追加する
          groups[result.deposit_group_key.deposit_group_key.toString()] = {
            group_id : result.deposit_group_key.deposit_group_key.toString(),
            group_name : result.deposit_group_key.deposit_group_name,
            menu_group_value : menu_group_value,
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
      menuItems.push(
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
      );
      Object.keys(groups).forEach((key, i)=>{
        let groupkey = key + "-" + i
        menuItems.push(
          <ListSubheader key={groupkey}>{groups[key].group_name}</ListSubheader>
        )
        // 同一のGroup_idのみ追加して抽出
        const additems = items.filter(item => item.group_id === groups[key].group_id );
        additems.map((item) =>{
          console.debug(`deposit_item_obj=${item.deposit_item_obj}`)
          menuItems.push(
            <MenuItem key={item.depositItem_key} value={item.deposit_item_obj.depositItem_key}>{item.deposit_item_obj.depositItem_name}</MenuItem>
          );
        });
      });
      //
      // 3. useStateに設定する
      //    console.log(menuItems);
      setSelectMenuItems(menuItems);
      //
      // Select Listの全データリストを保持
      setSelectItems(items);
    }
    fetchData();
  },[]);

  const handleChange = (event) =>{
    console.debug(event.target.value);
    setDepositItem_key(event.target.value);

    // 変更された値(depositItem_key)から全データを保持しているselectItemsから対象のデータオブジェクトを抽出し
    // 設定する。
    console.debug(selectItems);
    const selectItem = selectItems.find( r => r.deposit_item_obj.depositItem_key === event.target.value);
    console.log('SelectItem');
    console.log(selectItem);
    //
    // 親のハンドル呼出してオブジェクトを設定
    let newSelectItem = selectItem.deposit_item_obj;
    console.log('newSelectItem');
    console.log(newSelectItem);    
    parentHandle(newSelectItem);
    //parentHandle(event.target.value);
    console.log('SelectItem-end');
  }
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="deposit-grouped-native-select" required>預金項目</InputLabel>
        <Select 
        defaultValue=""
        id="deposit-grouped-native-select"
        onChange={handleChange} 
        value={depositItem_key}
        >
        {selectMenuItems}
      </Select>
    </FormControl>
  );
}

