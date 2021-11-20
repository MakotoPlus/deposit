//import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DatePicker01({labelName}) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div style={{'display':'inline-block'}}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justifyContent="start">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label={labelName}
            format="yyyy/MM/dd"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  );
}
