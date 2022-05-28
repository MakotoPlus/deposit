//
// DepositItemMultiSelect.js
//
import React, { useState, useEffect }  from 'react';
import { makeStyles,useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@mui/material/MenuItem';
//import clsx from 'clsx';
import Input from '@material-ui/core/Input';
//import ListItemText from '@material-ui/core/ListItemText';
//import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import ListSubheader from '@mui/material/ListSubheader';
//import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {ApiGetDepositItemList} from './prj_url';

const useStyles = makeStyles((theme) => ({
    formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
    maxWidth: 300,
    },
    chips: {
    display: 'flex',
    flexWrap: 'wrap',
    },
    chip: {
    margin: 2,
    },
    noLabel: {
    marginTop: theme.spacing(3),
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 120,
      },
    },
    getContentAnchorEl:null,  // anchorOrigin, transformOrigin が変更可能になるように元々ポップオーバーの基準となっている要素を解除
    anchorOrigin: { vertical: "bottom", horizontal: "left" }, // ポップオーバーの表示起点
    transformOrigin: { vertical: "top", horizontal: "left" }, // 表示時の transform の起点
};

function getStyles(name, personName, theme) {
    return {
    fontWeight:
        personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    };
}

export default function DepositItemMultiSelect(props) {
    const classes = useStyles();
    const theme = useTheme();
    const {user} = useUserContext();
    const [selectMenuItems, setSelectMenuItems] = useState([]);
    const deposit_flag = props.deposit_flag;
    //const [depositItem_key, setDepositItem_key] = useState([]);
    const [selectItems, setSelectItems] = useState([]);
    //const [userSelectItems, setUserSelectItems] = React.useState([]);
    const userSelectItems = props.userSelectItems;
    const setUserSelectItems = props.setUserSelectItems;

    useEffect(()=>{
<<<<<<< HEAD
      async function fetchData(){
        let headers = {
          headers : user.Authorization
        };
        let groups = {}; // 全てのgropid, groupname を格納(重複なし)
        let items = [];
        let result = await axios.get(prj_const.ServerUrl + "/api/deposit_item_list/?no_page&deposit_flag=true", headers);
  
        //
        // 1. 一度、表示すべきグループと項目をリストに別々に格納する
        // 2. １の情報を利用しリストボックス出力用のXSLTを生成する
        // 3. useStateに設定する
        //
        console.debug("DepositItemSelectGrouping.userEfect");
        console.debug(result);
        items = result.data.map((r)=>{
=======
      function fetchData(){
        ApiGetDepositItemList(user, deposit_flag).then( result =>{
          let groups = {}; // 全てのgropid, groupname を格納(重複なし)
          let items = [];
            //
          // 1. 一度、表示すべきグループと項目をリストに別々に格納する
          // 2. １の情報を利用しリストボックス出力用のXSLTを生成する
          // 3. useStateに設定する
>>>>>>> 202205-assets
          //
          console.debug("DepositItemSelectGrouping.userEfect");
          console.debug(result);
          items = result.data.map((r)=>{
            //
            // Group情報格納
            if (false === (r.deposit_group_key.deposit_group_key.toString() in groups )){
              let menu_group_value = r.deposit_group_key.deposit_group_key.toString() + "," +
              r.deposit_group_key.deposit_group_name;
              // group keyが存在しなかったら新規なので追加する
              groups[r.deposit_group_key.deposit_group_key.toString()] = {
                group_id : r.deposit_group_key.deposit_group_key.toString(),
                group_name : r.deposit_group_key.deposit_group_name,
                menu_group_value : menu_group_value,
                depositItem_key : "dumy" + r.deposit_group_key.deposit_group_key
              }
            }
            let deposit_item_obj = {
              deposit_group_key : r.deposit_group_key.deposit_group_key,
              deposit_group_name: r.deposit_group_key.deposit_group_name,
              depositItem_key : r.depositItem_key,
              depositItem_name: r.depositItem_name,
            }
            return ({
              depositItem_key : r.depositItem_key,
              group_id : r.deposit_group_key.deposit_group_key.toString(),
              deposit_item_obj : deposit_item_obj,
            });
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
            let addMenuItems = additems.map((item) =>{
              console.debug(`deposit_item_obj=${item.deposit_item_obj}`)
              return (
                  <MenuItem key={item.depositItem_key} 
                      value={item.deposit_item_obj.depositItem_key} 
                      style={getStyles(item.deposit_item_obj.depositItem_name, userSelectItems, theme)}>
                      {item.deposit_item_obj.depositItem_name}
                  </MenuItem>
              );
            });
            menuItems = [...menuItems, addMenuItems];
          });
          //
          // 3. useStateに設定する
          //    console.debug(menuItems);
          setSelectMenuItems(menuItems);
          //
          // Select Listの全データリストを保持
          setSelectItems(items);
        }).catch( error =>{
          console.error(error);
        })
      }
      fetchData();
    },[]);

    const handleChange = (event) => {
        // チェンジイベントでは配列で値が入ってい来る
        //console.debug(event.target.value);
        setUserSelectItems(event.target.value);
    };
    const getLabelName = (value) =>{
        //console.debug(value);
        if (!value) return;
        //console.debug(selectItems);
        return selectItems.find( r => r.depositItem_key === value).deposit_item_obj.depositItem_name;
    }

    const outputChip = (selected) =>{
        return (
            <div className={classes.chips}>
                {selected.map((value) => (
                (getLabelName(value)) 
                ?  <Chip key={value} label={getLabelName(value)} className={classes.chip} />
                : ""
                ))}
            </div>
        )
    }

    return (
    <div>
        <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">預金項目</InputLabel>
        <Select
            labelId="demo-mutiple-chip-label"
            id="demo-mutiple-chip"
            multiple
            value={userSelectItems}
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected) => (
                outputChip(selected)
            )}
            MenuProps={MenuProps}
              >
        {selectMenuItems}
        </Select>
        </FormControl>
    </div>
    );
}
