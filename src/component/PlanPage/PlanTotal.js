import React, {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {useUserContext} from '../../context/userContext';
import {usePlanContext} from '../../context/planContext';

const prj_const = require('./../prj_const.js')

//function preventDefault(event) {
//  event.preventDefault();
//}

//
// 全データ取得
async function getSavingsTotal(user){
  let headers = {
    headers : user.Authorization
  };
  let result;
  let urlpath = prj_const.ServerUrl + "/api/savings_total/";
  result = await axios.get(urlpath, headers);
  return result;
}


export default function PlanTotal() {
  const {user} = useUserContext();
  const {plan} = usePlanContext();  
  const [savingTotal, setSavingTotal] = React.useState("0");
  useEffect(()=>{
    getSavingsTotal(user).then(result=>{
      //console.debug(result);
      let value = result.data.value ? result.data.value : 0;
      setSavingTotal(value.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }));
    }).catch(error=>{
      console.error(error);
    })
  },[plan]);

  return (
    <React.Fragment>
      <Typography color="text.secondary" >
        総額預金額
      </Typography>
      <Typography component="p" variant="h4">
        {savingTotal}
      </Typography>
    </React.Fragment>
  );
}
