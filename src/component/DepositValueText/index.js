import React from 'react';
import TextField from '@material-ui/core/TextField';


export default function DepositValueText() {
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
    />
  )
}
