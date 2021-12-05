//import React, { useState, useEffect }  from 'react';
import TextField from '@material-ui/core/TextField';

/**
 * 
 * 金額入力フィールド
 * @param {value : Numeric, handle : event(value)}
 * 
 */
export default function DepositValueText(props) {
  const value = props.value;
  const handle = props.handle;
  const handelValueChange = (event) =>{
    //console.log(`event.target.value->${event.target.value}`)
    handle(event.target.value);
  }
  return (
    <TextField
      required 
      id="outlined-number"
      label="金額"
      type="number"
      InputLabelProps={{
      shrink: true,
      }}      
      variant="outlined"
      defaultValue={value}
      onChange={handelValueChange}
    />
  )
}
