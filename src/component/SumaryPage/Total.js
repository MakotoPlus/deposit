import React, {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import {useUserContext} from '../../context/userContext';
import {useResultDatasContext} from '../../context/resultDatasContext';
import {ApiGetDepositTotal} from '../common/prj_url';

//function preventDefault(event) {
//  event.preventDefault();
//}



export default function Total() {
  const {user} = useUserContext();
  const {resultDatas,  resultAllCount, } = useResultDatasContext();
  const [depositTotal, setDepositTotal] = React.useState("0");
  useEffect(()=>{
    ApiGetDepositTotal(user).then(result=>{
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
        貯金総額
      </Typography>
      <Typography component="p" variant="h4">
        {depositTotal}
      </Typography>
    </React.Fragment>
  );
}
