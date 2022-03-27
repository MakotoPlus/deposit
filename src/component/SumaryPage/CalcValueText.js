import  React from 'react';
import TextField from '@material-ui/core/TextField';

/**
 * 
 * 調整入力テキストボックス
 * @param {value : Numeric, handle : event(value)}
 * 
 */
export default function CalcValueText(props) {

  let value = 0;
  if ('string' === (typeof props.value)){
    value = props.value.replace(/,/g, '');
  }else{
    value = props.value;
  }
  const index = props.index;
  const handle = props.handle;
  const handelValueChange = (event) =>{
    handle(index, event.target.value);
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
