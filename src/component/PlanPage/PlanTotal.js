import React, {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import {useUserContext} from '../../context/userContext';
import {usePlanContext} from '../../context/planContext';
import {ApiGetSavingsTotal} from '../common/prj_url';


export default function PlanTotal() {
  const {user} = useUserContext();
  const {plan} = usePlanContext();  
  const [savingTotal, setSavingTotal] = React.useState("0");
  useEffect(()=>{
    ApiGetSavingsTotal(user).then(result=>{
      //console.debug(result);
      let value = result.data.value ? result.data.value : 0;
      setSavingTotal(value.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }));
    }).catch(error=>{
      console.error(error);
    })
  },[plan,user]);

  return (
    <React.Fragment>
      <Typography color="text.secondary" >
        一括貯金額
      </Typography>
      <Typography component="p" variant="h4">
        {savingTotal}
      </Typography>
    </React.Fragment>
  );
}
