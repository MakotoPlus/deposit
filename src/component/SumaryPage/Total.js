import React, {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';

const prj_const = require('../common/prj_const.js')

//function preventDefault(event) {
//  event.preventDefault();
//}

//
// 預金全データ取得
async function getDepositTotal(user){
  let headers = {
    headers : user.Authorization
  };
  let result;
  let urlpath = prj_const.ServerUrl + "/api/deposit_total/";
  result = await axios.get(urlpath, headers);
  return result;
}


export default function PlanTotal() {
  const {user} = useUserContext();
  const {resultDatas, setResultDatas, 
    resultAllCount, setResultAllCount,
  } = useResultDatasContext();
  const [depositTotal, setDepositTotal] = React.useState("0");
  useEffect(()=>{
    getDepositTotal(user).then(result=>{
      //console.debug(result);
      let value = result.data.value ? result.data.value : 0;
      setDepositTotal(value.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }));
    }).catch(error=>{
      console.error(error);
    })
  },[resultDatas,resultAllCount,user]);

  return (
    <React.Fragment>
      <Typography color="text.secondary" >
        総預金額
      </Typography>
      <Typography component="p" variant="h4">
        {depositTotal}
      </Typography>
    </React.Fragment>
  );
}
