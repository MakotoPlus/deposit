//import 'date-fns';
import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LocalizationProvider, DatePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { Box, TextField } from '@mui/material'

const useStyles = makeStyles((theme) => ({
  root: {
      display: "inline-block",
  },
}));

export default function DatePickerYearMonth(props) {
  const labelName = props.labelName;
  const [selectedDate, setSelectedDate] = React.useState(props.yyyymmdd);
  const classes = useStyles();
  const handleDateChange = (dt) => {
    console.debug(dt);
    props.setYyyymmdd(dt);
    setSelectedDate(dt);
  };

  useEffect(()=>{
    if (!props.yyyymmdd){
      setSelectedDate(null);
    }
    //console.log(`selectedDate=${selectedDate}`);
    //console.log(`props.yyyymmdd=${props.yyyymmdd}`);
  });

  return (
    <div className={classes.root}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ m: 2, width: '25ch' }}>
            <DatePicker
              margin="normal"
              id="date-picker-dialog"
              label={labelName}
              views={['year', 'month']}
              inputFormat='yyyy/MM'
              mask={"____/__"}   
              value={selectedDate}
              renderInput={(params) => <TextField {...params} />}
              onChange={handleDateChange}
            />
        </Box>
      </LocalizationProvider>
    </div>
  );
}
